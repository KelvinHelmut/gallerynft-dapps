const deploy = async() => {
  const [deployer] = await ethers.getSigners()

  console.log('Deploying constract with the account:', deployer.address)

  const nft = await ethers.getContractFactory('NFT')
  const deployed = await nft.deploy(10000)

  console.log('NFT is deployed at:', deployed.address)
}

deploy()
  .then(() => process.exit(0))
  .catch(error => {
    console.log(error)
    process.exit(1)
  })
