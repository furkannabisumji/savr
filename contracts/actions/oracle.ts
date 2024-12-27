import {
	ActionFn,
	Context,
	Event,
	TransactionEvent,
	BlockEvent,
} from '@tenderly/actions';
import { randomBytes, createHash } from 'crypto';
import { Interface } from 'ethers';
import { Wallet, Provider, types } from "zksync-ethers";
import { ethers } from "ethers";
import { readFileSync } from 'fs';
import { resolve } from 'path';

export const blockOracleFn: ActionFn = async (context: Context, event: Event) => {
	let blockEvent = event as BlockEvent;
	let transactionEvent = event as TransactionEvent;
	console.log(blockEvent);
	const randomBuffer = randomBytes(32);
	const hash = createHash('sha256').update(Date.now() + randomBuffer.toString('hex')).digest('hex');
	const randomInt = [BigInt(`0x${hash}`) % BigInt(100 - 1 + 1)];
	const provider = Provider.getDefaultProvider(types.Network.Sepolia);
	const wallet = new Wallet(await context.secrets.get('PRIVATE_KEY'), provider);
	const contractInterface = new Interface(readFileSync(resolve('./abi.json'), 'utf8').toString());
	const { data, topics } = transactionEvent.logs[0];
	const requestId = contractInterface.decodeEventLog('requestId', data, topics);
	const contract = new ethers.Contract(await context.secrets.get('SAVR_CONTRACT'), contractInterface, wallet);
	await contract.fulfillRandomWords(BigInt(requestId.toString()), randomInt);
}
