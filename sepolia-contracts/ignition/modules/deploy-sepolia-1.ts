import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SavrModule = buildModule("SavrModule", (m) => {
  //const savr = m.contract("SavrPool", []);
  const sender = m.contract("Sender", ["0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59", "0x779877A7B0D9E8603169DdbD7836e478b4624789", "0x81b0334115f5641dDE86D7696C52020558Ab84a5", "0x7c96d205080a339B7c1e60de3B74b2ab7ac13CcB"]);
  return { sender };
});

export default SavrModule;