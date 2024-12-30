// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract Savr is Ownable {
    struct Cycle {
        uint256 createdAt;
        uint256 deadline;
        uint256 contributedAmount;
        address[] members;
    }

    struct Group {
        uint id;
        string name;
        string image;
        uint256 contributionAmount;
        uint256 totalCycles;
        uint256 currentCycle;
        uint256 preStakeAmount;
        address admin;
        address[] members;
        mapping(address => bool) hasContributed;
        mapping(address => bool) isActive;
        mapping(address => bool) hasReceivedFunds;
        address currentRecipient;
        uint createdAt;
        Cycle[] cycles;
    }

    struct GroupInfo {
        uint id;
        string name;
        string image;
        uint256 contributionAmount;
        uint256 totalCycles;
        uint256 currentCycle;
        uint256 preStakeAmount;
        address admin;
        address[] members;
        address currentRecipient;
        uint createdAt;
        Cycle[] cycles;
    }

    IERC20 public stablecoin =
        IERC20(address(0x1CB10928cFFBda565db55cC19905eB4c01268497));
    enum InviteStatus {
        NOT_INVITED,
        INVITED,
        REQUESTED
    }

    uint256 public groupIdCounter;
    mapping(uint256 => Group) public groups;

    uint256 requestIdCounter;
    mapping(uint256 => uint256) public requestIdToGroupId;
    mapping(uint256 => mapping(address => InviteStatus)) public invites;

    event RandomWordsRequested(uint256 requestId, uint timestamp);
    event GroupCreated(uint256 groupId, uint timestamp);
    event MemberRequested(uint256 groupId, address member, uint timestamp);
    event MemberInvited(uint256 groupId, address member, uint timestamp);
    event MemberJoined(uint256 groupId, address member, uint timestamp);
    event ContributionMade(uint256 groupId, address member, uint timestamp);
    event FundsDistributed(uint256 groupId, address recipient, uint timestamp);
    event GroupTerminated(uint256 groupId, uint timestamp);

    constructor() {}

    function createGroup(
        string calldata name,
        string calldata image,
        uint256 contributionAmount,
        uint256 totalCycles,
        uint256 preStakePercentage
    ) external {
        require(totalCycles > 1, "Minimum totalCycles is 2");
        require(preStakePercentage <= 100, "Invalid pre-stake percentage");
        uint256 cycleDuration = 7 days;
        uint256 preStakeAmount = (contributionAmount *
            totalCycles *
            preStakePercentage) / 100;

        groupIdCounter++;
        Group storage group = groups[groupIdCounter];
        group.id = groupIdCounter;
        group.name = name;
        group.image = image;
        group.admin = msg.sender;
        group.contributionAmount = contributionAmount;
        group.totalCycles = totalCycles;
        group.preStakeAmount = preStakeAmount;
        group.createdAt = block.timestamp;
        address[] memory members;

        for (uint256 i = 0; i < totalCycles; i++) {
            group.cycles.push(
                Cycle({
                    createdAt: block.timestamp + (i * cycleDuration),
                    deadline: block.timestamp + ((i + 1) * cycleDuration),
                    contributedAmount: 0,
                    members: members
                })
            );
        }

        emit GroupCreated(groupIdCounter, block.timestamp);
    }

    function contribute(uint256 groupId) external {
        Group storage group = groups[groupId];
        require(group.isActive[msg.sender], "Not a member");
        require(group.members.length == group.totalCycles, "Must be full");
        require(
            !group.hasContributed[msg.sender],
            "Already contributed for this cycle"
        );

        uint256 currentCycleIndex = group.currentCycle;
        Cycle storage currentCycle = group.cycles[currentCycleIndex];

        require(block.timestamp <= currentCycle.deadline, "Cycle expired");

        stablecoin.transferFrom(
            msg.sender,
            address(this),
            group.contributionAmount
        );
        group.cycles[currentCycleIndex].members.push(msg.sender);
        group.hasContributed[msg.sender] = true;

        currentCycle.contributedAmount += group.contributionAmount;

        emit ContributionMade(groupId, msg.sender, block.timestamp);

        if (allMembersContributed(group)) {
            requestRandomRecipient(groupId);
        }
    }

    function allMembersContributed(
        Group storage group
    ) internal view returns (bool) {
        for (uint256 i = 0; i < group.members.length; i++) {
            if (!group.hasContributed[group.members[i]]) {
                return false;
            }
        }
        return true;
    }

    function getGroups() external view returns (GroupInfo[] memory) {
        GroupInfo[] memory allGroups = new GroupInfo[](groupIdCounter);

        for (uint256 i = 1; i <= groupIdCounter; i++) {
            Group storage group = groups[i];

            address[] memory membersCopy = new address[](group.members.length);
            for (uint256 j = 0; j < group.members.length; j++) {
                membersCopy[j] = group.members[j];
            }

            Cycle[] memory cyclesCopy = new Cycle[](group.cycles.length);
            for (uint256 k = 0; k < group.cycles.length; k++) {
                cyclesCopy[k] = group.cycles[k];
            }

            allGroups[i - 1] = GroupInfo({
                id: group.id,
                name: group.name,
                image: group.image,
                contributionAmount: group.contributionAmount,
                totalCycles: group.totalCycles,
                currentCycle: group.currentCycle,
                preStakeAmount: group.preStakeAmount,
                admin: group.admin,
                members: membersCopy,
                currentRecipient: group.currentRecipient,
                createdAt: group.createdAt,
                cycles: cyclesCopy
            });
        }

        return allGroups;
    }

    function joinGroup(uint256 groupId) external {
        require(
            invites[groupId][msg.sender] == InviteStatus.INVITED ||
                groups[groupId].admin == msg.sender,
            "Not invited"
        );
        Group storage group = groups[groupId];
        require(group.members.length < group.totalCycles, "Group is full");
        require(!group.isActive[msg.sender], "Already joined");

        stablecoin.transferFrom(
            msg.sender,
            address(this),
            group.preStakeAmount
        );

        group.members.push(msg.sender);
        group.isActive[msg.sender] = true;

        emit MemberJoined(groupId, msg.sender, block.timestamp);
    }

    function inviteGroup(uint256 groupId, address member) external {
        Group storage group = groups[groupId];
        require(group.members.length < group.totalCycles, "Group is full");
        require(
            invites[groupId][member] == InviteStatus.NOT_INVITED &&
                group.admin != member,
            "Already invited or requested"
        );
        if (group.admin == msg.sender) {
            invites[groupId][member] = InviteStatus.INVITED;
            emit MemberInvited(groupId, member, block.timestamp);
        } else {
            invites[groupId][member] = InviteStatus.REQUESTED;
            emit MemberRequested(groupId, member, block.timestamp);
        }
    }

    function requestRandomRecipient(uint256 groupId) internal {
        requestIdCounter++;
        requestIdToGroupId[requestIdCounter] = groupId;
        emit RandomWordsRequested(requestIdCounter, block.timestamp);
    }

    function fulfillRandomness(uint256 requestId, uint256 randomness) internal {
        uint256 groupId = requestIdToGroupId[requestId];
        Group storage group = groups[groupId];

        uint256 randomIndex = randomness % group.members.length;
        address recipient = group.members[randomIndex];

        uint256 retryCount = 0;
        uint256 maxRetries = 50;

        while (group.hasReceivedFunds[recipient] && retryCount < maxRetries) {
            randomIndex = (randomIndex + 1) % group.members.length;
            recipient = group.members[randomIndex];
            retryCount++;
        }
        stablecoin.transfer(
            recipient,
            group.contributionAmount * group.members.length
        );
        group.currentRecipient = recipient;
        group.hasReceivedFunds[recipient] = true;
        group.currentCycle++;
        if (isGroupExpired(groupId)) {
            terminateGroup(groupId);
        } else {
            for (uint256 i = 0; i < group.members.length; i++) {
                group.hasContributed[group.members[i]] = false;
            }
        }

        emit FundsDistributed(groupId, recipient, block.timestamp);
    }

    function isGroupExpired(uint groupId) public view returns (bool) {
        Group storage group = groups[groupId];

        if (group.currentCycle >= group.totalCycles) {
            return true;
        }

        Cycle storage currentCycle = group.cycles[group.currentCycle];

        if (
            block.timestamp > currentCycle.deadline &&
            !allMembersContributed(group)
        ) {
            return true;
        }

        return false;
    }

    function terminateGroup(uint256 groupId) public {
        Group storage group = groups[groupId];
        require(isGroupExpired(groupId), "Group is active");

        uint256 remainingPreStake = group.preStakeAmount * group.members.length;
        uint256 perMemberShare = remainingPreStake / group.members.length;

        for (uint256 i = 0; i < group.members.length; i++) {
            address member = group.members[i];
            if (group.isActive[member]) {
                stablecoin.transfer(member, perMemberShare);
            }
        }
        if (
            !allMembersContributed(group) &&
            block.timestamp > group.cycles[group.currentCycle].deadline
        ) {
            for (
                uint256 i = 0;
                i < group.cycles[group.currentCycle].members.length;
                i++
            ) {
                address member = group.cycles[group.currentCycle].members[i];
                stablecoin.transfer(member, group.contributionAmount);
            }
        }
        delete groups[groupId];

        emit GroupTerminated(groupId, block.timestamp);
    }

    function fulfillRandomWords(
        uint256 requestId,
        uint256[] calldata randomWords
    ) external onlyOwner {
        fulfillRandomness(requestId, randomWords[0]);
    }
}
