import React, { useState } from "react";
import { truncateAddress } from "../../utils/truncateAddress";
import TaskModal from "./TaskModal";

export default function TaskList({
  tasks,
  statuses,
  updateStatus,
  deleteTask,
  connectedAddress,
  updateTask,
}) {
  const connected = connectedAddress?.toLowerCase();
  const [selectedTask, setSelectedTask] = useState(null);

  return (
    <>
      {}
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onSave={updateTask}
        />
      )}

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
              .map((task) => {
                const collaborators = task.collaborators || [];

                const isAuthorized =
                  task.creator.toLowerCase() === connected ||
                  collaborators.map((c) => c.toLowerCase()).includes(connected);

                return (
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
                      flexWrap: "wrap",
                      cursor: isAuthorized ? "pointer" : "default", 
                    }}
                    onClick={() => {
                      console.log("Click détecté sur tâche:", task.id); 
                      if (isAuthorized) {
                        setSelectedTask(task);
                      }
                    }}
                  >
                    <div style={{ flex: "1 1 200px", marginRight: "10px" }}>
                      <p style={{ margin: 0, fontWeight: "bold", fontSize: "16px" }}>
                        {task.title}
                      </p>
                      <p style={{ margin: "4px 0", fontSize: "14px", color: "#555" }}>
                        {task.description}
                      </p>
                      <small style={{ color: "#888" }}>
                        Créé par: {truncateAddress(task.creator)}
                      </small>
                      <br />
                      <small style={{ color: "#888" }}>
                        Collaborateurs:{" "}
                        {collaborators.length
                          ? collaborators.map(truncateAddress).join(", ")
                          : "Aucun"}
                      </small>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "6px",
                        flexWrap: "wrap",
                        marginTop: "10px",
                      }}
                    >
                      {isAuthorized ? (
                        <>
                          {statuses.map(
                            (s, i) =>
                              i !== task.status && (
                                <button
                                  key={i}
                                  onClick={(e) => {
                                    e.stopPropagation(); 
                                    updateStatus(task.id, i);
                                  }}
                                  style={{
                                    padding: "6px 12px",
                                    cursor: "pointer",
                                    backgroundColor: "#3b82f6",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "8px",
                                    fontSize: "13px",
                                    fontWeight: "500",
                                  }}
                                >
                                  {s}
                                </button>
                              )
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); 
                              deleteTask(task.id);
                            }}
                            style={{
                              backgroundColor: "#ef4444",
                              color: "#fff",
                              border: "none",
                              borderRadius: "8px",
                              padding: "6px 12px",
                              cursor: "pointer",
                              fontSize: "13px",
                              fontWeight: "500",
                            }}
                          >
                            Supprimer
                          </button>
                        </>
                      ) : (
                        <span style={{ color: "#aaa", fontStyle: "italic" }}>
                          Lecture seule
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      ))}
    </>
  );
}
