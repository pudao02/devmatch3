"use client";

import React, { useState } from "react";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth/useScaffoldReadContract";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth/useScaffoldWriteContract";
import { useAccount } from "wagmi";
import ChatRoom from "./ChatRoom";
import SimpleWalletConnect from "./SimpleWalletConnect";

const HealthcareChat: React.FC = () => {
  const { address } = useAccount();
  const [selectedPromptId, setSelectedPromptId] = useState<number | null>(null);
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [feedbackComment, setFeedbackComment] = useState<string>("");

  // Contract hooks
  const { data: myPrompts } = useScaffoldReadContract({
    contractName: "HealthcareAI",
    functionName: "getMyPrompts",
  });

  const { data: myResponses } = useScaffoldReadContract({
    contractName: "HealthcareAI",
    functionName: "getMyResponses",
  });

  const { data: myFeedbacks } = useScaffoldReadContract({
    contractName: "HealthcareAI",
    functionName: "getMyFeedbacks",
  });

  const { writeContractAsync: submitFeedbackAsync } = useScaffoldWriteContract({
    contractName: "HealthcareAI",
  });

  const handleSend = (message: string) => {
    console.log("Message sent:", message);
  };

  const handleSubmitFeedback = async () => {
    if (selectedPromptId === null) return;

    try {
      await submitFeedbackAsync({
        functionName: "submitFeedback",
        args: [selectedPromptId, feedbackRating, feedbackComment],
      });
      
      // Reset form
      setSelectedPromptId(null);
      setFeedbackRating(5);
      setFeedbackComment("");
      
      alert("Feedback submitted successfully!");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Error submitting feedback. Please try again.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Wallet Connection */}
      <SimpleWalletConnect />
      
      <div style={{ 
        background: "#f8f9fa", 
        padding: "20px", 
        borderRadius: "10px", 
        marginBottom: "20px",
        border: "2px solid #3a5ca8"
      }}>
        <h2 style={{ color: "#3a5ca8", marginBottom: "10px" }}>🤖 AI Healthcare Assistant (Sapphire)</h2>
        <p style={{ color: "#666", marginBottom: "15px" }}>
          Ask healthcare questions and get AI-powered responses. All conversations are stored securely on the Oasis Sapphire blockchain using confidential storage. Powered by TEST ROSE tokens.
        </p>
        {!address && (
          <div style={{ 
            background: "#fff3cd", 
            padding: "10px", 
            borderRadius: "5px", 
            border: "1px solid #ffeaa7",
            color: "#856404"
          }}>
            ⚠️ Please connect your wallet (MetaMask) to start chatting with the AI assistant.
          </div>
        )}
      </div>

      {/* Conversation History */}
      {address && myPrompts && myPrompts.length > 0 && (
        <div style={{ 
          background: "white", 
          padding: "20px", 
          borderRadius: "10px", 
          marginBottom: "20px",
          border: "1px solid #ddd"
        }}>
          <h3 style={{ color: "#3a5ca8", marginBottom: "15px" }}>📋 Conversation History</h3>
          <div style={{ maxHeight: "300px", overflowY: "auto" }}>
            {myPrompts.map((prompt, index) => (
              <div key={index} style={{ 
                border: "1px solid #eee", 
                padding: "15px", 
                marginBottom: "10px", 
                borderRadius: "5px",
                background: "#fafafa"
              }}>
                <div style={{ marginBottom: "8px" }}>
                  <strong>Question {index + 1}:</strong> {prompt.prompt}
                </div>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  Asked: {new Date(Number(prompt.timestamp) * 1000).toLocaleString()}
                </div>
                {myResponses && myResponses[index] && (
                  <div style={{ 
                    marginTop: "8px", 
                    padding: "8px", 
                    background: "#e8f5e8", 
                    borderRadius: "3px",
                    borderLeft: "3px solid #2e7d32"
                  }}>
                    <strong>AI Response:</strong> {myResponses[index].output}
                  </div>
                )}
                
                {/* Feedback Section */}
                <div style={{ marginTop: "10px" }}>
                  <button
                    onClick={() => setSelectedPromptId(selectedPromptId === index ? null : index)}
                    style={{
                      background: "#3a5ca8",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      borderRadius: "3px",
                      cursor: "pointer",
                      fontSize: "12px"
                    }}
                  >
                    {selectedPromptId === index ? "Cancel Feedback" : "Add Feedback"}
                  </button>
                  
                  {selectedPromptId === index && (
                    <div style={{ marginTop: "10px", padding: "10px", background: "#f0f8ff", borderRadius: "5px" }}>
                      <div style={{ marginBottom: "8px" }}>
                        <label style={{ marginRight: "10px" }}>Rating:</label>
                        <select 
                          value={feedbackRating} 
                          onChange={(e) => setFeedbackRating(Number(e.target.value))}
                          style={{ padding: "3px" }}
                        >
                          <option value={1}>1 - Poor</option>
                          <option value={2}>2 - Fair</option>
                          <option value={3}>3 - Good</option>
                          <option value={4}>4 - Very Good</option>
                          <option value={5}>5 - Excellent</option>
                        </select>
                      </div>
                      <div style={{ marginBottom: "8px" }}>
                        <label style={{ display: "block", marginBottom: "3px" }}>Comment:</label>
                        <textarea
                          value={feedbackComment}
                          onChange={(e) => setFeedbackComment(e.target.value)}
                          placeholder="Your feedback..."
                          style={{ 
                            width: "100%", 
                            padding: "5px", 
                            borderRadius: "3px", 
                            border: "1px solid #ccc",
                            minHeight: "60px"
                          }}
                        />
                      </div>
                      <button
                        onClick={handleSubmitFeedback}
                        style={{
                          background: "#2e7d32",
                          color: "white",
                          border: "none",
                          padding: "5px 15px",
                          borderRadius: "3px",
                          cursor: "pointer"
                        }}
                      >
                        Submit Feedback
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Blockchain Data Display */}
      {address && (
        <div style={{ 
          background: "white", 
          padding: "20px", 
          borderRadius: "10px", 
          marginBottom: "20px",
          border: "1px solid #ddd"
        }}>
          <h3 style={{ color: "#3a5ca8", marginBottom: "15px" }}>🔗 Blockchain Data</h3>
          
          <div style={{ marginBottom: "15px" }}>
            <strong>Your Wallet Address:</strong> {address}
          </div>
          
          <div style={{ marginBottom: "15px" }}>
            <strong>Contract Data Summary:</strong>
            <ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
              <li>📝 Prompts Stored: {myPrompts ? myPrompts.length : 0}</li>
              <li>🤖 AI Responses: {myResponses ? myResponses.length : 0}</li>
              <li>⭐ Feedbacks: {myFeedbacks ? myFeedbacks.length : 0}</li>
            </ul>
          </div>
          
          <div style={{ 
            background: "#f8f9fa", 
            padding: "15px", 
            borderRadius: "8px",
            border: "1px solid #e9ecef"
          }}>
            <strong>🔍 View on Blockchain Explorer:</strong>
            <div style={{ marginTop: "8px" }}>
              <a 
                href={`https://testnet.explorer.sapphire.oasis.io/address/${address}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#3a5ca8",
                  textDecoration: "underline",
                  fontWeight: "bold"
                }}
              >
                View Your Transactions on Sapphire Explorer →
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Chat Interface */}
      <ChatRoom onSend={handleSend} />
    </div>
  );
};

export default HealthcareChat; 