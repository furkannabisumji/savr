import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SavrModule = buildModule("SavrModule", (m) => {
  //const savr = m.contract("SavrPool", []);
  //const receiver = m.contract("Receiver", ["0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59", "0x0000000000000000000000000000000000000000", "0xa11f810c650A19F2E6a74828dB73EA29B8C6904D"]);
  const sender = m.contract("Sender", ["0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59", "0x779877A7B0D9E8603169DdbD7836e478b4624789", "0xa11f810c650A19F2E6a74828dB73EA29B8C6904D", "0x5671557aAE47aB0582F9403F101D10d0B2F2f51e"]);
  return { sender };
});

export default SavrModule;