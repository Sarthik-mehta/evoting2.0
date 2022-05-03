App = {
    loading:false,
    Contracts: {},
    account:"default",
  
    load: async () => {
      await App.loadWeb3();
      await App.loadAccount();
      await App.loadContract();
      await App.render();
    },
  
    loadWeb3: async ()=> {
      if (window.ethereum) {
        App.web3Provider = window.ethereum;
        try {
          // Request account access
          await window.ethereum.enable();
        } catch (error) {
          // User denied account access...
          console.error("User denied account access")
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        App.web3Provider = window.web3.currentProvider;
      }
      // If no injected web3 instance is detected, fall back to Ganache
      else {
        App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      }
      window.web3 = new Web3(App.web3Provider);
  
      
    },
  
    loadAccount: async ()=> {
      web3.eth.getCoinbase(function(err, account) {
        if (err === null) {
          App.account = account;
          
          console.log("no error account",account);
        }
        else{
          console.log("error ",err);
        }
      });
      
    },
  
    loadContract: async ()=> {
      // Create a JS version of smart contract
     const votingSystem = await $.getJSON('VotingSystem.json');
  
        App.Contracts.VotingSystem = TruffleContract(votingSystem);
        App.Contracts.VotingSystem.setProvider(App.web3Provider);
  
          //Hydrate the smart contract with values from blockchain
          App.votingSystem = await App.Contracts.VotingSystem.deployed();
    },
  
    render: async ()=> {
      //Prevent Double Rendering
      if(App.loading){
        return
      }
  
      App.setLoading(true);
  
      //render account
      $('#account').html(App.account);
  
      //render Candidates
      await App.renderCandidates();

      const val = await App.votingSystem.showVotes();

      if(!val){
        document.getElementById("hvotes").checked= true;

      }
  
      App.setLoading(false);
    },
  
    renderCandidates: async () => {
      // Load the total task count from the blockchain
      const candidateCount = await App.votingSystem.CandidateCount()
      const $candidateTemplate = $('.candidateTemplate')
  
      // Render out each task with a new task template
      for (var i = 1; i <= candidateCount; i++) {
        // Fetch the task data from the blockchain
        const candidate = await App.votingSystem.candidates(i)
        const candidateId =  candidate[0].toNumber()
        const  candidateName =  candidate[1]
        const  candidateVotes =  candidate[2].toNumber()
        
  
        // Create the html for the task
        const $newCandidateTemplate = $candidateTemplate.clone()
        $newCandidateTemplate.find('.candidateId').html(candidateId)
        $newCandidateTemplate.find('.candidateName').html(candidateName)
        $newCandidateTemplate.find('.candidateVotes').html(candidateVotes)
  
        // Put the task in the correct list
        $newCandidateTemplate.show()
        $('#candidateList').append($newCandidateTemplate)
  
        // Show the task
        $newCandidateTemplate.show()
      }
    },
  
  
   AddMyCandidate: async () => {
      App.setLoading(true)
      const content = $('#newCandidate').val()
      await App.votingSystem.addCandidate(content, { from:  App.account})
      window.location.reload()
    },

    
  
    setLoading: (boolean) => {
      App.loading = boolean
      const loader = $('#loader')
      const content = $('#content')
      if (boolean) {
        loader.show()
        content.hide()
      } else {
        loader.hide()
        content.show()
      }
    },

    HideVotes: async ()=>{
        App.setLoading(true)
        console.log("function called!")
        const val = await App.votingSystem.showVotes();
        await App.votingSystem.changeShowVote(!val, { from:  App.account})
        window.location.reload()
    }
  
  }
  
  $(() => {
    $(window).load(() => {
      App.load()
    })
  })