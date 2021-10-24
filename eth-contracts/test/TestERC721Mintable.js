var ERC721MintableComplete = artifacts.require('ERC721Mintable');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    const account_three = accounts[2];
    

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});
            await this.contract.mint(account_three, 1, {from: account_one});
            await this.contract.mint(account_two, 2, {from: account_one});
            await this.contract.mint(account_two, 3, {from: account_one});
        })

        it('should return total supply', async function () { 
            const expectedSupply = 3;
            const actualSupply = await this.contract.totalSupply();
            assert.equal(actualSupply, expectedSupply, 'Invalid total supply');
        })

        it('should get token balance', async function () { 
            const expectedBalance = 2;
            const actualBalance = await this.contract.balanceOf(account_two);
            assert.equal(actualBalance, expectedBalance, 'Invalid balance')
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            const expecteTokenURI =  'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1';
            const actualTokenURI = await this.contract.tokenURI(1);
            assert.equal(actualTokenURI, expecteTokenURI, 'Invalid token URI');        
        })

        it('should transfer token from one owner to another', async function () { 
            const tokenId = 1;
            const expectedOwner = account_two;
            await this.contract.transferFrom(account_three, account_two, tokenId, {from: account_three});
            const actualOwner = await this.contract.ownerOf(tokenId);
            assert.equal(actualOwner, expectedOwner, 'Invalid token owner');
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 
           const expectedMinted = false;
           let actualMinted = false;
           try {
               actualMinted = await this.contract.mint(4, {from:account_two});
           } catch (e) { 
               actualMinted = false;
           }
           assert.equal(actualMinted, expectedMinted, 'Token should be minted only by owner of the contract')
        })

        it('should return contract owner', async function () { 
            const expectedOwner = account_one;
            const actualOwner = await this.contract.owner.call();
            assert.equal(actualOwner, expectedOwner, 'Invalid contract onwer')
        })

    });
})