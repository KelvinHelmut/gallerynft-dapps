import React from 'react';
import ReactDOM from 'react-dom/client';
import {HashRouter} from 'react-router-dom'
import {Web3ReactProvider} from '@web3-react/core'
import App from './App';
import { getWeb3Library } from './config/web3'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HashRouter>
      <Web3ReactProvider getLibrary={getWeb3Library} >
        <App />
      </Web3ReactProvider>
    </HashRouter>
  </React.StrictMode>
);

