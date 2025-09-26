import React, { useState, useEffect } from "react";

export default function TaskModal({ task, onClose, onSave }) {
    const [title, setTitle] = useState(task.title || "");
    const [description, setDescription] = useState(task.description || "");
    const [collaborators, setCollaborators] = useState((task.collaborators || []).join(","));
    const [status, setStatus] = useState(task.status || 0);


    useEffect(() => {
        setTitle(task.title);
        setDescription(task.description);
        setCollaborators((task.collaborators || []).join(","));
        setStatus(task.status);
    }, [task]);

    const handleSave = () => {
        const collaboratorsArray = collaborators
            .split(",")
            .map(addr => addr.trim())
            .filter(addr => addr);

        onSave({ ...task, title, description, collaborators: collaboratorsArray, status });
        onClose();
    };

    return (
        <div
            onClick={onClose} // ✅ click extérieur ferme la popup
            style={{
                position: "fixed",
                top: 0, left: 0, width: "100%", height: "100%",
                backgroundColor: "rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
                animation: "fadeIn 0.2s ease-in-out"
            }}
        >
            {/* STOP la propagation pour garder la popup ouverte si on clique dedans */}
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    background: "#fff",
                    padding: "25px",
                    borderRadius: "12px",
                    width: "420px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
                    animation: "scaleIn 0.2s ease-in-out"
                }}
            >
                <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "600", color: "#1f2937" }}>
                    Modifier la tâche
                </h2>

                <label style={{ fontSize: "14px", fontWeight: "500", color: "#374151" }}>Titre</label>
                <input
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Titre"
                    style={{
                        padding: "8px",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                        fontSize: "14px"
                    }}
                />

                <label style={{ fontSize: "14px", fontWeight: "500", color: "#374151" }}>Description</label>
                <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Description"
                    style={{
                        padding: "8px",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                        fontSize: "14px",
                        resize: "vertical",
                        minHeight: "80px"
                    }}
                />

                <label style={{ fontSize: "14px", fontWeight: "500", color: "#374151" }}>Collaborateurs</label>
                <input
                    value={collaborators}
                    onChange={e => setCollaborators(e.target.value)}
                    placeholder="0x123...,0x456..."
                    style={{
                        padding: "8px",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                        fontSize: "14px"
                    }}
                />

                <label style={{ fontSize: "14px", fontWeight: "500", color: "#374151" }}>Statut</label>
                <select
                    value={status}
                    onChange={e => setStatus(Number(e.target.value))}
                    style={{
                        padding: "8px",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                        fontSize: "14px"
                    }}
                >
                    <option value={0}>À faire</option>
                    <option value={1}>En cours</option>
                    <option value={2}>Terminé</option>
                </select>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "15px" }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: "8px 14px",
                            cursor: "pointer",
                            borderRadius: "8px",
                            border: "1px solid #ddd",
                            backgroundColor: "#f3f4f6",
                            fontWeight: "500"
                        }}
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleSave}
                        style={{
                            padding: "8px 14px",
                            cursor: "pointer",
                            borderRadius: "8px",
                            backgroundColor: "#22c55e",
                            color: "#fff",
                            fontWeight: "600",
                            border: "none"
                        }}
                    >
                        Sauvegarder
                    </button>
                </div>
            </div>
        </div>
    );
}
