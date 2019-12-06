const Web3 = require("web3");

const { TerminalHttpProvider, SourceType, Web3Versions } = require("@terminal-packages/sdk");

const endpoint = "http://localhost:8545";

const fulfillerAddress = "0xA9371636C0912F5Be6E7637161Dc1D253c01fDda";

//const web3 = new Web3(new Web3.providers.HttpProvider(endpoint));
const web3 = new Web3(new TerminalHttpProvider({
  "host": endpoint,
  "apiKey": "qJH6+zSroigSk3mY2fO1Rw==",
  "projectId": "yLYGOelqwnjbWaZJ",
  "source": "sandbox"
}));

let balance = web3.eth.getBalance(fulfillerAddress).then(balance => {
  console.log("BALANCE:", web3.utils.fromWei(balance));
});
