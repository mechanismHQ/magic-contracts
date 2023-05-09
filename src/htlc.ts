import * as btc from '@scure/btc-signer';
import { ripemd160 } from '@noble/hashes/ripemd160';
import { sha256 } from '@noble/hashes/sha256';
import { makeClarityHash } from 'micro-stacks/connect';
import {
  contractPrincipalCV,
  intCV,
  standardPrincipalCV,
  tupleCV,
  uintCV,
} from 'micro-stacks/clarity';
import { IntegerType } from 'micro-stacks/common';

export const CSV_DELAY = 500n;
export const CSV_DELAY_BUFF = btc.CompactSize.encode(CSV_DELAY);

export interface HTLC {
  metadata: Uint8Array;
  senderPublicKey: Uint8Array;
  recipientPublicKey: Uint8Array;
  expiration?: bigint;
  hash: Uint8Array;
}

export function encodeExpiration(expiration?: bigint): Uint8Array {
  return typeof expiration === 'undefined' ? CSV_DELAY_BUFF : btc.CompactSize.encode(expiration);
}

/**
 * * ${swapperHex}
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

export function encodeHtlcOutput(redeemScript: Uint8Array) {
  return btc.OutScript.encode({
    type: 'sh',
    hash: hash160(redeemScript),
  });
}

export function hash160(data: Uint8Array) {
  return ripemd160(sha256(data));
}

export function generateMetadataHash({
  swapperAddress,
  baseFee,
  feeRate,
}: {
  swapperAddress: string;
  baseFee: IntegerType;
  feeRate: IntegerType;
}) {
  const addressCV = swapperAddress.includes('.')
    ? contractPrincipalCV(swapperAddress)
    : standardPrincipalCV(swapperAddress);
  const cv = tupleCV({
    swapper: addressCV,
    'fee-rate': intCV(feeRate),
    'base-fee': intCV(baseFee),
  });
  return makeClarityHash(cv);
}
