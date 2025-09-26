export const BASE_CHAIN_ID = "0x14a34";
export const CELO_CHAIN_ID = "0xAA044C";
export const CELO_MAINNET_CHAIN_ID = "0xa4ec";

export const BASE_PARAMS = {
  chainId: BASE_CHAIN_ID,
  chainName: "Base Sepolia Testnet",
  nativeCurrency: { name: "Ethereum", symbol: "ETH", decimals: 18 },
  rpcUrls: ["https://sepolia.base.org"],
  blockExplorerUrls: ["https://sepolia.basescan.org"],
};

export const CELO_PARAMS = {
  chainId: CELO_CHAIN_ID,
  chainName: "Celo Sepolia Testnet",
  nativeCurrency: { name: "Celo", symbol: "CELO", decimals: 18 },
  rpcUrls: ["https://forno.celo-sepolia.celo-testnet.org/"],
  blockExplorerUrls: ["https://celoscan.io"],
};

export const CELO_MAINNET_PARAMS = {
  chainId: CELO_MAINNET_CHAIN_ID,
  chainName: "Celo Mainnet",
  nativeCurrency: { name: "Celo", symbol: "CELO", decimals: 18 },
  rpcUrls: ["https://forno.celo.org"],
  blockExplorerUrls: ["https://celoscan.io"],
};
