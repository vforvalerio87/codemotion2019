pragma solidity 0.5.1;

contract Registry {
    struct ServiceRegistration {
        string      serviceDefinitionURI;
        string      endpoint;
        bool        exists;
    }

    mapping (bytes32 => ServiceRegistration) public serviceRegistrations;
    bytes32[] public serviceIds;

    function registerService(bytes32 serviceId, string memory serviceDefinitionURI, string memory endpoint) public {
        require(serviceRegistrations[serviceId].exists == false, "A service already exists with that id");

        serviceRegistrations[serviceId] = ServiceRegistration(serviceDefinitionURI, endpoint, true);
        serviceIds.push(serviceId);
    }

    function listServices() public view returns(bytes32[] memory) {
        return serviceIds;
    }
}
