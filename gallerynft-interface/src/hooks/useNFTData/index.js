import {useState, useCallback, useEffect} from 'react'
import {useWeb3React} from '@web3-react/core'
import useNFT from '../useNFT'

const getNFTData = async ({NFT, tokenId}) => {
  console.log(NFT, tokenId)
  const [
    tokenURI,
    dna,
    owner,
    accessoriesType,
    clotheColor,
    clotheType,
    eyeType,
    eyeBrowType,
    facialHairColor,
    facialHairType,
    hairColor,
    hatColor,
    graphicType,
    mouthType,
    skinColor,
    topType,
  ] = await Promise.all([
    NFT.methods.tokenURI(tokenId).call(),
    NFT.methods.tokensDNA(tokenId).call(),
    NFT.methods.ownerOf(tokenId).call(),
    NFT.methods.getAccessoriesType(tokenId).call(),
    NFT.methods.getClotheColor(tokenId).call(),
    NFT.methods.getClotheType(tokenId).call(),
    NFT.methods.getEyeType(tokenId).call(),
    NFT.methods.getEyeBrowType(tokenId).call(),
    NFT.methods.getFacialHairColor(tokenId).call(),
    NFT.methods.getFacialHairType(tokenId).call(),
    NFT.methods.getHairColor(tokenId).call(),
    NFT.methods.getHatColor(tokenId).call(),
    NFT.methods.getGraphicType(tokenId).call(),
    NFT.methods.getMouthType(tokenId).call(),
    NFT.methods.getSkinColor(tokenId).call(),
    NFT.methods.getTopType(tokenId).call(),
  ])

  const responseMetadata = await fetch(tokenURI)
  const metadata = await responseMetadata.json()

  return {
    tokenId,
    attributes: {
      accessoriesType,
      clotheColor,
      clotheType,
      eyeType,
      eyeBrowType,
      facialHairColor,
      facialHairType,
      hairColor,
      hatColor,
      graphicType,
      mouthType,
      skinColor,
      topType,
    },
    tokenURI,
    dna,
    owner,
    ...metadata,
  }
}

const useNFTsData = ({owner=null}={}) => {
  const [NFTs, setNFTs] = useState([])
  const [loading, setLoading] = useState(false)
  const {library} = useWeb3React()
  const NFT = useNFT()

  const update = useCallback(async () => {
    if (NFT) {
      setLoading(true)
      let tokenIds
      console.log(owner)
      if (library.utils.isAddress(owner)) {
        const balance = await NFT.methods.balanceOf(owner).call()
        const tokenIdsOwner = new Array(Number(balance)).fill()
          .map((_, index) => NFT.methods.tokenOfOwnerByIndex(owner, index).call())
        tokenIds = await Promise.all(tokenIdsOwner)
      } else {
        const totalSupply = await NFT.methods.totalSupply().call()
        tokenIds = new Array(Number(totalSupply)).fill().map((_, index) => index)
      }
      console.log(tokenIds)
      const promises = tokenIds.map(tokenId => getNFTData({NFT, tokenId}))
      const data = await Promise.all(promises)
      setNFTs(data)
      setLoading(false)
    }
  }, [NFT, owner])

  useEffect(() => {
    update()
  }, [update])

  return {
    loading,
    update,
    NFTs,
  }
}


const useNFTData = (tokenId=null) => {
  const [nft, setNft] = useState()
  const [loading, setLoading] = useState(false)
  const NFT = useNFT()

  const update = useCallback(async () => {
    if (NFT && tokenId != null) {
      setLoading(true)
      const data = await getNFTData({NFT, tokenId})
      setNft(data)
      setLoading(false)
    }
  }, [NFT, tokenId])

  useEffect(() => {
    update()
  }, [update])

  return {
    loading,
    nft,
    update
  }
}

export {useNFTsData, useNFTData}
