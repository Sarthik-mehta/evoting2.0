const VotingSystem = artifacts.require('./VotingSystem.sol');

contract('VotingSystem', (accounts) => {
    var VotingInstance;
    it("initializes with two candidates", function(){ //test name
		return VotingSystem.deployed().then(function(instance){ //getting instance from contract
			return instance.CandidateCount();
		}).then(function(count){ //promise
			assert.equal(count, 1); //checking value
		});
	});
	it("it initializes the candidates with the correct values", function(){
		return VotingSystem.deployed().then(function(instance){
			VotingInstance = instance;
			return VotingInstance.candidates(1);
		}).then(function(candidate){
			assert.equal(candidate[0], 1, "contains the correct ID");
			assert.equal(candidate[1], "NOTA", "contains the correct name");
			assert.equal(candidate[2], 0, "contains the correct votes count");
		});
	});
	it("allows a voter to cast a vote", function(){
		return VotingSystem.deployed().then(function(instance){
			VotingInstance = instance;
			candidateId = 1;
			return VotingInstance.vote(candidateId, { from: accounts[0] });
		}).then(function(receipt){
			assert.equal(receipt.logs.length, 1, "an event was triggered");
      		assert.equal(receipt.logs[0].event, "votedEvent", "the event type is correct");
     		//assert.equal(receipt.logs[0].args._candidateId.toNumber(), candidateId, "the candidate id is correct");
      		return VotingInstance.voters(accounts[0]);
		}).then(function(voted) {
			assert(voted, "the voter was marked as voted");
			return VotingInstance.candidates(candidateId);
		}).then(function(candidate){
			var voteCount = candidate[2];
			assert.equal(voteCount, 1, "increments the candidate's vote count");
		});
		
	});

	it("Throws an exception for invalid candidates", function() {
		return VotingSystem.deployed().then(function(instance) {
			VotingInstance = instance;
			return VotingInstance.vote(99, {from: accounts[1] })
		}).then(assert.fail).catch(function(error) {
			assert(error.message.indexOf('revert') >=0, "error message must contain revert");
			return VotingInstance.candidates(1)
		}).then(function(candidate1) {
			var voteCount = candidate1[2];
			assert.equal(voteCount, 1, "candidate 1 did not receive any votes");
			return VotingInstance.candidates(2);
		}).then(function(candidate2) {
			var voteCount = candidate2[2];
			assert.equal(voteCount, 0, "candidate 2 did not receive any votes");
		});
	});
	it("throws an exception for double voting", function() {
	    return VotingSystem.deployed().then(function(instance) {
		    VotingInstance = instance;
		    candidateId = 1;
		    VotingInstance.vote(candidateId, { from: accounts[1] });
		    return VotingInstance.candidates(candidateId);
	    }).then(function(candidate) {
		    var voteCount = candidate[2];
		    assert.equal(voteCount, 1, "accepts first vote");
		    // Try to vote again
	      	return VotingInstance.vote(candidateId, { from: accounts[1] });
	    }).then(assert.fail).catch(function(error) {
	      	assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
	      	return VotingInstance.candidates(1);
	    }).then(function(candidate1) {
	      	var voteCount = candidate1[2];
	      	assert.equal(voteCount, 2, "candidate 1 did not receive any votes");
	      	return VotingInstance.candidates(2);
	    }).then(function(candidate2) {
	      	var voteCount = candidate2[2];
	      	assert.equal(voteCount, 0, "candidate 2 did not receive any votes");
		});
	});
})