import { project } from './clarigen-types';
import { Network } from './networks';
import { projectFactory, DeploymentNetwork } from '@clarigen/core';

export function getDeploymentKey(network: Network): DeploymentNetwork {
  switch (network) {
    case 'mainnet':
      return 'mainnet';
    case 'testnet':
      return 'testnet';
    case 'devnet':
      return 'devnet';
  }
}

export function getContracts(network: Network) {
  return projectFactory(project, network);
}

export function getMagicContract(network: Network) {
  return getContracts(network).magic;
}

export type Contracts = ReturnType<typeof getContracts>;
export type MagicContract = Contracts['magic'];
