const hre = require("hardhat");

async function main() {
  const enderecoContrato = "0x5a8F7B41499d0C41168aB421C0CDb58A78d7d5AA";
  const Votacao = await hre.ethers.getContractFactory("Votacao");
  const contrato = await Votacao.attach(enderecoContrato);

  // Verifica se a votação já foi iniciada antes de adicionar candidatos
  const votacaoAtiva = await contrato.votacaoAtiva();
  if (votacaoAtiva) {
    console.log(
      "A votação já foi iniciada. Não é possível adicionar novos candidatos."
    );
    return;
  }

  console.log("Adicionando candidatos...");

  const candidatos = ["Alice", "Bob", "Carol"];

  for (let nome of candidatos) {
    const tx = await contrato.adicionarCandidato(nome);
    await tx.wait();
    console.log(`Candidato adicionado: ${nome}`);
  }

  console.log("Todos os candidatos foram adicionados!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
