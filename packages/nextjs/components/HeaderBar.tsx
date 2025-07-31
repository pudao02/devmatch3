"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAccount } from "wagmi";

const HeaderBar: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [hovering, setHovering] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);
  const HIDE_DELAY = 150; // ms

  // Wagmi hooks
  const { address, isConnected } = useAccount();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleConnect = async () => {
    console.log("Header Connect Wallet button clicked");
    // For now, just show a message - the main wallet connection is in SimpleWalletConnect
    alert("Please use the wallet connection in the main interface below.");
  };

  // const handleDisconnect = () => {
  //   // Disconnect functionality removed - use SimpleWalletConnect instead
  // };

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

  // Don't render wallet state until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <>
        {/* Indicator Tab */}
        <div
          onMouseEnter={showBarFromIndicator}
          onClick={showBarFromIndicator}
          style={{
            position: "fixed",
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
            <button
              style={{
                ...buttonStyle,
                background: "#ffe08a",
                color: "#22334d",
                border: "2px solid #3a5ca8",
                fontWeight: "bold",
                padding: "10px 26px",
              }}
            >
              Connect Wallet
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Indicator Tab */}
      <div
        onMouseEnter={showBarFromIndicator}
        onClick={showBarFromIndicator}
        style={{
          position: "fixed",
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
              style={{
                ...buttonStyle,
                background: "#ffe08a",
                color: "#22334d",
                border: "2px solid #3a5ca8",
                fontWeight: "bold",
                padding: "10px 26px",
                cursor: "pointer",
              }}
            >
              Connect Wallet
            </button>
          ) : (
            <div style={{
              ...buttonStyle,
              background: "#28a745",
              color: "#fff",
              border: "2px solid #28a745",
              fontWeight: "bold",
              padding: "10px 26px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <span>✅</span>
              <span>{address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Connected"}</span>
            </div>
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
