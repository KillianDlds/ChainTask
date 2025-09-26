import { useState, useEffect } from "react";
import { useWallet } from "./features/wallet/useWallet";
import NetworkSelector from "./features/network/NetworkSelector";
import WalletButtons from "./features/wallet/WalletButtons";
import TaskForm from "./features/tasks/TaskForm";
import TaskList from "./features/tasks/TaskList";
import { loadTasks, addTask, updateStatus, deleteTask } from "./features/tasks/taskAPI";

export default function App() {
  const { connectedAddress, contract, selectedNetwork, connectWallet, disconnectWallet, switchNetwork } = useWallet();
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const statuses = ["À faire", "En cours", "Terminé"];

  useEffect(() => {
    if (contract) loadTasks(contract, setTasks);
  }, [contract]);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "900px", margin: "0 auto", padding: "25px" }}>
      <NetworkSelector selectedNetwork={selectedNetwork} switchNetwork={switchNetwork} />
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
        <h1 style={{ color: "#22c55e", fontSize: "28px" }}>📝 ChainTask On-Chain</h1>
        <WalletButtons connectedAddress={connectedAddress} connectWallet={connectWallet} disconnectWallet={disconnectWallet} />
      </header>
      <TaskForm
        newTitle={newTitle}
        setNewTitle={setNewTitle}
        newDescription={newDescription}
        setNewDescription={setNewDescription}
        addTask={() => addTask(contract, newTitle, newDescription, connectedAddress, setTasks, setNewTitle, setNewDescription)}
      />
      <TaskList
        tasks={tasks}
        statuses={statuses}
        updateStatus={(id, status) => updateStatus(contract, id, status, () => loadTasks(contract, setTasks))}
        deleteTask={id => deleteTask(contract, id, setTasks)}
      />
    </div>
  );
}
