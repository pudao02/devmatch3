import * as chains from "viem/chains";

export type BaseConfig = {
  targetNetworks: readonly chains.Chain[];
  pollingInterval: number;
  alchemyApiKey: string;
  rpcOverrides?: Record<number, string>;
  walletConnectProjectId: string;
  onlyLocalBurnerWallet: boolean;
};

export type ScaffoldConfig = BaseConfig;

export const DEFAULT_ALCHEMY_API_KEY = "oKxs-03sij-U_N0iOlrSsZFr29-IqbuF";

// Define Sapphire mainnet chain (commented out for now)
// const sapphireMainnet = {
//   id: 23294,
//   name: "Sapphire Mainnet",
//   network: "sapphire-mainnet",
//   nativeCurrency: {
//     decimals: 18,
//     name: "ROSE",
//     symbol: "ROSE",
//   },
//   rpcUrls: {
//     public: { http: ["https://sapphire.oasis.io"] },
//     default: { http: ["https://sapphire.oasis.io"] },
//   },
//   blockExplorers: {
//     default: { name: "Oasis Explorer", url: "https://explorer.oasis.io" },
//   },
// } as const;

// Define Sapphire testnet chain
const sapphireTestnet = {
  id: 23295,
  name: "Sapphire Testnet",
  network: "sapphire-testnet",
  nativeCurrency: {
    decimals: 18,
    name: "TEST ROSE",
    symbol: "TEST ROSE",
  },
  rpcUrls: {
    public: { http: ["https://testnet.sapphire.oasis.dev"] },
    default: { http: ["https://testnet.sapphire.oasis.dev"] },
  },
  blockExplorers: {
    default: { name: "Oasis Testnet Explorer", url: "https://testnet.explorer.oasis.dev" },
  },
} as const;

const scaffoldConfig = {
  // The networks on which your DApp is live
  targetNetworks: [sapphireTestnet], // Back to Sapphire testnet for TEST ROSE testing
  // The interval at which your front-end polls the RPC servers for new data (it has no effect if you only target the local network (default is 4000))
  pollingInterval: 30000,
  // This is ours Alchemy's default API key.
  // You can get your own at https://dashboard.alchemyapi.io
  // It's recommended to store it in an env variable:
  // .env.local for local testing, and in the Vercel/system env config for live apps.
  alchemyApiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || DEFAULT_ALCHEMY_API_KEY,
  // If you want to use a different RPC for a specific network, you can add it here.
  // The key is the chain ID, and the value is the HTTP RPC URL
  rpcOverrides: {
    // Example:
    // [chains.mainnet.id]: "https://mainnet.buidlguidl.com",
  },
  // This is ours WalletConnect's default project ID.
  // You can get your own at https://cloud.walletconnect.com
  // It's recommended to store it in an env variable:
  // .env.local for local testing, and in the Vercel/system env config for live apps.
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "3a8170812b534d0ff9d794f19a901d64",
  onlyLocalBurnerWallet: false,
} as const satisfies ScaffoldConfig;

export default scaffoldConfig;
