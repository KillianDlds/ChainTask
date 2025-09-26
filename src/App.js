import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";

// Adresses des contrats selon le réseau
const TASK_MANAGER_ADDRESSES = {
  base: "0xc5c09c5a5052decc8af4e7c6a6f6f448e3d4a16c",
  celo: "0x92144ED262b25B77499D7c11209755354EdB9dfC",
  celoMainnet: "0xf59db5d2e66436759a02bf4396ECCB1866C2bFfd" // Remplace par l'adresse du contrat Celo Mainnet
};

// ABI du contrat
const TASK_MANAGER_ABI = [
  "function addTask(string _title, string _description) public",
  "function updateTaskStatus(uint256 _id, uint8 _status) public",
  "function deleteTask(uint256 _id) public",
  "function getTask(uint256 _id) view returns (uint256, string, string, address, uint8)",
  "function getTaskIds() view returns (uint256[])",
];

// Infos réseaux
const BASE_CHAIN_ID = "0x14a34";
const CELO_CHAIN_ID = "0xAA044C";
const CELO_MAINNET_CHAIN_ID = "0xa4ec"; // 42220

const BASE_PARAMS = {
  chainId: BASE_CHAIN_ID,
  chainName: "Base Sepolia Testnet",
  nativeCurrency: { name: "Ethereum", symbol: "ETH", decimals: 18 },
  rpcUrls: ["https://sepolia.base.org"],
  blockExplorerUrls: ["https://sepolia.basescan.org"],
};

const CELO_PARAMS = {
  chainId: CELO_CHAIN_ID,
  chainName: "Celo Sepolia Testnet",
  nativeCurrency: { name: "Celo", symbol: "CELO", decimals: 18 },
  rpcUrls: ["https://forno.celo-sepolia.celo-testnet.org/"],
  blockExplorerUrls: ["https://celoscan.io"],
};

const CELO_MAINNET_PARAMS = {
  chainId: CELO_MAINNET_CHAIN_ID,
  chainName: "Celo Mainnet",
  nativeCurrency: { name: "Celo", symbol: "CELO", decimals: 18 },
  rpcUrls: ["https://forno.celo.org"],
  blockExplorerUrls: ["https://celoscan.io"],
};

export default function App() {
  const [selectedNetwork, setSelectedNetwork] = useState("base");
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [connectedAddress, setConnectedAddress] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  const statuses = ["À faire", "En cours", "Terminé"];

  // Connexion wallet
  const connectWallet = async () => {
    if (!window.ethereum) return alert("Installe MetaMask !");
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const prov = new ethers.BrowserProvider(connection);
      const signer = await prov.getSigner();
      const address = await signer.getAddress();

      setProvider(prov);
      setSigner(signer);
      setConnectedAddress(address);

      await switchNetwork(selectedNetwork, signer);

      localStorage.setItem("connectedWallet", address);
    } catch (err) {
      console.error("Erreur connexion wallet:", err);
    }
  };

  // Déconnexion wallet
  const disconnectWallet = () => {
    localStorage.removeItem("connectedWallet");
    setProvider(null);
    setSigner(null);
    setConnectedAddress(null);
    setContract(null);
    setTasks([]);
  };

  // Auto-connexion
  useEffect(() => {
    const autoConnect = async () => {
      if (localStorage.getItem("connectedWallet") && window.ethereum) {
        try {
          const prov = new ethers.BrowserProvider(window.ethereum);
          const signer = await prov.getSigner();
          const address = await signer.getAddress();

          setProvider(prov);
          setSigner(signer);
          setConnectedAddress(address);

          await switchNetwork(selectedNetwork, signer);
        } catch (err) {
          console.error("Erreur auto-connexion:", err);
        }
      }
    };
    autoConnect();
  }, [selectedNetwork]);

  // Écoute changement de réseau dans MetaMask
  useEffect(() => {
    if (!window.ethereum) return;

    const handleChainChanged = async (_chainId) => {
      let network = "base";
      if (_chainId.toLowerCase() === CELO_CHAIN_ID.toLowerCase()) {
        network = "celo";
      } else if (_chainId.toLowerCase() === CELO_MAINNET_CHAIN_ID.toLowerCase()) {
        network = "celoMainnet";
      }
      setSelectedNetwork(network);

      if (signer) await switchNetwork(network, signer);
    };

    window.ethereum.on("chainChanged", handleChainChanged);
    return () => window.ethereum.removeListener("chainChanged", handleChainChanged);
  }, [signer]);

  // Switch réseau + contrat
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
      await loadTasks(taskContract);
    }
  };

  // Charger les tâches
  const loadTasks = async (taskContract) => {
    if (!taskContract) return;
    try {
      const ids = await taskContract.getTaskIds();
      const tasksFetched = await Promise.all(
        ids.map(async (id) => {
          const [taskId, title, description, creator, status] =
            await taskContract.getTask(id);
          return {
            id: Number(taskId),
            title,
            description,
            creator,
            status: Number(status),
          };
        })
      );
      const validTasks = tasksFetched.filter(
        (t) => t.creator !== "0x0000000000000000000000000000000000000000"
      );
      setTasks(validTasks);
    } catch (err) {
      console.error("Erreur loadTasks:", err);
    }
  };

  // Ajouter tâche
  const addTask = async () => {
    if (!newTitle.trim() || !newDescription.trim())
      return alert("Remplis titre + description !");
    if (!contract) return alert("Connecte ton wallet !");
    try {
      const tx = await contract.addTask(newTitle, newDescription);
      await tx.wait();

      setTasks(prevTasks => [
        ...prevTasks,
        { id: Date.now(), title: newTitle, description: newDescription, creator: connectedAddress, status: 0 }
      ]);

      setNewTitle("");
      setNewDescription("");
    } catch (err) {
      console.error("Erreur addTask:", err);
      alert("Impossible d'ajouter la tâche sur ce réseau");
    }
  };


  // Mettre à jour statut
  const updateStatus = async (id, status) => {
    if (!contract) return alert("Connecte ton wallet !");
    try {
      const tx = await contract.updateTaskStatus(id, status);
      await tx.wait();
      await loadTasks(contract);
    } catch (err) {
      console.error("Erreur updateStatus:", err);
    }
  };

  // Supprimer tâche
  const deleteTask = async (id) => {
    if (!contract) return alert("Connecte ton wallet !");
    try {
      const tx = await contract.deleteTask(id);
      await tx.wait();

      // Mise à jour immédiate de la liste des tâches côté front
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    } catch (err) {
      console.error("Erreur deleteTask:", err);
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: 900, margin: "0 auto", padding: 20 }}>
      {/* Sélecteur réseau */}
      <div style={{ marginBottom: 20 }}>
        <label htmlFor="network-select" style={{ marginRight: 10 }}>Réseau :</label>
        <select
          id="network-select"
          value={selectedNetwork}
          onChange={e => switchNetwork(e.target.value)}
          style={{ padding: "5px 10px", fontSize: 16 }}
        >
          <option value="base">Base Sepolia</option>
          <option value="celo">Celo Sepolia</option>
          <option value="celoMainnet">Celo Mainnet</option>
        </select>
      </div>

      {/* Header */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ color: "#22c55e" }}>📝 ChainTask On-Chain</h1>
        {!connectedAddress ? (
          <button onClick={connectWallet} style={{ padding: "10px 20px", cursor: "pointer" }}>
            Connect Wallet
          </button>
        ) : (
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <p>Wallet : {connectedAddress}</p>
            <button
              onClick={disconnectWallet}
              style={{ padding: "8px 15px", cursor: "pointer", backgroundColor: "red", color: "#fff", border: "none", borderRadius: 5 }}
            >
              Déconnexion
            </button>
          </div>
        )}
      </header>

      {/* Formulaire nouvelle tâche */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "20px 0" }}>
        <input
          type="text"
          placeholder="Titre..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          style={{ padding: 10, fontSize: 16, borderRadius: 5, border: "1px solid #ccc" }}
        />
        <textarea
          placeholder="Description..."
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          style={{ padding: 10, fontSize: 16, borderRadius: 5, border: "1px solid #ccc", minHeight: 80 }}
        />
        <button
          onClick={addTask}
          style={{ padding: "10px 20px", cursor: "pointer", backgroundColor: "#22c55e", color: "#fff", border: "none", borderRadius: 5 }}
        >
          Ajouter
        </button>
      </div>

      {/* Liste des tâches */}
      {statuses.map((status) => (
        <div key={status} style={{ marginBottom: 30 }}>
          <h2 style={{ borderBottom: "2px solid #ddd", paddingBottom: 5 }}>{status}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {tasks.filter(t => t.status === statuses.indexOf(status)).map(task => (
              <div key={task.id} style={{ padding: 10, borderRadius: 8, background: "#f0fdf4", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
                <div>
                  <p style={{ margin: 0, fontWeight: "bold" }}>{task.title}</p>
                  <p style={{ margin: 0 }}>{task.description}</p>
                  <small>Créé par: {task.creator}</small>
                </div>
                <div>
                  {statuses.map((s, i) =>
                    i !== task.status && (
                      <button key={i} onClick={() => updateStatus(task.id, i)} style={{ marginRight: 5, cursor: "pointer", padding: "5px 10px" }}>
                        {s}
                      </button>
                    )
                  )}
                  <button
                    onClick={() => deleteTask(task.id)}
                    style={{ backgroundColor: "red", color: "white", border: "none", borderRadius: 5, padding: "5px 10px", cursor: "pointer" }}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
