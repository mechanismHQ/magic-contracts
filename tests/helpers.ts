import {
  Chain,
  afterAll,
  Receipts,
  TxCall,
  UnknownArgs,
  ContractCallTyped,
  btc,
  randomBytes,
} from "../deps.ts";
import { accounts, simnet } from "./clarigen-types.ts";
import { contracts } from "./clarigen.ts";
import { publicKeys } from "./mocks.ts";

export const magic = contracts.magic;
export const xbtcContract = contracts.wrappedBitcoin;
export const testUtils = contracts.testUtils;

export const [xbtcDeployer] = xbtcContract.identifier.split(".");

export const xbtcAsset = `${xbtcContract.identifier}::wrapped-bitcoin`;

export const supplier = accounts.wallet_1.address;
export const swapper = accounts.wallet_2.address;
export const deployer = accounts.deployer.address;

export const feeIn = 300n;
export const feeOut = 100n;
export const startingFunds = 2n * 1000000n;

export const [supplierKey, swapperKey] = publicKeys;

export const proof = {
  treeDepth: 1n,
  txIndex: 1n,
  hashes: [],
};

export type Receipt<T> = Receipts<T[]>[number];

// deno-lint-ignore no-explicit-any
export type TxReceipt<T> = T extends (...args: any) => any
  ? ReturnType<T> extends ContractCallTyped<UnknownArgs, infer R>
    ? Receipt<TxCall<R>>
    : never
  : never;
// deno-lint-ignore no-explicit-any
export type TxReceiptOk<T> = T extends (...args: any) => any
  ? ReturnType<T> extends ContractCallTyped<UnknownArgs, infer R>
    ? Receipt<TxCall<R, true>>
    : never
  : never;

export function hashMetadata(
  chain: Chain,
  minAmount: bigint,
  recipient: string
) {
  return chain.rov(
    magic.hashMetadata({
      swapper: recipient,
      minAmount,
    })
  );
}

export function deploy() {
  const { chain, accounts } = Chain.fromSimnet(simnet);

  const [deployer, supplier, swapper] = accounts.addresses(
    "deployer",
    "wallet_1",
    "wallet_2"
  );

  afterAll(() => {
    // deno-lint-ignore no-explicit-any
    (Deno as any).core.opSync("api/v1/terminate_session", {
      sessionId: chain.sessionId,
    });
  });

  return {
    chain,
    accounts,
    deployer,
    swapper,
    supplier,
  };
}

export function initXbtc(chain: Chain) {
  chain.txOk(
    xbtcContract.initialize("xbtc", "xbtc", 8, xbtcDeployer),
    xbtcDeployer
  );
  chain.txOk(xbtcContract.addPrincipalToRole(1, xbtcDeployer), xbtcDeployer);
  chain.txOk(
    xbtcContract.mintTokens(100000000000000, accounts.wallet_1.address),
    xbtcDeployer
  );
}

export function mockTxArgs(tx: btc.Transaction) {
  return {
    tx: tx.toBytes(true),
    block: {
      header: randomBytes(80),
      height: 1n,
    },
    prevBlocks: [],
    proof,
    outputIndex: 0n,
  };
}
