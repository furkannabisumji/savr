import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SavrModule = buildModule("SavrModule", (m) => {
  //const savr = m.contract("SavrPool", []);
  //const receiver = m.contract("Receiver", ["0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59", "0x19f79B2328867f9C2629060136e19c67881D799E"]);
  const sender = m.contract("Sender", ["0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59", "0x779877A7B0D9E8603169DdbD7836e478b4624789", "0x19f79B2328867f9C2629060136e19c67881D799E", "0xAAc0500c1aaF405f78ad3c4c2269cAaFBcB86c13"]);
  return { sender };
});

export default SavrModule;