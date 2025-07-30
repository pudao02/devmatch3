"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";

const HeaderBar: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [hovering, setHovering] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);
  const HIDE_DELAY = 150; // ms

  // Wagmi hooks
  const { address, isConnected } = useAccount();
  const { connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  const handleConnect = async () => {
    console.log("Header Connect Wallet button clicked");
    setIsConnecting(true);
    try {
      // Direct MetaMask connection
      if (typeof window !== "undefined" && window.ethereum) {
        console.log("MetaMask detected, requesting accounts...");

        // Request accounts directly from MetaMask
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
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

  useEffect(() => {
    function handleMouseMove(e: MouseEvent): void {
      if (e.clientY < 24) {
        if (hideTimeout.current) clearTimeout(hideTimeout.current);
        setVisible(true);
      } else if (!hovering) {
        if (hideTimeout.current) clearTimeout(hideTimeout.current);
        hideTimeout.current = setTimeout(() => setVisible(false), HIDE_DELAY);
      }
    }
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    };
  }, [hovering]);

  function handleMouseEnter(): void {
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    setHovering(true);
    setVisible(true);
  }
  function handleMouseLeave(): void {
    setHovering(false);
    hideTimeout.current = setTimeout(() => setVisible(false), HIDE_DELAY);
  }

  // Indicator tab logic
  function showBarFromIndicator(): void {
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    setVisible(true);
  }

  return (
    <>
      {/* Indicator Tab */}
      <div
        onMouseEnter={showBarFromIndicator}
        onClick={showBarFromIndicator}
        style={{
          position: "fixed", // Changed from absolute
          top: 0,
          left: "44%",
          transform: "translateX(-50%)",
          width: 60,
          height: 16,
          background: "#3a5ca8",
          borderRadius: "0 0 12px 12px",
          boxShadow: "0 2px 8px 0 rgba(58,92,168,0.18)",
          zIndex: 101,
          opacity: visible ? 0 : 0.85,
          pointerEvents: visible ? "none" : "auto",
          transition: "opacity 0.25s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
        title="Show toolbar"
      >
        <div style={{ width: 24, height: 4, background: "#fff", borderRadius: 2, marginTop: 6 }} />
      </div>
      {/* Toolbar */}
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          position: "absolute",
          top: visible ? "16px" : "-80px",
          left: "44%",
          transform: "translateX(-50%)",
          width: "80vw",
          maxWidth: "900px",
          minWidth: "340px",
          height: "64px",
          zIndex: 100,
          background: "#e3f0fd",
          border: "3px solid #3a5ca8",
          borderRadius: "18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 32px",
          fontFamily: '"Comic Sans MS", "Comic Sans", "Chalkboard SE", "monospace", sans-serif',
          boxShadow: "0 8px 32px 0 rgba(58,92,168,0.18), 0 4px 0 #3a5ca8",
          backdropFilter: "blur(2px)",
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? "auto" : "none",
          transition: "top 0.35s cubic-bezier(.4,1.6,.4,1), opacity 0.25s",
        }}
      >
        {/* Left: Logo and Team Name */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              width: 40,
              height: 40,
              background: "#3a5ca8",
              borderRadius: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: "bold",
              fontSize: 22,
              boxShadow: "2px 3px 0 #b3d1f7",
            }}
          >
            {/* Replace with your logo image if you have one */}
            <span>🌤️</span>
          </div>
          <span style={{ fontWeight: "bold", fontSize: 22, color: "#3a5ca8", letterSpacing: 1 }}>TeamName</span>
        </div>
        {/* Center: 3 Buttons */}
        <div style={{ display: "flex", gap: "18px" }}>
          <button style={buttonStyle}>Button 1</button>
          <button style={buttonStyle}>Button 2</button>
          <button style={buttonStyle}>Button 3</button>
        </div>
        {/* Right: Connect Wallet */}
        <div>
          {!isConnected ? (
            <button
              onClick={handleConnect}
              disabled={isConnecting || isPending}
              style={{
                ...buttonStyle,
                background: "#ffe08a",
                color: "#22334d",
                border: "2px solid #3a5ca8",
                fontWeight: "bold",
                padding: "10px 26px",
                opacity: isConnecting || isPending ? 0.7 : 1,
                cursor: isConnecting || isPending ? "not-allowed" : "pointer",
              }}
            >
              {isConnecting || isPending ? "Connecting..." : "Connect Wallet"}
            </button>
          ) : (
            <button
              onClick={handleDisconnect}
              style={{
                ...buttonStyle,
                background: "#dc3545",
                color: "#fff",
                border: "2px solid #dc3545",
                fontWeight: "bold",
                padding: "10px 26px",
              }}
            >
              Disconnect
            </button>
          )}
        </div>
      </div>
    </>
  );
};

const buttonStyle: React.CSSProperties = {
  background: "#f5faff",
  color: "#3a5ca8",
  border: "2px solid #3a5ca8",
  borderRadius: "10px",
  fontFamily: "inherit",
  fontSize: "16px",
  fontWeight: "bold",
  padding: "10px 22px",
  cursor: "pointer",
  boxShadow: "2px 3px 0 #b3d1f7",
  transition: "background 0.2s",
};

export default HeaderBar;
