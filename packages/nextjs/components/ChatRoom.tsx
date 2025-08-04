import React, { useEffect, useRef, useState } from "react";
import { useAccount, useChainId } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth/useScaffoldReadContract";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth/useScaffoldWriteContract";

interface Message {
  sender: "system" | "user" | "ai";
  text: string;
  timestamp?: number;
}

interface ChatRoomProps {
  onSend?: (message: string) => void;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ onSend }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "system",
      text: "Welcome to the AI Healthcare Chat! Your conversations are stored securely on the blockchain.",
    },
  ]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { address } = useAccount();
  const chainId = useChainId();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Contract hooks
  const { writeContractAsync: submitPromptAsync } = useScaffoldWriteContract({
    contractName: "HealthcareAI",
  });

  const { data: myPrompts } = useScaffoldReadContract({
    contractName: "HealthcareAI",
    functionName: "getMyPrompts",
  });

  const { data: myResponses } = useScaffoldReadContract({
    contractName: "HealthcareAI",
    functionName: "getMyResponses",
  });

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load existing conversation from blockchain
  useEffect(() => {
    if (myPrompts && myResponses) {
      const conversation: Message[] = [];

      // Add system message
      conversation.push({
        sender: "system",
        text: "Welcome to the AI Healthcare Chat! Your conversations are stored securely on the blockchain.",
      });

      // Add prompts and responses
      const maxLength = Math.max(myPrompts.length, myResponses.length);
      for (let i = 0; i < maxLength; i++) {
        if (myPrompts[i]) {
          conversation.push({
            sender: "user",
            text: myPrompts[i].prompt,
            timestamp: Number(myPrompts[i].timestamp),
          });
        }
        if (myResponses[i]) {
          conversation.push({
            sender: "ai",
            text: myResponses[i].output,
            timestamp: Number(myResponses[i].timestamp),
          });
        }
      }

      setMessages(conversation);
    }
  }, [myPrompts, myResponses]);

  async function handleSend(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    if (!input.trim() || !address) return;

    console.log("Sending prompt:", input);
    console.log("Wallet address:", address);
    console.log("Chain ID:", chainId);
    console.log("Expected Chain ID for Sapphire Mainnet: 23294");
    console.log("Expected Chain ID for Sapphire Testnet: 23295");
    setIsLoading(true);

    try {
      // Add user message to UI immediately
      const userMsg: Message = { sender: "user", text: input };
      setMessages(prev => [...prev, userMsg]);

      console.log("Calling submitPromptAsync...");
      // Store prompt on blockchain (using old contract function)
      const result = await submitPromptAsync({
        functionName: "submitPrompt",
        args: [input], // old function signature
      });
      
      console.log("Transaction result:", result);
      
      if (!result) {
        throw new Error("Transaction failed - no result returned");
      }
      
      console.log("Transaction hash:", result);

      // Simulate AI response (in real app, this would come from your AI backend)
      setTimeout(() => {
        const aiResponse: Message = {
          sender: "ai",
          text: `Thank you for your question: "${input}". This is a simulated AI response. In a real implementation, your AI backend would process this and store the response on the blockchain. Transaction hash: ${result}`,
        };
        setMessages(prev => [...prev, aiResponse]);
        setIsLoading(false);
      }, 2000);

      setInput("");
      if (onSend) onSend(input);
    } catch (error) {
      console.error("Error submitting prompt:", error);
      setMessages(prev => [
        ...prev,
        {
          sender: "system",
          text: `Error: Failed to submit prompt to blockchain. Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ]);
      setIsLoading(false);
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        right: "300px",
        bottom: "0",
        zIndex: 20,
        background: "#e3f0fd",
        borderTop: "3px solid #3a5ca8",
        borderRight: "3px solid #3a5ca8",
        borderLeft: "3px solid #3a5ca8",
        borderBottom: "none",
        borderTopLeftRadius: "18px",
        borderTopRightRadius: "18px",
        boxShadow: "0 -4px 0 #3a5ca8",
        minHeight: "220px",
        maxHeight: "300px", // Fixed maximum height in pixels
        boxSizing: "border-box", // Added
        display: "flex",
        flexDirection: "column",
        fontFamily: "'PressStart2P', 'Courier New', monospace",
        transition: "width 0.2s",
      }}
    >
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          padding: "18px 20px 8px 20px",
          color: "#22334d",
          fontSize: "12px",
          marginBottom: "4px",
          borderTopLeftRadius: "15px",
          borderTopRightRadius: "15px",
          maxHeight: "calc(300px - 80px)", // Account for input area height
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              color: msg.sender === "user" ? "#3a5ca8" : msg.sender === "ai" ? "#2e7d32" : "#22334d",
              marginBottom: 6,
            }}
          >
            <b>{msg.sender === "user" ? "You" : msg.sender === "ai" ? "AI Assistant" : "System"}:</b> {msg.text}
          </div>
        ))}
        {isLoading && (
          <div style={{ color: "#2e7d32", marginBottom: 6 }}>
            <b>AI Assistant:</b> Processing your request...
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <form
        onSubmit={handleSend}
        style={{
          display: "flex",
          borderTop: "2px solid #b3d1f7",
          background: "#f5faff",
          borderBottomLeftRadius: "15px",
          borderBottomRightRadius: "15px",
          padding: "10px 14px",
        }}
      >
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={mounted && address ? "Type your healthcare question..." : "Please connect your wallet first..."}
          disabled={!mounted || !address || isLoading}
          style={{
            flex: 1,
            padding: "12px 14px",
            fontSize: "12px",
            border: "2px solid #3a5ca8",
            borderRadius: "10px",
            outline: "none",
            background: mounted && address ? "#f5faff" : "#f0f0f0",
            color: "#22334d",
            fontFamily: "inherit",
            marginRight: "10px",
            boxShadow: "2px 3px 0 #b3d1f7",
            opacity: mounted && address ? 1 : 0.7,
          }}
        />
        <button
          type="submit"
          disabled={!mounted || !address || isLoading}
          style={{
            padding: "12px 22px",
            background: mounted && address && !isLoading ? "#ffe08a" : "#cccccc",
            color: "#22334d",
            border: "2px solid #3a5ca8",
            borderRadius: "10px",
            cursor: mounted && address && !isLoading ? "pointer" : "not-allowed",
            fontWeight: "bold",
            fontFamily: "inherit",
            fontSize: "17px",
            boxShadow: "2px 3px 0 #b3d1f7",
            transition: "background 0.2s",
          }}
          onMouseDown={e => {
            if (mounted && address && !isLoading) {
              (e.target as HTMLButtonElement).style.background = "#ffe9b3";
            }
          }}
          onMouseUp={e => {
            if (mounted && address && !isLoading) {
              (e.target as HTMLButtonElement).style.background = "#ffe08a";
            }
          }}
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
};

export default ChatRoom;
