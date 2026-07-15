'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Message = {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: number;
};

export type Chat = {
  id: string;
  title: string;
  messages: Message[];
};

type ChatContextValue = {
  chats: Chat[];
  activeChatId: string | null;
  activeChat: Chat | undefined;
  createChat: () => void;
  selectChat: (id: string) => void;
  deleteChat: (id: string) => void;
  sendMessage: (content: string) => void;
};

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

function makeId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const activeChat = chats.find((c) => c.id === activeChatId);

  useEffect(() => {
    let loadedChats: Chat[] = [];
    let loadedActiveId: string | null = null;

    try {
      const savedChats = localStorage.getItem('chats');
      loadedChats = savedChats ? JSON.parse(savedChats) : [];
      loadedActiveId = localStorage.getItem('activeChatId');
    } catch {
      loadedChats = [];
      loadedActiveId = null;
    }

    if (!loadedActiveId) {
      if (!loadedActiveId && loadedChats.length > 0) {
        loadedActiveId = loadedChats[0].id;
      } else {
        const newChat: Chat = { id: makeId(), title: 'New Chat', messages: [] };
        loadedChats = [newChat];
        loadedActiveId = newChat.id;
      }
    }

    setChats(loadedChats);
    setActiveChatId(loadedActiveId);
    setHydrated(true);
  }, []);

  // Only start saving AFTER the initial load above has finished
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem('chats', JSON.stringify(chats));
  }, [chats, hydrated]);

  useEffect(() => {
    if (!hydrated || !activeChatId) return;
    localStorage.setItem('activeChatId', activeChatId);
  }, [activeChatId, hydrated]);

  function createChat() {
    setActiveChatId(null);
  }

  function deleteChat(id: string) {
    setChats((prevChats) => {
      const remaingChats = prevChats.filter((chat) => chat.id !== id);
      if (id === activeChatId) {
        setActiveChatId(remaingChats.length > 0 ? remaingChats[0].id : null);
      }
      return remaingChats;
    });
  }
  function selectChat(id: string) {
    setActiveChatId(id);
  }

  function sendMessage(content: string) {
    const trimmed = content.trim();
    if (!trimmed) return;

    // If there's no active chat yet, create one on the fly.
    let chatId = activeChatId;
    let currentChats = chats;

    if (!chatId) {
      const newChat: Chat = { id: makeId(), title: 'New Chat', messages: [] };
      currentChats = [newChat, ...chats];
      chatId = newChat.id;
      setActiveChatId(chatId);
    }

    setChats((prevChats) => {
      const base = chatId === activeChatId ? prevChats : currentChats;
      return base.map((chat) => {
        if (chat.id !== chatId) return chat;

        const lastRole = chat.messages[chat.messages.length - 1]?.role;
        const nextRole: 'user' | 'bot' =
          chat.messages.length === 0 ? 'user' : lastRole === 'user' ? 'bot' : 'user';

        const newMessage: Message = {
          id: makeId(),
          role: nextRole,
          content: trimmed,
          timestamp: Date.now(),
        };

        const isFirstMessage = chat.messages.length === 0;
        return {
          ...chat,
          title: isFirstMessage ? trimmed.slice(0, 30) : chat.title,
          messages: [...chat.messages, newMessage],
        };
      });
    });
  }

  return (
    <ChatContext.Provider
      value={{ chats, activeChatId, activeChat, createChat, selectChat, deleteChat, sendMessage }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within a ChatProvider');
  return ctx;
}