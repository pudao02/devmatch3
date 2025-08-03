import React, { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookmarkIcon, SparklesIcon, XMarkIcon } from "@heroicons/react/24/outline";

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
  title?: string;
}

interface ChatAutoSaverProps {
  messages: Message[];
  onSummarySaved?: (summary: ChatSummary) => void;
}

const ChatAutoSaver: React.FC<ChatAutoSaverProps> = ({ messages, onSummarySaved }) => {
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveTitle, setSaveTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes
  const MIN_MESSAGES_FOR_SAVE = 1; // Changed to 1 so button shows immediately

  // Track user activity
  useEffect(() => {
    const updateActivity = () => setLastActivity(Date.now());

    window.addEventListener("mousemove", updateActivity);
    window.addEventListener("keypress", updateActivity);
    window.addEventListener("click", updateActivity);
    window.addEventListener("scroll", updateActivity);

    return () => {
      window.removeEventListener("mousemove", updateActivity);
      window.removeEventListener("keypress", updateActivity);
      window.removeEventListener("click", updateActivity);
      window.removeEventListener("scroll", updateActivity);
    };
  }, []);

  // Auto-save on inactivity
  useEffect(() => {
    const userMessages = messages.filter(msg => msg.sender === "user");
    if (userMessages.length >= MIN_MESSAGES_FOR_SAVE) {
      const timeSinceActivity = Date.now() - lastActivity;

      if (timeSinceActivity > INACTIVITY_TIMEOUT) {
        // Auto-save full chat to summaries system
        const autoSaveTitle = `Auto_Saved_Chat_${new Date().toISOString().split("T")[0]}`;
        saveFullChatAsJSON(autoSaveTitle);
        console.log("Chat auto-saved to summaries:", autoSaveTitle);
      } else {
        // Set timeout for auto-save
        if (autoSaveTimeout) clearTimeout(autoSaveTimeout);
        const timeout = setTimeout(() => {
          const autoSaveTitle = `Auto_Saved_Chat_${new Date().toISOString().split("T")[0]}`;
          saveFullChatAsJSON(autoSaveTitle);
          console.log("Chat auto-saved to summaries:", autoSaveTitle);
        }, INACTIVITY_TIMEOUT - timeSinceActivity);
        setAutoSaveTimeout(timeout);
      }
    }

    return () => {
      if (autoSaveTimeout) clearTimeout(autoSaveTimeout);
    };
  }, [lastActivity, messages.length, INACTIVITY_TIMEOUT, autoSaveTimeout]);

  // Show save button permanently
  useEffect(() => {
    console.log("ChatAutoSaver: messages.length =", messages.length);
    setShowSaveButton(true); // Always show the button
  }, [messages.length]);

  // Auto-save only on system exit (browser/application close)
  useEffect(() => {
    const handleBeforeUnload = () => {
      const userMessages = messages.filter(msg => msg.sender === "user");
      if (userMessages.length >= MIN_MESSAGES_FOR_SAVE) {
        const autoSaveTitle = `Auto_Saved_Chat_${new Date().toISOString().split("T")[0]}`;
        saveFullChatAsJSON(autoSaveTitle);
      }
    };

    // Only listen for actual browser/application close
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [messages.length]);

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

  const saveSummary = (summary: ChatSummary) => {
    try {
      const existingSummaries = JSON.parse(localStorage.getItem("chatSummaries") || "[]");
      const updatedSummaries = [summary, ...existingSummaries];
      localStorage.setItem("chatSummaries", JSON.stringify(updatedSummaries));

      if (onSummarySaved) {
        onSummarySaved(summary);
      }
    } catch (err) {
      console.error("Failed to save summary:", err);
    }
  };

  const handleManualSave = () => {
    setShowSaveModal(true);
    setSaveTitle(`Chat Session ${new Date().toLocaleDateString()}`);
  };

  const confirmManualSave = useCallback(() => {
    setIsSaving(true);
    setTimeout(() => {
      saveFullChatAsJSON(saveTitle);
      setShowSaveModal(false);
      setSaveTitle("");
      setIsSaving(false);
    }, 1000); // Simulate processing time
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveTitle]);

  const saveFullChatAsJSON = (title: string) => {
    const userMessages = messages.filter(msg => msg.sender === "user");
    const systemMessages = messages.filter(msg => msg.sender === "system");

    // Create a summary that includes the full chat data
    const summary: ChatSummary = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      summary: `Full chat conversation: ${userMessages.length} user messages and ${systemMessages.length} system responses. Topics: ${extractTopics(userMessages.map(m => m.text)).join(", ")}`,
      messageCount: messages.length,
      participants: ["User", "System"],
      tags: extractTopics(userMessages.map(m => m.text)),
      createdAt: new Date().toISOString(),
      title: title,
    };

    // Save to the chat summaries system
    saveSummary(summary);

    // Also save the full chat data to localStorage for potential future use
    const fullChatData = {
      id: summary.id,
      title: title,
      date: summary.date,
      createdAt: summary.createdAt,
      messages: messages, // Full conversation
      metadata: {
        totalMessages: messages.length,
        userMessages: userMessages.length,
        systemMessages: systemMessages.length,
        participants: ["User", "System"],
        tags: summary.tags,
      },
    };

    // Store full chat data separately
    const existingFullChats = JSON.parse(localStorage.getItem("fullChatData") || "[]");
    const updatedFullChats = [fullChatData, ...existingFullChats];
    localStorage.setItem("fullChatData", JSON.stringify(updatedFullChats));

    console.log("Full chat saved to summaries:", title);
  };

  console.log("ChatAutoSaver: showSaveButton =", showSaveButton, "messages.length =", messages.length);

  // Always show the button regardless of showSaveButton state
  return (
    <>
      {/* Manual Save Button */}
      <button
        onClick={handleManualSave}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 9999,
          background: "#ffe08a",
          color: "#22334d",
          border: "2px solid #3a5ca8",
          borderRadius: "50px",
          padding: "12px 20px",
          fontSize: "16px",
          fontWeight: "bold",
          cursor: "pointer",
          fontFamily: '"Comic Sans MS", "Comic Sans", "Chalkboard SE", "monospace", sans-serif',
          boxShadow: "2px 3px 0 #b3d1f7",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          transition: "background 0.2s",
        }}
        onMouseDown={e => ((e.target as HTMLButtonElement).style.background = "#ffe9b3")}
        onMouseUp={e => ((e.target as HTMLButtonElement).style.background = "#ffe08a")}
      >
        <BookmarkIcon style={{ width: "20px", height: "20px" }} />
        Save Full Chat
      </button>

      {/* Save Modal */}
      <AnimatePresence>
        {showSaveModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px",
              zIndex: 50,
            }}
            onClick={() => setShowSaveModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                background: "#e3f0fd",
                border: "3px solid #3a5ca8",
                borderRadius: "18px",
                padding: "24px",
                width: "100%",
                maxWidth: "400px",
                boxShadow: "0 8px 32px 0 rgba(58,92,168,0.18), 0 4px 0 #3a5ca8",
                fontFamily: '"Comic Sans MS", "Comic Sans", "Chalkboard SE", "monospace", sans-serif',
              }}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <div
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}
              >
                <h3
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#22334d",
                    margin: 0,
                  }}
                >
                  Save Full Chat
                </h3>
                <button
                  onClick={() => setShowSaveModal(false)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "4px",
                  }}
                >
                  <XMarkIcon style={{ width: "24px", height: "24px", color: "#3a5ca8" }} />
                </button>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#3a5ca8",
                    marginBottom: "8px",
                  }}
                >
                  File Name
                </label>
                <input
                  type="text"
                  value={saveTitle}
                  onChange={e => setSaveTitle(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "2px solid #3a5ca8",
                    borderRadius: "10px",
                    fontSize: "16px",
                    fontFamily: "inherit",
                    background: "#f5faff",
                    color: "#22334d",
                    outline: "none",
                    boxShadow: "2px 3px 0 #b3d1f7",
                    boxSizing: "border-box",
                  }}
                  placeholder="Enter a name for the chat file..."
                />
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={() => setShowSaveModal(false)}
                  style={{
                    flex: 1,
                    padding: "8px 16px",
                    border: "2px solid #3a5ca8",
                    borderRadius: "10px",
                    color: "#22334d",
                    background: "#f5faff",
                    fontSize: "16px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    boxShadow: "2px 3px 0 #b3d1f7",
                    transition: "background 0.2s",
                  }}
                  onMouseDown={e => ((e.target as HTMLButtonElement).style.background = "#e3f0fd")}
                  onMouseUp={e => ((e.target as HTMLButtonElement).style.background = "#f5faff")}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmManualSave}
                  disabled={isSaving}
                  style={{
                    flex: 1,
                    padding: "8px 16px",
                    background: "#ffe08a",
                    color: "#22334d",
                    border: "2px solid #3a5ca8",
                    borderRadius: "10px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    boxShadow: "2px 3px 0 #b3d1f7",
                    transition: "background 0.2s",
                    opacity: isSaving ? 0.7 : 1,
                  }}
                  onMouseDown={e => !isSaving && ((e.target as HTMLButtonElement).style.background = "#ffe9b3")}
                  onMouseUp={e => !isSaving && ((e.target as HTMLButtonElement).style.background = "#ffe08a")}
                >
                  {isSaving ? (
                    <>
                      <div
                        style={{
                          width: "16px",
                          height: "16px",
                          border: "2px solid #22334d",
                          borderTop: "2px solid transparent",
                          borderRadius: "50%",
                          animation: "spin 1s linear infinite",
                          display: "inline-block",
                          marginRight: "8px",
                        }}
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <SparklesIcon style={{ width: "16px", height: "16px", marginRight: "4px" }} />
                      Save Full Chat
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatAutoSaver;
