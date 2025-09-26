import React, { useState, useEffect } from "react";

export default function TaskModal({ task, onClose, onSave }) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [collaborators, setCollaborators] = useState((task.collaborators || []).join(","));
  const [status, setStatus] = useState(task.status);

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description);
    setCollaborators((task.collaborators || []).join(","));
    setStatus(task.status);
  }, [task]);

  const handleSave = () => {
    const collaboratorsArray = collaborators
      .split(",")
      .map(a => a.trim().toLowerCase())
      .filter(a => a);
    onSave({ ...task, title, description, collaborators: collaboratorsArray, status });
    onClose();
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center",
      zIndex: 1000
    }}>
      <div style={{
        background: "#fff", padding: "20px", borderRadius: "12px", width: "400px",
        display: "flex", flexDirection: "column", gap: "10px"
      }}>
        <h2>Modifier la tâche</h2>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Titre" />
        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
        <input value={collaborators} onChange={e => setCollaborators(e.target.value)} placeholder="Collaborateurs (séparés par ,)" />
        <select value={status} onChange={e => setStatus(Number(e.target.value))}>
          <option value={0}>À faire</option>
          <option value={1}>En cours</option>
          <option value={2}>Terminé</option>
        </select>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button onClick={onClose} style={{ padding: "6px 12px", cursor: "pointer" }}>Annuler</button>
          <button onClick={handleSave} style={{ padding: "6px 12px", backgroundColor: "#22c55e", color: "#fff", border: "none", borderRadius: 5, cursor: "pointer" }}>Sauvegarder</button>
        </div>
      </div>
    </div>
  );
}
