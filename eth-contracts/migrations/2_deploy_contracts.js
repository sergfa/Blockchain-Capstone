// migrating the appropriate contracts
//var SquareVerifier = artifacts.require("./SquareVerifier.sol");
//var SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");
const ERC721Mintable = artifacts.require('./ERC721Mintable.sol');

module.exports = function(deployer) {
  //deployer.deploy(SquareVerifier);
  //deployer.deploy(SolnSquareVerifier);
  deployer.deploy(ERC721Mintable);
};
