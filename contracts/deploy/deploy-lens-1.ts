import { deployContract, getWallet } from "./utils";
import { HardhatRuntimeEnvironment } from "hardhat/types";

export default async function (hre: HardhatRuntimeEnvironment) {
  const wallet = getWallet();

  const savr = await deployContract("Savr", [], {
    hre,
    wallet,
    verify: true,
  });
   await deployContract("Receiver", ["0xf5Aa9fe2B78d852490bc4E4Fe9ab19727DD10298", await savr.getAddress() ], {
    hre,
    wallet,
    verify: true,
  });
}
