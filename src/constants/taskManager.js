export const TASK_MANAGER_ADDRESSES = {
  base: "0xc5c09c5a5052decc8af4e7c6a6f6f448e3d4a16c",
  celo: "0x697f81ae267944d6eaafb5084a3ebd8f45fc7635", //        0x92144ED262b25B77499D7c11209755354EdB9dfC
  celoMainnet: "0xf59db5d2e66436759a02bf4396ECCB1866C2bFfd", 
};

export const TASK_MANAGER_ABI = [
  "function addTask(string _title, string _description, address[] _collaborators) public",
  "function updateTaskStatus(uint256 _id, uint8 _status) public",
  "function deleteTask(uint256 _id) public",
  "function getTask(uint256 _id) view returns (uint256, string, string, address, address[], uint8)",
  "function getTaskIds() view returns (uint256[])",
];

