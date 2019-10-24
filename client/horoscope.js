const fs = require("fs");

const tmp = require("tmp");
const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const IPFS = require("ipfs");
const Web3 = require("web3");

const { ethereumEndpoint, serviceId } = require("./../config.js");

const { abi, networks } = require("./../build/contracts/Registry.json");


async function main() {

  // Get service endpoint and definition from registry
  const web3 = new Web3(ethereumEndpoint);
  const networkId = await web3.eth.net.getId();
  const account = (await web3.eth.getAccounts())[0];

  const registry = new web3.eth.Contract(
    abi,
    networks[networkId].address
  );

  registry.methods.serviceRegistrations(
    web3.utils.asciiToHex(serviceId)
  ).call().then(async (serviceRegistration) => {

    const { endpoint, serviceDefinitionURI } = serviceRegistration;

    // Get service definition from IPFS, save to temp file
    const ipfs = await IPFS.create();

    const tmpFile = tmp.fileSync();

    ipfs.cat(serviceDefinitionURI, (err, file) => {
      if (err) throw err;

      fs.writeFileSync(tmpFile.fd, file.toString("utf8"));


      // Create IPFS client
      const package = grpc.loadPackageDefinition(
        protoLoader.loadSync(tmpFile.name)
      ).horoscope;

      const client = new package.Horoscope(
        endpoint,
        grpc.credentials.createInsecure()
      );


      // Call methods on the service
      client.getHoroscope({ "sign": "Taurus" }, (err, response) => {
        console.log("\n" + "GETTING HOROSCOPE FOR TAURUS:");

        if (err !== null) console.error(err.details);
        else console.log(response.prediction);
      });

      client.getHoroscope({ "sign": "Dog" }, (err, response) => {
        console.log("\n" + "GETTING HOROSCOPE FOR DOG:");

        if (err !== null) console.error(err.details);
        else console.log(response.prediction);
      });

    })

  });

}

main();
