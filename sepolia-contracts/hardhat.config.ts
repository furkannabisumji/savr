import { HardhatUserConfig, vars } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
  sepoliaTestnet: {
    url: `https://ethereum-sepolia.rpc.subquery.network/public`,
    accounts: [vars.get('PRIVATE_KEY')],
  },
},
etherscan: {
apiKey: {
  sepolia: vars.get('ETHERSCAN_API_KEY'),
},
},
};

export default config;
