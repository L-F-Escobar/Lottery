const assert = require('assert');
const ganache = require ('ganache-cli');
const Web3 = require('web3');/// @dev Constructor function always have capital letters.

const provider = ganache.provider();
const web3 = new Web3(provider);

const { interface, bytecode } = require('../compile');

let accounts;
let lottery;

console.log('Web3 version:', web3.version);

/// @dev Async await combo instead of promises.
beforeEach(async () => {
    /// @dev accounts will contain a list of all our eth accounts.
    accounts = await web3.eth.getAccounts();

    /// @dev Accessing the Contract property - contructor which allows us to either intrerface with existing contracts or create/deploy new contracts.
    /// @variable lottery - a javascript object repersentation of the contract we can interact with. Represents what exists on the actual eth blockchain.
    lottery = await new web3.eth.Contract(JSON.parse(interface))
        /// @dev Pass in bytecode & inital contract argument(s).
        .deploy({ data: bytecode})
        .send({ from: accounts[0], gas: '1000000' })
    lottery.setProvider(provider);
});

describe('Contract lottery', () => {
    /// @dev Ensure the contract is deployed.
    it('delpoys a contract', () => {
        // console.log(web3.eth.getAccounts());
        assert.ok(lottery.options.address);
    });


    /// @dev Ensure a user can enter the lottery.
    it('allows one account to enter', async () => {
        await lottery.methods.enter().send({ from: accounts[0], 
                                             value: web3.utils.toWei('.0011', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({ from: accounts[0] });

        assert.equal(accounts[0], players[0]);
        assert.equal(1, players.length);
    });


    /// @dev Ensure multiple users can enter the lottery.
    it('allows multiple account to enter', async () => {
        await lottery.methods.enter().send({ from: accounts[0], 
                                             value: web3.utils.toWei('.0011', 'ether')
        });

        await lottery.methods.enter().send({ from: accounts[1], 
            value: web3.utils.toWei('.0011', 'ether')
        });

        await lottery.methods.enter().send({ from: accounts[2], 
            value: web3.utils.toWei('.0011', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({ from: accounts[0] });

        assert.equal(accounts[0], players[0]);
        assert.equal(accounts[1], players[1]);
        assert.equal(accounts[2], players[2]);
        assert.equal(3, players.length);
    });


    /// @dev Ensure minimum fee is met.
    it('requires minimum ether to enter', async () => {
        /// @dev There should be an error thrown due to insufficient fee.
        try {
            await lottery.methods.enter().send({ from: accounts[0],
                                                 value: web3.utils.toWei('.0001', 'ether') 
            });
            /// @dev If no error is thrown in try, fail the test.
            assert(false);
        } catch (err) {
            // @dev Make sure there is an error present.
            assert(err);
        }
    });


    /// @dev Ensure that only the owner of the contract can pick a winner.
    it('only manager can call pickWinner', async () => {
        /// @dev There should be an error thrown due to onlyOwner modifier.
        try {
            await lottery.methods.pickWinner().send({ from: accounts[1],
                                                      value: web3.utils.toWei('.001', 'ether') 
            });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });


    /// @dev End to end contract run through.
    it('send money to winner and reset player array', async () => {
        await lottery.methods.enter().send({ from: accounts[0], 
                                              value: web3.utils.toWei('2', 'ether')
        });

        const initialBalance = await web3.eth.getBalance(accounts[0]);

        await lottery.methods.pickWinner().send({ from: accounts[0] });

        const finalBalance = await web3.eth.getBalance(accounts[0]);

        const difference = finalBalance - initialBalance;

        // console.log(finalBalance - initialBalance);

        assert(difference > web3.utils.toWei('1.8', 'ether'));
    });
});