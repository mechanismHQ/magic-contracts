import {
  btc,
  assertEquals,
  bytesToHex,
  hexToBytes,
  hex,
  secp256k1,
  sha256,
  hash160,
} from "../deps.ts";
import {
  createHtlcScript,
  createLegacyHtlcScript,
  encodeExpiration,
  encodeSwapperId,
  generateHtlcTx,
  generateLegacyHtlcTx,
} from "../src/htlc.ts";
import { randomBytes } from "../vendor/noble-hashes/utils.ts";

const fixture = {
  script:
    "04010000007563a802aaaa882102f8bb63e1e52f6dd145628849ec593d74dfe04b131604d1e5f5f134677fb31e72670164b2752103edf5ed04204ac5ab55832bb893958123f123e45fa417cfe950e4ece67359ee5868ac",
  recipient:
    "02f8bb63e1e52f6dd145628849ec593d74dfe04b131604d1e5f5f134677fb31e72",
  sender: "03edf5ed04204ac5ab55832bb893958123f123e45fa417cfe950e4ece67359ee58",
  hash: "aaaa",
  expBytes: "64",
  swapperHex: "01000000",
  swapper: 1,
  expiration: 100,
};

Deno.test({
  name: "encode expiration",
  fn() {
    // const exp = 100n;
    // const buff = encodeExpiration(exp);
    // console.log(bytesToHex(buff));

    const swapperBytes = encodeSwapperId(1n);
    // console.log(bytesToHex(swapperBytes));
    assertEquals(bytesToHex(swapperBytes), fixture.swapperHex);
  },
});

Deno.test("createLegacyHtlcScript", () => {
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

Deno.test("create htlc tx", () => {
  const htlc = {
    expiration: BigInt(fixture.expiration),
    hash: hexToBytes(fixture.hash),
    swapper: BigInt(fixture.swapper),
    recipientPublicKey: hexToBytes(fixture.recipient),
    senderPublicKey: hexToBytes(fixture.sender),
  };

  const tx = generateLegacyHtlcTx(htlc);

  // console.log(tx.hex);
});

Deno.test({
  name: "sign htlc tx",
  fn() {
    const privKey = hex.decode(
      "0101010101010101010101010101010101010101010101010101010101010101"
    );
    const pub = secp256k1.getPublicKey(privKey, true);
    const preimage = randomBytes(20);
    const hash = sha256(preimage);
    const metadata = hex.decode("0000");
    const htlc = {
      expiration: BigInt(fixture.expiration),
      hash: hash,
      metadata: sha256(metadata),
      recipientPublicKey: pub,
      senderPublicKey: hexToBytes(fixture.sender),
    };

    const htlcScript = createHtlcScript(htlc);
    const inputTx = generateHtlcTx(htlc);
    inputTx.finalize();

    const psbt = new btc.Transaction({ version: 1, allowUnknowInput: true });

    psbt.addInput({
      txid: inputTx.hash,
      nonWitnessUtxo: inputTx.hex,
      index: 0,
      redeemScript: htlcScript,
    });

    const out = btc.OutScript.encode({
      type: "sh",
      hash: hash160(htlcScript),
    });

    psbt.addOutput({
      redeemScript: htlcScript,
      script: out,
      amount: 900n,
    });

    console.log(hex.encode(htlcScript));

    // console.log(hex.encode(hash160(htlcScript)));

    // psbt.finalizeIdx(0);

    psbt.signIdx(privKey, 0);
    // console.log(hex.encode(pub));

    const input = psbt.getInput(0)!;
    const partial = input.partialSig!;
    const finalized = btc.Script.encode([partial[0][1], "OP_0"]);
    input.finalScriptSig = finalized;
    // console.log(partial[0].map(hex.encode)[1]);
    psbt.finalize();
  },
});
