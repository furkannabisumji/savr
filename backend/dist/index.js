import { Contract, Interface, Wallet as w2 } from "ethers";
import { Provider, Wallet } from "zksync-ethers";
import "dotenv/config";
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { randomBytes, createHash } from "crypto";
const provider = new Provider(process.env.RPC);
const abi = JSON.parse(readFileSync(resolve('./abi.json'), 'utf8'));
const contract = new Contract(process.env.CONTRACT, abi, provider);
const sepolia = new Provider(process.env.RPC2);
const abi2 = JSON.parse(readFileSync(resolve('./abi2.json'), 'utf8'));
const wallet = new Wallet(process.env.PRIVATE_KEY, provider);
const wallet2 = new w2(process.env.PRIVATE_KEY, sepolia);
const pool = new Contract(process.env.CONTRACT2, abi2, wallet2);
contract.on("RandomWordsRequested", async (requestId) => {
    const randomBuffer = randomBytes(32);
    const hash = createHash('sha256').update(Date.now() + randomBuffer.toString('hex')).digest('hex');
    const randomInt = [BigInt(`0x${hash}`) % BigInt(100 - 1 + 1)];
    const contractInterface = new Interface(abi);
    const contract = new Contract(process.env.CONTRACT, contractInterface, wallet);
    await contract.fulfillRandomWords(requestId, randomInt);
});
contract.on("Withdraw", async (groupId, member, amount) => {
    await pool.withdraw(groupId, member, amount);
});
//# sourceMappingURL=index.js.map