import React, { useState } from 'react';
import {
  MessageSquare,
  Plus,
  Search,
  Trash2,
  Clock,
  PhoneCall,
  Shield,
  X,
} from 'lucide-react';
import { ConversationSummary } from '../types';

interface SidebarProps {
  conversations: ConversationSummary[];
  activeConversationId?: string;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  isOpenMobile,
  onCloseMobile,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredConversations = conversations.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.lastMessagePreview && c.lastMessagePreview.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (deletingId === id) {
      onDeleteConversation(id);
      setDeletingId(null);
    } else {
      setDeletingId(id);
      setTimeout(() => setDeletingId(null), 4000);
    }
  };

  const content = (
    <div className="flex h-full flex-col bg-slate-50/80 dark:bg-slate-900/90 border-r border-slate-200/80 dark:border-slate-800 w-72 md:w-80 transition-colors">
      {/* Top action header */}
      <div className="p-3.5 border-b border-slate-200/60 dark:border-slate-800/80">
        <div className="flex items-center justify-between gap-2 mb-3 md:hidden">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Conversations
          </span>
          <button
            onClick={onCloseMobile}
            className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <button
          onClick={() => {
            onNewConversation();
            onCloseMobile();
          }}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 active:scale-[0.99] transition"
        >
          <Plus className="h-4 w-4" />
          New Conversation
        </button>

        {/* Search Input */}
        <div className="relative mt-2.5">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full rounded-lg border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-100 dark:placeholder-slate-500"
          />
        </div>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center justify-between">
          <span>Recent Sessions</span>
          <span className="text-[10px]">{filteredConversations.length}</span>
        </div>

        {filteredConversations.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500 px-4">
            {searchQuery ? 'No matching conversations found.' : 'No conversations yet. Start by asking a question!'}
          </div>
        ) : (
          filteredConversations.map(convo => {
            const isActive = convo.id === activeConversationId;
            const isConfirmingDelete = deletingId === convo.id;

            return (
              <div
                key={convo.id}
                onClick={() => {
                  onSelectConversation(convo.id);
                  onCloseMobile();
                }}
                className={`group relative flex items-center justify-between gap-2 rounded-xl p-2.5 cursor-pointer text-left transition-all ${
                  isActive
                    ? 'bg-indigo-50/80 text-indigo-950 ring-1 ring-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-100 dark:ring-indigo-800/60'
                    : 'text-slate-700 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-start gap-2.5 min-w-0 flex-1">
                  <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${
                    isActive ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}>
                    <MessageSquare className="h-3 w-3" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`truncate text-xs font-medium leading-snug ${
                      isActive ? 'font-semibold text-indigo-900 dark:text-indigo-200' : 'text-slate-800 dark:text-slate-200'
                    }`}>
                      {convo.title || 'Untitled Session'}
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                      <Clock className="h-2.5 w-2.5" />
                      <span>{new Date(convo.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                      <span>·</span>
                      <span>{convo.messageCount} msgs</span>
                    </div>
                  </div>
                </div>

                {/* Delete button */}
                <button
                  type="button"
                  onClick={e => handleDeleteClick(e, convo.id)}
                  title={isConfirmingDelete ? 'Click again to confirm delete' : 'Delete conversation'}
                  className={`opacity-0 group-hover:opacity-100 focus:opacity-100 p-1.5 rounded-lg transition-opacity ${
                    isConfirmingDelete
                      ? 'opacity-100 bg-red-100 text-red-600 dark:bg-red-950/80 dark:text-red-400 ring-1 ring-red-400'
                      : 'text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30'
                  }`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* College Support Card */}
      <div className="p-3 border-t border-slate-200/60 dark:border-slate-800/80 bg-slate-100/50 dark:bg-slate-950/30">
        <div className="rounded-xl border border-slate-200/80 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
            <Shield className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>AIET Campus Helpdesk</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Need in-person assistance? Registrar desk is at Block A, Room 102.
          </p>
          <div className="mt-2 flex items-center justify-between text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
            <span className="flex items-center gap-1">
              <PhoneCall className="h-3 w-3" /> +91 11 2890 4000
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex h-[calc(100vh-4rem)] shrink-0">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative z-50 flex h-full">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
