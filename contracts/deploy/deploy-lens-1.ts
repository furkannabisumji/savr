import { deployContract, getWallet } from "./utils";
import { HardhatRuntimeEnvironment } from "hardhat/types";

export default async function (hre: HardhatRuntimeEnvironment) {
  const wallet = getWallet();

  const savr = await deployContract("Savr", [], {
    hre,
    wallet,
    verify: true,
  });
   await deployContract("Receiver", ["0xf5Aa9fe2B78d852490bc4E4Fe9ab19727DD10298", await savr.getAddress(), "0x0000000000000000000000000000000000000000"], {
    hre,
    wallet,
    verify: true,
  });
  await deployContract("Sender", ["0xf5Aa9fe2B78d852490bc4E4Fe9ab19727DD10298", "0x7f1b9eE544f9ff9bB521Ab79c205d79C55250a36", await savr.getAddress(), "0xF41B6a5354a8aB5B54Db0605F5bDbc2e15E5e5BB"], {
    hre,
    wallet,
    verify: true,
  });
}
