//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;
pragma experimental ABIEncoderV2;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";

// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
// import "@openzeppelin/contracts/access/Ownable.sol";

contract VotingContract {

    struct Voter {
        bool voted;
        uint vote;
        uint weight;
        bool flag;
    }

    struct Proposal {
        string name;
        uint voteCount;
        bool flag;
    }

    struct Voting {
        address chairperson;
        string name;
        mapping(address => Voter) voters;
        uint votersCount;
        mapping(uint => Proposal) proposals;
        uint proposalsCount;
        bool isComplete;
        bool flag;
    }

    address public owner;
    mapping(uint => Voting) public elections;
    uint public electionCounter = 0;
    uint public proposalCounter = 0;

    constructor(address _owner) {
        owner = _owner;
    }

    event VotingAdded(uint id, string electionName);

    event ProposalAdded(uint id, uint electionId, string proposalName);

    function addVoting(string memory _electionName) public payable {
        Voting storage voting = elections[electionCounter];

        voting.chairperson = owner;
        voting.name = _electionName;
        voting.isComplete = false;
        voting.flag = true;
        
        emit VotingAdded(electionCounter, _electionName);

        electionCounter++;
    }

    function getVotingOwner(uint _electionId) public view returns(address){
        require(elections[_electionId].flag, "The election does not exist");

        return (elections[_electionId].chairperson);
    }

    function getElection(uint _electionId) external view returns(string memory, string[] memory, uint[] memory) {
        string[] memory resProposals = new string[](elections[_electionId].proposalsCount);
        uint[] memory resVoteCount = new uint[](elections[_electionId].proposalsCount);

        for (uint i = 0; i < elections[_electionId].proposalsCount; i++) {
            resProposals[i] = elections[_electionId] .proposals[i].name;
            resVoteCount[i] = elections[_electionId].proposals[i].voteCount;
        }
        return (elections[_electionId].name, resProposals, resVoteCount);
    }

    function getElections() external view returns(string[] memory, bool[] memory, bool[] memory, string[] memory) {
        string[] memory names = new string[](electionCounter);
        bool[] memory flags = new bool[](electionCounter);
        bool[] memory isCompletes = new bool[](electionCounter);
        string[] memory winners = new string[](electionCounter);

        for (uint i = 0; i < electionCounter; i++) {
            names[i] = elections[i].name;
            flags[i] = elections[i].flag;
            isCompletes[i] = elections[i].isComplete;

            uint count = 0;
            for(uint j = 0; j <= elections[i].proposalsCount; j++) {
                if(count <= elections[i].proposals[j].voteCount) {
                    count = elections[i].proposals[j].voteCount;
                    winners[i] = elections[i].proposals[j].name;
                }
            }
        }
        return (names, flags, isCompletes, winners);
    }

    function deleteElection(uint _electionId) public {
        require(elections[_electionId].flag, "The election does not exist");
        elections[_electionId].flag = false;
    }

    function completeElection(uint _electionId) public {
        require(!elections[_electionId].isComplete, "The election is over");
        require(elections[_electionId].flag, "The election does not exist");
        elections[_electionId].isComplete = true;
    }

    function addProposal(uint _electionId, string memory _proposalName) public {
        require(!elections[_electionId].isComplete, "The election is over");
        require(elections[_electionId].flag, "The election does not exist");
        require(elections[_electionId].chairperson == owner, "Not the Chairperson");

        Proposal storage proposal = elections[_electionId].proposals[elections[_electionId].proposalsCount];
        proposal.name = _proposalName;
        proposal.voteCount = 0;
        proposal.flag = true;

        elections[_electionId].proposalsCount++;
        
        proposalCounter++;
        emit ProposalAdded(proposalCounter, _electionId, _proposalName);
    }

    function getProposal(uint _electionId, uint _indexProposal) public view returns(Proposal memory) {
        require(elections[_electionId].flag, "The election does not exist");
        require(elections[_electionId].proposals[_indexProposal].flag, "The proposal does not exist");

        return (elections[_electionId].proposals[_indexProposal]);
    }

    function getProposals(uint _electionId) external view returns(string[] memory) {
        string[] memory names = new string[](electionCounter);

        for (uint i = 0; i < elections[_electionId].proposalsCount; i++) {
            names[i] = elections[_electionId].proposals[i].name;
        }
        return names;
    }

    function addVoter(uint _electionId, address _voterId) public {
        require(!elections[_electionId].isComplete, "The election is over");
        require(!elections[_electionId].voters[_voterId].voted, "Already registered");
        require(elections[_electionId].chairperson == owner, "Not the Chairperson");

        elections[_electionId].voters[_voterId].weight = 1;
    }

    function vote(uint _electionId, uint _indexProposal) public {
        require(!elections[_electionId].isComplete, "The election is over");
        require(!elections[_electionId].voters[msg.sender].voted, "Already voted");
        require(elections[_electionId].voters[msg.sender].weight > 0, "No right to vote");

        elections[_electionId].voters[msg.sender].voted = true;
        elections[_electionId].voters[msg.sender].vote = _indexProposal;

        elections[_electionId].proposals[_indexProposal].voteCount += 1;
    }
}
