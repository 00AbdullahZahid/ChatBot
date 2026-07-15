'use client';

import { useEffect, useRef, useState } from 'react';
import { useChat } from '../lib/chat-context';
import { IoSend } from 'react-icons/io5';

export default function ChatWindow() {
  const { activeChat, activeChatId, sendMessage } = useChat();
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages.length]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, [activeChatId]);
  function handleSend() {
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  // Whose turn it is next, so the input can hint at it.
  const lastRole = activeChat?.messages[activeChat.messages.length - 1]?.role;
  const nextRole: 'user' | 'bot' =
    !activeChat || activeChat.messages.length === 0 ? 'user' : lastRole === 'user' ? 'bot' : 'user';

  return (
    <div className="flex min-h-screen flex-col text-slate-100">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/80 px-8 py-5 backdrop-blur">
        <h2 className="text-lg font-semibold">{activeChat?.title || 'New Chat'}</h2>
      </div>

      {/* Messages OR welcome state */}
      <div className="flex-1 space-y-4 overflow-y-auto px-8 py-6">
        {!activeChat ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <h1 className="text-4xl font-bold mb-4">Welcome to the Chat App</h1>
            <p className="text-lg text-slate-300">This is a simple chat application built with Next.js and React.</p>
          </div>
        ) : activeChat.messages.length === 0 ? (
          <p className="text-center text-sm text-slate-500 mt-10">No messages yet — send the first one below.</p>
        ) : (
          activeChat.messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[65%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${message.role === 'user'
                  ? 'bg-sky-500 text-slate-950 rounded-br-sm'
                  : 'bg-slate-800 text-slate-100 rounded-bl-sm'
                  }`}
              >
                <div>{message.content}</div>
                <div
                  className={`mt-1 text-[10px] ${message.role === 'user' ? 'text-slate-900/60' : 'text-slate-400'
                    }`}
                >
                  {message.role === 'user' ? 'You' : 'Bot'} ·{' '}
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="sticky bottom-0 border-t border-slate-800 bg-slate-950 px-8 py-4">
        <div className="mb-2 text-xs text-slate-500">
          Sending as: <span className={nextRole === 'user' ? 'text-sky-400' : 'text-slate-300'}>
            {nextRole === 'user' ? 'You' : 'Bot'}
          </span>
        </div>
        <div className="flex items-end gap-3">
          <textarea
            value={input}
            ref={textareaRef}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={nextRole === 'user' ? 'Type a message as yourself...' : 'Type the bot reply...'}
            rows={1}
            className="flex-1 resize-none rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-sky-500"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-500 text-slate-950 transition hover:bg-sky-400 disabled:opacity-40 disabled:hover:bg-sky-500"
          >
            <IoSend className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
