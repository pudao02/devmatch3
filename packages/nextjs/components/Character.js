import { useFBX } from '@react-three/drei'
import { useRef } from 'react'

export default function Character({ modelPath, position, rotation = [0, 0, 0], scale = 1 }) {
  const fbx = useFBX(modelPath)
  const characterRef = useRef(null)

  return (
    <group 
      ref={characterRef} 
      position={position} 
      rotation={rotation}
      scale={[scale, scale, scale]}
    >
      <primitive object={fbx} />
    </group>
  )
} 