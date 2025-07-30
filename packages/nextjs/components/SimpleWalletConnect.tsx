"use client";

import React, { useState } from "react";
import { useAccount, useConnect, useDisconnect, useBalance, useChainId, useSwitchChain } from "wagmi";
import { injected } from "wagmi/connectors";

const SimpleWalletConnect: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const [isConnecting, setIsConnecting] = useState(false);
  
  const { data: balance } = useBalance({
    address: address,
  });

  const testButton = () => {
    console.log("Test button clicked!");
    alert("Test button works! Component is rendering properly.");
  };

  const handleConnect = async () => {
    console.log("Connect button clicked - Direct MetaMask approach");
    setIsConnecting(true);
    
    try {
      // Direct MetaMask connection
      if (typeof window !== 'undefined' && window.ethereum) {
        console.log("MetaMask detected, requesting accounts...");
        
        // Request accounts directly from MetaMask
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        
        console.log("Accounts received:", accounts);
        
        if (accounts && accounts.length > 0) {
          console.log("Successfully connected to MetaMask!");
          alert(`Connected to MetaMask! Address: ${accounts[0]}`);
          
          // Now try to connect with wagmi
          try {
            const connector = injected();
            await connect({ connector });
            console.log("Wagmi connection successful");
          } catch (wagmiError) {
            console.error("Wagmi connection failed:", wagmiError);
          }
        }
      } else {
        console.error("MetaMask not found");
        alert("MetaMask not found! Please install MetaMask extension.");
      }
    } catch (error) {
      console.error("Failed to connect:", error);
      alert("Failed to connect to MetaMask. Please make sure MetaMask is installed and unlocked.");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const handleSwitchToSapphire = () => {
    if (switchChain) {
      switchChain({ chainId: 23295 }); // Sapphire testnet chain ID
    }
  };

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
      border: "2px solid #3a5ca8",
      maxWidth: "300px"
    }}>
      {!isConnected ? (
        <div>
          <button
            onClick={handleConnect}
            disabled={isConnecting || isPending}
            style={{
              background: "#3a5ca8",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: (isConnecting || isPending) ? "not-allowed" : "pointer",
              fontSize: "14px",
              fontWeight: "bold",
              opacity: (isConnecting || isPending) ? 0.7 : 1,
              width: "100%",
              marginBottom: "10px"
            }}
          >
            {(isConnecting || isPending) ? "Connecting..." : "Connect MetaMask"}
          </button>
          
          {/* Test Button */}
          <button
            onClick={testButton}
            style={{
              background: "#28a745",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "12px",
              width: "100%",
              marginBottom: "10px"
            }}
          >
            🧪 Test Button (Click Me!)
          </button>
          
          {/* Testing Wallet Info */}
          <div style={{ 
            padding: "10px", 
            background: "#e3f2fd", 
            borderRadius: "5px",
            fontSize: "11px",
            color: "#1565c0",
            border: "1px solid #bbdefb"
          }}>
            <strong>Testing Wallet:</strong><br/>
            <code style={{ fontSize: "10px", wordBreak: "break-all" }}>
              0xfE04249705eaa696e7c6fcAEE20aFf8a9C360F67
            </code><br/>
            <a 
              href="https://faucet.sapphire.oasis.io/" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: "#1565c0", textDecoration: "underline", fontSize: "10px" }}
            >
              Get TEST ROSE →
            </a>
          </div>
        </div>
      ) : (
        <div>
          <div style={{ 
            marginBottom: "10px", 
            padding: "8px", 
            background: "#e8f5e8", 
            borderRadius: "5px",
            fontSize: "12px",
            color: "#2e7d32"
          }}>
            ✅ Connected: {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Loading..."}
          </div>
          
          {/* Network Information */}
          <div style={{ 
            marginBottom: "10px", 
            padding: "8px", 
            background: chainId === 23295 ? "#e8f5e8" : "#fff3cd", 
            borderRadius: "5px",
            fontSize: "12px",
            color: chainId === 23295 ? "#2e7d32" : "#856404",
            border: `1px solid ${chainId === 23295 ? "#c8e6c9" : "#ffeaa7"}`
          }}>
            🌐 Network: {chainId === 23295 ? "Sapphire Testnet" : "Unknown"} (ID: {chainId})
            {chainId !== 23295 && (
              <div style={{ marginTop: "8px" }}>
                <button
                  onClick={handleSwitchToSapphire}
                  disabled={isSwitching}
                  style={{
                    background: "#3a5ca8",
                    color: "white",
                    border: "none",
                    padding: "4px 8px",
                    borderRadius: "3px",
                    cursor: isSwitching ? "not-allowed" : "pointer",
                    fontSize: "10px",
                    marginRight: "8px"
                  }}
                >
                  {isSwitching ? "Switching..." : "Switch to Sapphire"}
                </button>
                <div style={{ fontSize: "10px", marginTop: "4px" }}>
                  Or add Sapphire Testnet to MetaMask manually:
                  <br/>
                  <strong>Network Name:</strong> Sapphire Testnet
                  <br/>
                  <strong>RPC URL:</strong> https://testnet.sapphire.oasis.io
                  <br/>
                  <strong>Chain ID:</strong> 23295
                  <br/>
                  <strong>Currency:</strong> TEST ROSE
                </div>
              </div>
            )}
          </div>
          
          {/* Show full address */}
          {address && (
            <div style={{ 
              marginBottom: "10px", 
              padding: "8px", 
              background: "#f0f8ff", 
              borderRadius: "5px",
              fontSize: "10px",
              color: "#0066cc",
              border: "1px solid #b3d9ff",
              wordBreak: "break-all"
            }}>
              <strong>Full Address:</strong><br/>
              {address}
            </div>
          )}
          
          {/* TEST ROSE Balance Display */}
          <div style={{ 
            marginBottom: "10px", 
            padding: "8px", 
            background: "#fff3cd", 
            borderRadius: "5px",
            fontSize: "12px",
            color: "#856404",
            border: "1px solid #ffeaa7"
          }}>
            💎 TEST ROSE Balance: {balance ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : "Loading..."}
          </div>
          
          {balance && parseFloat(balance.formatted) < 0.01 && (
            <div style={{ 
              marginBottom: "10px", 
              padding: "8px", 
              background: "#f8d7da", 
              borderRadius: "5px",
              fontSize: "11px",
              color: "#721c24",
              border: "1px solid #f5c6cb"
            }}>
              ⚠️ Low balance! Get TEST ROSE from: <a href="https://faucet.sapphire.oasis.io/" target="_blank" rel="noopener noreferrer" style={{color: "#721c24", textDecoration: "underline"}}>Sapphire Faucet</a>
            </div>
          )}
          
          <button
            onClick={handleDisconnect}
            style={{
              background: "#dc3545",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "12px"
            }}
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
};

export default SimpleWalletConnect; 