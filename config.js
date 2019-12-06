const path = require("path");

module.exports = {
  "ethereumEndpoint": "https://terminal.co/networks/ganache_24e13b3187d754c8df1c6a0ae74b070/ceec68a33ff30475",

  "serviceIpfsConfig": {
    "repo": path.resolve(
      path.join(__dirname, ".ipfs", "service")
    ),
    "config": {
      "Addresses": {
        "API": "/ip4/127.0.0.1/tcp/5002",
        "Gateway": "/ip4/127.0.0.1/tcp/9090",
        "Swarm": [
          "/ip4/0.0.0.0/tcp/4002",
          "/ip4/127.0.0.1/tcp/4003/ws"
        ]
      }
    }
  },

  "clientIpfsConfig": {
    "repo": path.resolve(
      path.join(__dirname, ".ipfs", "client")
    ),
    "config": {
      "Addresses": {
        "API": "/ip4/127.0.0.1/tcp/5020",
        "Gateway": "/ip4/127.0.0.1/tcp/9099",
        "Swarm": [
          "/ip4/0.0.0.0/tcp/4020",
          "/ip4/127.0.0.1/tcp/4030/ws"
        ]
      }
    }
  },

  "serviceId": "horoscope",
  "endpoint": "127.0.0.1:8099",
  "protoPath": path.resolve(
    path.join(__dirname, "protos", "horoscope.proto")
  )
};
