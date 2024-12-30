export interface Circle {
  id: number;
  admin: string; // Admin address (0x address)
  contributionAmount: bigint; // BigInt for the contribution amount
  currentCycle: bigint; // BigInt for the current cycle
  currentRecipient: string; // Current recipient address (0x address)
  image: string; // Image URL or reference (could be a string like 'h', as per your example)
  members: string[]; // Array of member addresses (0x addresses)
  name: string; // Group name
  preStakeAmount: bigint; // BigInt for the pre-stake amount
  totalCycles: bigint; // BigInt for total cycles
  createdAt: number;
}

interface Cycle {
  createdAt: bigint; // uint256 (BigNumber type for large numbers)
  deadline: bigint; // uint256 (BigNumber type)
  contributedAmount: bigint; // uint256 (BigNumber type)
  members: string[]; // address[] (Array of strings representing Ethereum addresses)
}

export type CircleData = [
  id: number,
  name: string, // 'Degen'
  imageHash: string, // 'bafkreieuxuc55qblza7f3zkqwqgz6jpa6jksesorejvv2foh2wet6gyxde'
  contributionAmount: bigint, // 10000000000000000n
  totalCycles: bigint, // 2000000000000000000n
  currentCycle: bigint, // 0n
  preStakeAmount: bigint, // 4000000000000000000000000000000000n
  adminAddress: `0x${string}`, // '0x7D4e2d9D7cf03199D5E41bAB5E9930a8d9A44FD7'
  members: `0x${string}`[],
  currentRecipient: `0x${string}`, // '0x0000000000000000000000000000000000000000'
  createdAt: number,
  cycles: Cycle[],
];
