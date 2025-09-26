export const loadTasks = async (contract, setTasks) => {
  if (!contract) return;
  try {
    const ids = await contract.getTaskIds();
    const tasksFetched = await Promise.all(
      ids.map(async (id) => {
        const [taskId, title, description, creator, collaborators, status] =
          await contract.getTask(id);

        return {
          id: Number(taskId),
          title,
          description,
          creator: creator?.toLowerCase() || "",
          collaborators: (collaborators || []).map(a => a.toLowerCase()),
          status: Number(status),
        };
      })
    );

    const validTasks = tasksFetched.filter(
      t => t.creator !== "0x0000000000000000000000000000000000000000"
    );
    setTasks(validTasks);
  } catch (err) {
    console.error("Erreur loadTasks:", err);
  }
};

export const addTask = async (contract, newTitle, newDescription, collaboratorsInput, connectedAddress, setTasks, setNewTitle, setNewDescription, loadTasksFunc) => {
  if (!newTitle || !newDescription) return alert("Titre et description requis !");
  if (!contract) return alert("Connecte ton wallet !");

  const collaboratorsArray = (collaboratorsInput || "")
    .split(",")
    .map(a => a.trim().toLowerCase())
    .filter(a => a);

  try {
    const tx = await contract.addTask(newTitle, newDescription, collaboratorsArray);
    await tx.wait();

    setNewTitle("");
    setNewDescription("");
    await loadTasksFunc();
  } catch (err) {
    console.error(err);
    alert("Impossible d'ajouter la tâche !");
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
export const updateTask = async (contract, task, setTasks, loadTasksFunc) => {
  if (!contract) return alert("Connecte ton wallet !");

  try {
    // On suppose que le contrat a une fonction updateTask(uint256 id, string title, string description, address[] collaborators)
    const tx = await contract.updateTask(task.id, task.title, task.description, task.collaborators);
    await tx.wait();
    await loadTasksFunc();
  } catch (err) {
    console.error(err);
    alert("Impossible de modifier la tâche !");
  }
};
