import React from "react";
import { truncateAddress } from "../../utils/truncateAddress";

export default function TaskList({ tasks, statuses, updateStatus, deleteTask }) {
  return (
    <>
      {statuses.map((status) => (
        <div key={status} style={{ marginBottom: "30px" }}>
          <h2
            style={{
              borderBottom: "2px solid #eee",
              paddingBottom: "5px",
              fontWeight: "600",
              fontSize: "18px",
            }}
          >
            {status}
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {tasks
              .filter((t) => t.status === statuses.indexOf(status))
              .map((task) => (
                <div
                  key={task.id}
                  style={{
                    padding: "15px",
                    borderRadius: "12px",
                    background: "#f9f9f9",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
                    transition: "transform 0.2s",
                    flexWrap: "wrap",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                >
                  {/* Infos tâche */}
                  <div style={{ flex: "1 1 200px", marginRight: "10px" }}>
                    <p style={{ margin: 0, fontWeight: "bold", fontSize: "16px" }}>{task.title}</p>
                    <p style={{ margin: "4px 0", fontSize: "14px", color: "#555" }}>{task.description}</p>
                    <small style={{ color: "#888" }}>Créé par: {truncateAddress(task.creator)}</small>
                    <br />
                    <small style={{ color: "#888" }}>
                      Collaborateurs: {task.collaborators.map(truncateAddress).join(", ")}
                    </small>
                  </div>

                  {/* Boutons d'action */}
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "10px" }}>
                    {statuses.map(
                      (s, i) =>
                        i !== task.status && (
                          <button
                            key={i}
                            onClick={() => updateStatus(task.id, i)}
                            style={{
                              padding: "6px 12px",
                              cursor: "pointer",
                              backgroundColor: "#3b82f6",
                              color: "#fff",
                              border: "none",
                              borderRadius: "8px",
                              fontSize: "13px",
                              fontWeight: "500",
                              transition: "background-color 0.2s",
                            }}
                            onMouseEnter={(e) => (e.target.style.backgroundColor = "#2563eb")}
                            onMouseLeave={(e) => (e.target.style.backgroundColor = "#3b82f6")}
                          >
                            {s}
                          </button>
                        )
                    )}
                    <button
                      onClick={() => deleteTask(task.id)}
                      style={{
                        backgroundColor: "#ef4444",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        padding: "6px 12px",
                        cursor: "pointer",
                        fontSize: "13px",
                        fontWeight: "500",
                        transition: "background-color 0.2s",
                      }}
                      onMouseEnter={(e) => (e.target.style.backgroundColor = "#dc2626")}
                      onMouseLeave={(e) => (e.target.style.backgroundColor = "#ef4444")}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </>
  );
}
