// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract Savr is Ownable {
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
        address currentRecipient;
        uint createdAt;
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
        require(preStakePercentage <= 100, "Invalid pre-stake percentage");

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

        emit GroupCreated(groupIdCounter, block.timestamp);
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

    function contribute(uint256 groupId) external {
        Group storage group = groups[groupId];
        require(group.isActive[msg.sender], "Not a member");
        require(group.members.length == group.totalCycles, "Must be full");
        require(
            !group.hasContributed[msg.sender],
            "Already contributed for this cycle"
        );

        stablecoin.transferFrom(
            msg.sender,
            address(this),
            group.contributionAmount
        );
        group.hasContributed[msg.sender] = true;

        emit ContributionMade(groupId, msg.sender, block.timestamp);

        if (allMembersContributed(group)) {
            requestRandomRecipient(groupId);
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

        stablecoin.transfer(
            recipient,
            group.contributionAmount * group.members.length
        );
        group.currentRecipient = recipient;
        group.currentCycle++;

        for (uint256 i = 0; i < group.members.length; i++) {
            group.hasContributed[group.members[i]] = false;
        }

        emit FundsDistributed(groupId, recipient, block.timestamp);

        if (group.currentCycle == group.totalCycles) {
            terminateGroup(groupId);
        }
    }

    function terminateGroup(uint256 groupId) internal {
        Group storage group = groups[groupId];

        uint256 remainingPreStake = group.preStakeAmount * group.members.length;
        uint256 perMemberShare = remainingPreStake / group.members.length;

        for (uint256 i = 0; i < group.members.length; i++) {
            address member = group.members[i];
            if (group.isActive[member]) {
                stablecoin.transfer(member, perMemberShare);
            }
        }

        delete groups[groupId];

        emit GroupTerminated(groupId, block.timestamp);
    }

    function allMembersContributed(
        Group storage group
    ) internal view returns (bool) {
        bool hasContributed = true;
        for (uint256 i = 0; i < group.members.length; i++) {
            if (!group.hasContributed[group.members[i]]) {
                hasContributed = false;
            }
        }
        return hasContributed;
    }

    function getGroups(
        uint256 groupId
    ) external view returns (GroupInfo[] memory) {
        uint256 length = groupId == 0 ? groupIdCounter : 1;
        GroupInfo[] memory allGroups = new GroupInfo[](length);
        for (uint256 i = 1; i <= length; i++) {
            Group storage group = groups[i];
            allGroups[i - 1] = GroupInfo({
                id: group.id,
                name: group.name,
                image: group.image,
                contributionAmount: group.contributionAmount,
                totalCycles: group.totalCycles,
                currentCycle: group.currentCycle,
                preStakeAmount: group.preStakeAmount,
                admin: group.admin,
                members: group.members,
                currentRecipient: group.currentRecipient,
                createdAt: group.createdAt
            });
        }
        return allGroups;
    }

    function fulfillRandomWords(
        uint256 requestId,
        uint256[] calldata randomWords
    ) external onlyOwner {
        fulfillRandomness(requestId, randomWords[0]);
    }
}
