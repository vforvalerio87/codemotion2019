const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const IPFS = require("ipfs");
const ethers = require('ethers');

const { ethereumEndpoint, serviceIpfsConfig, serviceId, endpoint, protoPath } = require("./../config.js");

const { abi, networks } = require("./../build/Registry.json");

const bytes32 = ethers.utils.formatBytes32String;


const provider = new ethers.providers.JsonRpcProvider(ethereumEndpoint);
const signer = provider.getSigner(0);


const package = grpc.loadPackageDefinition(
  protoLoader.loadSync(protoPath)
).horoscope;


function getHoroscope(call, callback) {
  switch(call.request.sign) {

    case "Taurus": {
      callback(null, { "prediction": "Day's looking great mate" });
      break;
    }

    default: {
      callback({
        "code": 400,
        "message": `That's no zodiac sign! (${call.request.sign})`,
        "status": grpc.status.INTERNAL
      }, null);
      break;
    }

  }
}

async function main() {

  // Start IPFS node
  // Specifying custom config to run a service IPFS node and a client IPFS node in parallel
  const ipfs = await IPFS.create(serviceIpfsConfig);


  // Upload service definition to IPFS, get service definition hash
  const result = await ipfs.addFromFs(protoPath);
  const ipfsHash = result[0].hash;

  console.log("IPFS HASH:", `https://ipfs.io/ipfs/${ipfsHash}`);


  // Get instance of registry contract
  const { chainId } = await provider.getNetwork();

  let registry = new ethers.Contract(
    networks[chainId].address,
    abi,
    provider
  );
  registry = registry.connect(signer);


  // Register service in the smart contract
  await registry.registerService(
    bytes32(serviceId),
    ipfsHash,
    endpoint
  );

  console.log(await registry.serviceRegistrations(bytes32(serviceId)));

  const server = new grpc.Server();
  server.addService(package.Horoscope.service, { getHoroscope });
  server.bind("0.0.0.0:8099", grpc.ServerCredentials.createInsecure());
  server.start();
}

main();
