require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/3ozwOUbr3VJbdIfFrASyKVFcVvPkVbk5",
      accounts: [
        [
          "Indicar Chave privada da Wallet para deploy do contrato e demais funções",
        ],
      ],
    },
  },
};
