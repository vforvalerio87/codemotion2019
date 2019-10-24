# Decentralized gRPC Service Platform

## Introduction
This is a sample decentralized service platform powered by gRPC, Ethereum, IPFS and Lightning Network.  
  
Built for Codemotion Milan 2019:
[Protobuf all the things! End to end gRPC service architectures](https://events.codemotion.com/conferences/milan/2019/speaker/5488/)

## Platform overview
- Decentralized service registry on the Ethereum blockchain
- gRPC clients and services
- Decentralized storage for gRPC service definitions on IPFS 

## Instructions
- `npm install` to get dependencies
- `npm run network` to start a local Ethereum blockchain
- `npm run compile` to compile the Registry smart contract
- `npm run deploy` to deploy the compiled Registry smart contract to the local Ethereum blockchain
- `npm run startService` to start the demo service. The service registers itself to the Registry smart contract. The service is a full-fledged IPFS node; it uploads, advertises and serves its own service definition to IPFS
- `npm run callService` to call the demo service from a demo client. The client gets the service endpoint and the service definition IPFS hash from the Registry smart contract. The client is a full-fledged IPFS node; if requests the service definition it needs from IPFS
- `npm run listServices` lists all the services in the Registry contract

## Stay tuned for
- Clients pay for services using Lightning Network

## Slides and video
Coming after the talk
