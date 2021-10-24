
const truffleAssert = require('truffle-assertions');

var SolnSquareVeririfer = artifacts.require('SolnSquareVeririfer');
var Veririfer = artifacts.require('Verifier');

const proofJSON = require("../../zokrates/code/square/proof.json");

contract('SolnSquareVeririfer', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
   

    describe('Test SolnSquareVeririfer', function () {
        let contract;
        beforeEach(async function () { 
            const verifierContract = await Veririfer.new({from: account_one});   
            contract = await SolnSquareVeririfer.new(verifierContract.address, {from: account_one});
        });

        it('should register new solution succeffully', async function () { 
            const tx =  await contract.regeisterSolution(proofJSON.proof.a, proofJSON.proof.b, proofJSON.proof.c, proofJSON.inputs, {from: account_one});
            let eventEmitted = false;

            truffleAssert.eventEmitted(tx, 'SolutionRegistered', (eventData) => {
                eventEmitted = eventData.index == 0; 
                return eventEmitted;
            });

           assert.equal(eventEmitted, true, 'Solution was not registered'); 
        });

        it('should mint new token', async function () { 
            const tx =  await contract.regeisterSolution(proofJSON.proof.a, proofJSON.proof.b, proofJSON.proof.c, proofJSON.inputs, {from: account_one});
            await contract.mint(account_two, proofJSON.inputs, {from:account_one});
            const totalSupply = await contract.totalSupply();
            assert.equal(totalSupply, 1, "Invalid total supply number");
        });


    });
  
})