import { describe, it, btc, hex, beforeAll, expect } from "../deps.ts";
import { generateBaseTx, mockPrivateKey } from "../src/htlc.ts";
import {
  deploy,
  magic,
  testUtils,
  xbtcContract,
  xbtcAsset,
  feeIn,
  feeOut,
  startingFunds,
  supplierKey,
  swapperKey,
  deployer,
  swapper,
  supplier,
  initXbtc,
  TxReceiptOk,
  mockTxArgs,
} from "./helpers.ts";
import { getSwapAmount } from "./utils.ts";

describe("outbound swap tests", () => {
  const { chain } = deploy();

  beforeAll(() => {
    initXbtc(chain);
    chain.txOk(
      magic.registerSupplier({
        publicKey: supplierKey,
        inboundFee: feeIn,
        outboundFee: feeOut,
        inboundBaseFee: 100n,
        outboundBaseFee: 100n,
        funds: startingFunds,
      }),
      supplier
    );
  });

  describe("successful outbound swap", () => {
    const swapperBalanceStart = 1000000n;
    const swapperBtc = btc.p2pkh(swapperKey);

    const xbtcAmount = 10000n;

    let initReceipt: TxReceiptOk<typeof magic["initiateOutboundSwap"]>;
    const swapId = 0n;
    const sats = getSwapAmount(xbtcAmount, feeOut, 100n);

    it("xbtc sent to swapper", () => {
      chain.txOk(
        xbtcContract.transfer({
          amount: swapperBalanceStart,
          sender: supplier,
          recipient: swapper,
          memo: null,
        }),
        supplier
      );

      expect(chain.rovOk(xbtcContract.getBalance(swapper))).toEqual(
        swapperBalanceStart
      );
    });

    it("outbound swap initiated", () => {
      initReceipt = chain.txOk(
        magic.initiateOutboundSwap({
          xbtc: xbtcAmount,
          supplierId: 0n,
          output: swapperBtc.script,
        }),
        swapper
      );
    });

    it("swapId is correct", () => {
      expect(initReceipt.value).toEqual(swapId);
    });

    it("xbtc transfered to contract", () => {
      initReceipt.events.expectFungibleTokenTransferEvent(
        xbtcAmount,
        swapper,
        magic.identifier,
        xbtcAsset
      );
    });

    it("outbound swap state is stored", () => {
      const swap = chain.rov(magic.getOutboundSwap(swapId))!;
      expect(swap.xbtc).toEqual(xbtcAmount);
      expect(swap.supplier).toEqual(0n);
      expect(swap.output).toEqual(swapperBtc.script);
      expect(swap.sats).toEqual(sats);
      expect(swap.swapper).toEqual(swapper);
      expect(swap.createdAt).toEqual(BigInt(chain.burnBlockHeight - 1));
    });

    describe("successfully finalizing outbound swap", () => {
      // let finalizeReceipt: TxReceiptOk<typeof magic["finalizeOutboundSwap"]>;

      const btcTx = generateBaseTx(sats);
      btcTx.addOutput({
        ...swapperBtc,
        amount: sats,
      });
      btcTx.sign(mockPrivateKey);
      btcTx.finalize();
      const txid = hex.decode(btcTx.id);

      it("finalizes outbound swap", () => {
        chain.txOk(testUtils.setMined(txid), deployer);
        chain.txOk(
          magic.finalizeOutboundSwap({
            ...mockTxArgs(btcTx),
            swapId,
          }),
          supplier
        );
      });

      it("swap saved as completed", () => {
        const _txid = chain.rov(magic.getCompletedOutboundSwapTxid(swapId))!;
        expect(_txid).toEqual(txid);

        const id = chain.rov(magic.getCompletedOutboundSwapByTxid(txid))!;
        expect(id).toEqual(swapId);
      });

      it("funds are updated", () => {
        const funds = chain.rov(magic.getFunds(0n));
        expect(funds).toEqual(startingFunds + xbtcAmount);
      });
    });
  });

  describe("revoking outbound swaps", () => {
    let swapperBalanceBefore: bigint;
    const swapId = 1n;
    const xbtcAmount = 7500n;
    const sats = getSwapAmount(xbtcAmount, feeOut, 100n);
    const btcTx = generateBaseTx(sats);
    const swapperBtc = btc.p2pkh(swapperKey);
    btcTx.addOutput({
      ...swapperBtc,
      amount: sats,
    });
    btcTx.sign(mockPrivateKey);
    btcTx.finalize();
    const txid = hex.decode(btcTx.id);

    beforeAll(() => {
      swapperBalanceBefore = chain.rovOk(xbtcContract.getBalance(swapper));
    });

    it("swap is intiated", () => {
      const receipt = chain.txOk(
        magic.initiateOutboundSwap({
          ...mockTxArgs(btcTx),
          xbtc: xbtcAmount,
          output: swapperBtc.script,
          supplierId: 0n,
        }),
        swapper
      );
      receipt.events.expectFungibleTokenTransferEvent(
        xbtcAmount,
        swapper,
        magic.identifier,
        xbtcAsset
      );
    });

    it("cannot revoke if not expired", () => {
      const receipt = chain.txErr(magic.revokeExpiredOutbound(swapId), swapper);
      expect(receipt.value).toEqual(
        magic.constants.ERR_REVOKE_OUTBOUND_NOT_EXPIRED.value
      );
    });

    describe("after expiration", () => {
      beforeAll(() => {
        const swap = chain.rov(magic.getOutboundSwap(swapId))!;
        chain.mineEmptyBlockUntil(
          swap.createdAt + magic.constants.OUTBOUND_EXPIRATION + 1n
        );
      });

      it("can revoke outbound swap after expiration", () => {
        const receipt = chain.txOk(
          magic.revokeExpiredOutbound(swapId),
          swapper
        );
        receipt.events.expectFungibleTokenTransferEvent(
          xbtcAmount,
          magic.identifier,
          swapper,
          xbtcAsset
        );
      });

      it("swap is marked as revoked", () => {
        const _txid = chain.rov(magic.getCompletedOutboundSwapTxid(swapId))!;
        expect(_txid).toEqual(magic.constants.REVOKED_OUTBOUND_TXID);
      });

      it("cannot revoke again", () => {
        const receipt = chain.txErr(
          magic.revokeExpiredOutbound(swapId),
          swapper
        );
        expect(receipt.value).toEqual(
          magic.constants.ERR_REVOKE_OUTBOUND_IS_FINALIZED.value
        );
      });

      it("swapper xbtc balance is back to start", () => {
        const balance = chain.rovOk(xbtcContract.getBalance(swapper));
        expect(balance).toEqual(swapperBalanceBefore);
      });

      it("cannot finalize after being revoked", () => {
        chain.txOk(testUtils.setMined(txid), deployer);
        const receipt = chain.txErr(
          magic.finalizeOutboundSwap({
            ...mockTxArgs(btcTx),
            swapId,
          }),
          supplier
        );
        expect(receipt.value).toEqual(
          magic.constants.ERR_ALREADY_FINALIZED.value
        );
      });
    });
  });
});
