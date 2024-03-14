const { expect } = require('chai');

describe('NFT Contract', () => {
  const setup = async (maxSupply=10000) => {
    const [owner] = await ethers.getSigners()
    const nft = await ethers.getContractFactory('NFT')
    const deployed = await nft.deploy(maxSupply)
    return {owner, deployed}
  }

  describe('Deployment', () => {
    it('Sets max supply to passed param', async () => {
      const maxSupply = 400
      const {deployed} = await setup(maxSupply)
      const returnedMaxSupply = await deployed.maxSupply()
      expect(maxSupply).to.equal(returnedMaxSupply)
    })
  })

  describe('Minting', () => {
    it('Mints a new token and assigns it to owner', async () => {
      const {owner, deployed} = await setup()
      await deployed.mint()
      const ownerOfMinted = await deployed.ownerOf(0)
      expect(owner.address).to.equal(ownerOfMinted)
    })

    it('Has a minting limit', async () => {
      const maxSupply = 2
      const {deployed} = await setup(maxSupply)
      await deployed.mint()
      await deployed.mint()
      expect(deployed.mint()).to.be.revertedWith('No NFT left :(')
    })
  })

  describe('Token URI', () => {
    it('Returns valid metadata', async () => {
      const {deployed} = await setup()
      await deployed.mint()
      const tokenURI = await deployed.tokenURI(0)
      const [, base64JSON] = tokenURI.split('data:application/json;base64,')
      const stringifiedMetadata = await Buffer.from(base64JSON, 'base64').toString()
      const metadata = JSON.parse(stringifiedMetadata)
      expect(metadata).to.have.all.keys('name', 'description', 'image')
    })
  })
  
})
