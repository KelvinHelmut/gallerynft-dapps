import {useState} from 'react'
import {useWeb3React} from '@web3-react/core'
import {useParams} from 'react-router-dom'
import useNFT from '../../hooks/useNFT'
import {useNFTData} from '../../hooks/useNFTData'

const GalleryItem = () => {
  const {active, account, library} = useWeb3React()
  const {tokenId} = useParams()
  const {loading, nft, update} = useNFTData(tokenId)
  const [transfering, setTransfering] = useState(false)
  const NFT = useNFT()

  const renderData = (data) => {
    if (!data) return
    console.log(data)
    return (
      <>
        <ul>
          {
            Object.entries(data).map(([key, value]) => {
              if (value instanceof Object) return renderData(value)
              if (key === 'image') return <img key={key} src={value} />
              return <li key={key}>{key}: {value}</li>
            })
          }
        </ul>
      </>
    )
  }

  const transfer = () => {
    setTransfering(true)
    const address = prompt('Address')

    if (library.utils.isAddress(address)) {
      NFT.methods.safeTransferFrom(nft.owner, address, nft.tokenId)
        .send({from: account})
        .on('transactionHash', txHash => console.log('txHash', txHash))
        .on('receipt', () => {
          console.log('CONFIRM')
          setTransfering(false)
          update()
        })
        .on('error', error => {
          console.log(error.message)
          setTransfering(false)
        })
    } else {
      console.log('Address invalida')
      setTransfering(false)
    }
  }

  if (!active) return 'Conecta tu wallet'

  return (
    <>
      <button onClick={transfer} disabled={nft && account != nft.owner}>Transferir</button>
      {renderData(nft)}
    </>
  )
}

export default GalleryItem
