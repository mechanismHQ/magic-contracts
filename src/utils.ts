import { Address, OutScript, NETWORK } from "@scure/btc-signer";
export { NETWORK, TEST_NETWORK } from "@scure/btc-signer";
import { equalBytes as _equalBytes } from "micro-packed";

export type BTCNetwork = typeof NETWORK;

export function outputToAddress(output: Uint8Array, network = NETWORK) {
  const outScript = OutScript.decode(output);
  const address = Address(network).encode(outScript);
  return address;
}

export function addressToOutput(address: string, network = NETWORK) {
  const outScript = Address(network).decode(address);
  return OutScript.encode(outScript);
}

export function equalBytes(a: Uint8Array, b: Uint8Array) {
  return _equalBytes(a, b);
}
