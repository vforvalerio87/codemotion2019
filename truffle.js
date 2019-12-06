const HDWalletProvider = require("truffle-hdwallet-provider");

const mnemonic = "video absent build angry loan ship worry solution hip tail eagle horn";

module.exports = {

  "networks": {
    "development": {
      provider: () => new HDWalletProvider(mnemonic, "https://terminal.co/networks/ganache_24e13b3187d754c8df1c6a0ae74b070/ceec68a33ff30475"),
      "network_id": "*"
    }
  },

  "compilers": {
    "solc": {
      "version": "0.5.1"
    }
  }

}
