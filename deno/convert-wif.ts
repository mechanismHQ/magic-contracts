import * as btc from '../vendor/scure-btc-signer.ts';
import { hexToBytes } from '../deps.ts';

const [privKey] = Deno.args;

const wif = btc.WIF(btc.TEST_NETWORK).encode(hexToBytes(privKey));

console.log(wif);
