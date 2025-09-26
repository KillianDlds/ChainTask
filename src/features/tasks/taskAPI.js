// Charger les tâches
export const loadTasks = async (contract, setTasks) => {
  if (!contract) return;

  try {
    const ids = await contract.getTaskIds();
    const tasksFetched = await Promise.all(
      ids.map(async (id) => {
        const [taskId, title, description, creator, collaborators, status] = await contract.getTask(id);
        return {
          id: Number(taskId),
          title,
          description,
          creator,
          collaborators,
          status: Number(status),
        };
      })
    );

    // Ne garder que les tâches valides
    const validTasks = tasksFetched.filter(
      t => t.creator && t.creator !== "0x0000000000000000000000000000000000000000"
    );

    setTasks(validTasks);

  } catch (err) {
    console.error("Erreur loadTasks:", err);
  }
};


// Ajouter une tâche
export const addTask = async (
  contract,
  newTitle,
  newDescription,
  collaborators,
  setTasks,
  setNewTitle,
  setNewDescription,
  setCollaborators
) => {
  if (!newTitle || !newDescription) return alert("Titre + description requis");
  if (!contract) return alert("Connecte ton wallet !");

  const collaboratorsArray = collaborators
    .split(",")
    .map((addr) => addr.trim())
    .filter((addr) => addr);

  try {
    const tx = await contract.addTask(newTitle, newDescription, collaboratorsArray);
    await tx.wait();

    setNewTitle("");
    setNewDescription("");
    setCollaborators("");

    await loadTasks(contract, setTasks);
  } catch (err) {
    console.error(err);
    alert("Impossible d'ajouter la tâche");
  }
};

// Mettre à jour le statut
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

// Supprimer une tâche
export const deleteTask = async (contract, id, setTasks) => {
  if (!contract) return alert("Connecte ton wallet !");
  try {
    const tx = await contract.deleteTask(id);
    await tx.wait();
    setTasks((prev) => prev.filter((t) => t.id !== id));
  } catch (err) {
    console.error("Erreur deleteTask:", err);
  }
};
