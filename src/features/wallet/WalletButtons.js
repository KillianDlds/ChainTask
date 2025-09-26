export default function WalletButtons({ connectedAddress, connectWallet, disconnectWallet }) {
  return !connectedAddress ? (
    <button
      onClick={connectWallet}
      style={{
        padding: "10px 20px",
        cursor: "pointer",
        backgroundColor: "#22c55e",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        fontWeight: "bold",
        transition: "background-color 0.2s",
      }}
      onMouseEnter={e => e.target.style.backgroundColor = "#16a34a"}
      onMouseLeave={e => e.target.style.backgroundColor = "#22c55e"}
    >
      Connect Wallet
    </button>
  ) : (
    <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
      <p style={{ margin: 0, fontWeight: "500" }}>Wallet: {connectedAddress}</p>
      <button
        onClick={disconnectWallet}
        style={{
          padding: "8px 15px",
          cursor: "pointer",
          backgroundColor: "#ef4444",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          fontWeight: "bold",
          transition: "background-color 0.2s",
        }}
        onMouseEnter={e => e.target.style.backgroundColor = "#dc2626"}
        onMouseLeave={e => e.target.style.backgroundColor = "#ef4444"}
      >
        Déconnexion
      </button>
    </div>
  );
}
