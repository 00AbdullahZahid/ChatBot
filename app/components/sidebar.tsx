'use client';

import { useState } from 'react';
import { Sidebar, Menu, MenuItem, SubMenu, MenuItemStylesParams, sidebarClasses } from 'react-pro-sidebar';
import { GrChat } from 'react-icons/gr';
import { FaSearch } from "react-icons/fa";
import { TbReload, TbLayoutSidebarLeftCollapse, TbLayoutSidebarLeftExpand } from "react-icons/tb";
import { RiChatNewLine, RiDeleteBinLine } from 'react-icons/ri';
import { BsWindowSidebar } from 'react-icons/bs';
import { useChat } from '../lib/chat-context';

export default function SidebarComponent({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}) {
  const { chats, activeChatId, createChat, selectChat, deleteChat } = useChat();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
 console.log("chats", chats)
  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className={`fixed top-0 left-0 bottom-0 z-50 overflow-hidden border-r border-slate-800 bg-slate-950 transition-all duration-300 ${collapsed ? 'w-20' : 'w-80'
        }`}
    >
      <Sidebar
        collapsed={collapsed}
        rootStyles={{
          height: '100%',
          border: 'none',
          [`.${sidebarClasses.container}`]: {
            backgroundColor: '#0f172a',
            color: '#e2e8f0',
            height: '100%',
            width: '100%',
            border: 'none',
          },
        }}
        width="100%"
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div
            className={`flex items-center gap-3 bg-slate-900 text-slate-100 ${collapsed ? 'flex-col py-4 px-2 gap-2' : 'px-5 py-5'
              }`}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-800 text-sky-400 shadow-lg shadow-slate-900/50">
              <BsWindowSidebar className="h-5 w-5" />
            </div>
            {!collapsed && (
              <div>
                <div className="text-base font-semibold">Chat App</div>
                <div className="text-xs text-slate-400">Your conversations in one place</div>
              </div>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className={`rounded-full bg-slate-800 p-2 text-slate-400 transition hover:bg-slate-700 hover:text-sky-400 ${collapsed ? '' : 'ml-auto'
                }`}
            >
              {collapsed ? (
                <TbLayoutSidebarLeftExpand className="h-4 w-4" />
              ) : (
                <TbLayoutSidebarLeftCollapse className="h-4 w-4" />
              )}
            </button>
          </div>

          {!collapsed && (
            <div className="px-5 pt-6 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Navigation
            </div>
          )}

          {/* Scrollable menu area */}
          <Menu
            className="min-h-0 flex-1 overflow-y-auto px-0"
            menuItemStyles={{
              button: ({ active, disabled, level }: MenuItemStylesParams) => ({
                backgroundColor: active ? '#111827' : undefined,
                color: disabled ? '#94a3b8' : '#e2e8f0',
                padding: collapsed ? '0.9rem' : level === 1 ? '0.75rem 1.5rem' : '0.9rem 1.2rem',
                borderRadius: '16px',
                margin: collapsed ? '0.15rem 0.5rem' : level === 0 ? '0.15rem 0.9rem' : '0.15rem 1.5rem',
                display: 'flex',
                justifyContent: collapsed ? 'center' : 'flex-start',
                '&:hover': {
                  backgroundColor: '#111827',
                },
              }),
              icon: {
                color: '#7dd3fc',
                minWidth: collapsed ? 0 : '1.5rem',
              },
              subMenuContent: {
                backgroundColor: '#111827',
                color: '#e2e8f0',
                padding: '0.4rem 0',
              },
              SubMenuExpandIcon: {
                display: collapsed ? 'none' : 'flex',
              },
            }}
          >
            <MenuItem icon={<RiChatNewLine />} onClick={createChat}>
              {!collapsed && 'New Chat'}
            </MenuItem>

            <MenuItem
              icon={<FaSearch />}
              onClick={() => setSearchOpen((prev) => !prev)}
            >
              {!collapsed && 'Search Chat'}
            </MenuItem>

            {!collapsed && searchOpen && (
              <div className="px-3 pb-2">
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search chats..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-sky-500"
                />
              </div>
            )}

            <SubMenu label={!collapsed && `History (${filteredChats.length})`} icon={<TbReload />}>
              {filteredChats.length === 0 && (
                <MenuItem disabled>
                  {!collapsed && (searchQuery ? 'No chats found' : 'No chats yet')}
                </MenuItem>
              )}
              {filteredChats.map((chat) => (
                <MenuItem
                  key={chat.id}
                  icon={<GrChat />}
                  active={chat.id === activeChatId}
                  onClick={() => selectChat(chat.id)}
                  suffix={
                    !collapsed && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteChat(chat.id);
                        }}
                        className="rounded-full p-1 text-slate-500 hover:bg-slate-700 hover:text-red-400"
                      >
                        <RiDeleteBinLine className="h-3.5 w-3.5" />
                      </button>
                    )
                  }
                >
                  {!collapsed && (chat.title || 'New Chat')}
                </MenuItem>
              ))}
            </SubMenu>
          </Menu>

          {/* Footer content — pinned to bottom because Menu above absorbs the extra space */}
          {!collapsed && (
            <div className="p-5">
              <div className="rounded-3xl bg-slate-900 p-5 text-slate-100 shadow-xl shadow-slate-950/60">
                <div className="text-sm font-semibold text-slate-100">Need a quick start?</div>
                <p className="mt-2 text-sm text-slate-400">Create new chats and organize your workflow with the sidebar.</p>
                <button
                  onClick={createChat}
                  className="mt-4 w-full text-white rounded-2xl bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
                >
                  Start New Chat
                </button>
              </div>
            </div>
          )}

          <div
            className={`mt-1 rounded-3xl bg-slate-900 p-1 text-slate-100 shadow-inner shadow-slate-950/20 ${collapsed ? 'mx-2 flex justify-center' : 'mx-6'
              }`}
          >
            <div className="flex items-center gap-2">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sky-500 text-sm font-bold text-white">
                AZ
              </div>
              {!collapsed && (
                <>
                  <div className="flex-1 items-center justify-between">
                    <div className="text-sm font-semibold">Abdullah Zahid</div>
                    <div className="text-xs text-slate-400">ChatBot Account</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="rounded-full bg-slate-800 p-2 text-slate-400 transition hover:bg-slate-700 hover:text-sky-400">
                      <FaSearch className="h-4 w-4" />
                    </button>
                    <button className="rounded-full bg-slate-800 p-2 text-slate-400 transition hover:bg-slate-700 hover:text-sky-400">
                      <TbReload className="h-4 w-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {!collapsed && (
            <div className="p-5 text-center text-xs text-slate-500">
              &copy; 2026 Chat App. All rights reserved.
            </div>
          )}
        </div>
      </Sidebar>
    </div>
  );
}