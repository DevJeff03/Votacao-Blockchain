const hre = require("hardhat");

async function main() {
  const Votacao = await hre.ethers.getContractFactory("Votacao");
  const contrato = await Votacao.deploy(["Alice", "Bob", "Carol"]);

  await contrato.waitForDeployment(); // correto para versões mais novas
  console.log("Contrato implantado em:", await contrato.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
(" ");
