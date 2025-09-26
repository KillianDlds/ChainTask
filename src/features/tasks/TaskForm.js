import React, { useState } from "react";

export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [collaborators, setCollaborators] = useState("");

  const handleAdd = () => {
    const collaboratorsArray = collaborators
      .split(",")
      .map(a => a.trim())
      .filter(a => a);
    onAdd(title, description, collaboratorsArray);
    setTitle("");
    setDescription("");
    setCollaborators("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", margin: "20px 0" }}>
      <input
        type="text"
        placeholder="Titre..."
        value={title}
        onChange={e => setTitle(e.target.value)}
        style={{ padding: 10, fontSize: 16, borderRadius: 5, border: "1px solid #ccc" }}
      />
      <textarea
        placeholder="Description..."
        value={description}
        onChange={e => setDescription(e.target.value)}
        style={{ padding: 10, fontSize: 16, borderRadius: 5, border: "1px solid #ccc", minHeight: 80 }}
      />
      <input
        type="text"
        placeholder="Collaborateurs (séparés par des virgules)"
        value={collaborators}
        onChange={e => setCollaborators(e.target.value)}
        style={{ padding: 10, fontSize: 16, borderRadius: 5, border: "1px solid #ccc" }}
      />
      <button
        onClick={handleAdd}
        style={{ padding: "10px 20px", cursor: "pointer", backgroundColor: "#22c55e", color: "#fff", border: "none", borderRadius: 5 }}
      >
        Ajouter
      </button>
    </div>
  );
}
