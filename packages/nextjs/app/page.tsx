"use client";

import { useState } from "react";
import Head from "next/head";
import ChatRoom from "../components/ChatRoom";
import Floor from "../components/Floor";
import HeaderBar from "../components/HeaderBar";
import ResultTab from "../components/ResultTab";
import SkyBackground from "../components/SkyBackground";

const Home: React.FC = () => {
  const [results, setResults] = useState<string[]>([]);
  const [gatherAndTalk, setGatherAndTalk] = useState(false);

  function handleChatSend(message: string): void {
    // Placeholder: Add a fake result for demo
    setResults(prev => [...prev, `Helper did something in response to: "${message}"`]);
    setGatherAndTalk(true);
    setTimeout(() => setGatherAndTalk(false), 30000); // 15 seconds of talking
  }

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden", background: "#111" }}>
      <Head>
        <title>3D Character Platform with Chat</title>
        <meta name="description" content="Interactive 3D platform with chat and results tab" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <HeaderBar />
      <SkyBackground />
      <Floor gatherAndTalk={gatherAndTalk} />
      <ChatRoom onSend={handleChatSend} />
      <ResultTab results={results} />
    </div>
  );
};

export default Home;
