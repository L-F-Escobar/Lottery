const assert = require('assert');
const ganache = require ('ganache-cli');
const Web3 = require('web3');/// @dev Constructor function always have capital letters.

const provider = ganache.provider();
const web3 = new Web3(provider);
// const web3 = new Web3(ganache.provider());

const { interface, bytecode } = require('../compile');

let accounts;
let inbox;
const INITIAL_STRING = "Hello World!";
const NEW_STRING = "Changed message."

/// @dev Async await combo instead of promises.
beforeEach(async () => {
    // // Get a list of all accounts - promises
    // web3.eth.getAccounts()
    //     .then(fetchedAccounts => {
    //         console.log(fetchedAccounts);
    //     });

    console.log('Web3 -v:', web3.version);

    /// @dev accounts will contain a list of all our eth accounts.
    accounts = await web3.eth.getAccounts();

    /// @dev Accessing the Contract property - contructor which allows us to either intrerface with existing contracts or create/deploy new contracts.
    /// @variable inbox - a javascript object repersentation of the contract we can interact with. Represents what exists on the actual eth blockchain.
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        /// @dev Pass in bytecode & inital contract argument(s).
        .deploy({ data: bytecode, arguments: [INITIAL_STRING] })
        .send({ from: accounts[0], gas: '1000000' })
    inbox.setProvider(provider);

});

describe('Contract Inbox', () => {

    /// @dev Ensure the contract is deployed.
    it('delpoys a contract', () => {
        assert.ok(inbox.options.address);
    });

    // /// @dev Print the js contract object.
    // it('Js object contract', () => {
    //     // console.log(inbox);
    //     console.log('_');
    // });

    /// @dev Ensure the initial message is properly set.
    it('has a default message', async () => {
        /// @dev inbox - instance of a contract that exists on the blockchain.
        /// @dev contract has a property called methods. 'console.log(inbox);'
        /// @notice Methods is an object that contains all of the different public functions that exists in our contract.
        /// @dev We are referencing the message property here.
        const message = await inbox.methods.message().call();
        /// @dev We are referencing the setMessage property here.
        // const message = await inbox.methods.setMessage().call();
        assert.equal(message, INITIAL_STRING);
      });

      /// @dev Print the js contract object.
    it('can change the message', async () => {
        await inbox.methods.setMessage(NEW_STRING).send({ from: accounts[0] });

        const message = await inbox.methods.message().call();
        
        assert.equal(message, NEW_STRING);
    });
});






// class Car {
//     park() {
//         return 'stopped';
//     }

//     drive() {
//         return 'vroom';
//     }
// }


// let car;

// beforeEach(() => {
//     car = new Car();
// });

// describe('Car', () => {
//     it('can park', () => {
//         assert.equal(car.park(), 'stopped');
//     });

//     it('can drive', () => {
//         assert.equal(car.drive(), "vroom");
//     });
// });