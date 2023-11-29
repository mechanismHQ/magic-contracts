import { Network } from './networks.ts';
import { Magic } from './openapi/index.ts';

export { Magic as MagicApiService } from './openapi/index.ts';

export function getMagicApiUrl(network: Network) {
  switch (network) {
    case 'mainnet':
      return 'https://mainnet-magic-api.fly.dev';
    case 'testnet':
      return 'https://mainnet-magic-api.fly.dev';
    case 'devnet':
      return 'http://localhost:3000';
  }
}

export function getMagicApi(network: Network) {
  return new Magic({
    BASE: getMagicApiUrl(network),
  });
}

export async function fetchTxData({
  network,
  txid,
  address,
}: {
  network: Network;
  txid: string;
  address: string;
}) {
  const api = getMagicApi(network);
  const data = await api.default.getTxData(txid, address);

  return {};
}
