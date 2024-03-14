import { Web3ReactProvider } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import Web3 from 'web3/dist/web3.min'

const connector = new InjectedConnector({
  supportedChainIds: [4]
})

const getWeb3Library = (provider) => {
  return new Web3(provider)
}

export { connector, getWeb3Library }
