import { describe, it, btc, hex, assertEquals, sha256, beforeAll, expect } from '../deps.ts';
import { createHtlcScript, generateHtlcTx, HTLC } from '../deno/htlc.ts';
import {
  deploy,
  magic,
  testUtils,
  xbtcContract,
  xbtcAsset,
  xbtcDeployer,
  feeIn,
  feeOut,
  startingFunds,
  supplierKey,
  swapperKey,
  proof,
  TxReceiptOk,
  hashMetadata,
} from './helpers.ts';
import { getSwapAmount } from './utils.ts';
import { publicKeys } from './mocks.ts';

describe('magic tests', () => {
  const { chain, accounts } = deploy();
  const [deployer, supplier, swapper] = accounts.addresses('deployer', 'wallet_1', 'wallet_2');

  it('can decode varint', () => {
    const num = 500n;
    const buff = btc.CompactSize.encode(num);
    const varint = chain.rovOk(magic.readVarint(buff));
    assertEquals(varint, num);

    const buff2 = hex.decode('64');
    const fromJs = btc.CompactSize.decode(buff2);
    assertEquals(chain.rovOk(magic.readVarint({ num: buff2 })), fromJs);

    const err = chain.rovErr(magic.readVarint(hex.decode('fd000000')));
    expect(err).toEqual(magic.constants.ERR_READ_UINT.value);
  });

  it('initializing xbtc', () => {
    chain.txOk(xbtcContract.initialize('xbtc', 'xbtc', 8, xbtcDeployer), xbtcDeployer);
    chain.txOk(xbtcContract.addPrincipalToRole(1, xbtcDeployer), xbtcDeployer);
    chain.txOk(xbtcContract.mintTokens(100000000000000, supplier), xbtcDeployer);
  });

  it('supplier can register', () => {
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

  it('fees are properly validates', () => {
    expect(chain.rovErr(magic.validateFee(10001n))).toEqual(8n);
    expect(chain.rovErr(magic.validateFee(-10001n))).toEqual(8n);
    expect(chain.rovOk(magic.validateFee(800n))).toBe(true);
    expect(chain.rovOk(magic.validateFee(-800n))).toBe(true);
  });

  it('can calculate fees', () => {
    function expectAmount(amount: bigint, feeRate: bigint, final: bigint) {
      const result = chain.rov(magic.getAmountWithFeeRate(amount, feeRate));
      expect(result).toEqual(final);
    }
    expectAmount(100n, 300n, 97n);
    expectAmount(10000n, 1n, 9999n);
    expectAmount(100n, 1n, 99n);
    expectAmount(100n, -300n, 103n);
    expectAmount(100n, 10000n, 0n);
    expectAmount(100n, -10000n, 200n);
    expectAmount(100n, 9999n, 0n);
  });

  it('can calculate swap amount', () => {
    function expectAmount(amount: bigint, feeRate: bigint, baseFee: bigint, final: bigint) {
      const result = chain.rovOk(magic.getSwapAmount(amount, feeRate, baseFee));
      expect(result).toEqual(final);
    }
    expectAmount(100n, 300n, 0n, 97n);
    expectAmount(10000n, 1n, 0n, 9999n);
    expectAmount(100n, 1n, 0n, 99n);
    expectAmount(100n, -300n, 0n, 103n);
    expectAmount(100n, -10000n, 0n, 200n);
  
    // with base fees
    expectAmount(100n, 300n, 5n, 92n);
    expectAmount(10000n, 1n, 10n, 9989n);
    expectAmount(100n, 1n, 3n, 96n);
    expectAmount(100n, -300n, 3n, 100n);
    expectAmount(100n, 10000n, -100n, 100n);
    expectAmount(100n, -10000n, -10n, 210n);
  
    // underflows
    function expectUnderflow(amount: bigint, feeRate: bigint, baseFee: bigint) {
      const result = chain.rovErr(magic.getSwapAmount(amount, feeRate, baseFee));
      expect(result).toEqual(24n);
    }
    expectUnderflow(100n, 9999n, 5n);
    expectUnderflow(100n, 300n, 97n);
    expectUnderflow(10000n, 1n, 10000n);
    expectUnderflow(100n, 1n, 100n);
    expectUnderflow(100n, -300n, 200n);
    expectUnderflow(100n, 10000n, 0n);
    expectUnderflow(100n, 9999n, 0n);
  });
  
});
