const fs = require("fs");

const tmp = require("tmp");
const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const IPFS = require("ipfs");
const Web3 = require("web3");

const { ethereumEndpoint, clientIpfsConfig, serviceId } = require("./../config.js");

const { abi, networks } = require("./../build/contracts/Registry.json");


async function main() {

  // Get instance of registry contract
  const web3 = new Web3(ethereumEndpoint);
  const networkId = await web3.eth.net.getId();
  const account = (await web3.eth.getAccounts())[0];

  const registry = new web3.eth.Contract(
    abi,
    networks[networkId].address
  );

  // Get service registration from service registrations mapping in contract
  registry.methods.serviceRegistrations(
    web3.utils.asciiToHex(serviceId)
  ).call().then(async (serviceRegistration) => {

    // Get service endpoint and service definition IPFS hash from service registration
    const { endpoint, serviceDefinitionURI } = serviceRegistration;

    // Start IPFS node
    // Specifying custom config to run a service IPFS node and a client IPFS node in parallel
    const ipfs = await IPFS.create(clientIpfsConfig);

    // Get service definition from IPFS, save to temp file
    const tmpFile = tmp.fileSync();

    ipfs.cat(serviceDefinitionURI, (err, file) => {
      if (err) throw err;

      fs.writeFileSync(tmpFile.fd, file.toString("utf8"));


      // Create gRPC client
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
