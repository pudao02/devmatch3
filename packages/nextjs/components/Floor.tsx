import React, { Suspense, useEffect, useRef, useState } from "react";
import Character from "./Character";
import { Environment, OrbitControls, PerspectiveCamera, useFBX, useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Group, Vector3 } from "three";

interface FloorProps {
  scale?: [number, number, number];
}

interface ModelProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number] | number;
}

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

// Keyboard controls hook
const useKeyboardControls = () => {
  const { camera } = useThree();
  const keys = useRef({
    w: false,
    a: false,
    s: false,
    d: false,
    q: false, // up
    e: false, // down
  });

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (key in keys.current) {
        keys.current[key as keyof typeof keys.current] = true;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (key in keys.current) {
        keys.current[key as keyof typeof keys.current] = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useFrame(() => {
    const speed = 0.5;
    const direction = new Vector3();

    if (keys.current.w) {
      direction.z -= speed; // Forward
    }
    if (keys.current.s) {
      direction.z += speed; // Backward
    }
    if (keys.current.a) {
      direction.x -= speed; // Left
    }
    if (keys.current.d) {
      direction.x += speed; // Right
    }
    if (keys.current.q) {
      direction.y += speed; // Up
    }
    if (keys.current.e) {
      direction.y -= speed; // Down
    }

    // Apply rotation to direction vector
    direction.applyQuaternion(camera.quaternion);
    camera.position.add(direction);
  });
};

// Keyboard Controls Component
const KeyboardControls: React.FC = () => {
  useKeyboardControls();
  return null;
};

// Character LazyModel component
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
  return <Component {...props} />;
}

// Character models array
const characterModels = [
  {
    Component: Character,
    props: {
      modelPath: "/models/characters/Casual_Male.fbx",
      position: [-10, 0, -5],
      rotation: [0, Math.PI / 4, 0],
      scale: 0.01,
    },
  },
  {
    Component: Character,
    props: {
      modelPath: "/models/characters/Casual_Female.fbx",
      position: [5, 0, -8],
      rotation: [0, -Math.PI / 4, 0],
      scale: 0.01,
    },
  },
  {
    Component: Character,
    props: {
      modelPath: "/models/characters/Casual2_Male.fbx",
      position: [8, 0, 2],
      rotation: [0, Math.PI / 2, 0],
      scale: 0.01,
    },
  },
  {
    Component: Character,
    props: {
      modelPath: "/models/characters/Casual3_Female.fbx",
      position: [-2, 0, 5],
      rotation: [0, -Math.PI / 2, 0],
      scale: 0.01,
    },
  },
];

// Furniture Models
const TableModel: React.FC<ModelProps> = props => {
  const { scene } = useGLTF("/models/furnitures/table.glb");
  return <primitive object={scene} position={[0, 0, 0]} scale={[0.8, 0.8, 0.8]} {...props} />;
};

const RugModel: React.FC<ModelProps> = props => {
  const { scene } = useGLTF("/models/furnitures/rugRounded.glb");
  return <primitive object={scene} position={[1.5, 0.01, 1.5]} scale={[1, 1, 1]} {...props} />;
};

const PlantModel: React.FC<ModelProps> = props => {
  const { scene } = useGLTF("/models/furnitures/plantSmall1.glb");
  return <primitive object={scene} position={[5, 0, 0]} scale={[1, 1, 1]} {...props} />;
};

const ChairCushionModel: React.FC<ModelProps> = props => {
  const { scene } = useGLTF("/models/furnitures/chairCushion.glb");
  return <primitive object={scene} position={[0, 0, 0]} scale={[1, 1, 1]} {...props} />;
};

const BookcaseClosedDoorsModel: React.FC<ModelProps> = props => {
  const { scene } = useGLTF("/models/furnitures/bookcaseClosedDoors.glb");
  return <primitive object={scene} position={[0, 0, 0]} scale={[1, 1, 1]} {...props} />;
};

const PottedPlantModel: React.FC<ModelProps> = props => {
  const { scene } = useGLTF("/models/furnitures/pottedPlant.glb");
  return <primitive object={scene} position={[0, 0, 0]} scale={[1, 1, 1]} {...props} />;
};

const CabinetTelevisionModel: React.FC<ModelProps> = props => {
  const { scene } = useGLTF("/models/furnitures/cabinetTelevision.glb");
  return <primitive object={scene} position={[0, 0, 0]} scale={[1, 1, 1]} {...props} />;
};

const TelevisionVintageModel: React.FC<ModelProps> = props => {
  const { scene } = useGLTF("/models/furnitures/televisionVintage.glb");
  return <primitive object={scene} position={[0, 0, 0]} scale={[1, 1, 1]} {...props} />;
};

const LampRoundFloorModel: React.FC<ModelProps> = props => {
  const { scene } = useGLTF("/models/furnitures/lampRoundFloor.glb");
  return <primitive object={scene} position={[0, 0, 0]} scale={[1, 1, 1]} {...props} />;
};

const LaptopModel: React.FC<ModelProps> = props => {
  const { scene } = useGLTF("/models/furnitures/laptop.glb");
  return <primitive object={scene} position={[0, 0, 0]} scale={[1, 1, 1]} {...props} />;
};

const RoomGeometry: React.FC<FloorProps> = ({ scale = [1, 1, 1] }) => {
  const floorRef = useRef<Group>(null);

  return (
    <group ref={floorRef} scale={scale}>
      {/* Floor - Made longer and wider */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[40, 30]} />
        <meshStandardMaterial color="#f5f5dc" />
      </mesh>

      {/* Back Wall - Extended to match wider floor */}
      <mesh position={[0, 5, -15]}>
        <planeGeometry args={[40, 10]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Side Wall - Extended to match longer floor */}
      <mesh position={[-20, 5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[30, 10]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Furniture Setup - Repositioned for larger space */}
      {/* Table */}
      <TableModel position={[-15, 0, -11]} rotation={[0, Math.PI, 0]} />

      {/* Rug */}
      <RugModel position={[0, 0.01, 0]} />

      {/* Chair near table */}
      <ChairCushionModel position={[-10, 0, -10]} rotation={[0, Math.PI / 20, 0]} />

      {/* Bookcase against back wall */}
      <BookcaseClosedDoorsModel position={[-5, 0, -12]} rotation={[0, Math.PI, 0]} />

      {/* Plants - Spread out more */}
      <PlantModel position={[11, 0, -12]} />
      <PottedPlantModel position={[-15, 0, 12]} />

      {/* TV setup */}
      <CabinetTelevisionModel position={[0, 0, -12]} rotation={[0, Math.PI, 0]} />
      <TelevisionVintageModel position={[2, 3.2, -12]} rotation={[0, Math.PI, 0]} />

      {/* Lamp - Moved to new position */}
      <LampRoundFloorModel position={[-17, 0, -13]} />

      {/* Laptop on table */}
      <LaptopModel position={[-13, 2.8, -11.5]} rotation={[0, Math.PI, 0]} />
    </group>
  );
};

const Floor: React.FC<FloorProps> = props => {
  const [charactersToShow, setCharactersToShow] = useState(0);

  // Sequential loading for characters
  const handleCharacterLoaded = () => setCharactersToShow(charactersToShow + 1);

  return (
    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 1 }}>
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: false,
          powerPreference: "default",
        }}
        dpr={1}
        shadows
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />

        <RoomGeometry {...props} />
        <KeyboardControls />

        {/* Character Models */}
        <Suspense fallback={null}>
          {characterModels.slice(0, charactersToShow + 1).map(({ Component, props }, i) => (
            <LazyModel key={i} Component={Component} props={props} onLoaded={handleCharacterLoaded} />
          ))}
        </Suspense>

        <PerspectiveCamera makeDefault position={[25, 25, 25]} fov={60} />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={8}
          maxDistance={50}
          maxPolarAngle={Math.PI / 2}
        />
        <Environment preset="apartment" />
      </Canvas>
    </div>
  );
};

export default Floor;
