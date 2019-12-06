pragma solidity 0.5.1;

contract Registry {
    struct ServiceRegistration {
        string      serviceDefinitionURI;
        string      endpoint;
        bool        exists;
    }

    mapping (bytes32 => ServiceRegistration) public serviceRegistrations;
    bytes32[] public serviceIds;

    event ServiceRegistered(bytes32 serviceId, string serviceDefinitionURI, string endpoint);
    event ServiceRegistered2(bytes32 indexed serviceId, string serviceDefinitionURI, string endpoint);

    function registerService(bytes32 serviceId, string memory serviceDefinitionURI, string memory endpoint) public {
        require(serviceRegistrations[serviceId].exists == false, "A service already exists with that id");

        serviceRegistrations[serviceId] = ServiceRegistration(serviceDefinitionURI, endpoint, true);
        serviceIds.push(serviceId);

        emit ServiceRegistered(serviceId, serviceDefinitionURI, endpoint);
        emit ServiceRegistered2(serviceId, serviceDefinitionURI, endpoint);
    }

    function listServices() public view returns(bytes32[] memory) {
        return serviceIds;
    }
}
