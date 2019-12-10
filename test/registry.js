const { provider } = require("@nomiclabs/buidler").ethers;
const ethers = require("ethers");

const { deployContract, getWallets, solidity } = require("ethereum-waffle");

const { use, expect } = require("chai");

const Registry = require("./../build/Registry.json");

use(solidity);

const bytes32 = ethers.utils.formatBytes32String;

describe("Registry", () => {

  let [ wallet ] = getWallets(provider);

  let registry;

  beforeEach(async () => {
    registry = await deployContract(wallet, Registry);
  });

  it("should let register services", async () => {
    await registry.registerService(bytes32("testServiceId"), "testServiceDefinitionURI", "testEndpoint");
  });

});
