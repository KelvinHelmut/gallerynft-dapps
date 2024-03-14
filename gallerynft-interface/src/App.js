import {useEffect, useCallback, useState} from 'react'
import {Route, Routes, Link} from 'react-router-dom'
import {useWeb3React, UnsupportedChainIdError} from '@web3-react/core'
import {connector} from './config/web3'
// import Web3 from 'web3/dist/web3.min'
import Home from './views/home'
import Gallery from './views/gallery'
import GalleryItem from './views/gallery-item'

function App() {
  const [balance, setBalance] = useState(0)
  const {active, activate, deactivate, account, error, library} = useWeb3React()
  const isUnsupportedChain = error instanceof UnsupportedChainIdError

  const connect = useCallback(() => {
    activate(connector)
    localStorage.setItem('conectado', '1')
  }, [activate])

  const disconnect = () => {
    deactivate(connector)
    localStorage.removeItem('conectado')
  }

  const getBalance = useCallback(async () => {
    // console.log(active)
    const balanceAccount = await library.eth.getBalance(account)
    setBalance((balanceAccount / 1e18).toFixed(2))
  }, [library?.eth, account])

  useEffect(() => {
    if (active) getBalance()
  }, [active, getBalance])

  useEffect(() => {
    if (localStorage.getItem('conectado') == '1') connect()
  }, [connect])

  useEffect(() => {
    console.log('web3')
    // window.ethereum.request({method: 'eth_requestAccounts'}).then(console.log)
    // const web3 = new Web3(window.ethereum)
    // console.log(web3)
    // web3.eth.requestAccounts().then(console.log)
    // web3.eth.getAccounts(console.log)
  }, [])

  return (
    <>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/gallery">Gallery</Link></li>
      </ul>
      {active
        ? <>
            <button onClick={disconnect}>Desconectar</button>
            <p>{account.substr(2, 8)}</p>
            <p>{balance}</p>
          </>
        : <button onClick={connect} disabled={isUnsupportedChain}>{isUnsupportedChain ? 'Red no soportada' : 'Conectar'}</button>
      }
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/gallery" exact element={<Gallery />} />
        <Route path="/gallery/:tokenId" exact element={<GalleryItem />} />
      </Routes>
    </>
  );
}

export default App;
