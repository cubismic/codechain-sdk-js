import { Buffer } from "buffer";
import { AssetTransferAddress, H160 } from "codechain-primitives";

import { H256 } from "../core/H256";
import { Script } from "../core/Script";
import { NetworkId } from "../core/types";
import { encodeSignatureTag, SignatureTag } from "../utils";

import { KeyStore } from "./KeyStore";

/**
 * AssetAgent which supports P2PKH(Pay to Public Key Hash).
 */
export class P2PKH {
    public static getLockScript(): Buffer {
        const { CHKSIG } = Script.Opcode;
        return Buffer.from([CHKSIG]);
    }

    public static getLockScriptHash(): H160 {
        return new H160("d4c23a53d70e9db1e7433a3d62e674402f316ba6");
    }
    private rawKeyStore: KeyStore;
    private networkId: NetworkId;

    // FIXME: rename keyStore to rawKeyStore
    constructor(params: { keyStore: KeyStore; networkId: NetworkId }) {
        const { keyStore, networkId } = params;
        this.rawKeyStore = keyStore;
        this.networkId = networkId;
    }

    public async createAddress(
        options: { passphrase?: string } = {}
    ): Promise<AssetTransferAddress> {
        const { passphrase } = options;
        const hash = await this.rawKeyStore.asset.createKey({ passphrase });
        return AssetTransferAddress.fromTypeAndPayload(1, hash, {
            networkId: this.networkId
        });
    }

    public async createUnlockScript(
        publicKeyHash: string,
        txhash: H256,
        options: { passphrase?: string; signatureTag?: SignatureTag } = {}
    ): Promise<Buffer> {
        const {
            passphrase,
            signatureTag = { input: "all", output: "all" } as SignatureTag
        } = options;
        const publicKey = await this.rawKeyStore.asset.getPublicKey({
            key: publicKeyHash,
            passphrase
        });
        if (!publicKey) {
            throw Error(
                `Unable to get original key from the given public key hash: ${publicKeyHash}`
            );
        }
        const signature = await this.rawKeyStore.asset.sign({
            key: publicKeyHash,
            message: txhash.value,
            passphrase
        });
        const encodedTag = encodeSignatureTag(signatureTag);
        const { PUSHB } = Script.Opcode;
        return Buffer.from([
            PUSHB,
            65,
            ...Buffer.from(signature, "hex"),
            PUSHB,
            encodedTag.byteLength,
            ...encodedTag
        ]);
    }
}
