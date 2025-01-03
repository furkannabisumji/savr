import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SavrModule = buildModule("SavrModule", (m) => {
  const savr = m.contract("SavrPool", []);

  return { savr };
});

export default SavrModule;