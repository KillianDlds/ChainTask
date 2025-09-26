export const loadTasks = async (contract, setTasks) => {
  if (!contract) return;
  try {
    const ids = await contract.getTaskIds();
    const tasksFetched = await Promise.all(
      ids.map(async (id) => {
        const [taskId, title, description, creator, status] = await contract.getTask(id);
        return { id: Number(taskId), title, description, creator, status: Number(status) };
      })
    );
    const validTasks = tasksFetched.filter(t => t.creator !== "0x0000000000000000000000000000000000000000");
    setTasks(validTasks);
  } catch (err) {
    console.error("Erreur loadTasks:", err);
  }
};

export const addTask = async (contract, newTitle, newDescription, connectedAddress, setTasks, setNewTitle, setNewDescription) => {
  if (!newTitle.trim() || !newDescription.trim()) return alert("Remplis titre + description !");
  if (!contract) return alert("Connecte ton wallet !");
  try {
    const tx = await contract.addTask(newTitle, newDescription);
    await tx.wait();
    setTasks(prev => [...prev, { id: Date.now(), title: newTitle, description: newDescription, creator: connectedAddress, status: 0 }]);
    setNewTitle(""); setNewDescription("");
  } catch (err) {
    console.error("Erreur addTask:", err);
    alert("Impossible d'ajouter la tâche sur ce réseau");
  }
};

export const updateStatus = async (contract, id, status, loadTasksFunc) => {
  if (!contract) return alert("Connecte ton wallet !");
  try {
    const tx = await contract.updateTaskStatus(id, status);
    await tx.wait();
    await loadTasksFunc();
  } catch (err) {
    console.error("Erreur updateStatus:", err);
  }
};

export const deleteTask = async (contract, id, setTasks) => {
  if (!contract) return alert("Connecte ton wallet !");
  try {
    const tx = await contract.deleteTask(id);
    await tx.wait();
    setTasks(prev => prev.filter(t => t.id !== id));
  } catch (err) {
    console.error("Erreur deleteTask:", err);
  }
};
