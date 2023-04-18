import { Chain, describe, it, btc, hex } from "../deps.ts";
import { contracts, accounts } from "./clarigen.ts";
import { simnet } from "./clarigen-types.ts";
import { deploy } from "./helpers.ts";

const magic = contracts.magic;

describe("magic tests", () => {
  const { chain, accounts } = deploy();
  const alice = accounts.addr("wallet_1");

  it("encoding varint", () => {
    const num = 500n;
    const buff = btc.CompactSize.encode(num);
    console.log(hex.encode(buff), buff.length);

    const v1 = chain.rov(
      magic.readUint32({ num: buff.slice(1), length: buff.length - 1 })
    );

    const varint = chain.rov(magic.readVarint(buff));
    console.log("varint", varint);

    console.log(chain.rov(magic.readUint32V2({ num: buff })));

    console.log("v1", v1);

    const buff2 = chain.rov(
      magic.readUint32({ num: hex.decode("64"), length: 1 })
    );
    chain.rov(magic.readVarint({ num: hex.decode("64") }));
    console.log("buff2", buff2);
  });

  it("serializing metadata", () => {
    const num = 1000000n;
    const buff = chain.rov(magic.testSerializeUint(num));
    console.log(hex.encode(buff.buff));
    console.log(buff.unwrapped);
  });
});
