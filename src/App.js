import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import twitterLogo from "./assets/twitter-logo.svg";
import myEpicNft from "./utils/MyEpicNFT.json";

import "./styles/App.css";

// Constants
const CONTRACT_ADDRESS = "0x1CBc219Cc190d428d315546ECc3b6FBC08D709C5";
const TWITTER_HANDLE = "web3dev_";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = "";
const TOTAL_MINT_COUNT = 50;

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Please check your wallet connection!");
      return;
    } else {
      console.log("Wallet is connected!");
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log(`Account connected: ${account}`);
      setCurrentAccount(account);
    } else {
      console.log("No accounts found!");
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Please Download Metamask!");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log(`Connected to wallet: ${accounts[0]}`);
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.error(err);
    }
  };

  const askContractToMint = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          myEpicNft.abi,
          signer
        );
        console.log("Wallet will be open to pay gas...");
        let nftTxn = await connectedContract.makeAnEpicNFT();
        console.log("Minting NFT... Please wait...");
        await nftTxn.wait();
        console.log(
          `NFT Minted look at: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
        );
      } else {
        alert("Please Download Metamask!");
      }
    } catch (error) {}
  };

  const renderNotConnectedContainer = () => (
    <button
      onClick={connectWallet}
      className="cta-button connect-wallet-button"
    >
      Conectar Carteira
    </button>
  );

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">Minha Coleção de NFT</p>
          <p className="sub-text">
            Exclusivos! Maravilhosos! Únicos! Descubra seu NFT hoje.
          </p>
          {currentAccount === "" ? (
            renderNotConnectedContainer()
          ) : (
            <button
              onClick={askContractToMint}
              className="cta-button connect-wallet-button"
            >
              Mint NFT
            </button>
          )}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`feito com ❤️ pela @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
