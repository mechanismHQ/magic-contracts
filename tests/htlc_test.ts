import {
  btc,
  assertEquals,
  bytesToHex,
  hexToBytes,
  hex,
  secp256k1,
  sha256,
  hash160,
  describe,
  it,
  beforeAll,
  expect,
  equalBytes,
} from '../deps.ts';
import {
  createHtlcScript,
  createLegacyHtlcScript,
  encodeSwapperId,
  generateHtlcTx,
  generateLegacyHtlcTx,
  generateWshOutput,
} from '../deno/htlc.ts';
import { randomBytes } from '../vendor/noble-hashes/utils.ts';
import { deploy } from './helpers.ts';
import { magic } from './clarigen.ts';

const fixture = {
  script:
    '04010000007563a802aaaa882102f8bb63e1e52f6dd145628849ec593d74dfe04b131604d1e5f5f134677fb31e72670164b2752103edf5ed04204ac5ab55832bb893958123f123e45fa417cfe950e4ece67359ee5868ac',
  recipient: '02f8bb63e1e52f6dd145628849ec593d74dfe04b131604d1e5f5f134677fb31e72',
  sender: '03edf5ed04204ac5ab55832bb893958123f123e45fa417cfe950e4ece67359ee58',
  hash: 'aaaa',
  expBytes: '64',
  swapperHex: '01000000',
  swapper: 1,
  expiration: 100,
};

describe('HTLC tests', () => {
  const { chain, accounts } = deploy();

  it('can encode expiration', () => {
    const swapperBytes = encodeSwapperId(1n);
    // console.log(bytesToHex(swapperBytes));
    assertEquals(bytesToHex(swapperBytes), fixture.swapperHex);
  });

  it('createLegacyHtlcScript', () => {
    const htlc = {
      expiration: BigInt(fixture.expiration),
      hash: hexToBytes(fixture.hash),
      swapper: BigInt(fixture.swapper),
      recipientPublicKey: hexToBytes(fixture.recipient),
      senderPublicKey: hexToBytes(fixture.sender),
    };
    const script = createLegacyHtlcScript(htlc);

    // const decoded = btc.Script.decode(hexToBytes(fixture.script));
    // console.log(decoded);

    // console.log(btc.Script.decode(script));
    assertEquals(bytesToHex(script), fixture.script);
  });

  it('create legacy HTLC tx', () => {
    const htlc = {
      expiration: BigInt(fixture.expiration),
      hash: hexToBytes(fixture.hash),
      swapper: BigInt(fixture.swapper),
      recipientPublicKey: hexToBytes(fixture.recipient),
      senderPublicKey: hexToBytes(fixture.sender),
    };

    const _tx = generateLegacyHtlcTx(htlc);

    // console.log(tx.hex);
  });

  it('sign htlc tx', () => {
    const privKey = hex.decode('0101010101010101010101010101010101010101010101010101010101010101');
    const pub = secp256k1.getPublicKey(privKey, true);
    const preimage = randomBytes(20);
    const hash = sha256(preimage);
    const metadata = hex.decode('0000');
    const htlc = {
      expiration: BigInt(fixture.expiration),
      hash: hash,
      metadata: sha256(metadata),
      recipientPublicKey: pub,
      senderPublicKey: pub,
    };

    const htlcScript = createHtlcScript(htlc);
    const inputTx = generateHtlcTx(htlc);
    const htlcOutput = generateWshOutput(htlcScript);

    const psbt = new btc.Transaction({ allowUnknowInput: true });

    psbt.addInput({
      txid: inputTx.id,
      witnessUtxo: {
        script: htlcOutput,
        amount: 1000n,
      },
      witnessScript: htlcScript,
      // nonWitnessUtxo: inputTx.hex,
      sequence: Number(htlc.expiration),
      index: 0,
      // redeemScript: htlcScript,
    });

    psbt.addOutput({
      // redeemScript: htlcScript,
      script: htlcOutput,
      amount: 900n,
    });

    psbt.signIdx(privKey, 0);

    const input = psbt.getInput(0)!;
    const partial = input.partialSig!;
    const finalized = btc.Script.encode([partial[0][1], 'OP_0', htlcScript]);
    input.finalScriptSig = finalized;
    psbt.updateInput(0, input);

    // to validate signatures and finalScriptSig:
    // const tx = psbt.extract();
    // console.log(`\n\n btcdeb --tx=${hex.encode(tx)} --txin=${inputTx.hex}`);
  });

  it('generates a p2wsh output', () => {
    const privKey = hex.decode('0101010101010101010101010101010101010101010101010101010101010101');
    const pub = secp256k1.getPublicKey(privKey, true);
    const preimage = randomBytes(20);
    const hash = sha256(preimage);
    const metadata = hex.decode('0000');
    const htlc = {
      expiration: BigInt(fixture.expiration),
      hash: hash,
      metadata: sha256(metadata),
      recipientPublicKey: pub,
      senderPublicKey: pub,
    };

    const htlcScript = createHtlcScript(htlc);
    const scriptHash = sha256(htlcScript);

    const output = btc.OutScript.encode({
      type: 'wsh',
      hash: scriptHash,
    });

    const contractOutput = chain.rov(magic.generateWshOutput(htlcScript));

    assertEquals(equalBytes(contractOutput, output), true);
  });
});
