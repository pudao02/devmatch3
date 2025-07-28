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
      scale: 0.02,
    },
  },
  {
    Component: Character,
    props: {
      modelPath: "/models/characters/Casual_Female.fbx",
      position: [5, 0, -8],
      rotation: [0, -Math.PI / 4, 0],
      scale: 0.02,
    },
  },
  {
    Component: Character,
    props: {
      modelPath: "/models/characters/Casual3_Female.fbx",
      position: [-2, 0, 5],
      rotation: [0, -Math.PI / 2, 0],
      scale: 0.02,
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

const TableClothModel: React.FC<ModelProps> = props => {
  const { scene } = useGLTF("/models/furnitures/tableCloth.glb");
  return <primitive object={scene} position={[0, 0, 0]} scale={[1, 1, 1]} {...props} />;
};

const LoungeSofaCornerModel: React.FC<ModelProps> = props => {
  const { scene } = useGLTF("/models/furnitures/loungeSofaCorner.glb");
  return <primitive object={scene} position={[0, 0, 0]} scale={[1, 1, 1]} {...props} />;
};

const LoungeSofaModel: React.FC<ModelProps> = props => {
  const { scene } = useGLTF("/models/furnitures/loungeSofa.glb");
  return <primitive object={scene} position={[0, 0, 0]} scale={[1, 1, 1]} {...props} />;
};

const LampSquareFloorModel: React.FC<ModelProps> = props => {
  const { scene } = useGLTF("/models/furnitures/lampSquareFloor.glb");
  return <primitive object={scene} position={[0, 0, 0]} scale={[1, 1, 1]} {...props} />;
};

const DeskModel: React.FC<ModelProps> = props => {
  const { scene } = useGLTF("/models/furnitures/desk.glb");
  return <primitive object={scene} position={[0, 0, 0]} scale={[1, 1, 1]} {...props} />;
};

const KitchenFridgeSmallModel: React.FC<ModelProps> = props => {
  const { scene } = useGLTF("/models/furnitures/kitchenFridgeSmall.glb");
  return <primitive object={scene} position={[0, 0, 0]} scale={[0.75, 0.65, 0.75]} {...props} />;
};

const BooksModel: React.FC<ModelProps> = props => {
  const { scene } = useGLTF("/models/furnitures/books.glb");
  return <primitive object={scene} position={[0, 0, 0]} scale={[1, 1, 1]} {...props} />;
};

const Books2Model: React.FC<ModelProps> = props => {
  const { scene } = useGLTF("/models/furnitures/books2.glb");
  return <primitive object={scene} position={[0, 0, 0]} scale={[1, 1, 1]} {...props} />;
};

const LampRoundTableModel: React.FC<ModelProps> = props => {
  const { scene } = useGLTF("/models/furnitures/lampRoundTable.glb");
  return <primitive object={scene} position={[0, 0, 0]} scale={[0.65, 0.65, 0.65]} {...props} />;
};

const KitchenCoffeeMachineModel: React.FC<ModelProps> = props => {
  const { scene } = useGLTF("/models/furnitures/kitchenCoffeeMachine.glb");
  return <primitive object={scene} position={[0, 0, 0]} scale={[0.7, 0.7, 0.7]} {...props} />;
};

const PlantSmall2Model: React.FC<ModelProps> = props => {
  const { scene } = useGLTF("/models/furnitures/plantSmall2.glb");
  return <primitive object={scene} position={[0, 0, 0]} scale={[1, 1, 1]} {...props} />;
};

const KitchenBarModel: React.FC<ModelProps> = props => {
  const { scene } = useGLTF("/models/furnitures/kitchenBar.glb");
  return <primitive object={scene} position={[0, 0, 0]} scale={[1, 1, 1]} {...props} />;
};

const KitchenBar2Model: React.FC<ModelProps> = props => {
  const { scene } = useGLTF("/models/furnitures/kitchenBar2.glb");
  return <primitive object={scene} position={[0, 0, 0]} scale={[1, 1, 1]} {...props} />;
};

const KitchenBar3Model: React.FC<ModelProps> = props => {
  const { scene } = useGLTF("/models/furnitures/kitchenBar3.glb");
  return <primitive object={scene} position={[0, 0, 0]} scale={[1, 1, 1]} {...props} />;
};

const KitchenBarEndModel: React.FC<ModelProps> = props => {
  const { scene } = useGLTF("/models/furnitures/kitchenBarEnd.glb");
  return <primitive object={scene} position={[0, 0, 0]} scale={[1, 1, 1]} {...props} />;
};

const KitchenFridgeModel: React.FC<ModelProps> = props => {
  const { scene } = useGLTF("/models/furnitures/kitchenFridge.glb");
  return <primitive object={scene} position={[0, 0, 0]} scale={[1, 1, 1]} {...props} />;
};

const KitchenCabinetUpperDoubleModel: React.FC<ModelProps> = props => {
  const { scene } = useGLTF("/models/furnitures/kitchenCabinetUpperDouble.glb");
  return <primitive object={scene} position={[0, 0, 0]} scale={[1, 1, 1]} {...props} />;
};

const KitchenCabinetUpperDouble2Model: React.FC<ModelProps> = props => {
  const { scene } = useGLTF("/models/furnitures/kitchenCabinetUpperDouble2.glb");
  return <primitive object={scene} position={[0, 0, 0]} scale={[1, 1, 1]} {...props} />;
};

const KitchenCabinetUpperCornerModel: React.FC<ModelProps> = props => {
  const { scene } = useGLTF("/models/furnitures/kitchenCabinetUpperCorner.glb");
  return <primitive object={scene} position={[0, 0, 0]} scale={[1, 1, 1]} {...props} />;
};

const KitchenCabinetUpperModel: React.FC<ModelProps> = props => {
  const { scene } = useGLTF("/models/furnitures/kitchenCabinetUpper.glb");
  return <primitive object={scene} position={[0, 0, 0]} scale={[1, 1, 1]} {...props} />;
};

const KitchenCabinetUpper2Model: React.FC<ModelProps> = props => {
  const { scene } = useGLTF("/models/furnitures/kitchenCabinetUpper2.glb");
  return <primitive object={scene} position={[0, 0, 0]} scale={[1, 1, 1]} {...props} />;
};

const KitchenSinkModel: React.FC<ModelProps> = props => {
  const { scene } = useGLTF("/models/furnitures/kitchenSink.glb");
  return <primitive object={scene} position={[0, 0, 0]} scale={[1, 1, 1]} {...props} />;
};

const RugRectangleModel: React.FC<ModelProps> = props => {
  const { scene } = useGLTF("/models/furnitures/rugRectangle.glb");
  return <primitive object={scene} position={[0, 0, 0]} scale={[1, 1, 1.3]} {...props} />;
};

const TableRoundModel: React.FC<ModelProps> = props => {
  const { scene } = useGLTF("/models/furnitures/tableRound.glb");
  return <primitive object={scene} position={[0, 0, 0]} scale={[0.85, 0.85, 0.85]} {...props} />;
};

const ChairRoundedModel: React.FC<ModelProps> = props => {
  const { scene } = useGLTF("/models/furnitures/chairRounded.glb");
  return <primitive object={scene} position={[0, 0, 0]} scale={[1, 1, 1]} {...props} />;
};

const ChairRounded2Model: React.FC<ModelProps> = props => {
  const { scene } = useGLTF("/models/furnitures/chairRounded2.glb");
  return <primitive object={scene} position={[0, 0, 0]} scale={[1, 1, 1]} {...props} />;
};

const PlantSmall3Model: React.FC<ModelProps> = props => {
  const { scene } = useGLTF("/models/furnitures/plantSmall3.glb");
  return <primitive object={scene} position={[0, 0, 0]} scale={[1, 1, 1]} {...props} />;
};

const RadioModel: React.FC<ModelProps> = props => {
  const { scene } = useGLTF("/models/furnitures/radio.glb");
  return <primitive object={scene} position={[0, 0, 0]} scale={[0.9, 0.9, 0.9]} {...props} />;
};

const BearModel: React.FC<ModelProps> = props => {
  const { scene } = useGLTF("/models/furnitures/bear.glb");
  return <primitive object={scene} position={[0, 0, 0]} scale={[1, 1, 1]} {...props} />;
};

const KitchenCabinetCornerInnerModel: React.FC<ModelProps> = props => {
  const { scene } = useGLTF("/models/furnitures/kitchenCabinetCornerInner.glb");
  return <primitive object={scene} position={[0, 0, 0]} scale={[1, 1, 1]} {...props} />;
};

const KitchenCabinetDrawer1Model: React.FC<ModelProps> = props => {
  const { scene } = useGLTF("/models/furnitures/kitchenCabinetDrawer 1.glb");
  return <primitive object={scene} position={[0, 0, 0]} scale={[1, 1, 1]} {...props} />;
};

const RoomGeometry: React.FC<FloorProps> = ({ scale = [1, 1, 1] }) => {
  const floorRef = useRef<Group>(null);

  return (
    <group ref={floorRef} scale={scale}>
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

      {/* Furniture Setup - Repositioned for larger space */}
      {/* Table */}
      <TableModel position={[-15, 0, -11]} rotation={[0, Math.PI, 0]} />

      {/* Rug */}
      <RugModel position={[28, 0.01, -9]} />

      {/* Chair near table */}
      <ChairCushionModel position={[-10, 0, -10]} rotation={[0, Math.PI / 20, 0]} />

      {/* Bookcase against back wall */}
      <BookcaseClosedDoorsModel position={[-8, 0, -12]} rotation={[0, Math.PI, 0]} />

      {/* Plants - Spread out more */}
      <PlantModel position={[19, 3.3, -5]} />
      <PottedPlantModel position={[28, 0, -14]} />

      {/* TV setup */}
      <CabinetTelevisionModel position={[15.5, 0, -12]} rotation={[0, Math.PI, 0]} />
      <TelevisionVintageModel position={[17.5, 3.2, -12]} rotation={[0, Math.PI, 0]} />

      {/* Lamp - Moved to new position */}
      <LampRoundFloorModel position={[-17, 0, -13]} />

      {/* Laptop on table */}
      <LaptopModel position={[-13, 2.8, -11.5]} rotation={[0, Math.PI, 0]} />

      {/* Table Cloth */}
      <TableClothModel position={[15.8, 0, -2.3]} rotation={[0, Math.PI / 1, 0]} />

      {/* Lounge Sofa */}
      <LoungeSofaModel position={[25, 0, 2]} rotation={[0, Math.PI / 100000000, 0]} />

      {/* Desk */}
      <DeskModel position={[22, 0, 5.5]} rotation={[0, Math.PI / 100000000000, 0]} />

      {/* Small Kitchen Fridge */}
      <KitchenFridgeSmallModel position={[22.2, 0, 8.2]} rotation={[0, Math.PI, 0]} />

      {/* Books */}
      <BooksModel position={[19, 3.85, 7]} rotation={[0, Math.PI, 0]} />
      <Books2Model position={[18, 3.85, 7]} rotation={[0, Math.PI, 0]} />

      {/* Round Table Lamp */}
      <LampRoundTableModel position={[21.2, 3.85, 6]} rotation={[0, Math.PI / 4, 0]} />

      {/* Kitchen Coffee Machine */}
      <KitchenCoffeeMachineModel position={[-17, 4.3, 14.6]} rotation={[0, Math.PI / -2, 0]} />

      {/* Small Plant 2 */}
      <PlantSmall2Model position={[17, 4, 7.5]} rotation={[0, Math.PI / 6, 0]} />

      {/* Kitchen Bars */}
      <KitchenBarModel position={[-20, 0, -1]} rotation={[0, Math.PI / 2, 0]} />
      <KitchenBar2Model position={[-20, 0,-5]} rotation={[0, Math.PI / 2, 0]} />
      <KitchenBar3Model position={[-20, 0, -9]} rotation={[0, Math.PI / 2, 0]} />

      {/* Kitchen Bar End */}
      <KitchenBarEndModel position={[-20, 0, -10]} rotation={[0, Math.PI / 2, 0]} />

      {/* Kitchen Fridge */}
      <KitchenFridgeModel position={[-17, 0, 20.6]} rotation={[0, Math.PI / -2, 0]} />

      {/* Kitchen Cabinets */}
      <KitchenCabinetUpperDoubleModel position={[-18, 8, 5]} rotation={[0, Math.PI / -2, 0]} />
      <KitchenCabinetUpperDouble2Model position={[-18, 8, 1]} rotation={[0, Math.PI / -2, 0]} />
      <KitchenCabinetUpperCornerModel position={[-18, 8, -5.4]} rotation={[0, Math.PI / 10000000, 0]} />
      <KitchenCabinetUpperModel position={[-18, 8, 9]} rotation={[0, Math.PI / -2, 0]} />
      <KitchenCabinetUpper2Model position={[-18, 8, 13]} rotation={[0, Math.PI / -2, 0]} />
      <KitchenCabinetCornerInnerModel position={[-15.5, 0, 11.8]} rotation={[0, Math.PI / 10000000, 0]} />
      <KitchenCabinetDrawer1Model position={[-15.5, 0, 11.8]} rotation={[0, Math.PI / -2, 0]} />

      {/* Kitchen Sink */}
      <KitchenSinkModel position={[-15.5, 0, 7.5]} rotation={[0, Math.PI / -2, 0]} />

      {/* Rectangle Rug */}
      <RugRectangleModel position={[-10, 0.01, -6]} rotation={[0, Math.PI / 2, 0]} />

      {/* Round Table */}
      <TableRoundModel position={[15, 3, 14]} rotation={[0, Math.PI / 6, 0]} />

      {/* Rounded Chairs */}
      <ChairRoundedModel position={[12, 0, 20]} rotation={[0, -Math.PI / 4, 0]} />
      <ChairRounded2Model position={[16, 0, 16]} rotation={[0, Math.PI / 2, 0]} />

      {/* Small Plant 3 */}
      <PlantSmall3Model position={[15, 3.8, 18]} rotation={[0, Math.PI / 6, 0]} />

      {/* Radio */}
      <RadioModel position={[15, 4, 18.5]} rotation={[0, Math.PI / 6, 0]} />

      {/* Bear */}
      <BearModel position={[10, 7, -13]} rotation={[0, Math.PI / 1, 0]} scale={[0.8, 0.8, 0.8]} />
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
