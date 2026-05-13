import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import apiClient from "../api/apiClient";
import ChatSidebar from "../components/chat/ChatSidebar";
import ChatWindow from "../components/chat/ChatWindow";
import MessageInput from "../components/chat/MessageInput";
import { toast } from "react-toastify";

const socket = io("http://localhost:5000", {
  withCredentials: true,
  autoConnect: false,
});

const Chats = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const sellerId = searchParams.get("sellerId");
  const productId = searchParams.get("productId");
  
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInitiating, setIsInitiating] = useState(false);

  const [activeTab, setActiveTab] = useState("orders"); // 'orders' or 'sales'

  // Fetch all chats for the user
  const fetchChats = useCallback(async () => {
    try {
      const response = await apiClient.get("/chat/all");
      setChats(response.data);
      
      // If we are initiating from a product, decide which tab to open
      if (productId) {
        // We'll handle tab switching in the initiation logic
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching chats:", error);
      return [];
    } finally {
      setLoading(false);
    }
  }, [productId]);

  const handleInitiateChat = useCallback(async (receiverId, pId) => {
    if (isInitiating) return;
    setIsInitiating(true);
    try {
      const response = await apiClient.post("/chat/create", { 
        receiverId, 
        productId: pId 
      });
      const newChat = response.data;
      
      // Decide tab based on whether user is seller
      if (newChat.productId?.seller === user?._id) {
        setActiveTab("sales");
      } else {
        setActiveTab("orders");
      }

      setChats(prev => {
        const filtered = prev.filter(c => c._id.toString() !== newChat._id.toString());
        return [newChat, ...filtered];
      });
      
      setActiveChat(newChat);
    } catch (error) {
      console.error("Initiate chat error:", error);
    } finally {
      setIsInitiating(false);
    }
  }, [isInitiating, user]);

  const fetchMessages = async (chatId) => {
    try {
      const response = await apiClient.get(`/chat/messages/${chatId}`);
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    if (user) {
      socket.connect();
      fetchChats();
    }
    return () => {
      socket.disconnect();
    };
  }, [user, fetchChats]);

  const initiatedRef = useRef(null);

  // Handle sellerId from URL
  useEffect(() => {
    if (user && sellerId && !loading) {
      const initKey = `${sellerId}-${productId}`;
      if (initiatedRef.current === initKey) return;
      
      handleInitiateChat(sellerId, productId);
      initiatedRef.current = initKey;
    }
  }, [user, sellerId, productId, loading, handleInitiateChat]);

  // Reset chat window when switching tabs
  useEffect(() => {
    setActiveChat(null);
    setMessages([]);
  }, [activeTab]);

  useEffect(() => {
    if (activeChat) {
      fetchMessages(activeChat._id);
      socket.emit("join_chat", activeChat._id);
    }
  }, [activeChat]);

  useEffect(() => {
    const handleMessage = (message) => {
      // Use chatId.toString() for comparison
      const msgChatId = message.chatId?.toString() || message.chatId;
      
      if (activeChat && activeChat._id.toString() === msgChatId) {
        setMessages((prev) => [...prev, message]);
      }
      
      // Update chats list with last message
      setChats((prev) => {
        const chatIndex = prev.findIndex((c) => c._id.toString() === msgChatId);
        if (chatIndex !== -1) {
          return prev.map((c) =>
            c._id.toString() === msgChatId ? { ...c, lastMessage: message, updatedAt: new Date() } : c
          ).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        } else {
          // If the chat isn't in our list (new chat initiated by someone else), refresh the list
          fetchChats();
          return prev;
        }
      });
    };


    socket.on("receive_message", handleMessage);
    return () => {
      socket.off("receive_message", handleMessage);
    };
  }, [activeChat, fetchChats]); // Added fetchChats to dependencies

  // Smart Tab Selection: If current tab is empty but other has content, switch automatically
  useEffect(() => {
    if (chats.length > 0 && !activeChat && !isInitiating) {
      const hasOrders = chats.some(c => c.productId?.seller?.toString() !== user?._id?.toString());
      const hasSales = chats.some(c => c.productId?.seller?.toString() === user?._id?.toString());
      
      if (activeTab === "orders" && !hasOrders && hasSales) {
        setActiveTab("sales");
      } else if (activeTab === "sales" && !hasSales && hasOrders) {
        setActiveTab("orders");
      }
    }
  }, [chats, activeTab, user, activeChat, isInitiating]);


  const handleSendMessage = (text) => {
    if (!activeChat || !user) return;

    const messageData = {
      chatId: activeChat._id,
      sender: user._id,
      text,
    };

    socket.emit("send_message", messageData);
  };

  const updateActiveChat = (updatedChat) => {
    setActiveChat(updatedChat);
    setChats((prev) =>
      prev.map((c) => (c._id.toString() === updatedChat._id.toString() ? updatedChat : c))
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ backgroundColor: "var(--mui-palette-background-default)" }}>
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const otherParticipant = activeChat?.participants.find(
    (p) => p._id?.toString() !== user?._id?.toString()
  );

  // Absolute deduplication logic: One entry per Person (preserving history)
  const conversationMap = new Map();

  chats.forEach(chat => {
    const otherP = chat.participants.find(p => p._id?.toString() !== user?._id?.toString());
    if (!otherP) return;

    const otherPId = otherP._id?.toString();
    const key = otherPId; // One thread per person

    const existing = conversationMap.get(key);
    // Keep the one with the most recent activity
    if (!existing || new Date(chat.updatedAt) > new Date(existing.updatedAt)) {
      conversationMap.set(key, chat);
    }
  });

  const uniqueChats = Array.from(conversationMap.values());

  // Filter unique chats by OTHER PARTICIPANT ID to be 100% sure we only see one entry per person
  // But now we filter by tab too
  const filteredByTab = uniqueChats.filter(chat => {
    // If productId.seller matches user._id, it's a 'sale'
    const isSeller = chat.productId?.seller?.toString() === user?._id?.toString();
    if (activeTab === "sales") return isSeller;
    return !isSeller;
  });

  return (
    <div className="h-[calc(100vh-64px)] flex overflow-hidden" style={{ backgroundColor: "var(--mui-palette-background-default)" }}>
      <ChatSidebar
        chats={filteredByTab}
        activeChat={activeChat}
        onSelectChat={setActiveChat}
        currentUser={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <ChatWindow
          messages={messages}
          currentUser={user}
          otherParticipant={otherParticipant}
          activeChat={activeChat}
          updateActiveChat={updateActiveChat}
        />
        {activeChat && (
          <MessageInput onSendMessage={handleSendMessage} />
        )}
      </div>
    </div>
  );
};

export default Chats;
