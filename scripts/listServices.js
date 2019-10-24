const { abi, networks } = require("./../build/contracts/Registry.json");

module.exports = async (done) => {

  const networkId = await web3.eth.net.getId();

  const account = (await web3.eth.getAccounts())[0];

  const registry = new web3.eth.Contract(
    abi,
    networks[networkId].address
  );

  registry.methods.listServices().call().then(services => {
    console.log("SERVICES:", services.map(service => web3.utils.hexToUtf8(service)));
    
    return Promise.all(
      services.map(service =>
        registry.methods.serviceRegistrations(service).call()
      )
    )
  }).then(serviceRegistrations => {
    console.log("SERVICE REGISTRATIONS:", serviceRegistrations);

    done();
  });
 
}
