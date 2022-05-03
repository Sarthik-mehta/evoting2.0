pragma solidity ^0.5.0;

contract VotingSystem {

    uint public CandidateCount = 0;
    bool public showVotes = true;

    struct Candidate {
        uint id;
        string name;
        uint votes;
    }

    //store accounts that have voted
    mapping(address=> bool) public voters;
    //store candidates
    mapping(uint=> Candidate) public candidates;

    event CandidateAdded(
        uint id,
        string name,
        uint votes
    );


    event votedEvent (
        uint indexed _candidateId
    );

    event showVoteChanged (
        bool val
    );

    constructor() public{
        addCandidate("NOTA");
    }

    function addCandidate(string memory _name) public {
        CandidateCount++;
        candidates[CandidateCount] = Candidate(CandidateCount, _name, 0);
        emit CandidateAdded(CandidateCount, _name, 0);
    }

    function vote(uint _candidateId) public {

        //require that the have not voted before
        require(!voters[msg.sender]);
        //require a valid candidate
        require(_candidateId>0 && _candidateId<=CandidateCount);
        //msg.sender contains the voters id
        //record that voter has voted
        voters[msg.sender]=true;
        candidates[_candidateId].votes++;
        emit votedEvent (_candidateId);
    }

    function changeShowVote (bool _val) public {
        showVotes = _val;
        emit showVoteChanged(_val);
    }
}