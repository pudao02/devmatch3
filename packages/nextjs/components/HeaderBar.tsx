import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

const HeaderBar: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent): void {
      if (e.clientY <= 20) {
        setVisible(true);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          setVisible(false);
        }, 1000);
      }
    }

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  function handleMouseEnter(): void {
    setVisible(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }

  function handleMouseLeave(): void {
    timeoutRef.current = setTimeout(() => {
      setVisible(false);
    }, 1000);
  }

  function showBarFromIndicator(): void {
    setVisible(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }

  return (
    <>
      {/* Show toolbar indicator */}
      <div
        onMouseEnter={showBarFromIndicator}
        style={{
          position: "fixed",
          top: 0,
          left: "44%",
          transform: "translateX(-50%)",
          width: "60px",
          height: "16px",
          background: "#3a5ca8",
          borderRadius: "0 0 12px 12px",
          boxShadow: "0 2px 8px 0 rgba(58,92,168,0.18)",
          zIndex: 101,
          opacity: 0.85,
          pointerEvents: "auto",
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
        {/* Center: Navigation Buttons */}
        <div style={{ display: "flex", gap: "18px" }}>
          <Link href="/" style={buttonStyle} className="header-button">
            Home
          </Link>
          <Link href="/chat-summaries" style={buttonStyle} className="header-button">
            Chat Summaries
          </Link>
          <Link href="/debug" style={buttonStyle} className="header-button">
            Debug
          </Link>
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
