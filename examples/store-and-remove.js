const SDK = require("codechain-sdk");

const sdk = new SDK({
    server: process.env.CODECHAIN_RPC_HTTP || "http://localhost:8080",
    networkId: process.env.CODECHAIN_NETWORK_ID || "tc"
});

const ACCOUNT_ADDRESS =
    process.env.ACCOUNT_ADDRESS ||
    "tccq9h7vnl68frvqapzv3tujrxtxtwqdnxw6yamrrgd";
const ACCOUNT_PASSPHRASE = process.env.ACCOUNT_PASSPHRASE || "satoshi";

const privForStore = sdk.util.generatePrivateKey();

(async () => {
    // Store the text with a secret (= private key)
    const storeParcel = sdk.core.createStoreParcel({
        content: "CodeChain",
        secret: privForStore
    });
    const storeResult = await sdk.rpc.account.sendParcel({
        parcel: storeParcel,
        account: ACCOUNT_ADDRESS,
        passphrase: ACCOUNT_PASSPHRASE
    });
    const storeHash = storeResult.hash;
    const invoice1 = await sdk.rpc.chain.getParcelInvoice(storeHash, {
        timeout: 300 * 1000
    });
    console.log(invoice1); // { success : true }

    // To get the text, use hash of signed parcel
    const text = await sdk.rpc.chain.getText(storeHash);
    console.log(text);
    // Text {
    //   content: 'CodeChain',
    //   certifier: PlatformAddress from privForStore
    // }

    // When remove, hash of signed parcel is needed
    const removeParcel = sdk.core.createRemoveParcel({
        hash: storeHash,
        secret: privForStore
    });
    const removeResult = await sdk.rpc.account.sendParcel({
        parcel: removeParcel,
        account: ACCOUNT_ADDRESS,
        passphrase: ACCOUNT_PASSPHRASE
    });
    const removeHash = removeResult.hash;
    const invoice2 = await sdk.rpc.chain.getParcelInvoice(removeHash, {
        timeout: 300 * 1000
    });
    console.log(invoice2); // { success : true }
})().catch(console.error);