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
  supplier,
  deployer,
} from "./helpers.ts";
import { getSwapAmount } from "./utils.ts";
import { publicKey, publicKeys } from "./mocks.ts";
import { clarityBitcoin } from "./clarigen.ts";

describe("supplier tests", () => {
  const { chain, accounts } = deploy();

  initXbtcAndSupplier(chain);

  it('cannot re-register with same controller', () => {
    const receipt = chain.txErr(
      magic.registerSupplier(hex.decode('aaee'), feeIn, feeOut, 0, 0, 0),
      supplier
    );
    assertEquals(receipt.value, magic.constants.ERR_SUPPLIER_EXISTS.value);
  });

  it('cannot register with existing public key', () => {
    const receipt = chain.txErr(
      magic.registerSupplier(supplierKey, feeIn, feeOut, 0, 0, 0),
      deployer
    );
    assertEquals(receipt.value, magic.constants.ERR_SUPPLIER_EXISTS.value);
  });

  it('supplier can update fees', () => {
    const supplierInfo = chain.rov(magic.getSupplier(0n))!;

    // first, test inboundBaseFee
    chain.txOk(
      magic.updateSupplierFees({
        inboundFee: supplierInfo.inboundFee! + 1n,
        outboundFee: supplierInfo.outboundFee! - 1n,
        inboundBaseFee: supplierInfo.inboundBaseFee + 10n,
        outboundBaseFee: supplierInfo.outboundBaseFee - 10n,
      }),
      supplier,
    );

    const newInfo = chain.rov(magic.getSupplier(0n))!;
    expect(newInfo).toEqual({
      ...supplierInfo,
      inboundFee: supplierInfo.inboundFee! + 1n,
        outboundFee: supplierInfo.outboundFee! - 1n,
        inboundBaseFee: supplierInfo.inboundBaseFee + 10n,
        outboundBaseFee: supplierInfo.outboundBaseFee - 10n,
    });

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

  it('supplier can update public key', () => {
    const supplierInfo = chain.rov(magic.getSupplier(0n))!;
    const newKey = publicKeys[4];
    chain.txOk(magic.updateSupplierPublicKey(newKey), supplier);
    const newInfo = chain.rov(magic.getSupplier(0n))!;
    expect(newInfo.publicKey).toEqual(newKey);
  });
  
  it('supplier cant set invalid fees', () => {
    const baseInfo = chain.rov(magic.getSupplier(0n))!;
    let receipt = chain.txErr(magic.updateSupplierFees({
      ...baseInfo,
      inboundFee: 10001n,
    }), supplier);
    expect(receipt.value).toEqual(magic.constants.ERR_FEE_INVALID.value);

    receipt = chain.txErr(magic.updateSupplierFees({
      ...baseInfo,
      outboundFee: 10001n,
    }), supplier);
    expect(receipt.value).toEqual(magic.constants.ERR_FEE_INVALID.value);
  });

  it('supplier can remove funds', () => {
    const fundsBefore = chain.rov(magic.getFunds(0n));
    const receipt = chain.txOk(magic.removeFunds(100n), supplier);

    receipt.events.expectFungibleTokenTransferEvent(
      100n,
      magic.identifier,
      supplier,
      xbtcAsset
    );

    const fundsAfter = chain.rov(magic.getFunds(0n));
    expect(fundsAfter).toEqual(fundsBefore - 100n);
  });

  it('supplier can add funds', () => {
    const fundsBefore = chain.rov(magic.getFunds(0n));
    const receipt = chain.txOk(magic.addFunds(100n), supplier);

    receipt.events.expectFungibleTokenTransferEvent(
      100n,
      supplier,
      magic.identifier,
      xbtcAsset
    );

    const fundsAfter = chain.rov(magic.getFunds(0n));
    expect(fundsAfter).toEqual(fundsBefore + 100n);
  });

  it('cannot remove more funds than available', () => {
    const funds = chain.rov(magic.getFunds(0n));
    const receipt = chain.txErr(magic.removeFunds(funds + 1n), supplier);
    expect(receipt.value).toEqual(magic.constants.ERR_INSUFFICIENT_FUNDS.value);
  });

  it('cannot add more funds than owned', () => {
    const balance = chain.rovOk(xbtcContract.getBalance(supplier));
    const receipt = chain.txErr(magic.addFunds(balance + 1n), supplier);
    expect(receipt.value).toEqual(magic.constants.ERR_TRANSFER.value);
  });

  it('next supplier ID is correct', () => {
    const nextId = chain.rov(magic.getNextSupplierId());
    expect(nextId).toEqual(1n);
  });
});