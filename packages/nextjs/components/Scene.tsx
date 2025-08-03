"use client";

import React, { Suspense, useEffect, useState } from "react";
import Floor from "./Floor";
import { Environment, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

interface SceneProps {
  gatherAndTalk?: boolean;
}

export default function Scene({ gatherAndTalk = false }: SceneProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    // Simulate progressive loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Update loading progress
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#000",
          color: "#fff",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <div style={{ fontSize: "24px", fontWeight: "bold" }}>Loading 3D Scene...</div>
        <div style={{ width: "300px", height: "4px", background: "#333", borderRadius: "2px", overflow: "hidden" }}>
          <div
            style={{
              width: `${loadingProgress}%`,
              height: "100%",
              background: "#4CAF50",
              transition: "width 0.2s ease",
            }}
          />
        </div>
        <div style={{ fontSize: "14px" }}>{loadingProgress}%</div>
      </div>
    );
  }

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas shadows>
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />

        <Suspense fallback={null}>
          <Floor gatherAndTalk={gatherAndTalk} />
        </Suspense>

        <PerspectiveCamera makeDefault position={[10, 10, 10]} />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} minDistance={5} maxDistance={50} />
        <Environment preset="apartment" />
      </Canvas>
    </div>
  );
}
