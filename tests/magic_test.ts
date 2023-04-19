import {
  describe,
  it,
  btc,
  hex,
  assertEquals,
  sha256,
  Chain,
  beforeAll,
  expect,
  Receipts,
  TxCall,
  ContractCallFunction,
  UnknownArgs,
} from "../deps.ts";
import { createHtlcScript, generateHtlcTx, HTLC } from "../src/htlc.ts";
import { contracts } from "./clarigen.ts";
import { deploy } from "./helpers.ts";
import { publicKey, publicKeys } from "./mocks.ts";
import { getSwapAmount } from "./utils.ts";

const magic = contracts.magic;
const xbtcContract = contracts.wrappedBitcoin;
const testUtils = contracts.testUtils;

const [xbtcDeployer] = xbtcContract.identifier.split(".");

const xbtcAsset = `${xbtcContract.identifier}::wrapped-bitcoin`;

const feeIn = 300n;
const feeOut = 100n;
const startingFunds = 2n * 1000000n;

const [supplierKey, swapperKey] = publicKeys;

const proof = {
  treeDepth: 1n,
  txIndex: 1n,
  hashes: [],
};

type Receipt<T> = Receipts<T[]>[number];

type TxReceipt<T> = T extends ContractCallFunction<UnknownArgs, infer R>
  ? Receipt<TxCall<R>>
  : never;

type TxReceiptOk<T> = T extends ContractCallFunction<UnknownArgs, infer R>
  ? Receipt<TxCall<R, true>>
  : never;

function hashMetadata(chain: Chain, minAmount: bigint, recipient: string) {
  return chain.rov(
    magic.hashMetadata({
      swapper: recipient,
      minAmount,
    })
  );
}

describe("magic tests", () => {
  const { chain, accounts } = deploy();
  const [deployer, supplier, swapper] = accounts.addresses(
    "deployer",
    "wallet_1",
    "wallet_2"
  );

  describe("helpers", () => {
    it("encoding varint", () => {
      const num = 500n;
      const buff = btc.CompactSize.encode(num);

      const v1 = chain.rov(
        magic.readUint32({ num: buff.slice(1), length: buff.length - 1 })
      );

      assertEquals(v1.value, num);

      const varint = chain.rovOk(magic.readVarint(buff));
      assertEquals(varint, num);

      const buff2 = hex.decode("64");
      const fromJs = btc.CompactSize.decode(buff2);
      assertEquals(
        chain.rovOk(magic.readUint32({ num: hex.decode("64"), length: 1 })),
        fromJs
      );
      assertEquals(chain.rovOk(magic.readVarint({ num: buff2 })), fromJs);
    });

    it("serializing metadata", () => {
      const num = 1000000n;
      const _buff = chain.rov(magic.testSerializeUint(num));
    });
  });

  it("initializing xbtc", () => {
    chain.txOk(
      xbtcContract.initialize("xbtc", "xbtc", 8, xbtcDeployer),
      xbtcDeployer
    );
    chain.txOk(xbtcContract.addPrincipalToRole(1, xbtcDeployer), xbtcDeployer);
    chain.txOk(
      xbtcContract.mintTokens(100000000000000, supplier),
      xbtcDeployer
    );
  });

  it("supplier can register", () => {
    const receipt = chain.txOk(
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

    assertEquals(receipt.value, 0n);

    assertEquals(chain.rov(magic.getSupplierIdByController(supplier)), 0n);
    assertEquals(chain.rov(magic.getSupplierIdByPublicKey(supplierKey)), 0n);
  });

  it("cannot re-register with same controller", () => {
    const receipt = chain.txErr(
      magic.registerSupplier(hex.decode("aaee"), feeIn, feeOut, 0, 0, 0),
      supplier
    );
    assertEquals(receipt.value, magic.constants.ERR_SUPPLIER_EXISTS.value);
  });

  it("cannot register with existing public key", () => {
    const receipt = chain.txErr(
      magic.registerSupplier(publicKey, feeIn, feeOut, 0, 0, 0),
      deployer
    );
    assertEquals(receipt.value, magic.constants.ERR_SUPPLIER_EXISTS.value);
  });

  describe("successful inbound swap", () => {
    const preimage = hex.decode("deadbeef");
    const hash = sha256(preimage);
    const minAmount = 100n;
    const recipient = swapper;
    const metadata = hashMetadata(chain, minAmount, recipient);
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
      const receipt = chain.txOk(
        magic.escrowSwapV2({
          block: {
            header: new Uint8Array([]),
            height: 1n,
          },
          prevBlocks: [],
          tx: tx.toBytes(true),
          outputIndex: 0,
          recipient: publicKey,
          minToReceive: minAmount,
          swapper,
          sender: swapperKey,
          expirationBuff: btc.CompactSize.encode(500n),
          proof,
          hash,
          supplierId: 0n,
        }),
        swapper
      );

      // receipt.events.expectFungibleTokenTransferEvent(xbtc, magic.identifier, swapper,)
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
        magic.escrowSwapV2({
          block: {
            header: new Uint8Array([]),
            height: 1n,
          },
          prevBlocks: [],
          tx: tx.toBytes(true),
          outputIndex: 0,
          recipient: publicKey,
          minToReceive: minAmount,
          swapper,
          sender: swapperKey,
          expirationBuff: btc.CompactSize.encode(500n),
          proof,
          hash,
          supplierId: 0n,
        }),
        swapper
      );

      expect(receipt.value).toEqual(magic.constants.ERR_TXID_USED.value);
    });

    describe("finalizing", () => {
      // let receipt: TxReceiptOk<typeof magic["finalizeSwapV2"]>;

      it("can successfully finalize", () => {
        const receipt = chain.txOk(
          magic.finalizeSwapV2({
            preimage,
            txid: hex.decode(txid),
          }),
          swapper
        );

        receipt.events.expectFungibleTokenTransferEvent(
          xbtc,
          magic.identifier,
          swapper,
          xbtcAsset
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
});
