var Verifier = artifacts.require('Verifier');
const proofJSON = require("../../zokrates/code/square/proof.json");

contract('Verifier', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
   

    describe('Test Verifier', function () {
        let invalidProofJSON;
        let contract;
        before(async function () { 
            contract = await Verifier.new({from: account_one});
            invalidProofJSON = JSON.parse(JSON.stringify(proofJSON));
            const input0 = invalidProofJSON.inputs[0];
            invalidProofJSON.inputs[0] = invalidProofJSON.inputs[1];
            invalidProofJSON.inputs[1] = input0;
        });

        it('should verify correctly with correct proof', async function () { 
            const expected = true;
            const actual = await contract.verifyTx(proofJSON.proof, proofJSON.inputs);
            assert.equal(actual, expected, "Invalid proof data");
        });

        it('should return false with incorrect proof', async function () { 
            const expected = false;
            const actual = await contract.verifyTx(invalidProofJSON.proof, invalidProofJSON.inputs);
            assert.equal(actual, expected, "Invalid proof data");
        });

    });
  
})