"use client";
import { Suspense, useState, useEffect } from "react";
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, PerspectiveCamera, useGLTF, useFBX } from '@react-three/drei'
import Floor from './Floor.js'
import Character from './Character.js'

function TableModel(props) {
  const { scene } = useGLTF('/models/furnitures/table.glb')
  return (
    <primitive object={scene} position={[0, 0, 0]} scale={[0.8, 0.8, 0.8]} {...props} />
  )
}

function RugModel(props) {
  const { scene } = useGLTF('/models/furnitures/rugRounded.glb')
  return (
    <primitive object={scene} position={[1.5, 0.01, 1.5]} scale={[1, 1, 1]} {...props} />
  )
}

function PlantModel(props) {
  const { scene } = useGLTF('/models/furnitures/plantSmall1.glb')
  return (
    <primitive object={scene} position={[0, 0, 0]} scale={[1, 1, 1]} {...props} />
  )
}

function WallModel(props) {
  const { scene } = useGLTF('/models/furnitures/wall.glb')
  return (
    <primitive object={scene} {...props} />
  )
}

function WallWindowSlideModel(props) {
  const { scene } = useGLTF('/models/furnitures/wallWindowSlide.glb')
  return (
    <primitive object={scene} position={[0, 0, 0]} scale={[1, 1, 1]} {...props} />
  )
}

function WallDoorwayModel(props) {
  const { scene } = useGLTF('/models/furnitures/wallDoorway.glb')
  return (
    <primitive object={scene} position={[0, 0, 0]} scale={[1, 1, 1]} {...props} />
  )
}

function WallWindowModel(props) {
  const { scene } = useGLTF('/models/furnitures/wallWindow.glb')
  return (
    <primitive object={scene} position={[0, 0, 0]} scale={[1, 1, 1]} {...props} />
  )
}

function BenchCushionLowModel(props) {
  const { scene } = useGLTF('/models/furnitures/benchCushionLow.glb')
  return (
    <primitive object={scene} position={[0, 0, 0]} scale={[1, 1, 1]} {...props} />
  )
}

function ChairCushionModel(props) {
  const { scene } = useGLTF('/models/furnitures/chairCushion.glb')
  return (
    <primitive object={scene} position={[0, 0, 0]} scale={[1, 1, 1]} {...props} />
  )
}

function BookcaseClosedDoorsModel(props) {
  const { scene } = useGLTF('/models/furnitures/bookcaseClosedDoors.glb')
  return (
    <primitive object={scene} position={[0, 0, 0]} scale={[1, 1, 1]} {...props} />
  )
}

function PottedPlantModel(props) {
  const { scene } = useGLTF('/models/furnitures/pottedPlant.glb')
  return (
    <primitive object={scene} position={[0, 0, 0]} scale={[1, 1, 1]} {...props} />
  )
}

function CabinetTelevisionModel(props) {
  const { scene } = useGLTF('/models/furnitures/cabinetTelevision.glb')
  return (
    <primitive object={scene} position={[0, 0, 0]} scale={[1, 1, 1]} {...props} />
  )
}

function TelevisionVintageModel(props) {
  const { scene } = useGLTF('/models/furnitures/televisionVintage.glb')
  return (
    <primitive object={scene} position={[0, 0, 0]} scale={[1, 1, 1]} {...props} />
  )
}

function BearModel(props) {
  const { scene } = useGLTF('/models/furnitures/bear.glb')
  return (
    <primitive object={scene} position={[0, 0, 0]} scale={[1, 1, 1]} {...props} />
  )
}

function KitchenFridgeModel(props) {
  const { scene } = useGLTF('/models/furnitures/kitchenFridge.glb')
  return (
    <primitive object={scene} position={[0, 0, 0]} scale={[1, 1, 1]} {...props} />
  )
}

function LampRoundFloorModel(props) {
  const { scene } = useGLTF('/models/furnitures/lampRoundFloor.glb')
  return (
    <primitive object={scene} position={[0, 0, 0]} scale={[1, 1, 1]} {...props} />
  )
}

function CabinetBedDrawerModel(props) {
  const { scene } = useGLTF('/models/furnitures/cabinetBedDrawer.glb')
  return (
    <primitive object={scene} position={[0, 0, 0]} scale={[1, 1, 1]} {...props} />
  )
}

function BookcaseOpenModel(props) {
  const { scene } = useGLTF('/models/furnitures/bookcaseOpen.glb')
  return (
    <primitive object={scene} position={[0, 0, 0]} scale={[1, 1, 1]} {...props} />
  )
}

function BooksModel(props) {
  const { scene } = useGLTF('/models/furnitures/books.glb')
  return (
    <primitive object={scene} position={[0, 0, 0]} scale={[1, 1, 1]} {...props} />
  )
}

function LaptopModel(props) {
  const { scene } = useGLTF('/models/furnitures/laptop.glb')
  return (
    <primitive object={scene} position={[0, 0, 0]} scale={[1, 1, 1]} {...props} />
  )
}

function PlantSmall2Model(props) {
  const { scene } = useGLTF('/models/furnitures/plantSmall2.glb')
  return (
    <primitive object={scene} position={[0, 0, 0]} scale={[1, 1, 1]} {...props} />
  )
}

function PanelingModel(props) {
  const { scene } = useGLTF('/models/furnitures/paneling.glb')
  return (
    <primitive object={scene} position={[0, 0, 0]} scale={[1, 1, 1]} {...props} />
  )
}

function Walls() {
  // Platform is 3x3, centered at [0,0,0]. Adjust wall positions as needed.
  const length = 3 // platform size
  const height = 1 // adjust if needed
  const offset = 0
  return (
    <>
      {/* Front wall */}
      <WallModel position={[0, height / 2, -2]} scale={[3, 1, 1]} />
      {/* Back wall */}
      <WallModel position={[0, height / 2, offset]} scale={[3, 1, 1]} />
      {/* Left wall */}
      <WallModel position={[-offset, height / 2, 0]} rotation={[0, Math.PI / 2, 0]} scale={[3, 1, 1]} />
      {/* Right wall */}
      <WallModel position={[offset, height / 2, 0]} rotation={[0, Math.PI / 2, 0]} scale={[3, 1, 1]} />
    </>
  )
}

function LazyModel({ Component, props, onLoaded }) {
  let loaded = true;
  let model = null;

  if (props.modelPath && props.modelPath.endsWith('.fbx')) {
    model = useFBX(props.modelPath);
    loaded = !!model;
  } else if (props.modelPath && (props.modelPath.endsWith('.glb') || props.modelPath.endsWith('.gltf'))) {
    model = useGLTF(props.modelPath);
    loaded = !!model;
  }

  useEffect(() => {
    if (onLoaded && loaded) onLoaded();
  }, [onLoaded, loaded]);

  if (model) {
    return <primitive object={model} {...props} />;
  }
  return <Component {...props} />;
}

const wallModels = [
  { Component: Walls, props: {} },
  { Component: WallModel, props: { position: [0, 0, 0] } },
  { Component: WallWindowSlideModel, props: { position: [0, 0, 30] } },
  { Component: WallDoorwayModel, props: { position: [-10, 0, 30] } },
  { Component: WallModel, props: { position: [0, 0, 0] } },
  { Component: WallWindowModel, props: { position: [-20, 0, 30] } },
];

const furnitureModels = [
  { Component: BenchCushionLowModel, props: { position: [-11.35, 0.3, 11.5] } },
  { Component: ChairCushionModel, props: { position: [-12, 0.3, 18], rotation: [0, Math.PI / 3, 0] } },
  { Component: BookcaseClosedDoorsModel, props: { position: [-2.5, 0, 2], rotation: [0, Math.PI / 2, 0] } },
  { Component: PottedPlantModel, props: { position: [0, 0, 28] } },
  { Component: CabinetTelevisionModel, props: { position: [-2.5, 0, 10], rotation: [0, Math.PI / 2, 0] } },
  { Component: TelevisionVintageModel, props: { position: [-2.5, 3.1, 12], rotation: [0, Math.PI / 2, 0] } },
  { Component: BearModel, props: { position: [-2.5, 6.5, 12], rotation: [0, Math.PI / 2, 0] } },
  { Component: KitchenFridgeModel, props: { position: [-2.5, 0, 18], rotation: [0, Math.PI / 2, 0] } },
  { Component: LampRoundFloorModel, props: { position: [-0.5, 0.5, 7] } },
  { Component: CabinetBedDrawerModel, props: { position: [-18.5, 0.5, 28] } },
  { Component: BookcaseOpenModel, props: { position: [-2.5, 0, 23], rotation: [0, Math.PI / 2, 0] } },
  { Component: BooksModel, props: { position: [-2.3, 3.68, 25], rotation: [0, Math.PI / 2, 0] } },
  { Component: LaptopModel, props: { position: [-13, 2.6, 15] } },
  { Component: PlantSmall2Model, props: { position: [-19, 3.2, 29.5] } },
  { Component: PanelingModel, props: { position: [-18.8, 6, 30], scale: [0.5, 0.5, 0.5] } },
  { Component: PlantModel, props: { position: [-11, 2.6, 16] } },
  { Component: RugModel, props: { position: [-5.5, 0.5, 11.3] } },
  { Component: TableModel, props: { position: [-10, 0, 14] } },
  { Component: Floor, props: { scale: [3, 1, 3] } },
];

const characterModels = [
  { Component: Character, props: { modelPath: "/models/characters/Casual_Male.fbx", position: [0, 0.5, 0], rotation: [0, Math.PI / 4, 0], scale: 0.01 } },
  { Component: Character, props: { modelPath: "/models/characters/Casual_Female.fbx", position: [0, 0.5, 0], rotation: [0, -Math.PI / 4, 0], scale: 0.01 } },
  { Component: Character, props: { modelPath: "/models/characters/Casual2_Male.fbx", position: [0, 0.5, 0], rotation: [0, Math.PI / 2, 0], scale: 0.01 } },
  { Component: Character, props: { modelPath: "/models/characters/Casual3_Female.fbx", position: [0, 0.5, 0], rotation: [0, -Math.PI / 2, 0], scale: 0.01 } },
];

export default function Scene() {
  const [wallsToShow, setWallsToShow] = useState(0);
  const [furnitureToShow, setFurnitureToShow] = useState(0);
  const [charactersToShow, setCharactersToShow] = useState(0);

  // Sequential loading for walls
  const handleWallLoaded = () => setWallsToShow(wallsToShow + 1);
  // Sequential loading for furniture
  const handleFurnitureLoaded = () => setFurnitureToShow(furnitureToShow + 1);
  // Sequential loading for characters
  const handleCharacterLoaded = () => setCharactersToShow(charactersToShow + 1);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas shadows>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <Suspense fallback={null}>
          {wallModels.slice(0, wallsToShow + 1).map(({ Component, props }, i) => (
            <LazyModel key={i} Component={Component} props={props} onLoaded={handleWallLoaded} />
          ))}
        </Suspense>
        <Suspense fallback={null}>
          {furnitureModels.slice(0, furnitureToShow + 1).map(({ Component, props }, i) => (
            <LazyModel key={i} Component={Component} props={props} onLoaded={handleFurnitureLoaded} />
          ))}
        </Suspense>
        <Suspense fallback={null}>
          {characterModels.slice(0, charactersToShow + 1).map(({ Component, props }, i) => (
            <LazyModel key={i} Component={Component} props={props} onLoaded={handleCharacterLoaded} />
          ))}
        </Suspense>
        <PerspectiveCamera makeDefault position={[10, 10, 10]} />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} minDistance={5} maxDistance={50} />
        <Environment preset="apartment" />
      </Canvas>
    </div>
  );
} 