// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Verifier.sol";
import "./ERC721Mintable.sol";

contract SolnSquareVerifier is ERC721Mintable {
    struct Solution {
        uint256 index;
        address owner;
        bool used;
    }

    Verifier private _verifier;
    Solution[] private _solutions;
    mapping(bytes32 => Solution) private _keyToSolution;

    event SolutionRegistered(uint256 index);

    constructor(address verifier) {
        _verifier = Verifier(verifier);
    }

    function registerSolution(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[2] memory inputs
    ) public {
        bytes32 key = keccak256(abi.encodePacked(inputs[0], inputs[1]));
        require(
            _keyToSolution[key].owner == address(0),
            "Solution already registered"
        );
        Verifier.Proof memory proof;
        proof.a.X = a[0];
        proof.a.Y = a[1];
        proof.b.X = b[0];
        proof.b.Y = b[1];
        proof.c.X = c[0];
        proof.c.Y = c[1];
        bool verify = _verifier.verifyTx(proof, inputs);
        require(verify, "Invalid proof data");
        uint256 index = _solutions.length;
        Solution memory sol;
        sol.index = index;
        sol.owner = msg.sender;
        _solutions.push(sol);
        _keyToSolution[key] = sol;
        emit SolutionRegistered(index);
    }

    function mintNewNFT(address to, uint256[2] memory inputs) external {
        bytes32 key = keccak256(abi.encodePacked(inputs[0], inputs[1]));
        require(
            _keyToSolution[key].owner == msg.sender,
            "Solution is not registered by caller"
        );
        require(_keyToSolution[key].used == false, "Solution already used");
        Solution memory sol = _keyToSolution[key];
        _keyToSolution[key].used = true;
        super.mint(to, sol.index);
    }
}
