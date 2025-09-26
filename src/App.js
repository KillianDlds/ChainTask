import { useState, useEffect } from "react";
import { useWallet } from "./features/wallet/useWallet";
import NetworkSelector from "./features/network/NetworkSelector";
import WalletButtons from "./features/wallet/WalletButtons";
import TaskForm from "./features/tasks/TaskForm";
import TaskList from "./features/tasks/TaskList";
import { loadTasks, addTask, updateStatus, deleteTask, updateTask } from "./features/tasks/taskAPI";

export default function App() {
  const { connectedAddress, contract, selectedNetwork, connectWallet, disconnectWallet, switchNetwork } = useWallet();

  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [collaborators, setCollaborators] = useState("");

  const statuses = ["À faire", "En cours", "Terminé"];

  // Charger les tâches quand le contrat change
  useEffect(() => {
    if (contract) loadTasks(contract, setTasks);
  }, [contract]);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "900px", margin: "0 auto", padding: "25px" }}>

      {/* Sélecteur de réseau */}
      <NetworkSelector selectedNetwork={selectedNetwork} switchNetwork={switchNetwork} />

      {/* Header avec wallet */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
        <h1 style={{ color: "#22c55e", fontSize: "28px" }}>📝 ChainTask On-Chain</h1>
        <WalletButtons
          connectedAddress={connectedAddress}
          connectWallet={connectWallet}
          disconnectWallet={disconnectWallet}
        />
      </header>

      {/* Formulaire d'ajout de tâche */}
      <TaskForm
        newTitle={newTitle}
        setNewTitle={setNewTitle}
        newDescription={newDescription}
        setNewDescription={setNewDescription}
        collaborators={collaborators}
        setCollaborators={setCollaborators}
        addTask={() =>
          addTask(
            contract,
            newTitle,
            newDescription,
            collaborators,
            setTasks,
            setNewTitle,
            setNewDescription,
            setCollaborators
          )
        }
      />

      {/* Liste des tâches */}
      <TaskList
        tasks={tasks}
        statuses={statuses}
        updateStatus={(id, status) =>
          updateStatus(contract, id, status, () => loadTasks(contract, setTasks))
        }
        deleteTask={id => deleteTask(contract, id, setTasks)}
        connectedAddress={connectedAddress}
        updateTask={task => updateTask(contract, task, setTasks, () => loadTasks(contract, setTasks))}
      />
    </div>
  );
}
