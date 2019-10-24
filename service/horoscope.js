const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const IPFS = require("ipfs");
const Web3 = require("web3");

const { ethereumEndpoint, serviceId, endpoint, protoPath } = require("./../config.js");

const { abi, networks } = require("./../build/contracts/Registry.json");


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

  // Upload service definition to IPFS
  const ipfs = await IPFS.create();

  const result = await ipfs.addFromFs(protoPath);
  const ipfsHash = result[0].hash;


  // Register service in the smart contract
  const web3 = new Web3(ethereumEndpoint);
  const networkId = await web3.eth.net.getId();
  const account = (await web3.eth.getAccounts())[0];

  const registry = new web3.eth.Contract(
    abi,
    networks[networkId].address
  );


  registry.methods.registerService(
    web3.utils.asciiToHex(serviceId),
    ipfsHash,
    endpoint,
  ).send({
    "from": account,
    "gas": 200000
  }).then(receipt => {
    console.log("RECEIPT:", receipt);

    // Start IPFS service
    const server = new grpc.Server();
    server.addService(package.Horoscope.service, { getHoroscope });
    server.bind("0.0.0.0:8099", grpc.ServerCredentials.createInsecure());
    server.start();
  });
  
}

main();
