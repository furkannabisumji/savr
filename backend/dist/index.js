import { Contract, Interface } from "ethers";
import { Provider, Wallet } from "zksync-ethers";
import "dotenv/config";
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { randomBytes, createHash } from "crypto";
const provider = new Provider(process.env.RPC);
const abi = JSON.parse(readFileSync(resolve('./abi.json'), 'utf8'));
const contract = new Contract(process.env.CONTRACT, abi, provider);
const wallet = new Wallet(process.env.PRIVATE_KEY, provider);
contract.on("RandomWordsRequested", async (requestId) => {
    const randomBuffer = randomBytes(32);
    const hash = createHash('sha256').update(Date.now() + randomBuffer.toString('hex')).digest('hex');
    const randomInt = [BigInt(`0x${hash}`) % BigInt(100 - 1 + 1)];
    const contractInterface = new Interface(abi);
    const contract = new Contract(process.env.CONTRACT, contractInterface, wallet);
    await contract.fulfillRandomWords(requestId, randomInt);
});
//# sourceMappingURL=index.js.map