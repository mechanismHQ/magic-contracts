import { btc, assertEquals, bytesToHex, hexToBytes } from "../deps.ts";
import {
  createLegacyHtlcScript,
  encodeExpiration,
  encodeSwapperId,
  generateLegacyHtlcTx,
} from "../src/htlc.ts";

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
    const exp = 100n;
    const buff = encodeExpiration(exp);
    console.log(bytesToHex(buff));

    const swapperBytes = encodeSwapperId(1n);
    console.log(bytesToHex(swapperBytes));
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

  const decoded = btc.Script.decode(hexToBytes(fixture.script));
  console.log(decoded);

  console.log(btc.Script.decode(script));
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

  console.log(tx.hex);
});
