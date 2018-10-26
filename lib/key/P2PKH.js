"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const buffer_1 = require("buffer");
const codechain_primitives_1 = require("codechain-primitives");
const Script_1 = require("../core/Script");
const utils_1 = require("../utils");
/**
 * AssetAgent which supports P2PKH(Pay to Public Key Hash).
 */
class P2PKH {
    static getLockScript() {
        const { CHKSIG } = Script_1.Script.Opcode;
        return buffer_1.Buffer.from([CHKSIG]);
    }
    static getLockScriptHash() {
        return new codechain_primitives_1.H160("d4c23a53d70e9db1e7433a3d62e674402f316ba6");
    }
    // FIXME: rename keyStore to rawKeyStore
    constructor(params) {
        const { keyStore, networkId } = params;
        this.rawKeyStore = keyStore;
        this.networkId = networkId;
    }
    createAddress(options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const { passphrase } = options;
            const hash = yield this.rawKeyStore.asset.createKey({ passphrase });
            return codechain_primitives_1.AssetTransferAddress.fromTypeAndPayload(1, hash, {
                networkId: this.networkId
            });
        });
    }
    createUnlockScript(publicKeyHash, txhash, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const { passphrase, signatureTag = { input: "all", output: "all" } } = options;
            const publicKey = yield this.rawKeyStore.asset.getPublicKey({
                key: publicKeyHash,
                passphrase
            });
            if (!publicKey) {
                throw Error(`Unable to get original key from the given public key hash: ${publicKeyHash}`);
            }
            const signature = yield this.rawKeyStore.asset.sign({
                key: publicKeyHash,
                message: txhash.value,
                passphrase
            });
            const encodedTag = utils_1.encodeSignatureTag(signatureTag);
            const { PUSHB } = Script_1.Script.Opcode;
            return buffer_1.Buffer.from([
                PUSHB,
                65,
                ...buffer_1.Buffer.from(signature, "hex"),
                PUSHB,
                encodedTag.byteLength,
                ...encodedTag
            ]);
        });
    }
}
exports.P2PKH = P2PKH;
