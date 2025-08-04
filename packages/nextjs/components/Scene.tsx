"use client";

import React, { Suspense, useEffect, useState } from "react";
<<<<<<< HEAD
import Character from "./Character";
import { Environment, OrbitControls, PerspectiveCamera, useFBX } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

interface LazyModelProps {
  Component: React.ComponentType<any>;
  props: {
    modelPath?: string;
    position?: number[];
    rotation?: number[];
    scale?: number;
    [key: string]: any;
  };
  onLoaded?: () => void;
}

function LazyModel({ Component, props, onLoaded }: LazyModelProps) {
  // Always call the hook, but conditionally pass the modelPath
  const modelPath = props.modelPath && props.modelPath.endsWith(".fbx") ? props.modelPath : undefined;
  const model = useFBX(modelPath as string);
  const loaded = !!model;

  useEffect(() => {
    if (onLoaded && loaded) onLoaded();
  }, [onLoaded, loaded]);

  if (model) {
    return <primitive object={model} {...props} />;
  }
  // Pass all props to the Component, including speechBubblePath
  return <Component {...props} />;
}

const characterModels = [
  {
    Component: Character,
    props: {
      modelPath: "/models/characters/Casual_Male.fbx",
      animationPath: "/models/characters/animations/WalkingForCasualMale.fbx",
      idleAnimationPath: "/models/characters/animations/IdleCasualMale.fbx",
      talkingAnimationPath: "/models/characters/animations/TalkingForCasualMale.fbx",
      speechBubblePath: "/models/characters/speechbubble1.fbx",
      position: [0, 0.5, 0],
      rotation: [0, Math.PI / 4, 0],
      scale: 0.01,
    },
  },
  {
    Component: Character,
    props: {
      modelPath: "/models/characters/Casual_Female.fbx",
      animationPath: "/models/characters/animations/WalkingForCasualFemale.fbx",
      idleAnimationPath: "/models/characters/animations/IdleCasualFemale.fbx",
      talkingAnimationPath: "/models/characters/animations/TalkingForCasualFemale.fbx",
      speechBubblePath: "/models/characters/speechbubble2.fbx",
      position: [3, 0.5, 0],
      rotation: [0, -Math.PI / 4, 0],
      scale: 0.01,
    },
  },
  {
    Component: Character,
    props: {
      modelPath: "/models/characters/Casual2_Male.fbx",
      animationPath: "/models/characters/animations/WalkingForCasualMale.fbx",
      idleAnimationPath: "/models/characters/animations/IdleCasualMale.fbx",
      talkingAnimationPath: "/models/characters/animations/TalkingForCasualMale.fbx",
      speechBubblePath: "/models/characters/speechbubble1.fbx",
      position: [-3, 0.5, 0],
      rotation: [0, Math.PI / 2, 0],
      scale: 0.01,
    },
  },
  {
    Component: Character,
    props: {
      modelPath: "/models/characters/Casual3_Female.fbx",
      animationPath: "/models/characters/animations/WalkingForCasualFemale3.fbx",
      idleAnimationPath: "/models/characters/animations/IdleCasualFemale3.fbx",
      talkingAnimationPath: "/models/characters/animations/TalkingForCasualFemale3.fbx",
      speechBubblePath: "/models/characters/speechbubble3.fbx",
      position: [0, 0.5, 3],
      rotation: [0, -Math.PI / 2, 0],
      scale: 0.01,
    },
  },
];

export default function Scene() {
  const [charactersToShow, setCharactersToShow] = useState(0);

  // Sequential loading for characters
  const handleCharacterLoaded = () => setCharactersToShow(charactersToShow + 1);
=======
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
>>>>>>> origin/mark

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas shadows>
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />

        <Suspense fallback={null}>
<<<<<<< HEAD
          {characterModels.slice(0, charactersToShow + 1).map(({ Component, props }, i) => (
            <LazyModel key={i} Component={Component} props={props} onLoaded={handleCharacterLoaded} />
          ))}
=======
          <Floor gatherAndTalk={gatherAndTalk} />
>>>>>>> origin/mark
        </Suspense>

        <PerspectiveCamera makeDefault position={[10, 10, 10]} />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} minDistance={5} maxDistance={50} />
        <Environment preset="apartment" />
      </Canvas>
    </div>
  );
}
