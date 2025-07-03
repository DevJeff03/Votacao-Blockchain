// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Votacao {
    address public administrador;
    bool public votacaoAtiva = false;
    uint public inicioVotacao;
    uint public fimVotacao;

    struct Candidato {
        string nome;
        uint votos;
    }

    mapping(uint => Candidato) public candidatos;
    uint public totalCandidatos;

    mapping(address => bool) public jaVotou; // 🔒 Proteção contra votos duplicados

    constructor() {
        administrador = msg.sender;
    }

    modifier apenasAdmin() {
        require(msg.sender == administrador, "Apenas o admin pode executar isso");
        _;
    }

    function adicionarCandidato(string memory _nome) public apenasAdmin {
        candidatos[totalCandidatos] = Candidato(_nome, 0);
        totalCandidatos++;
    }

    function iniciarVotacao(uint _duracaoSegundos) public apenasAdmin {
        require(!votacaoAtiva, "A votacao ja esta ativa");
        inicioVotacao = block.timestamp;
        fimVotacao = block.timestamp + _duracaoSegundos;
        votacaoAtiva = true;
    }

    function encerrarVotacao() public apenasAdmin {
        votacaoAtiva = false;
    }

    function votar(uint _candidatoId) public {
        require(votacaoAtiva, "A votacao nao esta ativa");
        require(block.timestamp >= inicioVotacao, "A votacao ainda nao comecou");
        require(block.timestamp <= fimVotacao, "A votacao terminou");
        require(_candidatoId < totalCandidatos, "Candidato invalido");
        require(!jaVotou[msg.sender], "Esse endereco ja votou");

        candidatos[_candidatoId].votos++;
        jaVotou[msg.sender] = true; // Marca como votado
    }

    function verVotos(uint _candidatoId) public view returns (uint) {
        require(_candidatoId < totalCandidatos, "Candidato invalido");
        return candidatos[_candidatoId].votos;
    }

    function listarCandidatosComVotos() public view returns (string[] memory, uint[] memory) {
        string[] memory nomes = new string[](totalCandidatos);
        uint[] memory votos = new uint[](totalCandidatos);

        for (uint i = 0; i < totalCandidatos; i++) {
            nomes[i] = candidatos[i].nome;
            votos[i] = candidatos[i].votos;
        }

        return (nomes, votos);
    }
}