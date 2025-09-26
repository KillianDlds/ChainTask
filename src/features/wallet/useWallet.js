import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { TASK_MANAGER_ADDRESSES, TASK_MANAGER_ABI } from "../../constants/taskManager";
import { BASE_CHAIN_ID, CELO_CHAIN_ID, CELO_MAINNET_CHAIN_ID, BASE_PARAMS, CELO_PARAMS, CELO_MAINNET_PARAMS } from "../network/networks";

export const useWallet = () => {
  const [connectedAddress, setConnectedAddress] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [selectedNetwork, setSelectedNetwork] = useState("base");

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Installe MetaMask !");
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const prov = new ethers.BrowserProvider(connection);
      const signerInstance = await prov.getSigner();
      const address = await signerInstance.getAddress();

      setProvider(prov);
      setSigner(signerInstance);
      setConnectedAddress(address);

      await switchNetwork(selectedNetwork, signerInstance);

      localStorage.setItem("connectedWallet", address);
    } catch (err) {
      console.error("Erreur connexion wallet:", err);
    }
  };

  const disconnectWallet = () => {
    localStorage.removeItem("connectedWallet");
    setProvider(null);
    setSigner(null);
    setConnectedAddress(null);
    setContract(null);
  };

  const switchNetwork = async (network, signerInstance = signer) => {
    if (!window.ethereum) return alert("MetaMask non détecté !");
    let chainId, params;
    if (network === "celo") {
      chainId = CELO_CHAIN_ID;
      params = CELO_PARAMS;
    } else if (network === "celoMainnet") {
      chainId = CELO_MAINNET_CHAIN_ID;
      params = CELO_MAINNET_PARAMS;
    } else {
      chainId = BASE_CHAIN_ID;
      params = BASE_PARAMS;
    }

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [params],
        });
      } else {
        console.error("Erreur switch réseau:", switchError);
        return;
      }
    }

    setSelectedNetwork(network);

    if (signerInstance) {
      const taskContract = new ethers.Contract(
        TASK_MANAGER_ADDRESSES[network],
        TASK_MANAGER_ABI,
        signerInstance
      );
      setContract(taskContract);
    }
  };

  useEffect(() => {
    const autoConnect = async () => {
      if (localStorage.getItem("connectedWallet") && window.ethereum) {
        try {
          const prov = new ethers.BrowserProvider(window.ethereum);
          const signerInstance = await prov.getSigner();
          const address = await signerInstance.getAddress();

          setProvider(prov);
          setSigner(signerInstance);
          setConnectedAddress(address);

          await switchNetwork(selectedNetwork, signerInstance);
        } catch (err) {
          console.error("Erreur auto-connexion:", err);
        }
      }
    };
    autoConnect();
  }, [selectedNetwork]);

  useEffect(() => {
    if (!window.ethereum) return;
    const handleChainChanged = async (_chainId) => {
      let network = "base";
      if (_chainId.toLowerCase() === CELO_CHAIN_ID.toLowerCase()) network = "celo";
      else if (_chainId.toLowerCase() === CELO_MAINNET_CHAIN_ID.toLowerCase()) network = "celoMainnet";
      setSelectedNetwork(network);
      if (signer) await switchNetwork(network, signer);
    };
    window.ethereum.on("chainChanged", handleChainChanged);
    return () => window.ethereum.removeListener("chainChanged", handleChainChanged);
  }, [signer]);

  return { connectedAddress, provider, signer, contract, selectedNetwork, connectWallet, disconnectWallet, switchNetwork };
};
