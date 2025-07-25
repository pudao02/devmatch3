
"use client";

import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useState } from 'react'
import ChatRoom from '../components/ChatRoom.js';
import ResultTab from '../components/ResultTab.js';
import SkyBackground from '../components/SkyBackground.js';
import HeaderBar from '../components/HeaderBar.js'; 

const Scene = dynamic(() => import('../components/Scene.js'), { 
  ssr: false,
  loading: () => <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', color: '#fff', fontSize: '18px' }}>Loading 3D Scene...</div>
})

export default function Home() {
  const [results, setResults] = useState([])

  function handleChatSend(message) {
    // Placeholder: Add a fake result for demo
    setResults(prev => [
      ...prev,
      `Helper did something in response to: "${message}"`
    ])
  }

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', background: '#111' }}>
      <Head>
        <title>3D Character Platform with Chat</title>
        <meta name="description" content="Interactive 3D platform with chat and results tab" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <HeaderBar />
      <SkyBackground />
      <Scene />
      <ChatRoom onSend={handleChatSend} />
      <ResultTab results={results} />
    </div>
  )
} 