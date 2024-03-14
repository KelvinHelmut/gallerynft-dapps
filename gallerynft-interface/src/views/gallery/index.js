import {useState} from 'react'
import {useWeb3React} from '@web3-react/core'
import {Link} from 'react-router-dom'
import {useNavigate, useLocation} from 'react-router-dom'
import {useNFTsData} from '../../hooks/useNFTData'

const Gallery = () => {
  const {active} = useWeb3React()
  const {search} = useLocation()
  const [address, setAddress] = useState(new URLSearchParams(search).get('address'))
  const NFTsData = useNFTsData({owner: address ? address : null})
  const navigate = useNavigate()

  const handleAddressChange = ({target: {value}}) => {
    setAddress(value)
    filtrar(value)
  }

  const filtrar = (value) => {
    if (value) {
      navigate(`/gallery/?address=${value}`)
    } else {
      navigate('/gallery')
    }
  }

  if (!active) return 'Conecta tu wallet'

  return (
    <>
      <h1>Gallery</h1>
      <input value={address ?? ''} onChange={handleAddressChange} />
      {NFTsData.loading
        ? 'Cargando' 
        : NFTsData.NFTs.map(({tokenId, name, image}) =>
            <Link key={tokenId} to={`/gallery/${tokenId}`}>
              <div>
                <p>{tokenId} {name}</p>
                <img src={image} />
              </div>
            </Link>
        )
      }
    </>
  )
}

export default Gallery
