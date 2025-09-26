// Charger les tâches
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
          creator,
          collaborators,
          status: Number(status),
        };
      })
    );

    const validTasks = tasksFetched.filter(
      t => t && t.creator !== "0x0000000000000000000000000000000000000000"
    );

    setTasks(validTasks);
  } catch (err) {
    console.error("Erreur loadTasks:", err);
  }
};

// Ajouter une tâche
export const addTask = async (contract, title, description, collaborators = []) => {
  if (!contract) return alert("Connecte ton wallet !");
  if (!title || !description) return alert("Titre et description requis !");
  try {
    const tx = await contract.addTask(title, description, collaborators);
    await tx.wait();
  } catch (err) {
    console.error("Impossible d'ajouter la tâche :", err);
    alert("Impossible d'ajouter la tâche. Vérifie le contrat et les adresses des collaborateurs.");
  }
};

// Mettre à jour une tâche
export const updateTask = async (contract, task) => {
  if (!contract) return alert("Connecte ton wallet !");
  try {
    await contract.updateTask(
      task.id,
      task.title,
      task.description,
      task.collaborators,
      task.status
    );
  } catch (err) {
    console.error("Impossible de modifier la tâche :", err);
    alert("Impossible de modifier la tâche. Vérifie que tu es le créateur ou collaborateur.");
  }
};

// Mettre à jour le statut
export const updateStatus = async (contract, id, status) => {
  if (!contract) return alert("Connecte ton wallet !");
  try {
    const tx = await contract.updateTaskStatus(id, status);
    await tx.wait();
  } catch (err) {
    console.error("Erreur updateStatus:", err);
  }
};

// Supprimer une tâche
export const deleteTask = async (contract, id) => {
  if (!contract) return alert("Connecte ton wallet !");
  try {
    const tx = await contract.deleteTask(id);
    await tx.wait();
  } catch (err) {
    console.error("Erreur deleteTask:", err);
    alert("Impossible de supprimer la tâche");
  }
};
