import {useState, useCallback, useEffect} from 'react'
import {useWeb3React} from '@web3-react/core'
import useNFT from '../../hooks/useNFT'

const Home = () => {
    const {active, account} = useWeb3React()
    const [available, setAvailable] = useState()
    const [imageSrc, setImageSrc] = useState('')
    const [isMinting, setIsMinting] = useState(false)
    const NFT = useNFT()
    const getNFTData = useCallback(async () => {
        if (NFT) {
            const totalSupply = await NFT.methods.totalSupply().call()
            const maxSupply = await NFT.methods.maxSupply().call()
            const dna = await NFT.methods.deterministicPseudoRandomDNA(totalSupply, account).call()
            const image = await NFT.methods.imageByDNA(dna).call()
            setImageSrc(image)
            setAvailable(maxSupply-totalSupply)
        }
    }, [NFT, account])

    useEffect(() => {
        getNFTData()
    }, [getNFTData])

    const mint = () => {
        setIsMinting(true)
        NFT.methods
            .mint()
            .send({from: account})
            .on('transactionHash', (txHash) => {
                console.log('TXHash', txHash)
            })
            .on('receipt', () => {
                console.log('CONFIRM')
                setIsMinting(false)
            })
            .on('error', (error) => {
                console.log('ERROR', error)
                setIsMinting(false)
            })
    }

    if (!active) return 'Conecta tu wallet'

    return (
        <>
            <img src={imageSrc} />
            <p>Disponibles: {available}</p>
            {isMinting
                ? 'Minting'
                : <button onClick={mint} disabled={!NFT}>Obtener</button>
            }
        </>
    )
}

export default Home
