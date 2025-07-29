import React, { useRef } from "react";
import { useFBX } from "@react-three/drei";
import { Group } from "three";
import { useFrame } from "@react-three/fiber";
import { AnimationMixer, Vector3 } from "three";
import { useEffect, useState } from "react";

interface CharacterProps {
  modelPath: string;
  animationPath?: string;
  idleAnimationPath?: string;
  talkingAnimationPath?: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  onLoaded?: () => void;
  gatherAndTalk?: boolean;
  gatherPosition?: [number, number, number];
}

const Character: React.FC<CharacterProps> = (props) => {
  console.log("Character props:", props);
  const { modelPath, animationPath, idleAnimationPath, talkingAnimationPath, position, rotation = [0, 0, 0], scale = 1, onLoaded, gatherAndTalk, gatherPosition } = props;
  const [state, setState] = useState<'walking' | 'idle' | 'talking'>('walking');
  console.log("Character gatherAndTalk:", gatherAndTalk, "state:", state);
  const characterRef = useRef<Group>(null);
  const [mixer, setMixer] = useState<AnimationMixer | null>(null);
  const [currentAction, setCurrentAction] = useState<'walk' | 'idle'>('walk');
  const walkDuration = useRef(Math.random() * 3 + 2); // 2-5 seconds
  const idleDuration = useRef(Math.random() * 2 + 1); // 1-3 seconds
  const timer = useRef(0);

  // Use refs for mutable position and direction
  const positionRef = useRef(new Vector3(...position));
  const directionInit = (() => {
    const v = new Vector3(Math.random() - 0.5, 0, Math.random() - 0.5);
    return v.length() === 0 ? new Vector3(1, 0, 0) : v.normalize();
  })();
  const directionRef = useRef(directionInit);
  const currentYRotation = useRef(rotation[1] ?? 0);

  const fbx = useFBX(modelPath);
  const walkAnim = animationPath ? useFBX(animationPath) : null;
  const idleAnim = idleAnimationPath ? useFBX(idleAnimationPath) : null;
  const talkingAnim = talkingAnimationPath ? useFBX(talkingAnimationPath) : null;
  console.log("Loaded model:", fbx);
  console.log("Loaded walk animation:", walkAnim);
  console.log("Loaded idle animation:", idleAnim);

  // Wait for model and animations to load
  if (!fbx || (animationPath && !walkAnim) || (idleAnimationPath && !idleAnim)) {
    return null;
  }

  // Setup animation mixer and play correct animation
  useEffect(() => {
    if (!fbx) return;
    const mixer = new AnimationMixer(fbx);
    let action;
    if (state === 'walking' && walkAnim && walkAnim.animations.length > 0) {
      action = mixer.clipAction(walkAnim.animations[0], fbx);
      action.play();
    } else if (state === 'idle' && idleAnim && idleAnim.animations.length > 0) {
      action = mixer.clipAction(idleAnim.animations[0], fbx);
      action.play();
    } else if (state === 'talking' && talkingAnim && talkingAnim.animations.length > 0) {
      action = mixer.clipAction(talkingAnim.animations[0], fbx);
      action.play();
    }
    setMixer(mixer);
    return () => {
      mixer.stopAllAction();
      setMixer(null);
    };
  }, [fbx, walkAnim, idleAnim, talkingAnim, state]);

  // Call onLoaded when ready
  useEffect(() => {
    if (fbx && (!animationPath || walkAnim) && (!idleAnimationPath || idleAnim) && (!talkingAnimationPath || talkingAnim)) {
      onLoaded?.();
    }
  }, [fbx, walkAnim, idleAnim, talkingAnim, animationPath, idleAnimationPath, talkingAnimationPath, onLoaded]);

  // Gather and talk logic
  useEffect(() => {
    if (gatherAndTalk) {
      setState('talking');
    } else if (state === 'talking') {
      setState('walking');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gatherAndTalk]);

  // Furniture collision spheres
  const FURNITURE_COLLIDERS = [
    { center: [-15, 0, -11], radius: 2.5 },
    { center: [-10, 0, -10], radius: 1.2 },
    { center: [-8, 0, -12], radius: 2 },
    { center: [19, 3.3, -5], radius: 1 },
    { center: [28, 0, -14], radius: 1 },
    { center: [15.5, 0, -12], radius: 2 },
    { center: [17.5, 3.2, -12], radius: 1 },
    { center: [-17, 0, -13], radius: 1 },
    { center: [25, 0, 2], radius: 3 },
    { center: [22, 0, 5.5], radius: 2 },
    { center: [22.2, 0, 8.2], radius: 1.2 },
    { center: [17, 4, 7.5], radius: 1 },
    { center: [-20, 0, -1], radius: 2 },
    { center: [-20, 0, -5], radius: 2 },
    { center: [-20, 0, -9], radius: 2 },
    { center: [-20, 0, -10], radius: 2 },
    { center: [-17, 0, 20.6], radius: 1.5 },
    { center: [-15.5, 0, 7.5], radius: 1.2 },
    { center: [15, 3, 14], radius: 2 },
    { center: [12, 0, 20], radius: 1 },
    { center: [16, 0, 16], radius: 1 },
    { center: [15, 3.8, 18], radius: 1 },
    { center: [10, 7, -13], radius: 1.2 }
  ];

  // Animate mixer and wandering/idle logic
  useFrame((_, delta) => {
    if (mixer) mixer.update(delta);
    timer.current += delta;

    if (state === 'talking' && gatherAndTalk && gatherPosition) {
      // Move to gatherPosition, face [0,0,6], play talking animation
      const gatherVec = new Vector3(...gatherPosition);
      const center = new Vector3(0, 0, 6);
      // Smoothly move to gather position
      let pos = positionRef.current.clone();
      pos.lerp(gatherVec, 0.1); // 0.1 = smoothing factor
      positionRef.current = pos;
      if (characterRef.current) {
        characterRef.current.position.copy(pos);
        // Face the center
        const dirToCenter = center.clone().sub(pos);
        characterRef.current.rotation.y = Math.atan2(dirToCenter.x, dirToCenter.z);
      }
      return;
    }

    if (!gatherAndTalk) {
      // Normal wandering/idle logic
      if (state === 'walking') {
        let pos = positionRef.current.clone();
        let dir = directionRef.current.clone();
        let nextPos = pos.clone().add(dir.clone().multiplyScalar(0.02));

        // Bounding circle
        const WALK_CENTER = new Vector3(0, 0, 6);
        const WALK_RADIUS = 10;
        let collided = false;
        if (nextPos.distanceTo(WALK_CENTER) > WALK_RADIUS) {
          collided = true;
        }

        // Furniture collision
        for (const f of FURNITURE_COLLIDERS) {
          const fCenter = new Vector3(...f.center);
          if (nextPos.distanceTo(fCenter) < f.radius + 0.5) {
            collided = true;
            break;
          }
        }

        if (collided) {
          setState('idle');
          setCurrentAction('idle');
          timer.current = 0;
          idleDuration.current = Math.random() * 2 + 1;
          // Do not update position or direction now
        } else {
          pos = nextPos;
          positionRef.current = pos;
          if (characterRef.current) {
            characterRef.current.position.copy(pos);
            characterRef.current.rotation.y = currentYRotation.current;
          }
          // Switch to idle after walkDuration
          if (timer.current > walkDuration.current) {
            setState('idle');
            setCurrentAction('idle');
            timer.current = 0;
            idleDuration.current = Math.random() * 2 + 1;
          }
        }
      } else if (state === 'idle') {
        if (characterRef.current) {
          characterRef.current.rotation.y = currentYRotation.current;
        }
        if (timer.current > idleDuration.current) {
          setState('walking');
          setCurrentAction('walk');
          timer.current = 0;
          walkDuration.current = Math.random() * 3 + 2;
          // Pick new random direction
          const v = new Vector3(Math.random() - 0.5, 0, Math.random() - 0.5);
          directionRef.current = v.length() === 0 ? new Vector3(1, 0, 0) : v.normalize();
          currentYRotation.current = Math.atan2(directionRef.current.x, directionRef.current.z);
        }
      }
    }
  });

  return (
    <group ref={characterRef} rotation={rotation} scale={[scale, scale, scale]}>
      <primitive object={fbx} />
    </group>
  );
};

export default Character;
