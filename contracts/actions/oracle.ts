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

const abi = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "groupId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "member",
          "type": "address"
        }
      ],
      "name": "ContributionMade",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "groupId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        }
      ],
      "name": "FundsDistributed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "groupId",
          "type": "uint256"
        }
      ],
      "name": "GroupCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "groupId",
          "type": "uint256"
        }
      ],
      "name": "GroupTerminated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "groupId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "member",
          "type": "address"
        }
      ],
      "name": "MemberInvited",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "groupId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "member",
          "type": "address"
        }
      ],
      "name": "MemberJoined",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "groupId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "member",
          "type": "address"
        }
      ],
      "name": "MemberRequested",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "requestId",
          "type": "uint256"
        }
      ],
      "name": "RandomWordsRequested",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "groupId",
          "type": "uint256"
        }
      ],
      "name": "contribute",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "image",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "contributionAmount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "totalCycles",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "preStakePercentage",
          "type": "uint256"
        }
      ],
      "name": "createGroup",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "requestId",
          "type": "uint256"
        },
        {
          "internalType": "uint256[]",
          "name": "randomWords",
          "type": "uint256[]"
        }
      ],
      "name": "fulfillRandomWords",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "groupId",
          "type": "uint256"
        }
      ],
      "name": "getGroups",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "image",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "contributionAmount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "totalCycles",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "currentCycle",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "preStakeAmount",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "admin",
              "type": "address"
            },
            {
              "internalType": "address[]",
              "name": "members",
              "type": "address[]"
            },
            {
              "internalType": "address",
              "name": "currentRecipient",
              "type": "address"
            }
          ],
          "internalType": "struct Savr.GroupInfo[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "groupIdCounter",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "groups",
      "outputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "image",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "contributionAmount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "totalCycles",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "currentCycle",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "preStakeAmount",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "admin",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "currentRecipient",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "groupId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "member",
          "type": "address"
        }
      ],
      "name": "inviteGroup",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "invites",
      "outputs": [
        {
          "internalType": "enum Savr.InviteStatus",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "groupId",
          "type": "uint256"
        }
      ],
      "name": "joinGroup",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "requestIdToGroupId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "stablecoin",
      "outputs": [
        {
          "internalType": "contract IERC20",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]

export const blockOracleFn: ActionFn = async (context: Context, event: Event) => {
	let blockEvent = event as BlockEvent;
	let transactionEvent = event as TransactionEvent;
	console.log(blockEvent);
	const randomBuffer = randomBytes(32);
	const hash = createHash('sha256').update(Date.now() + randomBuffer.toString('hex')).digest('hex');
	const randomInt = [BigInt(`0x${hash}`) % BigInt(100 - 1 + 1)];
	const provider = Provider.getDefaultProvider(types.Network.Sepolia);
	const wallet = new Wallet(await context.secrets.get('PRIVATE_KEY'), provider);
	const contractInterface = new Interface(abi);
	const { data, topics } = transactionEvent.logs[0];
	const requestId = contractInterface.decodeEventLog('requestId', data, topics);
	const contract = new ethers.Contract(await context.secrets.get('SAVR_CONTRACT'), contractInterface, wallet);
	await contract.fulfillRandomWords(BigInt(requestId.toString()), randomInt);
}
