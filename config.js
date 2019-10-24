const path = require("path");

module.exports = {
  "ethereumEndpoint": "ws://localhost:9545",

  "serviceId": "horoscope",
  "endpoint": "127.0.0.1:8099",
  "protoPath": path.resolve(
    path.join(__dirname, "protos", "horoscope.proto")
  )
};
