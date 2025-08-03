"use client";

import React, { useEffect, useMemo, useState } from "react";
import Character from "./Character";

interface CharactersProps {
  gatherAndTalk?: boolean;
  onLoaded?: () => void;
}

const Characters: React.FC<CharactersProps> = ({ gatherAndTalk = false, onLoaded }) => {
  const [charactersToShow, setCharactersToShow] = useState(0);
  const [loadedCount, setLoadedCount] = useState(0);

  const characterModels = useMemo(
    () => [
      {
        Component: Character,
        props: {
          modelPath: "/models/characters/Casual_Male.fbx",
          animationPath: "/models/characters/animations/WalkingForCasualMale.fbx",
          idleAnimationPath: "/models/characters/animations/IdleCasualMale.fbx",
          talkingAnimationPath: "/models/characters/animations/TalkingForCasualMale.fbx",
          speechBubblePath: "/models/characters/speechbubble1.fbx",
          position: [0, 0, 6] as [number, number, number],
          rotation: [0, Math.PI / 4, 0] as [number, number, number],
          scale: 0.02,
          gatherPosition: [0, 0, 10] as [number, number, number],
          gatherAndTalk,
        },
      },
      {
        Component: Character,
        props: {
          modelPath: "/models/characters/Casual_Female.fbx",
          animationPath: "/models/characters/animations/WalkingForCasualFemale.fbx",
          idleAnimationPath: "/models/characters/animations/IdleCasualFemale.fbx",
          talkingAnimationPath: "/models/characters/animations/TalkingForCasualFemale.fbx",
          speechBubblePath: "/models/characters/speechbubble2.fbx",
          position: [0, 0, 6] as [number, number, number],
          rotation: [0, -Math.PI / 4, 0] as [number, number, number],
          scale: 0.02,
          gatherPosition: [-4, 0, 2] as [number, number, number],
          gatherAndTalk,
        },
      },
      {
        Component: Character,
        props: {
          modelPath: "/models/characters/Casual2_Male.fbx",
          animationPath: "/models/characters/animations/WalkingForCasualMale.fbx",
          idleAnimationPath: "/models/characters/animations/IdleCasualMale.fbx",
          talkingAnimationPath: "/models/characters/animations/TalkingForCasualMale.fbx",
          speechBubblePath: "/models/characters/speechbubble1.fbx",
          position: [0, 0, 6] as [number, number, number],
          rotation: [0, Math.PI / 2, 0] as [number, number, number],
          scale: 0.02,
          gatherPosition: [4, 0, 2] as [number, number, number],
          gatherAndTalk,
        },
      },
      {
        Component: Character,
        props: {
          modelPath: "/models/characters/Casual3_Female.fbx",
          animationPath: "/models/characters/animations/WalkingForCasualFemale3.fbx",
          idleAnimationPath: "/models/characters/animations/IdleCasualFemale3.fbx",
          talkingAnimationPath: "/models/characters/animations/TalkingForCasualFemale3.fbx",
          speechBubblePath: "/models/characters/speechbubble3.fbx",
          position: [0, 0, 6] as [number, number, number],
          rotation: [0, -Math.PI / 2, 0] as [number, number, number],
          scale: 0.02,
          gatherPosition: [0, 0, -4] as [number, number, number],
          gatherAndTalk,
        },
      },
    ],
    [gatherAndTalk],
  );

  const handleCharacterLoaded = () => {
    setCharactersToShow(prev => prev + 1);
    setLoadedCount(prev => prev + 1);
  };

  useEffect(() => {
    // Progressive character loading
    const timer = setTimeout(() => {
      setCharactersToShow(1);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loadedCount >= characterModels.length && onLoaded) {
      onLoaded();
    }
  }, [loadedCount, onLoaded, characterModels.length]);

  return (
    <group>
      {characterModels.slice(0, charactersToShow + 1).map(({ Component, props }, i) => (
        <Component key={i} {...props} onLoaded={handleCharacterLoaded} />
      ))}
    </group>
  );
};

export default Characters;
