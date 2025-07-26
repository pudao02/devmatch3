import React, { useRef } from "react";
import { useFBX } from "@react-three/drei";
import { Group } from "three";

interface CharacterProps {
  modelPath: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

const Character: React.FC<CharacterProps> = ({ modelPath, position, rotation = [0, 0, 0], scale = 1 }) => {
  const characterRef = useRef<Group>(null);

  try {
    const fbx = useFBX(modelPath);

    return (
      <group ref={characterRef} position={position} rotation={rotation} scale={[scale, scale, scale]}>
        <primitive object={fbx} />
      </group>
    );
  } catch (error) {
    console.warn(`Failed to load character model: ${modelPath}`, error);
    // Return a simple placeholder box if model fails to load
    return (
      <group position={position} rotation={rotation} scale={[scale * 100, scale * 100, scale * 100]}>
        <mesh>
          <boxGeometry args={[1, 2, 0.5]} />
          <meshStandardMaterial color="orange" />
        </mesh>
      </group>
    );
  }
};

export default Character;
