import { Magic } from './openapi';
import { getContracts, getMagicContract, MagicContract } from './contracts';
import { getMagicApi } from './api';
import { getBtcNetwork, Network } from './networks';
import { hexToBytes, IntegerType, intToBigInt } from 'micro-stacks/common';
import { createHtlcScript, encodeExpiration, encodeHtlcOutput, generateMetadataHash } from './htlc';
import { outputToAddress } from './utils';
import { CompactSize } from '@scure/btc-signer';

export interface EscrowSwapOptions {
  supplier: IntegerType;
  /** bitcoin pubkey of swapper */
  sender: Uint8Array;
  recipient: Uint8Array;
  expiration: bigint;
  baseFee: bigint;
  feeRate: bigint;
  txid: string;
  hash: Uint8Array;
  swapper: string;
  network: Network;
}

export async function generateEscrowTx(options: EscrowSwapOptions) {
  const { network } = options;
  const magic = getMagicContract(network);
  const api = getMagicApi(network);

  const metadataHash = generateMetadataHash({
    swapperAddress: options.swapper,
    baseFee: options.baseFee,
    feeRate: options.feeRate,
  });

  const htlcScript = createHtlcScript({
    metadata: metadataHash,
    hash: options.hash,
    senderPublicKey: options.sender,
    recipientPublicKey: options.recipient,
    expiration: options.expiration,
  });
  const htlcOutput = encodeHtlcOutput(htlcScript);
  const htlcAddress = outputToAddress(htlcOutput, getBtcNetwork(network));

  const txData = await api.default.getTxData(options.txid, htlcAddress);
  let expiration = encodeExpiration(options.expiration);
  if (typeof expiration === 'number') {
    expiration = CompactSize.encode(BigInt(expiration));
  }

  const tx = magic.escrowSwap({
    ...txData,
    tx: hexToBytes(txData.txHex),
    prevBlocks: txData.prevBlocks.map(hexToBytes),
    proof: {
      txIndex: txData.proof.txIndex,
      hashes: txData.proof.hashes.map(hexToBytes),
      treeDepth: txData.proof.treeDepth,
    },
    block: {
      header: hexToBytes(txData.block.header),
      height: txData.block.height,
    },
    sender: options.sender,
    recipient: options.recipient,
    expirationBuff: expiration,
    hash: options.hash,
    swapper: options.swapper,
    supplierId: intToBigInt(options.supplier),
    maxBaseFee: options.baseFee,
    maxFeeRate: options.feeRate,
  });

  return tx;
}
