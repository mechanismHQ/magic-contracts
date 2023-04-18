import { Chain, afterAll } from "../deps.ts";
import { simnet } from "./clarigen-types.ts";

export function deploy() {
  const { chain, accounts } = Chain.fromSimnet(simnet);

  afterAll(() => {
    // deno-lint-ignore no-explicit-any
    (Deno as any).core.opSync("api/v1/terminate_session", {
      sessionId: chain.sessionId,
    });
  });

  return {
    chain,
    accounts,
  };
}
