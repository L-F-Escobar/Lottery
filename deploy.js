const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

const provider = new HDWalletProvider(
    'high rigid play dance wait excite super youth stamp pond veteran essence', 
    'https://rinkeby.infura.io/2skNCF6MQTUrJPjRhBey'
);
const web3 = new Web3(provider);

/// @dev Cannot call await outside a function!
const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from contract', accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode, arguments: ['Wello Horld'] })
        .send({ gas: '1000000', from: accounts[0] })

    console.log('Contract deployed to', result.options.address);
};
deploy();