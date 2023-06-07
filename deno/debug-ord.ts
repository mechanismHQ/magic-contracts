import { btc, hex } from '../deps.ts';

const txid = Deno.args[0] || '0c944a22e9b2a01ae1f268d8884512f835a16c3cbe3fc46072ac3fe58a0318ea';

const url = `https://mempool.space/api/tx/${txid}/hex`;

const res = await fetch(url);

const txHex = await res.text();

const tx = btc.Transaction.fromRaw(hex.decode(txHex));

if (tx.id !== txid) throw new Error('txid mismatch');

const input = tx.getInput(0)!;

const witnesses = input.finalScriptWitness!;

const inscription = witnesses[1];

const script = btc.Script.decode(inscription);

const ordStartIdx = script.findIndex(op => op === 'IF');

const mimeHex = script[ordStartIdx + 3];
const contentHex = script[ordStartIdx + 5];

const decoder = new TextDecoder();

const contentType = decoder.decode(mimeHex as Uint8Array);
console.log('contentType', contentType);

const content = decoder.decode(contentHex as Uint8Array);
console.log('content', content);