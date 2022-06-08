# evoting2.0
An e-voting system based on ethereum Blockchain, solidity, truffle, and Javascript.

## To Compile the contract
```
truffle migrate
```
###### If a Contract is edited
If a Contract is edited, we need to reset the blockchain and deploy our new contract as we cannot make a change in the Blockchain thus we need to reset it using this truffle command.
```
truffle migrate --reset
```
## To Open Truffle Console
```truffle console```

## Exiting Truffle development console
```.exit```


## Voters Side
Now anyone connected to the blockchain will be able to make a vote 
Voter will be modelled by address to any account given by the ganache in our ganache application.
Addresses can be accessed in truffle console by web3.js.

accounts[0] will give the address of 1st account in ganache

## Why Testing is Important ?
In Blockchain project Testing is very important since we know the blochain is immutable and any changes won't ne possible later.

- If contract have bugs we need to deploy its new copy and the new copy won't have the same state and the same address. Then we need to disable the old contract
- Deploying a contract costs gas which costs ether thus increasing overall cost of the application.
- If a function has any bugs then a user sending the transaction will be wasting ether since it will not function as desired.

Truffle comes bundled with **Mocha** testing framework and **Chai** assertion library.

Election.js file is running the test to check correct candidates count.

## Meta Mask 
It is a chrome browser that turns our browser into a blockchain browser that connects to ethereum network and provides web3provider.

## Gas
Whenever account calls a function it has pay its fees.
Ethereum uses gas to calculate how much gas the user has to pay.
Because the reads are free but the writes are chargable.
Gas - unit within itself
Ether = No. of Gas units used X Gas price.
