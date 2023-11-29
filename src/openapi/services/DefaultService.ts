/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class DefaultService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * @param txid
     * @param address
     * @returns any Default Response
     * @throws ApiError
     */
    public getTxData(
        txid: string,
        address: string,
    ): CancelablePromise<{
        /**
         * The BTC transaction in hex
         */
        txHex: string;
        proof: {
            hashes: Array<string>;
            txIndex: number;
            treeDepth: number;
        };
        block: {
            header: string;
            height: number;
        };
        prevBlocks: Array<string>;
        outputIndex: number;
        amount: string;
        burnHeight: number;
    }> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/tx-data',
            query: {
                'txid': txid,
                'address': address,
            },
        });
    }

    /**
     * Fetch all suppliers
     * Fetch all registered suppliers, including their capacities in BTC and xBTC
     * @returns any Default Response
     * @throws ApiError
     */
    public getSuppliers(): CancelablePromise<{
        suppliers: Array<{
            /**
             * STX address of the supplier
             */
            controller: string;
            /**
             * The fee (in bips) for inbound transactions
             */
            inboundFee: number;
            /**
             * The fee (in bips) for outbound transactions
             */
            outboundFee: number;
            /**
             * The base fee (in sats) for outbound transactions
             */
            outboundBaseFee: number;
            /**
             * The base fee (in sats) for inbound transactions
             */
            inboundBaseFee: number;
            /**
             * The public key of the supplier
             */
            publicKey: string;
            /**
             * The total xBTC funds (in sats) of the supplier
             */
            funds: number;
            /**
             * The unique integer identifier of the supplier
             */
            id: number;
            /**
             * Total BTC capacity (in sats) of the supplier
             */
            btc: string;
            /**
             * The p2wpkh address of the supplier
             */
            btcAddress: string;
        }>;
    }> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/suppliers',
        });
    }

}
