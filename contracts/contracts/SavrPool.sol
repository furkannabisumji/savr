// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IPool} from "@aave/core-v3/contracts/interfaces/IPool.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./CCIPSender.sol";

contract SavrPool is Ownable {
    IPool internal constant POOL =
        IPool(0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951);
    Sender sender;
    address receiver;
    address internal constant token =
        0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0;
    mapping(uint256 => uint256) groupBalance;
    uint256 totalAUSDTBalance;

     function setSender(address _sender) public onlyOwner {
        sender = Sender(_sender);
    }

    function supply(uint256 groupId, uint256 amount) public {
        POOL.supply(token, amount, address(this), 0);
        sender.sendMessage(abi.encode(groupId, msg.sender, amount), 6827576821754315911);
        groupBalance[groupId] += amount;
        totalAUSDTBalance += amount;
    }

    function withdraw(
        uint256 groupId,
        address to,
        uint256 amount
    ) public {
        require(receiver == msg.sender, "Unauthorised");
        if (groupId > 0) {
            uint256 groupProportion = (groupBalance[groupId] * 1e18) /
                totalAUSDTBalance;
            uint256 currentTotalBalance = IERC20(
                address(0xAF0F6e8b0Dc5c913bbF4d14c22B4E78Dd14310B6)
            ).balanceOf(address(this));
            uint256 totalInterestEarned = currentTotalBalance -
                totalAUSDTBalance;
            amount = (totalInterestEarned * groupProportion) / 1e18;
        }
        POOL.withdraw(token, amount, to);
        groupBalance[groupId] -= amount;
        totalAUSDTBalance -= amount;
    }
}
