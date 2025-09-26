export default function TaskForm({ newTitle, setNewTitle, newDescription, setNewDescription, addTask }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "15px", margin: "25px 0" }}>
      <input
        type="text"
        placeholder="Titre..."
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        style={{
          padding: "12px",
          fontSize: "16px",
          borderRadius: "10px",
          border: "1px solid #ddd",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
        }}
      />
      <textarea
        placeholder="Description..."
        value={newDescription}
        onChange={(e) => setNewDescription(e.target.value)}
        style={{
          padding: "12px",
          fontSize: "16px",
          borderRadius: "10px",
          border: "1px solid #ddd",
          minHeight: "100px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
        }}
      />
      <button
        onClick={addTask}
        style={{
          padding: "12px 20px",
          cursor: "pointer",
          backgroundColor: "#22c55e",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          fontWeight: "bold",
          fontSize: "16px",
          transition: "background-color 0.2s"
        }}
        onMouseEnter={e => e.target.style.backgroundColor = "#16a34a"}
        onMouseLeave={e => e.target.style.backgroundColor = "#22c55e"}
      >
        Ajouter
      </button>
    </div>
  );
}
