import React from "react";
import { useFBX } from "@react-three/drei";

interface SpeechBubbleProps {
  modelPath: string;
  position?: [number, number, number];
  scale?: number;
  visible?: boolean;
}

const SpeechBubble: React.FC<SpeechBubbleProps> = ({ modelPath, position = [0, 0, 0], scale = 1, visible = true }) => {
  const speechBubble = useFBX(modelPath);

  // Debug logging
  console.log("SpeechBubble component:", {
    modelPath,
    visible,
    speechBubbleLoaded: !!speechBubble,
    position,
    scale,
  });

  if (!visible || !speechBubble) {
    console.log("SpeechBubble not rendering - visible:", visible, "speechBubble:", !!speechBubble);
    return null;
  }

  return <primitive object={speechBubble} position={position} scale={[scale, scale, scale]} />;
};

export default SpeechBubble;
