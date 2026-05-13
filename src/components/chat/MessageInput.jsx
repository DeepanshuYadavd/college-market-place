import React, { useState } from "react";

const MessageInput = ({ onSendMessage, disabled }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() && !disabled) {
      onSendMessage(text);
      setText("");
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="p-6 border-t flex gap-4 transition-all" 
      style={{ 
        borderColor: "var(--mui-palette-divider)", 
        backgroundColor: "var(--mui-palette-background-paper)" 
      }}
    >
      <input
        type="text"
        placeholder="Craft your message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={disabled}
        className="flex-1 px-6 py-3 rounded-2xl font-medium text-sm focus:ring-4 focus:ring-blue-600/20 outline-none transition-all border"
        style={{ 
          backgroundColor: "var(--mui-palette-background-default)",
          borderColor: "var(--mui-palette-divider)",
          color: "var(--mui-palette-text-primary)"
        }}
      />
      <button
        type="submit"
        disabled={!text.trim() || disabled}
        className="px-6 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/20 active:scale-95 flex items-center justify-center"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </button>
    </form>
  );
};

export default MessageInput;
