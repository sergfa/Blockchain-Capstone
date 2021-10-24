// migrating the appropriate contracts
var SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");

var verifierAddress = '0x3Ae323D7A27A7E646fe8a8c16A85e74437aE16F6';
module.exports = function(deployer) {
  deployer.deploy(SolnSquareVerifier, verifierAddress);
};
