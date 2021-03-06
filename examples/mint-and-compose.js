const SDK = require("codechain-sdk");

const sdk = new SDK({
    server: process.env.CODECHAIN_RPC_HTTP || "http://localhost:8080",
    networkId: process.env.CODECHAIN_NETWORK_ID || "tc"
});

const ACCOUNT_ADDRESS =
    process.env.ACCOUNT_ADDRESS ||
    "tccq9h7vnl68frvqapzv3tujrxtxtwqdnxw6yamrrgd";
const ACCOUNT_PASSPHRASE = "satoshi";

(async () => {
    const aliceAddress = await sdk.key.createAssetAddress({
        type: "P2PKH"
    });

    const assetScheme = sdk.core.createAssetScheme({
        shardId: 0,
        metadata: {
            name: "An example asset"
        },
        supply: 10,
        approver: null
    });
    const mintTx = sdk.core.createMintAssetTransaction({
        scheme: assetScheme,
        recipient: aliceAddress
    });

    const firstAsset = mintTx.getMintedAsset();
    const composeTx = sdk.core.createComposeAssetTransaction({
        scheme: {
            shardId: 0,
            metadata: { name: "An unique asset" },
            supply: 1
        },
        inputs: [firstAsset.createTransferInput()],
        recipient: aliceAddress
    });
    await sdk.key.signTransactionInput(composeTx, 0);

    await sdk.rpc.chain.sendTransaction(mintTx, {
        account: ACCOUNT_ADDRESS,
        passphrase: ACCOUNT_PASSPHRASE
    });
    await sdk.rpc.chain.sendTransaction(composeTx, {
        account: ACCOUNT_ADDRESS,
        passphrase: ACCOUNT_PASSPHRASE
    });

    const mintTxResults = await sdk.rpc.chain.getTransactionResultsByTracker(
        mintTx.tracker(),
        {
            timeout: 300 * 1000
        }
    );
    if (!mintTxResults[0].success) {
        throw Error("AssetMintTransaction failed");
    }
    const transferTxResults = await sdk.rpc.chain.getTransactionResultsByTracker(
        composeTx.tracker(),
        {
            timeout: 300 * 1000
        }
    );
    if (!transferTxResults[0].success) {
        throw Error("AssetComposeTransaction failed");
    }
})().catch(err => {
    console.error(`Error:`, err);
});
