import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";

// ⚡ Adresse réelle de ton contrat déployé (modifie-la si besoin)
const TASK_MANAGER_ADDRESS = "0x92144ED262b25B77499D7c11209755354EdB9dfC";

// ⚡ ABI du contrat avec title + description
const TASK_MANAGER_ABI = [
  "function addTask(string _title, string _description) public",
  "function updateTaskStatus(uint256 _id, uint8 _status) public",
  "function getTask(uint256 _id) view returns (uint256, string, string, address, uint8)",
  "function getTaskIds() view returns (uint256[])",
  "event TaskAdded(uint256 indexed id, string title, string description, address indexed creator, uint8 status)",
  "event TaskStatusUpdated(uint256 indexed id, uint8 status)",
  "event TaskDeleted(uint256 indexed id)"
];

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [connectedAddress, setConnectedAddress] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  const statuses = ["À faire", "En cours", "Terminé"];

  // ✅ Connexion wallet
  const connectWallet = async () => {
    try {
      if (!window.ethereum) return alert("Installe MetaMask !");
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();

      const prov = new ethers.BrowserProvider(connection);
      const signer = await prov.getSigner();
      const address = await signer.getAddress();

      const taskContract = new ethers.Contract(
        TASK_MANAGER_ADDRESS,
        TASK_MANAGER_ABI,
        signer
      );

      setProvider(prov);
      setSigner(signer);
      setConnectedAddress(address);
      setContract(taskContract);

      console.log("Wallet connecté:", address);
      loadTasks(taskContract);
    } catch (err) {
      console.error("Erreur connexion wallet:", err);
    }
  };

  // ✅ Charger les tâches
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
      setTasks(tasksFetched);
    } catch (err) {
      console.error("Erreur loadTasks:", err);
    }
  };

  // ✅ Ajouter une tâche
  const addTask = async () => {
    if (!newTitle.trim() || !newDescription.trim())
      return alert("Remplis titre + description !");
    if (!contract) return alert("Connecte ton wallet d’abord !");
    try {
      const tx = await contract.addTask(newTitle, newDescription);
      await tx.wait();
      console.log("Tâche ajoutée !");
      setNewTitle("");
      setNewDescription("");
      loadTasks(contract);
    } catch (err) {
      console.error("Erreur addTask:", err);
      alert("Erreur lors de l'ajout de la tâche");
    }
  };

  // ✅ Mettre à jour le statut
  const updateStatus = async (id, status) => {
    if (!contract) return alert("Connecte ton wallet d’abord !");
    try {
      const tx = await contract.updateTaskStatus(id, status);
      await tx.wait();
      console.log("Statut mis à jour !");
      loadTasks(contract);
    } catch (err) {
      console.error("Erreur updateStatus:", err);
      alert("Erreur lors de la mise à jour du statut");
    }
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: 900,
        margin: "0 auto",
        padding: 20,
      }}
    >
      <header
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <h1 style={{ color: "#22c55e" }}>📝 ChainTask On-Chain</h1>
        {!connectedAddress ? (
          <button
            onClick={connectWallet}
            style={{ padding: "10px 20px", cursor: "pointer" }}
          >
            Connect Wallet
          </button>
        ) : (
          <p>Wallet : {connectedAddress}</p>
        )}
      </header>

      {/* Formulaire nouvelle tâche */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "20px 0" }}>
        <input
          type="text"
          placeholder="Titre..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          style={{
            padding: 10,
            fontSize: 16,
            borderRadius: 5,
            border: "1px solid #ccc",
          }}
        />
        <textarea
          placeholder="Description..."
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          style={{
            padding: 10,
            fontSize: 16,
            borderRadius: 5,
            border: "1px solid #ccc",
            minHeight: 80,
          }}
        />
        <button
          onClick={addTask}
          style={{
            padding: "10px 20px",
            cursor: "pointer",
            backgroundColor: "#22c55e",
            color: "#fff",
            border: "none",
            borderRadius: 5,
          }}
        >
          Ajouter
        </button>
      </div>

      {/* Liste des tâches par statut */}
      {statuses.map((status) => (
        <div key={status} style={{ marginBottom: 30 }}>
          <h2 style={{ borderBottom: "2px solid #ddd", paddingBottom: 5 }}>
            {status}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {tasks
              .filter((t) => t.status === statuses.indexOf(status))
              .map((task) => (
                <div
                  key={task.id}
                  style={{
                    padding: 10,
                    borderRadius: 8,
                    background: "#f0fdf4",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  }}
                >
                  <div>
                    <p style={{ margin: 0, fontWeight: "bold" }}>{task.title}</p>
                    <p style={{ margin: 0 }}>{task.description}</p>
                    <small>Créé par: {task.creator}</small>
                  </div>
                  <div>
                    {statuses.map(
                      (s, i) =>
                        i !== task.status && (
                          <button
                            key={i}
                            onClick={() => updateStatus(task.id, i)}
                            style={{
                              marginRight: 5,
                              cursor: "pointer",
                              padding: "5px 10px",
                            }}
                          >
                            {s}
                          </button>
                        )
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
