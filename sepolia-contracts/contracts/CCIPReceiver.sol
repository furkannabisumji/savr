// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import "./SavrPool.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

/// @title - A simple contract for receiving string data across chains.
contract Receiver is CCIPReceiver {
    SavrPool savrPool;
    /// @notice Constructor initializes the contract with the router address.
    constructor(address router, address savrPoolAddr) CCIPReceiver(router) {
        savrPool = SavrPool(savrPoolAddr);
    }

    /// handle a received message
    function _ccipReceive(
        Client.Any2EVMMessage memory any2EvmMessage
    ) internal override {
            (uint256 groupId, address to, uint256 amount) = abi.decode(any2EvmMessage.data, (uint256, address, uint256));
            savrPool.withdraw(groupId, to, amount);
    }
}
