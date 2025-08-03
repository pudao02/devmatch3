import React, { useRef } from "react";
import { useEffect, useState } from "react";
import SpeechBubble from "./SpeechBubble";
import { useFBX } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";
import { AnimationMixer, Vector3 } from "three";

interface CharacterProps {
  modelPath: string;
  animationPath?: string;
  idleAnimationPath?: string;
  talkingAnimationPath?: string;
  speechBubblePath?: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  onLoaded?: () => void;
  gatherAndTalk?: boolean;
  gatherPosition?: [number, number, number];
}

const Character: React.FC<CharacterProps> = props => {
  console.log("Character props:", props);
  const {
    modelPath,
    animationPath,
    idleAnimationPath,
    talkingAnimationPath,
    speechBubblePath,
    position,
    rotation = [0, 0, 0],
    scale = 1,
    onLoaded,
    gatherAndTalk,
    gatherPosition,
  } = props;

  const [state, setState] = useState<"walking" | "idle" | "gathering" | "talking">("walking");
  const [speechBubbleVisible, setSpeechBubbleVisible] = useState(false);
  console.log("Character gatherAndTalk:", gatherAndTalk, "state:", state);
  const characterRef = useRef<Group>(null);
  const [mixer, setMixer] = useState<AnimationMixer | null>(null);
  const walkDuration = useRef(Math.random() * 3 + 2); // 2-5 seconds
  const idleDuration = useRef(Math.random() * 2 + 1); // 1-3 seconds
  const timer = useRef(0);
  const speechBubbleTimer = useRef(0);
  const speechBubbleDuration = useRef(Math.random() * 2 + 1); // 1-3 seconds for speech bubble visibility
  const hasCalledOnLoaded = useRef(false);

  // Use refs for mutable position and direction
  const positionRef = useRef(new Vector3(...position));
  const directionInit = (() => {
    const v = new Vector3(Math.random() - 0.5, 0, Math.random() - 0.5);
    return v.length() === 0 ? new Vector3(1, 0, 0) : v.normalize();
  })();
  const directionRef = useRef(directionInit);
  const currentYRotation = useRef(rotation[1] ?? 0);
  const targetYRotation = useRef(rotation[1] ?? 0);
  const rotationSpeed = 0.05; // Controls how fast the character turns

  // Helper function to smoothly rotate towards target
  const smoothRotate = (current: number, target: number, speed: number): number => {
    let diff = target - current;

    // Handle angle wrapping (e.g., going from 359° to 1°)
    if (diff > Math.PI) diff -= 2 * Math.PI;
    if (diff < -Math.PI) diff += 2 * Math.PI;

    return current + diff * speed;
  };

  const fbx = useFBX(modelPath);
  const walkAnim = useFBX(animationPath || "");
  const idleAnim = useFBX(idleAnimationPath || "");
  const talkingAnim = useFBX(talkingAnimationPath || "");
  console.log("Loaded model:", fbx);
  console.log("Loaded walk animation:", walkAnim);
  console.log("Loaded idle animation:", idleAnim);

  // Setup animation mixer and play correct animation
  useEffect(() => {
    if (!fbx) return;
    const mixer = new AnimationMixer(fbx);
    let action;
    if ((state === "walking" || state === "gathering") && walkAnim && walkAnim.animations.length > 0) {
      action = mixer.clipAction(walkAnim.animations[0], fbx);
      action.play();
    } else if (state === "idle" && idleAnim && idleAnim.animations.length > 0) {
      action = mixer.clipAction(idleAnim.animations[0], fbx);
      action.play();
    } else if (state === "talking" && talkingAnim && talkingAnim.animations.length > 0) {
      action = mixer.clipAction(talkingAnim.animations[0], fbx);
      action.play();
    }
    setMixer(mixer);
    return () => {
      mixer.stopAllAction();
      setMixer(null);
    };
  }, [fbx, walkAnim, idleAnim, talkingAnim, state]);

  // Call onLoaded when ready - only once
  useEffect(() => {
    if (
      !hasCalledOnLoaded.current &&
      fbx &&
      (!animationPath || walkAnim) &&
      (!idleAnimationPath || idleAnim) &&
      (!talkingAnimationPath || talkingAnim)
    ) {
      hasCalledOnLoaded.current = true;
      onLoaded?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fbx, walkAnim, idleAnim, talkingAnim, animationPath, idleAnimationPath, talkingAnimationPath]);

  // Gather and talk logic
  useEffect(() => {
    if (gatherAndTalk) {
      setState("gathering");
    } else if (state === "gathering" || state === "talking") {
      setState("walking");
      setSpeechBubbleVisible(false); // Hide speech bubble when talking ends
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gatherAndTalk]);

  // Animate mixer and wandering/idle logic
  useFrame((_, delta) => {
    if (mixer) mixer.update(delta);
    timer.current += delta;
    speechBubbleTimer.current += delta;

    if (state === "gathering" && gatherAndTalk && gatherPosition) {
      // Move to gatherPosition, then switch to talking
      const gatherVec = new Vector3(...gatherPosition);
      const pos = positionRef.current.clone();
      const dist = pos.distanceTo(gatherVec);
      if (dist > 0.1) {
        // Walk slowly toward gather position
        const direction = gatherVec.clone().sub(pos).normalize();
        const walkSpeed = 0.02; // Slower walking speed
        pos.add(direction.multiplyScalar(walkSpeed));
        positionRef.current = pos;
        if (characterRef.current) {
          characterRef.current.position.copy(pos);
          // Face the direction of movement with smooth rotation
          targetYRotation.current = Math.atan2(direction.x, direction.z);
          currentYRotation.current = smoothRotate(currentYRotation.current, targetYRotation.current, rotationSpeed);
          characterRef.current.rotation.y = currentYRotation.current;
        }
      } else {
        // Arrived at gather position, switch to talking
        setState("talking");
      }
      return;
    }

    if (state === "talking" && gatherAndTalk && gatherPosition) {
      // Stay at gatherPosition, face center, play talking animation
      const gatherVec = new Vector3(...gatherPosition);
      const center = new Vector3(0, 0, 6);
      positionRef.current = gatherVec;
      if (characterRef.current) {
        characterRef.current.position.copy(gatherVec);
        const dirToCenter = center.clone().sub(gatherVec);
        targetYRotation.current = Math.atan2(dirToCenter.x, dirToCenter.z);
        currentYRotation.current = smoothRotate(currentYRotation.current, targetYRotation.current, rotationSpeed);
        characterRef.current.rotation.y = currentYRotation.current;
      }

      // Random speech bubble behavior
      if (speechBubbleTimer.current > speechBubbleDuration.current) {
        setSpeechBubbleVisible(!speechBubbleVisible);
        speechBubbleTimer.current = 0;
        speechBubbleDuration.current = Math.random() * 3 + 1; // 1-4 seconds for next change
      }

      return;
    }

    if (!gatherAndTalk) {
      // Normal wandering/idle logic
      if (state === "walking") {
        let pos = positionRef.current.clone();
        const dir = directionRef.current.clone();
        const nextPos = pos.clone().add(dir.clone().multiplyScalar(0.02));

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
          setState("idle");
          timer.current = 0;
          idleDuration.current = Math.random() * 2 + 1;
          // Do not update position or direction now
        } else {
          pos = nextPos;
          positionRef.current = pos;
          if (characterRef.current) {
            characterRef.current.position.copy(pos);
            // Apply smooth rotation for normal walking
            currentYRotation.current = smoothRotate(currentYRotation.current, targetYRotation.current, rotationSpeed);
            characterRef.current.rotation.y = currentYRotation.current;
          }
          // Switch to idle after walkDuration
          if (timer.current > walkDuration.current) {
            setState("idle");
            timer.current = 0;
            idleDuration.current = Math.random() * 2 + 1;
          }
        }
      } else if (state === "idle") {
        if (characterRef.current) {
          // Apply smooth rotation even when idle
          currentYRotation.current = smoothRotate(currentYRotation.current, targetYRotation.current, rotationSpeed);
          characterRef.current.rotation.y = currentYRotation.current;
        }
        if (timer.current > idleDuration.current) {
          setState("walking");
          timer.current = 0;
          walkDuration.current = Math.random() * 3 + 2;
          // Change direction randomly
          const newDir = new Vector3(Math.random() - 0.5, 0, Math.random() - 0.5);
          directionRef.current = newDir.length() === 0 ? new Vector3(1, 0, 0) : newDir.normalize();
          targetYRotation.current = Math.atan2(directionRef.current.x, directionRef.current.z);
        }
      }
    }
  });

  // Wait for model and animations to load
  if (!fbx || (animationPath && !walkAnim) || (idleAnimationPath && !idleAnim)) {
    return null;
  }

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
    { center: [10, 7, -13], radius: 1.2 },
  ];

  return (
    <group ref={characterRef} rotation={rotation} scale={[scale, scale, scale]}>
      <primitive object={fbx} />
      {speechBubblePath && (
        <SpeechBubble
          modelPath={speechBubblePath}
          position={[0, 300, 0]} // Position much higher above the character's head
          scale={0.4} // Appropriate size for speech bubble
          visible={state === "talking" && gatherAndTalk && speechBubbleVisible}
        />
      )}
    </group>
  );
};

export default Character;
