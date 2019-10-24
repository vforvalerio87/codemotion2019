const Registry = artifacts.require("Registry");

module.exports = async function(deployer) {
  deployer.deploy(Registry);
};
