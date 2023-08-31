import { sha256 } from '../deps.ts';
import { secp256k1 } from '../vendor/noble-curves/secp256k1.ts';
import { hexToBytes } from '../vendor/noble-hashes/utils.ts';
import { hex } from '../vendor/scure-base.ts';
import * as btc from '../vendor/scure-btc-signer.ts';
import { hash160 } from '../vendor/scure-btc-signer.ts';
// import { hex } from "../vendor/scure-base.ts";

export interface LegacyHTLC {
  hash: Uint8Array;
  senderPublicKey: Uint8Array;
  recipientPublicKey: Uint8Array;
  expiration?: bigint;
  swapper: bigint;
}

export interface HTLC {
  metadata: Uint8Array;
  senderPublicKey: Uint8Array;
  recipientPublicKey: Uint8Array;
  expiration?: bigint;
  hash: Uint8Array;
}

export function numberToLEBytes(num: bigint) {
  return btc.CompactSize.encode(num);
}

export const CSV_DELAY = 500n;
export const CSV_DELAY_BUFF = btc.CompactSize.encode(CSV_DELAY);

export function encodeExpiration(expiration?: bigint): Uint8Array | number {
  if (typeof expiration === 'undefined') return CSV_DELAY_BUFF;
  if (expiration <= 252n) return Number(expiration);
  return btc.CompactSize.encode(expiration);
}

export function encodeSwapperId(id: bigint): Uint8Array {
  const length = 4;
  const hex = id.toString(16).padStart(length * 2, '0');
  let le = '';
  // reverse the buffer
  for (let i = 0; i < length; i++) {
    le += hex.slice(-2 * (i + 1), -2 * i || length * 2);
  }
  return hexToBytes(le);
}

// ${swapperHex} OP_DROP
// OP_IF
//   OP_SHA256 ${bytesToHex(hash)}
//   OP_EQUALVERIFY
//   ${bytesToHex(recipientPublicKey)}
// OP_ELSE
//   ${encodeExpiration(expiration).toString('hex')}
//   OP_CHECKSEQUENCEVERIFY
//   OP_DROP
//   ${bytesToHex(senderPublicKey)}
// OP_ENDIF
// OP_CHECKSIG`

export function createLegacyHtlcScript(htlc: LegacyHTLC) {
  const swapperHex = encodeSwapperId(htlc.swapper);
  return btc.Script.encode([
    swapperHex,
    'DROP',
    'IF',
    'SHA256',
    htlc.hash,
    'EQUALVERIFY',
    htlc.recipientPublicKey,
    'ELSE',
    encodeExpiration(htlc.expiration),
    'CHECKSEQUENCEVERIFY',
    'DROP',
    htlc.senderPublicKey,
    'ENDIF',
    'CHECKSIG',
  ]);
}

/**
 * ${metadata_hash}
 * OP_DROP
 * OP_IF
 *   OP_SHA256 ${hash}
 *   OP_EQUALVERIFY
 *   ${recipientPublicKey}
 * OP_ELSE
 *   ${encodeExpiration(expiration).toString('hex')}
 *   OP_CHECKSEQUENCEVERIFY
 *   OP_DROP
 *   ${senderPublicKey}
 * OP_ENDIF
 * OP_CHECKSIG`
 *
 * @param htlc
 * @returns
 */
export function createHtlcScript(htlc: HTLC) {
  return btc.Script.encode([
    htlc.metadata,
    'DROP',
    'IF',
    'SHA256',
    htlc.hash,
    'EQUALVERIFY',
    htlc.recipientPublicKey,
    'ELSE',
    encodeExpiration(htlc.expiration),
    'CHECKSEQUENCEVERIFY',
    'DROP',
    htlc.senderPublicKey,
    'ENDIF',
    'CHECKSIG',
  ]);
}

export const mockPrivateKey = hex.decode(
  '0101010101010101010101010101010101010101010101010101010101010101'
);

export function generateLegacyHtlcTx(htlc: LegacyHTLC) {
  const htlcScript = createLegacyHtlcScript(htlc);
  const privKey = hex.decode('0101010101010101010101010101010101010101010101010101010101010101');
  const opts = { version: 1, allowLegacyWitnessUtxo: true };
  const tx = new btc.Transaction(opts);
  const pub = secp256k1.getPublicKey(privKey, true);
  tx.addInput({
    txid: hex.decode('c061c23190ed3370ad5206769651eaf6fac6d87d85b5db34e30a74e0c4a6da3e'),
    index: 0,
    witnessUtxo: {
      amount: 550n,
      script: btc.p2pkh(pub).script,
    },
  });
  const out = btc.OutScript.encode({
    type: 'sh',
    hash: hash160(htlcScript),
  });

  tx.addOutput({
    redeemScript: htlcScript,
    script: out,
    amount: 10000n,
  });

  tx.signIdx(privKey, 0);
  return tx;
}

export function generateBaseTx(_amount?: bigint) {
  const privKey = mockPrivateKey;
  const opts = { version: 1, allowLegacyWitnessUtxo: true };
  const tx = new btc.Transaction(opts);
  const pub = secp256k1.getPublicKey(privKey, true);
  const amount = _amount ?? 50000n;
  tx.addInput({
    txid: hex.decode('c061c23190ed3370ad5206769651eaf6fac6d87d85b5db34e30a74e0c4a6da3e'),
    index: 0,
    witnessUtxo: {
      amount: amount + 100n,
      script: btc.p2wpkh(pub).script,
    },
  });

  return tx;
}

export function generateWshOutput(witnessScript: Uint8Array) {
  const scriptHash = sha256(witnessScript);
  return btc.OutScript.encode({
    type: 'wsh',
    hash: scriptHash,
  });
}

export function generateHtlcTx(htlc: HTLC, _amount?: bigint) {
  const htlcScript = createHtlcScript(htlc);
  const privKey = mockPrivateKey;
  const amount = _amount ?? 50000n;
  const tx = generateBaseTx(amount);
  const out = generateWshOutput(htlcScript);

  tx.addOutput({
    // redeemScript: htlcScript,
    script: out,
    amount: amount,
  });

  tx.sign(privKey);
  tx.finalize();

  return tx;
}
