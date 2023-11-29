// export { NETWORK, TEST_NETWORK } from '@scure/btc-signer';

export type Network = 'mainnet' | 'testnet' | 'devnet';

export const BtcMainnet = {
  bech32: 'bc',
  pubKeyHash: 0x00,
  scriptHash: 0x05,
  wif: 0x80,
};

export type BtcNetwork = typeof BtcMainnet;

export const BtcTestnet: BtcNetwork = {
  bech32: 'tb',
  pubKeyHash: 0x6f,
  scriptHash: 0xc4,
  wif: 0xef,
};

export type BTCNetwork = BtcNetwork;

const BtcRegtest = {
  ...BtcTestnet,
  bech32: 'bcrt',
};

export const BitcoinNetwork = {
  Mainnet: BtcMainnet,
  Testnet: BtcTestnet,
  Regtest: BtcRegtest,
} as const;

export function getBtcNetwork(network: Network) {
  switch (network) {
    case 'mainnet':
      return BtcMainnet;
    case 'testnet':
      return BtcTestnet;
    case 'devnet':
      return BtcRegtest;
  }
}
