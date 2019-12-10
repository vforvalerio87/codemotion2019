const fs = require("fs");

const tmp = require("tmp");
const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const IPFS = require("ipfs");
const ethers = require('ethers');

const { ethereumEndpoint, clientIpfsConfig, serviceId } = require("./../config.js");

const { abi, networks } = require("./../build/Registry.json");

const bytes32 = ethers.utils.formatBytes32String;


const provider = new ethers.providers.JsonRpcProvider(ethereumEndpoint);
const signer = provider.getSigner(1);


async function main() {

  // Get instance of registry contract
  const { chainId } = await provider.getNetwork();
  let registry = new ethers.Contract(
    networks[chainId].address,
    abi,
    provider
  );
  registry = registry.connect(signer);

  // Get service registration from service registrations mapping in contract
  const serviceRegistration = await registry.serviceRegistrations(bytes32(serviceId))

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

}

main();
