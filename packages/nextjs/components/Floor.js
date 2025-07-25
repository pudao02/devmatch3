import { useGLTF } from '@react-three/drei'
import { useRef } from 'react'

export default function Floor({ scale = [1, 1, 1] }) {
  const { scene } = useGLTF('/models/furnitures/floorFull.glb')
  const floorRef = useRef(null)

  return (
    <group ref={floorRef} scale={scale}>
      <primitive object={scene} />
    </group>
  )
}

useGLTF.preload('/models/furnitures/floorFull.glb') 