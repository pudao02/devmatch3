"use client";

import { useState } from "react";
import Head from "next/head";
import ChatAutoSaver from "../components/ChatAutoSaver";
import ChatRoom from "../components/ChatRoom";
import HeaderBar from "../components/HeaderBar";
import ResultTab from "../components/ResultTab";
import Scene from "../components/Scene";
import SkyBackground from "../components/SkyBackground";

const Home: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ sender: "system" | "user"; text: string }>>([
    { sender: "system", text: "Welcome to the chatroom! Talk to your helpers below." },
  ]);
  const [results, setResults] = useState<string[]>([]);
  const [gatherAndTalk, setGatherAndTalk] = useState(false);

  const handleChatSend = (message: string) => {
    // Add both user message and system response in a single state update
    const userMessage = { sender: "user" as const, text: message };
    const systemMessage = { sender: "system" as const, text: `Helper did something in response to: "${message}"` };

    setMessages(prev => [...prev, userMessage, systemMessage]);
    setResults(prev => [...prev, `Helper did something in response to: "${message}"`]);
    setGatherAndTalk(true);
    setTimeout(() => setGatherAndTalk(false), 30000); // 30 seconds of talking
  };

  return (
    <>
      <Head>
        <title>3D Living Room Chat</title>
        <meta name="description" content="Interactive 3D living room with chat functionality" />
        <link rel="icon" href="/favicon.png" />
      </Head>

      <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>
        <HeaderBar />
        <SkyBackground />
        <Scene gatherAndTalk={gatherAndTalk} />
        <ChatRoom onSend={handleChatSend} />
        <ChatAutoSaver messages={messages} />
        <ResultTab results={results} />
      </div>
    </>
  );
};

export default Home;
