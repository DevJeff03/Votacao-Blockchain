const hre = require("hardhat");
const inquirer = require("inquirer").default;

async function main() {
  const enderecoContrato = "0x5a8F7B41499d0C41168aB421C0CDb58A78d7d5AA";
  const Votacao = await hre.ethers.getContractFactory("Votacao");
  const contrato = await Votacao.attach(enderecoContrato);

  const signers = await hre.ethers.getSigners();

  // Escolha da carteira
  const escolhaCarteira = await inquirer.prompt([
    {
      type: "list",
      name: "indiceCarteira",
      message: "Escolha a carteira que será usada para votar:",
      choices: signers.map((signer, index) => ({
        name: `${index + 1}. ${signer.address}`,
        value: index,
      })),
    },
  ]);

  const carteiraSelecionada = signers[escolhaCarteira.indiceCarteira];
  const contratoConectado = contrato.connect(carteiraSelecionada);

  console.log("\n📡 Interagindo com o contrato em:", enderecoContrato);
  console.log("👤 Carteira usada:", carteiraSelecionada.address);

  const votacaoAtiva = await contratoConectado.votacaoAtiva();
  const agora = Math.floor(Date.now() / 1000);
  const inicio = await contratoConectado.inicioVotacao();
  const fim = await contratoConectado.fimVotacao();

  if (!votacaoAtiva || agora < inicio || agora > fim) {
    console.log("⚠️  A votação não está ativa no momento.");
    return;
  }

  // Listar candidatos
  const [nomes, votos] = await contratoConectado.listarCandidatosComVotos();

  console.log("\n🧾 Candidatos disponíveis para votação:");
  nomes.forEach((nome, i) => {
    console.log(`${i + 1}. ${nome}`);
  });

  // Escolha do candidato
  const resposta = await inquirer.prompt([
    {
      type: "list",
      name: "candidatoEscolhido",
      message: "Escolha um candidato para votar:",
      choices: nomes.map((nome, i) => ({
        name: `${i + 1}. ${nome}`,
        value: i,
      })),
    },
  ]);

  const candidatoEscolhido = resposta.candidatoEscolhido;

  console.log(`\n🗳️  Você escolheu votar em: ${nomes[candidatoEscolhido]}`);

  try {
    const tx = await contratoConectado.votar(candidatoEscolhido);
    await tx.wait();

    console.log(`✅ Voto registrado para ${nomes[candidatoEscolhido]}!`);

    const votosAtualizados = await contratoConectado.verVotos(
      candidatoEscolhido
    );
    console.log(
      `🧮 Total de votos para ${nomes[candidatoEscolhido]}: ${votosAtualizados}`
    );
  } catch (error) {
    const mensagemErro =
      error?.error?.message || error?.message || "Erro desconhecido";

    if (mensagemErro.includes("Você já votou")) {
      console.log("❌ Não é possível votar duas vezes com o mesmo endereço.");
    } else {
      console.error("Erro ao registrar o voto:", mensagemErro);
    }
  }
}

main().catch((error) => {
  console.error("Erro inesperado:", error);
  process.exitCode = 1;
});
