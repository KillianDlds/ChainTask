export default function NetworkSelector({ selectedNetwork, switchNetwork }) {
  return (
    <div style={{ marginBottom: "25px", display: "flex", alignItems: "center", gap: "10px" }}>
      <label htmlFor="network-select" style={{ fontWeight: "500" }}>Réseau:</label>
      <select
        id="network-select"
        value={selectedNetwork}
        onChange={e => switchNetwork(e.target.value)}
        style={{
          padding: "8px 12px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          fontSize: "16px",
          cursor: "pointer"
        }}
      >
        <option value="base">Base Sepolia</option>
        <option value="celo">Celo Sepolia</option>
        <option value="celoMainnet">Celo Mainnet</option>
      </select>
    </div>
  );
}
