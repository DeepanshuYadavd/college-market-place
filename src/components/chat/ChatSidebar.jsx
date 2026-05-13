import React from "react";

const ChatSidebar = ({ chats, activeChat, onSelectChat, currentUser, activeTab, setActiveTab }) => {
  return (
    <div 
      className="w-full md:w-80 border-r flex flex-col h-full overflow-hidden transition-colors duration-300" 
      style={{ 
        borderColor: "var(--mui-palette-divider)",
        backgroundColor: "var(--mui-palette-background-paper)",
        color: "var(--mui-palette-text-primary)"
      }}
    >
      <div className="p-6 border-b space-y-4" style={{ borderColor: "var(--mui-palette-divider)" }}>
        <h2 className="text-2xl font-black uppercase tracking-tighter">Messages</h2>
        
        {/* Tabs */}
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 gap-1" style={{ backgroundColor: "var(--mui-palette-background-default)" }}>
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all cursor-pointer ${
              activeTab === "orders" 
                ? "bg-blue-600 text-white shadow-md" 
                : "text-gray-500 hover:bg-gray-500/10"
            }`}
          >
            My Orders
          </button>
          <button
            onClick={() => setActiveTab("sales")}
            className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all cursor-pointer ${
              activeTab === "sales" 
                ? "bg-blue-600 text-white shadow-md" 
                : "text-gray-500 hover:bg-gray-500/10"
            }`}
          >
            My Sales
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {chats.length === 0 ? (
          <div className="p-12 text-center opacity-50 flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-500/10 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0l-8 5-8-5" />
              </svg>
            </div>
            <p className="text-sm font-bold uppercase tracking-widest">Inbox Empty</p>
          </div>
        ) : (
          chats.map((chat) => {
            const otherParticipant = chat.participants.find(
              (p) => p?._id?.toString() !== currentUser?._id?.toString()
            );
            const isActive = activeChat?._id?.toString() === chat._id?.toString();
            return (
              <div
                key={chat._id}
                onClick={() => onSelectChat(chat)}
                className={`p-4 flex items-center gap-4 cursor-pointer transition-all border-b relative group ${
                  isActive
                    ? "bg-blue-600/5"
                    : "hover:bg-blue-600/5"
                }`}
                style={{ borderColor: "var(--mui-palette-divider)" }}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600" />
                )}
                
                <div className="relative">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black uppercase shadow-lg transition-transform group-hover:scale-105 ${
                    isActive ? "bg-blue-600 text-white" : "bg-blue-500/10 text-blue-600"
                  }`}>
                    {otherParticipant?.userName?.charAt(0) || "U"}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 rounded-full" style={{ borderColor: "var(--mui-palette-background-paper)" }} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className={`font-bold truncate text-sm uppercase tracking-tight ${isActive ? "text-blue-600" : ""}`}>
                      {otherParticipant?.userName || "Unknown User"}
                    </h3>
                    {chat.lastMessage && (
                      <span className="text-[9px] font-black opacity-40 uppercase">
                        {new Date(chat.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] opacity-60 truncate font-medium">
                    {chat.lastMessage?.text || "Started a new conversation"}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default ChatSidebar;
