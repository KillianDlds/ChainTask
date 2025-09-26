import React from "react";

export default function TaskForm({
  newTitle,
  setNewTitle,
  newDescription,
  setNewDescription,
  collaborators,
  setCollaborators,
  addTask
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "20px 0" }}>
      <input
        type="text"
        placeholder="Titre..."
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        style={{ padding: 10, fontSize: 16, borderRadius: 5, border: "1px solid #ccc" }}
      />
      <textarea
        placeholder="Description..."
        value={newDescription}
        onChange={(e) => setNewDescription(e.target.value)}
        style={{ padding: 10, fontSize: 16, borderRadius: 5, border: "1px solid #ccc", minHeight: 80 }}
      />
      <input
        type="text"
        placeholder="Collaborateurs (0x..., séparés par des virgules)"
        value={collaborators}
        onChange={(e) => setCollaborators(e.target.value)}
        style={{ padding: 10, borderRadius: 5, border: "1px solid #ccc" }}
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
  );
}
