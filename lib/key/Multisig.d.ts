/// <reference types="node" />
import { AssetTransferAddress, H160 } from "codechain-primitives";
import { NetworkId } from "../core/types";
import { SignatureTag } from "../utils";
import { KeyStore } from "./KeyStore";
export declare class Multisig {
    static getLockScript(): Buffer;
    static getLockScriptHash(): H160;
    private keyStore;
    private networkId;
    constructor(params: {
        keyStore: KeyStore;
        networkId: NetworkId;
    });
    createAddress(params: {
        n: number;
        m: number;
        pubkeys: H160 | string;
    }, options?: {
        passphrase?: string;
    }): Promise<AssetTransferAddress>;
    createUnlockScript(options?: {
        passphrase?: string;
        signatureTag?: SignatureTag;
    }): Promise<Buffer>;
}
