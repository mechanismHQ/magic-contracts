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

describe('magic tests', () => {
  const { chain, accounts } = deploy();
  const [deployer, supplier, swapper] = accounts.addresses('deployer', 'wallet_1', 'wallet_2');

  describe('helpers', () => {
    it('encoding varint', () => {
      const num = 500n;
      const buff = btc.CompactSize.encode(num);
      const varint = chain.rovOk(magic.readVarint(buff));
      assertEquals(varint, num);

      const buff2 = hex.decode('64');
      const fromJs = btc.CompactSize.decode(buff2);
      assertEquals(chain.rovOk(magic.readVarint({ num: buff2 })), fromJs);
    });

    it('serializing metadata', () => {
      const num = 1000000n;
      const _buff = chain.rov(magic.testSerializeUint(num));
    });

    it('encoding output scripts', () => {
      const address = btc.p2pkh(swapperKey).address!;
      const toOut = btc.Address().decode(address);
      const _out = btc.OutScript.encode(toOut);
    });
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
});
