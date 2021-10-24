// migrating the appropriate contracts
var NewERC721 = artifacts.require("./NewERC721.sol");

module.exports = function(deployer) {
  deployer.deploy(NewERC721);
};
