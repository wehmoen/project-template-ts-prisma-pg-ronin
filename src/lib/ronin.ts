import {JsonRpcProvider} from "ethers";

function getApiKey(apiKey?: string): string {
    if (!apiKey) {
        apiKey = process.env.SM_API_KEY;
        if (!apiKey) throw new Error("API key not provided!");
    }

    return apiKey
}

async function testRPC(provider: JsonRpcProvider): Promise<boolean> {
    try {
        await provider.getBlockNumber();
        return true;
    } catch (e) {
        return false
    }
}

async function mainnet(archive: boolean, apiKey?: string) {
    const provider = new JsonRpcProvider("https://api-gateway.skymavis.com/" + (archive ? "archive/" : "") + "rpc?apikey=" + (getApiKey(apiKey) || ""));

    const testResult = await testRPC(provider);

    if (!testResult) throw new Error("RPC test failed! Check the provided API key and try again.");

    return provider;
}

async function testnet(apiKey?: string) {
    const provider = new JsonRpcProvider("https://api-gateway.skymavis.com/rpc/testnet?apikey=" + (getApiKey(apiKey) || ""));

    const testResult = await testRPC(provider);

    if (!testResult) throw new Error("RPC test failed! Check the provided API key and try again.");

    return provider;
}

export default {
    mainnet: (apiKey?: string) => mainnet(false, apiKey),
    mainnetArchive: (apiKey?: string) => mainnet(true, apiKey),
    testnet: testnet
}