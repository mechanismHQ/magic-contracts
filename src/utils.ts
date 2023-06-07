import { Address, OutScript } from '@scure/btc-signer';
import { equalBytes as _equalBytes } from 'micro-packed';
import type { BtcNetwork } from './networks';

export function outputToAddress(output: Uint8Array, network: BtcNetwork) {
  const outScript = OutScript.decode(output);
  const address = Address(network).encode(outScript);
  return address;
}

export function addressToOutput(address: string, network: BtcNetwork) {
  const outScript = Address(network).decode(address);
  return OutScript.encode(outScript);
}

export function equalBytes(a: Uint8Array, b: Uint8Array) {
  return _equalBytes(a, b);
}
