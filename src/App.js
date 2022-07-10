import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import githubLogo from "./assets/github-logo.svg";
import loadingIcon from "./assets/loading.svg";
import myEpicNft from "./utils/MyEpicNFT.json";

import "./styles/App.css";

// Constants
const CONTRACT_ADDRESS = "0x11241d41558644722d35453332B3357fFaeccCd1";
const GITHUB_LINK = `https://github.com/Fred-Reis`;
const OPENSEA_LINK = "https://testnets.opensea.io";
const RARIBLE_LINK = "https://rinkeby.rarible.com";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [openSeaLink, setOpenSeaLink] = useState("");
  const [raribleLink, setRaribleLink] = useState("");
  const [loading, setLoading] = useState(false);

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Please check your wallet connection!");
      return;
    } else {
      console.log("Wallet is connected!");
      let chainId = await ethereum.request({ method: "eth_chainId" });
      console.log("Conected at network " + chainId);
      const rinkebyChainId = "0x4";
      if (chainId !== rinkebyChainId) {
        alert("You're not conected at Rinkeby test network!");
        return;
      }
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log(`Account connected: ${account}`);
      setCurrentAccount(account);

      setupEventListener();
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

      setupEventListener();
    } catch (err) {
      console.error(err);
    }
  };

  const setupEventListener = async () => {
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

        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber());
          alert(
            `Hey Folks! We already mint your NFT. Might it's a blank page for now. It spends in maximum 10 minuts to show up at OpenSea and Rarible.`
          );
          setOpenSeaLink(
            `${OPENSEA_LINK}/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`
          );
          setRaribleLink(
            `${RARIBLE_LINK}/token/${CONTRACT_ADDRESS}:${tokenId.toNumber()}`
          );
        });

        console.log("Setup event listener!");
      } else {
        console.log("ethereum object doesn't exist!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const askContractToMint = async () => {
    setOpenSeaLink("");
    setRaribleLink("");
    try {
      const { ethereum } = window;
      if (ethereum) {
        setLoading(true);
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
        setLoading(false);
      } else {
        alert("Please Download Metamask!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const renderNotConnectedContainer = () => (
    <button
      onClick={connectWallet}
      className="cta-button connect-wallet-button"
    >
      Connect Wallet
    </button>
  );

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">
            Exclusive! Awesome! Single! Find your own NFT today.
          </p>
          {currentAccount === "" ? (
            renderNotConnectedContainer()
          ) : loading ? (
            <img alt="" src={loadingIcon} />
          ) : (
            <button
              onClick={askContractToMint}
              className="cta-button connect-wallet-button"
            >
              Mint NFT
            </button>
          )}
          <div className="link-container">
            {openSeaLink !== "" && (
              <a
                className="link-text"
                href={openSeaLink}
                target="_blank"
                rel="noreferrer"
              >
                Here is the Link for your NFT at OpenSea be patience, it might
                spent until 10 minutes
              </a>
            )}

            {raribleLink !== "" && (
              <a
                className="link-text"
                href={raribleLink}
                target="_blank"
                rel="noreferrer"
              >
                Here is the Link for your NFT at Rarible be patience, it might
                spent until 10 minutes
              </a>
            )}
          </div>
        </div>
        <div className="footer-container">
          <a
            className="footer-text"
            href={GITHUB_LINK}
            target="_blank"
            rel="noreferrer"
          >
            <img alt="Github Logo" className="github-logo" src={githubLogo} />
            {`Made with ❤️ By Fred Reis`}
          </a>
        </div>
      </div>
    </div>
  );
};

export default App;
