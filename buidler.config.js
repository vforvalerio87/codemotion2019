const { usePlugin } = require("@nomiclabs/buidler/config");
const waffleDefaultAccounts = require("ethereum-waffle/dist/config/defaultAccounts").default;

usePlugin("@nomiclabs/buidler-ethers");

module.exports = {

  "paths": {
    "sources": "./contracts",
    "artifacts": "./build"
  },

  "solc": {
    "version": "0.5.1"
  },

  "networks": {

    "buidlerevm": {
      "accounts": waffleDefaultAccounts.map(acc => ({
        "balance": acc.balance,
        "privateKey": acc.secretKey
      }))
    },

    "ganache": {
      "url": "http://127.0.0.1:8545"
    }
  },

  "defaultNetwork": "buidlerevm"

};
