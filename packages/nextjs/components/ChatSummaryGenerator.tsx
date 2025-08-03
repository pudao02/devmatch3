import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SparklesIcon } from "@heroicons/react/24/outline";

interface Message {
  sender: "system" | "user";
  text: string;
}

interface ChatSummary {
  id: string;
  date: string;
  summary: string;
  messageCount: number;
  participants: string[];
  tags: string[];
  createdAt: string;
}

interface ChatSummaryGeneratorProps {
  messages: Message[];
  onSummaryGenerated?: (summary: ChatSummary) => void;
}

const ChatSummaryGenerator: React.FC<ChatSummaryGeneratorProps> = ({ messages, onSummaryGenerated }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);

  const generateSummary = async () => {
    setIsGenerating(true);

    // Simulate AI summary generation
    await new Promise(resolve => setTimeout(resolve, 2000));

    const userMessages = messages.filter(msg => msg.sender === "user");
    const systemMessages = messages.filter(msg => msg.sender === "system");

    // Simple summary generation logic
    const topics = extractTopics(userMessages.map(m => m.text));
    const summary = `Chat session with ${userMessages.length} user messages and ${systemMessages.length} system responses. Key topics discussed: ${topics.join(", ")}.`;

    const newSummary: ChatSummary = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      summary,
      messageCount: messages.length,
      participants: ["User", "System"],
      tags: topics.length > 0 ? topics.slice(0, 3) : ["general"],
      createdAt: new Date().toISOString(),
    };

    // Save to localStorage
    const existingSummaries = JSON.parse(localStorage.getItem("chatSummaries") || "[]");
    const updatedSummaries = [newSummary, ...existingSummaries];
    localStorage.setItem("chatSummaries", JSON.stringify(updatedSummaries));

    if (onSummaryGenerated) {
      onSummaryGenerated(newSummary);
    }

    setIsGenerating(false);
    setShowGenerator(false);
  };

  const extractTopics = (texts: string[]): string[] => {
    const commonTopics = [
      "blockchain",
      "ethereum",
      "smart contracts",
      "defi",
      "nft",
      "web3",
      "development",
      "coding",
      "programming",
      "react",
      "nextjs",
      "typescript",
      "cryptocurrency",
      "trading",
      "investment",
      "technology",
      "ai",
      "machine learning",
    ];

    const foundTopics = commonTopics.filter(topic =>
      texts.some(text => text.toLowerCase().includes(topic.toLowerCase())),
    );

    return foundTopics.length > 0 ? foundTopics : ["general"];
  };

  // Show generator when there are enough messages
  useEffect(() => {
    if (messages.length >= 3) {
      setShowGenerator(true);
    }
  }, [messages.length]);

  if (!showGenerator) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="fixed bottom-4 right-4 z-30">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={generateSummary}
        disabled={isGenerating}
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50"
      >
        {isGenerating ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <SparklesIcon className="w-5 h-5" />
            Generate Summary
          </>
        )}
      </motion.button>
    </motion.div>
  );
};

export default ChatSummaryGenerator;
