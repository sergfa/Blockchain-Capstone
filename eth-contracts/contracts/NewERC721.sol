// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import  "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";
import  "openzeppelin-solidity/contracts/access/Ownable.sol";


contract NewERC721 is ERC721, Ownable {

 string constant BASE_URI = "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/";
 address private _owner;
 uint256 private _nextTokenId;

 constructor() ERC721('FSCoin', 'FS'){

  }
  
  function _baseURI() internal pure override returns (string memory) {
        return BASE_URI;
  }

  function mint(address to) public onlyOwner {
      uint256 tokenId = _nextTokenId;
      _nextTokenId += 1;
      _mint(to, tokenId);
  }
}