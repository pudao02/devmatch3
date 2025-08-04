"use client";

import React, { useCallback, useEffect, useState } from "react";
import Characters from "./Characters";
import Furniture from "./Furniture";
import { useFrame, useThree } from "@react-three/fiber";

interface FloorProps {
  scale?: [number, number, number];
  gatherAndTalk?: boolean;
}

const useKeyboardControls = () => {
  const [keys, setKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      setKeys(prev => new Set(prev).add(event.key.toLowerCase()));
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      setKeys(prev => {
        const newKeys = new Set(prev);
        newKeys.delete(event.key.toLowerCase());
        return newKeys;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return keys;
};

const KeyboardControls: React.FC = () => {
  const keys = useKeyboardControls();
  const { camera } = useThree();

  useFrame(() => {
    const moveSpeed = 0.1;

    if (keys.has("w")) {
      camera.position.z -= moveSpeed;
    }
    if (keys.has("s")) {
      camera.position.z += moveSpeed;
    }
    if (keys.has("a")) {
      camera.position.x -= moveSpeed;
    }
    if (keys.has("d")) {
      camera.position.x += moveSpeed;
    }
    if (keys.has("q")) {
      camera.position.y += moveSpeed;
    }
    if (keys.has("e")) {
      camera.position.y -= moveSpeed;
    }

    // Keep camera within bounds
    camera.position.x = Math.max(-50, Math.min(50, camera.position.x));
    camera.position.y = Math.max(1, Math.min(20, camera.position.y));
    camera.position.z = Math.max(-50, Math.min(50, camera.position.z));
  });

  return null;
};

// Simplified Room Geometry - just basic floor and walls
const RoomGeometry: React.FC<FloorProps> = ({ scale = [1, 1, 1] }) => {
  return (
    <group scale={scale}>
      {/* Floor - Made longer and wider */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[5, 0, 5]}>
        <planeGeometry args={[50, 40]} />
        <meshStandardMaterial color="#f5f5dc" />
      </mesh>

      {/* Back Wall - Extended to match wider floor */}
      <mesh position={[5, 7.5, -15]}>
        <planeGeometry args={[50, 15]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Side Wall - Extended to match longer floor */}
      <mesh position={[-20, 7.5, 5]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[40, 15]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
};

const Floor: React.FC<FloorProps> = ({ scale = [1, 1, 1], gatherAndTalk = false }) => {
  console.log("Floor gatherAndTalk:", gatherAndTalk);

  const handleFurnitureLoaded = useCallback(() => {
    // Furniture loaded callback
  }, []);

  const handleCharactersLoaded = useCallback(() => {
    // Characters loaded callback
  }, []);

  return (
    <group>
      <KeyboardControls />

      {/* Room Geometry */}
      <RoomGeometry scale={scale} />

      {/* Furniture - loads progressively */}
      <Furniture onLoaded={handleFurnitureLoaded} />

      {/* Characters - loads progressively */}
      <Characters gatherAndTalk={gatherAndTalk} onLoaded={handleCharactersLoaded} />
    </group>
  );
};

export default Floor;
