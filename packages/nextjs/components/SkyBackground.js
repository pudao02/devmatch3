"use client";
import { useEffect, useState } from "react";

// Helper for random cloud animation duration and delay
function random(min, max) {
  return Math.random() * (max - min) + min
}

export default function SkyBackground(props) {
  const [clouds, setClouds] = useState([]);

  useEffect(() => {
    // Only runs on the client
    const generatedClouds = Array.from({ length: 5 }).map((_, i) => ({
      id: i,
      scale: Math.random() + 0.5,
      // ...other random properties if needed
    }));
    setClouds(generatedClouds);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      zIndex: 0,
      left: 0,
      top: 0,
      width: '100vw',
      height: '100vh',
      pointerEvents: 'none',
      background: 'linear-gradient(to bottom, #b3e0ff 0%, #e3f0fd 100%)',
      overflow: 'hidden',
    }}>
      {clouds.map(cloud => (
        <svg
          key={cloud.id}
          width={180 * cloud.scale}
          height={80 * cloud.scale}
          viewBox="0 0 180 80"
          style={{
            position: 'absolute',
            top: cloud.top,
            left: '-200px',
            opacity: cloud.opacity,
            transform: `scale(${cloud.scale})`,
            animation: `cloud-move-${cloud.id} ${cloud.duration}s linear ${cloud.delay}s infinite`,
          }}
        >
          <ellipse cx="60" cy="40" rx="50" ry="25" fill="#fff" />
          <ellipse cx="110" cy="35" rx="30" ry="20" fill="#fff" />
          <ellipse cx="140" cy="50" rx="20" ry="15" fill="#fff" />
        </svg>
      ))}
      <style>{`
        ${clouds.map(cloud => `
          @keyframes cloud-move-${cloud.id} {
            0% { left: -200px; }
            100% { left: 110vw; }
          }
        `).join('\n')}
      `}</style>
    </div>
  )
} 