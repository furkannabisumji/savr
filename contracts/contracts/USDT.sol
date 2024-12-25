// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract USDT is ERC20 {
    constructor() ERC20("Dummy USDT", "USDT") {
        uint256 initialSupply = 1_000_000_000 * 10 ** decimals();
        _mint(msg.sender, initialSupply);
    }
}
