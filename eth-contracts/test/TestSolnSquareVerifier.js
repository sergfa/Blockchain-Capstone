
const truffleAssert = require('truffle-assertions');

var SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
var Veririfer = artifacts.require('Verifier');

const proofJSON = require("../../zokrates/code/square/proof.json");
const proofJSON1 = require("../../zokrates/code/square/proof1.json");


contract('SolnSquareVerifier', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
   

    describe('Test SolnSquareVerifier', function () {
        let contract;
        beforeEach(async function () { 
            const verifierContract = await Veririfer.new({from: account_one});   
            contract = await SolnSquareVerifier.new(verifierContract.address, {from: account_one});
        });

        it('should register new solution succeffully', async function () { 
            const tx =  await contract.registerSolution(proofJSON.proof.a, proofJSON.proof.b, proofJSON.proof.c, proofJSON.inputs, {from: account_one});
            let eventEmitted = false;

            truffleAssert.eventEmitted(tx, 'SolutionRegistered', (eventData) => {
                eventEmitted = eventData.index == 0; 
                return eventEmitted;
            });

           assert.equal(eventEmitted, true, 'Solution was not registered'); 
        });

        it('should not register same solution twice', async function () { 
            let eventEmitted = false;
            let errorFound = false;
            await contract.registerSolution(proofJSON.proof.a, proofJSON.proof.b, proofJSON.proof.c, proofJSON.inputs, {from: account_one});
            try {
            const tx =  await contract.registerSolution(proofJSON.proof.a, proofJSON.proof.b, proofJSON.proof.c, proofJSON.inputs, {from: account_one});

         
            truffleAssert.eventEmitted(tx, 'SolutionRegistered', (eventData) => {
                eventEmitted = true; 
                return eventEmitted;
            });
        }catch(e){
            errorFound = true;
         }

           assert.equal(eventEmitted, false, 'Solution was registered'); 
           assert.equal(errorFound, true, 'Error was not found'); 
        });


        it('should mint new token', async function () { 
            await contract.registerSolution(proofJSON.proof.a, proofJSON.proof.b, proofJSON.proof.c, proofJSON.inputs, {from: account_one});
            await contract.mintNewNFT(account_two, proofJSON.inputs, {from:account_one});
            const totalSupply = await contract.totalSupply();
            assert.equal(totalSupply, 1, "Invalid total supply number");
        });


        it('should mint new tokens with different solutions succeffully', async function () { 
            await contract.registerSolution(proofJSON.proof.a, proofJSON.proof.b, proofJSON.proof.c, proofJSON.inputs, {from: account_one});
            await contract.registerSolution(proofJSON1.proof.a, proofJSON1.proof.b, proofJSON1.proof.c, proofJSON1.inputs, {from: account_one});
            
            await contract.mintNewNFT(account_two, proofJSON.inputs, {from:account_one});
            await contract.mintNewNFT(account_two, proofJSON1.inputs, {from:account_one});
            
            const totalSupply = await contract.totalSupply();
            assert.equal(totalSupply, 2, "Invalid total supply number");
        });

    });
  
})