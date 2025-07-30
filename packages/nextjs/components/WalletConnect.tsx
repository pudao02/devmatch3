import React from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const WalletConnect: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <div style={{ 
      position: "fixed", 
      top: "20px", 
      right: "20px", 
      zIndex: 1000,
      background: "white",
      padding: "15px",
      borderRadius: "10px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      border: "2px solid #3a5ca8"
    }}>
      <ConnectButton 
        chainStatus="icon"
        showBalance={true}
        accountStatus={{
          smallScreen: 'avatar',
          largeScreen: 'full',
        }}
      />
      
      {isConnected && (
        <div style={{ 
          marginTop: "10px", 
          padding: "8px", 
          background: "#e8f5e8", 
          borderRadius: "5px",
          fontSize: "12px",
          color: "#2e7d32"
        }}>
          ✅ Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
        </div>
      )}
    </div>
  );
};

export default WalletConnect; 