import { deployContract, getWallet } from "./utils";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { writeFileSync } from "fs";
import { resolve } from "path"; 

export default async function (hre: HardhatRuntimeEnvironment) {
  const wallet = getWallet();

  const savr = await deployContract("Savr", [], {
    hre,
    wallet,
    verify: true,
  });
  const receiver = await deployContract("Receiver", ["0xf5Aa9fe2B78d852490bc4E4Fe9ab19727DD10298", await savr.getAddress(), "0x0000000000000000000000000000000000000000"], {
    hre,
    wallet,
    verify: true,
  });
  writeFileSync(resolve(__dirname, "../lens-1-config.json"), JSON.stringify({
    savr: await savr.getAddress(),
    receiver: await receiver.getAddress(),
  }));
}
