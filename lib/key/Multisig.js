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
const codechain_primitives_1 = require("codechain-primitives");
class Multisig {
    static getLockScript() {
        return Buffer.from([]);
    }
    static getLockScriptHash() {
        return new codechain_primitives_1.H160("");
    }
    constructor(params) {
        const { keyStore, networkId } = params;
        this.keyStore = keyStore;
        this.networkId = networkId;
    }
    createAddress(params, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            // FIXME:
            return codechain_primitives_1.AssetTransferAddress.fromTypeAndPayload(3, "", {
                networkId: this.networkId
            });
        });
    }
    createUnlockScript(options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const { passphrase, signatureTag = { input: "all", output: "all" } } = options;
            if (!!true) {
                throw Error(`not implemented ${passphrase}, ${signatureTag}`);
            }
            return Buffer.from([]);
        });
    }
}
exports.Multisig = Multisig;
