const fs = require("fs");
const path = require("path");

const { getContract, provider } = require("@nomiclabs/buidler").ethers;
const RegistryArtifact = require("./../build/Registry.json");

async function main() {
  const registry = await getContract("Registry");

  const contract = await registry.deploy();

  console.log("Address:", contract.address);

  await contract.deployed();

  const networkObject = {
    "events": {},
    "links": {},
    "address": contract.address,
    "transactionHash": contract.deployTransaction.hash
  };

  const { chainId } = await provider.getNetwork();

  if (typeof RegistryArtifact.networks === "undefined") RegistryArtifact.networks = {};

  RegistryArtifact.networks[chainId] = networkObject;

  fs.writeFileSync(path.join(__dirname, "..", "build", "Registry.json"), JSON.stringify(RegistryArtifact, null, 2));
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
