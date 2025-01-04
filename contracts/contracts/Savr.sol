// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "./CCIPSender.sol";

contract Savr is Ownable {
    struct Cycle {
        uint256 createdAt;
        uint256 deadline;
        uint256 contributedAmount;
        address[] members;
    }

    struct Group {
        uint256 id;
        string name;
        string image;
        uint256 contributionAmount;
        uint256 totalContributedAmount;
        uint256 totalCycles;
        uint256 currentCycle;
        address admin;
        address[] members;
        mapping(address => bool) hasContributed;
        mapping(address => bool) isActive;
        mapping(address => bool) hasReceivedFunds;
        address currentRecipient;
        uint256 createdAt;
        Cycle[] cycles;
    }

    struct GroupInfo {
        uint256 id;
        string name;
        string image;
        uint256 contributionAmount;
        uint256 totalCycles;
        uint256 totalContributedAmount;
        uint256 currentCycle;
        address admin;
        address[] members;
        address currentRecipient;
        uint256 createdAt;
        Cycle[] cycles;
    }

    enum InviteStatus {
        NOT_INVITED,
        INVITED,
        REQUESTED
    }
    Sender sender;
    uint256 public totalVolume;
    uint256 public uniqueUsers;
    mapping(address => bool) isUser;

    uint256 public groupIdCounter;
    mapping(uint256 => Group) groups;
    struct Request {
        uint256 groupId;
        bool isGroupExpired;
    }
    uint256 requestIdCounter;
    mapping(uint256 => Request) requestIdToGroupId;
    address receiver;
    mapping(uint256 => mapping(address => InviteStatus)) public invites;
    mapping(uint256 => address[]) invitesAddresses;
    event RandomWordsRequested(uint256 requestId, uint256 timestamp);
    event GroupCreated(uint256 groupId, uint256 timestamp);
    event MemberRequested(uint256 groupId, address member, uint256 timestamp);
    event MemberInvited(uint256 groupId, address member, uint256 timestamp);
    event MemberJoined(uint256 groupId, address member, uint256 timestamp);
    event ContributionMade(uint256 groupId, address member, uint256 timestamp);
    event FundsDistributed(
        uint256 groupId,
        address recipient,
        uint256 timestamp
    );
    event GroupTerminated(uint256 groupId, uint256 timestamp);

    constructor() {}

    function setSender(address payable _sender) public onlyOwner {
        sender = Sender(_sender);
    }

    function createGroup(
        string calldata name,
        string calldata image,
        uint256 contributionAmount,
        uint256 totalCycles
    ) external {
        require(totalCycles > 1, "Minimum totalCycles is 2");
        uint256 cycleDuration = 7 days;

        groupIdCounter++;
        Group storage group = groups[groupIdCounter];
        group.id = groupIdCounter;
        group.name = name;
        group.image = image;
        group.admin = msg.sender;
        group.contributionAmount = contributionAmount;
        group.totalCycles = totalCycles;
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

        if (!isUser[msg.sender]) {
            uniqueUsers++;
            isUser[msg.sender] = true;
        }

        emit GroupCreated(groupIdCounter, block.timestamp);
    }

    function contribute(
        uint256 groupId,
        address member,
        uint256 amount
    ) external {
        require(receiver == msg.sender, "Unauthorised");
        Group storage group = groups[groupId];
        require(group.isActive[member], "Not a member");
        require(group.members.length == group.totalCycles, "Must be full");
        require(
            !group.hasContributed[member],
            "Already contributed for this cycle"
        );
        require(amount >= group.contributionAmount, "Invalid amount");

        uint256 currentCycleIndex = group.currentCycle;
        group.totalContributedAmount += amount;
        Cycle storage currentCycle = group.cycles[currentCycleIndex];

        require(block.timestamp <= currentCycle.deadline, "Cycle expired");

        group.cycles[currentCycleIndex].members.push(member);
        group.hasContributed[member] = true;

        currentCycle.contributedAmount += group.contributionAmount;
        totalVolume = totalVolume + group.contributionAmount;
        emit ContributionMade(groupId, member, block.timestamp);

        if (allMembersContributed(group)) {
            requestRandomRecipient(groupId, false);
        }
    }

    function allMembersContributed(Group storage group)
        internal
        view
        returns (bool)
    {
        for (uint256 i = 0; i < group.members.length; i++) {
            if (!group.hasContributed[group.members[i]]) {
                return false;
            }
        }
        return true;
    }

    function getGroups(uint256 groupId, address admin)
        external
        view
        returns (GroupInfo[] memory)
    {
        GroupInfo[] memory allGroups = new GroupInfo[](
            groupId != 0 ? groupIdCounter : 1
        );
        uint256 length = groupId != 0 ? groupIdCounter : 1;
        for (uint256 i = 1; i <= length; i++) {
            Group storage group = groups[groupId != 0 ? i : groupId];
            if (admin == address(0) || (admin == group.admin)) {
                address[] memory membersCopy = new address[](
                    group.members.length
                );
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
                    totalContributedAmount: group.totalContributedAmount,
                    totalCycles: group.totalCycles,
                    currentCycle: group.currentCycle,
                    admin: group.admin,
                    members: membersCopy,
                    currentRecipient: group.currentRecipient,
                    createdAt: group.createdAt,
                    cycles: cyclesCopy
                });
            }
        }

        return allGroups;
    }

    function getInvitesAddresses(uint256 groupId)
        public
        view
        returns (address[] memory)
    {
        return invitesAddresses[groupId];
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
        invitesAddresses[groupId].push(member);
    }

    function requestRandomRecipient(uint256 groupId, bool isExpired) internal {
        requestIdCounter++;
        requestIdToGroupId[requestIdCounter].groupId = groupId;
        requestIdToGroupId[requestIdCounter].isGroupExpired = isExpired;
        emit RandomWordsRequested(requestIdCounter, block.timestamp);
    }

    function fulfillRandomness(uint256 requestId, uint256 randomness) internal {
        Request storage request = requestIdToGroupId[requestId];
        uint256 groupId = request.groupId;
        Group storage group = groups[groupId];

        uint256 randomIndex = randomness % group.members.length;
        address recipient = group.members[randomIndex];

        uint256 retryCount = 0;
        uint256 maxRetries = 50;
        if (request.isGroupExpired) {
            while (
                group.hasReceivedFunds[recipient] && retryCount < maxRetries
            ) {
                randomIndex = (randomIndex + 1) % group.members.length;
                recipient = group.members[randomIndex];
                retryCount++;
            }
            sender.sendMessage(
                abi.encode(
                    0,
                    recipient,
                    group.contributionAmount * group.members.length
                ),
                16015286601757825753
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
        } else {
            while (retryCount < maxRetries) {
                randomIndex = (randomIndex + 1) % group.members.length;
                recipient = group.members[randomIndex];
                retryCount++;
            }
            sender.sendMessage(abi.encode(groupId, recipient, 0), 16015286601757825753);
        }
        emit FundsDistributed(groupId, recipient, block.timestamp);
    }

    function isGroupExpired(uint256 groupId) public view returns (bool) {
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
                sender.sendMessage(
                    abi.encode(member, group.contributionAmount),
                    16015286601757825753
                );
            }
        }
        if (group.totalContributedAmount > 0) {
            requestRandomRecipient(groupId, true);
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
