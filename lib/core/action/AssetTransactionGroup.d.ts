import { H256 } from "../H256";
import { Transaction } from "../transaction/Transaction";
export declare class ChangeShard {
    shardId: number;
    preRoot: H256;
    postRoot: H256;
    constructor(obj: {
        shardId: number;
        preRoot: H256;
        postRoot: H256;
    });
    toJSON(): {
        shardId: number;
        preRoot: string;
        postRoot: string;
    };
    toEncodeObject(): (string | number)[];
}
export declare class AssetTransactionGroup {
    transactions: Transaction[];
    changes: ChangeShard[];
    signatures: string[];
    constructor(input: {
        transactions: Transaction[];
    });
    addSignature(signature: string): void;
    toEncodeObject(): any[];
    toJSON(): {
        action: string;
        transactions: ({
            type: string;
            data: {
                networkId: string;
                burns: {
                    prevOut: {
                        transactionHash: string;
                        index: number;
                        assetType: string;
                        amount: number;
                    };
                    lockScript: number[];
                    unlockScript: number[];
                }[];
                inputs: {
                    prevOut: {
                        transactionHash: string;
                        index: number;
                        assetType: string;
                        amount: number;
                    };
                    lockScript: number[];
                    unlockScript: number[];
                }[];
                outputs: {
                    lockScriptHash: string;
                    parameters: number[][];
                    assetType: string;
                    amount: number;
                }[];
                nonce: number;
            };
        } | {
            type: string;
            data: {
                networkId: string;
                shardId: number;
                metadata: string;
                output: {
                    lockScriptHash: string;
                    parameters: number[][];
                    amount: number | null;
                };
                registrar: string | null;
                nonce: number;
            };
        } | {
            type: string;
            data: {
                networkId: string;
                shardId: number;
                metadata: string;
                registrar: import("codechain-primitives/lib/address/PlatformAddress").PlatformAddress | null;
                output: {
                    lockScriptHash: string;
                    parameters: number[][];
                    amount: number | null;
                };
                inputs: {
                    prevOut: {
                        transactionHash: string;
                        index: number;
                        assetType: string;
                        amount: number;
                    };
                    lockScript: number[];
                    unlockScript: number[];
                }[];
                nonce: number;
            };
        } | {
            type: string;
            data: {
                input: {
                    prevOut: {
                        transactionHash: string;
                        index: number;
                        assetType: string;
                        amount: number;
                    };
                    lockScript: number[];
                    unlockScript: number[];
                };
                outputs: {
                    lockScriptHash: string;
                    parameters: number[][];
                    assetType: string;
                    amount: number;
                }[];
                networkId: string;
                nonce: number;
            };
        })[];
        changes: {
            shardId: number;
            preRoot: string;
            postRoot: string;
        }[];
        signatures: string[];
    };
}
