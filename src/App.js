import { useState, useEffect } from "react";
import { useWallet } from "./features/wallet/useWallet";
import NetworkSelector from "./features/network/NetworkSelector";
import WalletButtons from "./features/wallet/WalletButtons";
import TaskForm from "./features/tasks/TaskForm";
import TaskList from "./features/tasks/TaskList";
import TaskModal from "./features/tasks/TaskModal";
import { loadTasks, addTask, updateStatus, deleteTask, updateTask } from "./features/tasks/taskAPI";

export default function App() {
  const { connectedAddress, contract, selectedNetwork, connectWallet, disconnectWallet, switchNetwork } = useWallet();

  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const statuses = ["À faire", "En cours", "Terminé"];

  // Charger les tâches
  useEffect(() => {
    if (contract) loadTasks(contract, setTasks);
  }, [contract]);

  // Sauvegarder une tâche modifiée
  const handleSaveTask = async (task) => {
    // Vérifier si la tâche a été supprimée
    if (task.creator === "0x0000000000000000000000000000000000000000") {
      alert("Cette tâche a été supprimée");
      setShowModal(false);
      return;
    }

    try {
      await updateTask(contract, task);
      await loadTasks(contract, setTasks);
      setShowModal(false);
    } catch (err) {
      console.error("Impossible de modifier la tâche :", err);
      alert("Impossible de modifier la tâche");
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "900px", margin: "0 auto", padding: "25px" }}>
      <NetworkSelector selectedNetwork={selectedNetwork} switchNetwork={switchNetwork} />
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
        <h1 style={{ color: "#22c55e", fontSize: "28px" }}>📝 ChainTask On-Chain</h1>
        <WalletButtons connectedAddress={connectedAddress} connectWallet={connectWallet} disconnectWallet={disconnectWallet} />
      </header>

      <TaskForm
        onAdd={async (title, description, collaborators) => {
          await addTask(contract, title, description, collaborators);
          await loadTasks(contract, setTasks);
        }}
      />

      <TaskList
        tasks={tasks}
        statuses={statuses}
        connectedAddress={connectedAddress}
        updateStatus={async (id, status) => {
          await updateStatus(contract, id, status);
          await loadTasks(contract, setTasks);
        }}
        deleteTask={async (id) => {
          await deleteTask(contract, id);
          await loadTasks(contract, setTasks);
        }}
        updateTask={handleSaveTask}
      />


      {showModal && selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setShowModal(false)}
          onSave={handleSaveTask}
        />
      )}
    </div>
  );
}
