import {
  assertEquals,
  beforeAll,
  btc,
  describe,
  expect,
  hex,
  it,
  sha256,
} from "../deps.ts";
import { createHtlcScript, generateHtlcTx, HTLC } from "../deno/htlc.ts";
import {
  deploy,
  feeIn,
  feeOut,
  hashMetadata,
  initXbtcAndSupplier,
  magic,
  proof,
  setMined,
  startingFunds,
  supplierKey,
  swapperKey,
  testUtils,
  TxReceiptOk,
  xbtcAsset,
  xbtcContract,
  xbtcDeployer,
} from "./helpers.ts";
import { getSwapAmount } from "./utils.ts";
import { publicKey, publicKeys } from "./mocks.ts";
import { clarityBitcoin } from "./clarigen.ts";

describe("magic tests", () => {
  const { chain, accounts } = deploy();
  initXbtcAndSupplier(chain);
  const [deployer, supplier, swapper] = accounts.addresses(
    "deployer",
    "wallet_1",
    "wallet_2",
  );

  describe("successful inbound swap", () => {
    const preimage = hex.decode("deadbeef");
    const hash = sha256(preimage);
    const recipient = swapper;
    const metadata = hashMetadata(chain, feeIn, 100n, recipient);
    const htlc: HTLC = {
      senderPublicKey: swapperKey,
      recipientPublicKey: supplierKey,
      metadata,
      hash,
    };

    const sats = 50000n;
    const tx = generateHtlcTx(htlc, sats);
    const txid = tx.id;

    const xbtc = getSwapAmount(sats, feeIn, 100n);

    let swapperBalanceBefore: bigint;
    let supplierFundsBefore: bigint;
    let supplierEscrowBefore: bigint;

    beforeAll(() => {
      swapperBalanceBefore = chain.rovOk(xbtcContract.getBalance(swapper));
      supplierFundsBefore = chain.rov(magic.getFunds(0));
      supplierEscrowBefore = chain.rov(magic.getEscrow(0))!;

      chain.txOk(testUtils.setMined(hex.decode(txid)), deployer);
    });

    it("can escrow with a valid transaction", () => {
      chain.txOk(
        magic.escrowSwap({
          block: {
            header: new Uint8Array([]),
            height: 1n,
          },
          prevBlocks: [],
          tx: tx.toBytes(true),
          outputIndex: 0,
          recipient: supplierKey,
          maxBaseFee: 100n,
          maxFeeRate: feeIn,
          swapper,
          sender: swapperKey,
          expirationBuff: btc.CompactSize.encode(500n),
          proof,
          hash,
          supplierId: 0n,
        }),
        swapper,
      );
    });

    it("escrow state is stored", () => {
      const swap = chain.rov(magic.getInboundSwap(hex.decode(txid)))!;
      assertEquals(swap.swapper, swapper);
      assertEquals(swap.xbtc, xbtc);
      assertEquals(swap.hash, hash);
      assertEquals(swap.expiration, 501n - 200n);
      assertEquals(swap.supplier, 0n);
    });

    it("escrow metadata is stored", () => {
      const swap = chain.rovOk(magic.getFullInbound(hex.decode(txid)))!;
      assertEquals(swap.sats, sats);
      assertEquals(swap.csv, 500n);
      assertEquals(swap.outputIndex, 0n);
      assertEquals(swap.redeemScript, createHtlcScript(htlc));
      assertEquals(swap.senderPublicKey, swapperKey);
    });

    it("validates funds moved to escrow", () => {
      const funds = chain.rov(magic.getFunds(0n));
      const escrow = chain.rov(magic.getEscrow(0n));
      if (escrow === null) throw new Error("Expected escrow");
      expect(funds).toEqual(supplierFundsBefore - xbtc);
      expect(escrow).toEqual(supplierEscrowBefore + escrow);
      expect(supplierEscrowBefore).toEqual(0n);
      expect(escrow).toEqual(xbtc);
    });

    it("volume not yet updated", () => {
      expect(chain.rov(magic.getUserInboundVolume(swapper))).toEqual(0n);
      expect(chain.rov(magic.getTotalInboundVolume())).toEqual(0n);
    });

    it("cannot re-use the same tx", () => {
      const receipt = chain.txErr(
        magic.escrowSwap({
          block: {
            header: new Uint8Array([]),
            height: 1n,
          },
          prevBlocks: [],
          tx: tx.toBytes(true),
          outputIndex: 0,
          recipient: supplierKey,
          maxBaseFee: 100n,
          maxFeeRate: feeIn,
          swapper,
          sender: swapperKey,
          expirationBuff: btc.CompactSize.encode(500n),
          proof,
          hash,
          supplierId: 0n,
        }),
        swapper,
      );

      expect(receipt.value).toEqual(magic.constants.ERR_TXID_USED.value);
    });

    describe("finalizing", () => {
      let receipt: TxReceiptOk<(typeof magic)["finalizeSwap"]>;

      it("can successfully finalize", () => {
        receipt = chain.txOk(
          magic.finalizeSwap({
            preimage,
            txid: hex.decode(txid),
          }),
          swapper,
        );

        receipt.events.expectFungibleTokenTransferEvent(
          xbtc,
          magic.identifier,
          swapper,
          xbtcAsset,
        );
      });

      it("escrowed amount is updated", () => {
        const escrow = chain.rov(magic.getEscrow(0n));
        expect(escrow).toEqual(0n);
      });

      it("preimage is saved", () => {
        const saved = chain.rov(magic.getPreimage(hex.decode(txid)));
        expect(saved).toEqual(preimage);
      });

      it("inbound volume is updated", () => {
        expect(chain.rov(magic.getUserInboundVolume(swapper))).toEqual(xbtc);
        expect(chain.rov(magic.getTotalInboundVolume())).toEqual(xbtc);
        expect(chain.rov(magic.getUserOutboundVolume(swapper))).toEqual(0n);
        expect(chain.rov(magic.getTotalOutboundVolume())).toEqual(0n);
        expect(chain.rov(magic.getUserTotalVolume(swapper))).toEqual(xbtc);
        expect(chain.rov(magic.getTotalVolume())).toEqual(xbtc);
      });

      it("swapper has xbtc", () => {
        const balance = chain.rovOk(xbtcContract.getBalance(swapper));
        expect(balance).toEqual(swapperBalanceBefore + xbtc);
      });
    });
  });

  describe("validating inbound swaps", () => {
    const preImage = hex.decode("aabb");
    const hash = sha256(preImage);
    const metadata = hashMetadata(chain, feeIn, 100n, swapper);
    const htlc = {
      senderPublicKey: swapperKey,
      recipientPublicKey: supplierKey,
      hash,
      swapper: 0n,
      metadata,
    };

    const sats = 50000n;
    const tx = generateHtlcTx(htlc, sats);
    const txid = hex.decode(tx.id);
    const xbtcAmount = getSwapAmount(sats, feeIn, 100n);

    it("validates that tx was mined", () => {
      chain.txOk(testUtils.setNotMined(txid), deployer);
      const receipt = chain.txErr(
        magic.escrowSwap({
          block: {
            header: new Uint8Array([]),
            height: 1n,
          },
          prevBlocks: [],
          tx: tx.toBytes(true),
          outputIndex: 0,
          recipient: supplierKey,
          maxBaseFee: 100n,
          maxFeeRate: feeIn,
          swapper,
          sender: swapperKey,
          expirationBuff: btc.CompactSize.encode(500n),
          proof,
          hash,
          supplierId: 0n,
        }),
        swapper,
      );
      expect(receipt.value).toEqual(21n);
    });

    it("validates proper htlc output", () => {
      chain.txOk(testUtils.setMined(txid), deployer);
      const receipt = chain.txErr(
        magic.escrowSwap({
          block: {
            header: new Uint8Array([]),
            height: 1n,
          },
          prevBlocks: [],
          tx: tx.toBytes(true),
          outputIndex: 0,
          recipient: supplierKey,
          maxBaseFee: 100n,
          maxFeeRate: feeIn,
          swapper,
          sender: publicKeys[2],
          expirationBuff: btc.CompactSize.encode(500n),
          proof,
          hash,
          supplierId: 0n,
        }),
        swapper,
      );

      expect(receipt.value).toEqual(magic.constants.ERR_INVALID_OUTPUT.value);
    });

    it("validates that supplier pubkey is correct", () => {
      const htlc = {
        senderPublicKey: publicKeys[1],
        // invalid supplier key:
        recipientPublicKey: publicKeys[2],
        hash,
        swapper: 0n,
        metadata,
      };
      const tx = generateHtlcTx(htlc, sats);
      chain.txOk(testUtils.setMined(hex.decode(tx.id)), deployer);
      const receipt = chain.txErr(
        magic.escrowSwap({
          block: {
            header: new Uint8Array([]),
            height: 1n,
          },
          prevBlocks: [],
          tx: tx.toBytes(true),
          outputIndex: 0,
          recipient: supplierKey,
          maxBaseFee: 100n,
          maxFeeRate: feeIn,
          swapper,
          sender: swapperKey,
          expirationBuff: btc.CompactSize.encode(500n),
          proof,
          hash,
          supplierId: 0n,
        }),
        swapper,
      );

      expect(receipt.value).toEqual(magic.constants.ERR_INVALID_OUTPUT.value);
    });

    it("validates proper tx", () => {
      const txBuff = hex.decode("aaaaaaaa");
      const txid = chain.rov(clarityBitcoin.getTxid(txBuff));
      chain.txOk(testUtils.setMined(txid), deployer);
      const receipt = chain.txErr(
        magic.escrowSwap({
          block: {
            header: new Uint8Array([]),
            height: 1n,
          },
          prevBlocks: [],
          tx: txBuff,
          outputIndex: 0,
          recipient: supplierKey,
          maxBaseFee: 100n,
          maxFeeRate: feeIn,
          swapper,
          sender: swapperKey,
          expirationBuff: btc.CompactSize.encode(500n),
          proof,
          hash,
          supplierId: 0n,
        }),
        swapper,
      );
      expect(receipt.value).toEqual(magic.constants.ERR_INVALID_TX.value);
    });

    it("validates that supplier has sufficient funds", () => {
      const funds = chain.rov(magic.getFunds(0n));
      const tx = generateHtlcTx(htlc, funds * 2n);
      const txid = hex.decode(tx.id);
      setMined(chain, txid);
      const receipt = chain.txErr(
        magic.escrowSwap({
          block: {
            header: new Uint8Array([]),
            height: 1n,
          },
          prevBlocks: [],
          tx: tx.toBytes(true),
          outputIndex: 0,
          recipient: supplierKey,
          maxBaseFee: 100n,
          maxFeeRate: feeIn,
          swapper,
          sender: swapperKey,
          expirationBuff: btc.CompactSize.encode(500n),
          proof,
          hash,
          supplierId: 0n,
        }),
        swapper,
      );

      expect(receipt.value).toEqual(
        magic.constants.ERR_INSUFFICIENT_FUNDS.value,
      );
    });

    it("validates htlc expiration isnt too far", () => {
      const htlc = {
        senderPublicKey: publicKeys[1],
        // invalid supplier key:
        recipientPublicKey: publicKeys[2],
        hash,
        swapper: 0n,
        metadata,
      };
      const tx = generateHtlcTx({
        ...htlc,
        expiration: 551n,
      }, sats);
      chain.txOk(testUtils.setMined(hex.decode(tx.id)), deployer);

      const receipt = chain.txErr(
        magic.escrowSwap({
          block: {
            header: new Uint8Array([]),
            height: 1n,
          },
          prevBlocks: [],
          tx: tx.toBytes(true),
          outputIndex: 0,
          recipient: supplierKey,
          maxBaseFee: 100n,
          maxFeeRate: feeIn,
          swapper,
          sender: swapperKey,
          expirationBuff: btc.CompactSize.encode(551n),
          proof,
          hash,
          supplierId: 0n,
        }),
        swapper,
      );
      expect(receipt.value).toEqual(
        magic.constants.ERR_INVALID_EXPIRATION.value,
      );
    });

    it("validates that supplier allows inbound swaps", () => {
      const supplierInfo = chain.rov(magic.getSupplier(0n))!;

      chain.txOk(
        magic.updateSupplierFees({
          inboundFee: null,
          outboundFee: supplierInfo.outboundFee,
          inboundBaseFee: supplierInfo.inboundBaseFee,
          outboundBaseFee: supplierInfo.outboundBaseFee,
        }),
        supplier,
      );

      const receipt = chain.txErr(
        magic.escrowSwap({
          block: {
            header: new Uint8Array([]),
            height: 1n,
          },
          prevBlocks: [],
          tx: tx.toBytes(true),
          outputIndex: 0,
          recipient: supplierKey,
          maxBaseFee: 100n,
          maxFeeRate: feeIn,
          swapper,
          sender: swapperKey,
          expirationBuff: btc.CompactSize.encode(500n),
          proof,
          hash,
          supplierId: 0n,
        }),
        swapper,
      );

      expect(receipt.value).toEqual(magic.constants.ERR_INVALID_SUPPLIER.value);

      chain.txOk(
        magic.updateSupplierFees({
          inboundFee: supplierInfo.inboundFee,
          outboundFee: supplierInfo.outboundFee,
          inboundBaseFee: supplierInfo.inboundBaseFee,
          outboundBaseFee: supplierInfo.outboundBaseFee,
        }),
        supplier,
      );
    });

    it("validates that swap fails if supplier changes fees", () => {
      const supplierInfo = chain.rov(magic.getSupplier(0n))!;

      // first, test inboundBaseFee
      chain.txOk(
        magic.updateSupplierFees({
          inboundFee: supplierInfo.inboundFee,
          outboundFee: supplierInfo.outboundFee,
          inboundBaseFee: supplierInfo.inboundBaseFee + 10n,
          outboundBaseFee: supplierInfo.outboundBaseFee,
        }),
        supplier,
      );

      let receipt = chain.txErr(
        magic.escrowSwap({
          block: {
            header: new Uint8Array([]),
            height: 1n,
          },
          prevBlocks: [],
          tx: tx.toBytes(true),
          outputIndex: 0,
          recipient: supplierKey,
          maxBaseFee: 100n,
          maxFeeRate: feeIn,
          swapper,
          sender: swapperKey,
          expirationBuff: btc.CompactSize.encode(500n),
          proof,
          hash,
          supplierId: 0n,
        }),
        swapper,
      );

      expect(receipt.value).toEqual(
        magic.constants.ERR_INCONSISTENT_FEES.value,
      );

      // next, test inboundFee
      chain.txOk(
        magic.updateSupplierFees({
          inboundFee: supplierInfo.inboundFee! + 1n,
          outboundFee: supplierInfo.outboundFee,
          inboundBaseFee: supplierInfo.inboundBaseFee,
          outboundBaseFee: supplierInfo.outboundBaseFee,
        }),
        supplier,
      );

      receipt = chain.txErr(
        magic.escrowSwap({
          block: {
            header: new Uint8Array([]),
            height: 1n,
          },
          prevBlocks: [],
          tx: tx.toBytes(true),
          outputIndex: 0,
          recipient: supplierKey,
          maxBaseFee: 100n,
          maxFeeRate: feeIn,
          swapper,
          sender: swapperKey,
          expirationBuff: btc.CompactSize.encode(500n),
          proof,
          hash,
          supplierId: 0n,
        }),
        swapper,
      );

      expect(receipt.value).toEqual(
        magic.constants.ERR_INCONSISTENT_FEES.value,
      );

      chain.txOk(
        magic.updateSupplierFees({
          inboundFee: supplierInfo.inboundFee,
          outboundFee: supplierInfo.outboundFee,
          inboundBaseFee: supplierInfo.inboundBaseFee,
          outboundBaseFee: supplierInfo.outboundBaseFee,
        }),
        supplier,
      );
    });

    describe("validation after valid escrow", () => {
      it("escrow successful", () => {
        const receipt = chain.txOk(
          magic.escrowSwap({
            block: {
              header: new Uint8Array([]),
              height: 1n,
            },
            prevBlocks: [],
            tx: tx.toBytes(true),
            outputIndex: 0,
            recipient: supplierKey,
            maxBaseFee: 100n,
            maxFeeRate: feeIn,
            swapper,
            sender: swapperKey,
            expirationBuff: btc.CompactSize.encode(500n),
            proof,
            hash,
            supplierId: 0n,
          }),
          swapper,
        );
      });

      it("validates that preimage is valid", () => {
        const receipt = chain.txErr(
          magic.finalizeSwap(txid, hex.decode("aaeeaaee")),
          swapper,
        );
        expect(receipt.value).toEqual(
          magic.constants.ERR_INVALID_PREIMAGE.value,
        );
      });

      it("cannot revoke inbound before expiration", () => {
        const receipt = chain.txErr(magic.revokeExpiredInbound(txid), supplier);
        expect(receipt.value).toEqual(
          magic.constants.ERR_REVOKE_INBOUND_NOT_EXPIRED.value,
        );
      });

      describe("after swap expiration", () => {
        beforeAll(() => {
          const blockHeight = chain.blockHeight;
          const { expiration } = chain.rov(magic.getInboundSwap(txid))!;
          chain.mineEmptyBlockUntil(BigInt(blockHeight) + expiration + 1n);
        });

        it("cannot finalize swap after expiration", () => {
          const receipt = chain.txErr(
            magic.finalizeSwap(txid, preImage),
            swapper,
          );
          expect(receipt.value).toEqual(
            magic.constants.ERR_ESCROW_EXPIRED.value,
          );
        });

        it("can revoke inbound after expiration", () => {
          const swap = chain.rov(magic.getInboundSwap(txid))!;
          const { xbtc, supplier: supplierId } = swap;
          const fundsBefore = chain.rov(magic.getFunds(supplierId));
          const escrowBefore = (chain.rov(magic.getEscrow(supplierId)))!;
          const receipt = chain.txOk(magic.revokeExpiredInbound(txid), supplier);
          const storedPreimage = chain.rov(magic.getPreimage(txid));
          expect(storedPreimage).toEqual(hex.decode('00'));
          expect(receipt.value).toEqual(swap);
          const funds = chain.rov(magic.getFunds(supplierId));
          const escrow = (chain.rov(magic.getEscrow(supplierId)))!;
          expect(funds).toEqual(fundsBefore + xbtc);
          expect(escrow).toEqual(escrowBefore - xbtc);
        });

        it('cannot revoke already revoked inbound swap', () => {
          const receipt = chain.txErr(magic.revokeExpiredInbound(txid), supplier);
          expect(receipt.value).toEqual(magic.constants.ERR_REVOKE_INBOUND_IS_FINALIZED.value);
        });
      });
    });
  });
});
