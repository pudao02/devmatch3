import React, { useEffect, useRef, useState } from "react";

interface Message {
  sender: "system" | "user";
  text: string;
}

interface ChatRoomProps {
  onSend?: (message: string) => void;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ onSend }) => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "system", text: "Welcome to the chatroom! Talk to your helpers below." },
  ]);
  const [input, setInput] = useState<string>("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    if (!input.trim()) return;
    const newMsg: Message = { sender: "user", text: input };
    setMessages([...messages, newMsg]);
    setInput("");
    if (onSend) onSend(input);
  }

  return (
    <div
      style={{
        position: "fixed", // Changed from absolute
        left: 0,
        right: "300px", // Changed from right: 0 and removed width/marginRight
        bottom: "0",
        zIndex: 20,
        background: "#e3f0fd", // pastel blue
        borderTop: "3px solid #3a5ca8", // deep blue
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
        fontFamily: '"Comic Sans MS", "Comic Sans", "Chalkboard SE", "monospace", sans-serif',
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
          fontSize: "17px",
          marginBottom: "4px",
          borderTopLeftRadius: "15px",
          borderTopRightRadius: "15px",
          maxHeight: "calc(300px - 80px)", // Account for input area height
        }}
      >
        {messages.map((msg, i) => (
          <div key={i} style={{ color: msg.sender === "user" ? "#3a5ca8" : "#22334d", marginBottom: 6 }}>
            <b>{msg.sender === "user" ? "You" : "System"}:</b> {msg.text}
          </div>
        ))}
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
          placeholder="Type your message..."
          style={{
            flex: 1,
            padding: "12px 14px",
            fontSize: "17px",
            border: "2px solid #3a5ca8",
            borderRadius: "10px",
            outline: "none",
            background: "#f5faff",
            color: "#22334d",
            fontFamily: "inherit",
            marginRight: "10px",
            boxShadow: "2px 3px 0 #b3d1f7",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "12px 22px",
            background: "#ffe08a",
            color: "#22334d",
            border: "2px solid #3a5ca8",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold",
            fontFamily: "inherit",
            fontSize: "17px",
            boxShadow: "2px 3px 0 #b3d1f7",
            transition: "background 0.2s",
          }}
          onMouseDown={e => ((e.target as HTMLButtonElement).style.background = "#ffe9b3")}
          onMouseUp={e => ((e.target as HTMLButtonElement).style.background = "#ffe08a")}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatRoom;
