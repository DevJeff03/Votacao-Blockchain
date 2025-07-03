const hre = require("hardhat");

async function main() {
  const enderecoContrato = "0x5a8F7B41499d0C41168aB421C0CDb58A78d7d5AA";
  const Votacao = await hre.ethers.getContractFactory("Votacao");
  const contrato = await Votacao.attach(enderecoContrato);

  console.log("Iniciando a votação...");

  // Verifica se há candidatos registrados
  const [nomes, _] = await contrato.listarCandidatosComVotos();

  if (!nomes || nomes.length === 0) {
    console.log(
      "❌ Não é possível iniciar a votação sem candidatos registrados."
    );
    return;
  }

  const duracaoVotacao = 300; // 5 minutos

  const txInicio = await contrato.iniciarVotacao(duracaoVotacao);
  await txInicio.wait();
  console.log(`✅ Votação iniciada por ${duracaoVotacao} segundos.`);

  console.log("⏳ Aguardando o término da votação...");
  await new Promise((resolve) => setTimeout(resolve, duracaoVotacao * 1000));

  const txFim = await contrato.encerrarVotacao();
  await txFim.wait();
  console.log("🛑 Votação encerrada automaticamente!");

  // Apuração dos votos
  console.log("\n📊 Apuração dos votos:");
  const [nomesAtualizados, votos] = await contrato.listarCandidatosComVotos();

  let vencedor = "";
  let maiorNumeroVotos = -1;
  let empate = [];

  nomesAtualizados.forEach((nome, i) => {
    const totalVotos = votos[i];
    console.log(`🗳️ ${nome}: ${totalVotos} voto(s)`);

    if (totalVotos > maiorNumeroVotos) {
      maiorNumeroVotos = totalVotos;
      vencedor = nome;
      empate = [nome];
    } else if (totalVotos === maiorNumeroVotos) {
      empate.push(nome);
    }
  });

  if (maiorNumeroVotos === 0) {
    console.log("\n⚠️ Nenhum voto foi registrado.");
  } else if (empate.length > 1) {
    console.log(
      `\n🤝 Empate entre os candidatos: ${empate.join(
        ", "
      )} com ${maiorNumeroVotos} voto(s) cada.`
    );
  } else {
    console.log(
      `\n🏆 Candidato vencedor: ${vencedor} com ${maiorNumeroVotos} voto(s)!`
    );
  }
}

main().catch((error) => {
  console.error("Erro inesperado:", error);
  process.exitCode = 1;
});
