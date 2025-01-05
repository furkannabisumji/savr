import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SavrModule = buildModule("SavrModule", (m) => {
  //const savr = m.contract("SavrPool", []);
  //const receiver = m.contract("Receiver", ["0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59", "0x0D168958e7Be8873d4A997a0aB6F0Dac5b6966C8"]);
  const sender = m.contract("Sender", ["0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59", "0x779877A7B0D9E8603169DdbD7836e478b4624789", "0x0D168958e7Be8873d4A997a0aB6F0Dac5b6966C8", "0x6021a86F9CF3cF1EbAaC74b4De761f01441DDe48"]);
  return { sender };
});

export default SavrModule;