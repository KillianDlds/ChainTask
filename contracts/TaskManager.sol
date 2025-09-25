// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract TaskManager {
    uint256 public taskCount;

    struct Task {
        uint256 id;
        string title;
        string description;
        address creator;
        uint8 status; // 0 = À faire, 1 = En cours, 2 = Terminé
    }

    mapping(uint256 => Task) public tasks;

    event TaskAdded(uint256 indexed id, string title, string description, address indexed creator, uint8 status);
    event TaskStatusUpdated(uint256 indexed id, uint8 status);
    event TaskDeleted(uint256 indexed id);

    // Ajouter une tâche
    function addTask(string memory _title, string memory _description) public {
        taskCount++;
        tasks[taskCount] = Task(taskCount, _title, _description, msg.sender, 0);
        emit TaskAdded(taskCount, _title, _description, msg.sender, 0);
    }

    // Récupérer une tâche par ID
    function getTask(uint256 _id) public view returns (
        uint256 id,
        string memory title,
        string memory description,
        address creator,
        uint8 status
    ) {
        Task memory t = tasks[_id];
        return (t.id, t.title, t.description, t.creator, t.status);
    }

    // Récupérer tous les IDs de tâches
    function getTaskIds() public view returns (uint256[] memory) {
        uint256[] memory ids = new uint256[](taskCount);
        for (uint256 i = 0; i < taskCount; i++) {
            ids[i] = i + 1;
        }
        return ids;
    }

    // Mettre à jour le statut
    function updateTaskStatus(uint256 _id, uint8 _status) public {
        require(_id > 0 && _id <= taskCount, "Task inexistante");
        require(msg.sender == tasks[_id].creator, "Pas ton task !");
        tasks[_id].status = _status;
        emit TaskStatusUpdated(_id, _status);
    }

    // Supprimer une tâche
    function deleteTask(uint256 _id) public {
        require(_id > 0 && _id <= taskCount, "Task inexistante");
        require(msg.sender == tasks[_id].creator, "Pas ton task !");
        delete tasks[_id];
        emit TaskDeleted(_id);
    }
}
