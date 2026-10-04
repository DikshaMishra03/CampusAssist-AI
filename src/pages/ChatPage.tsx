import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from '../components/Sidebar';
import { ChatMessage } from '../components/ChatMessage';
import { ChatInput } from '../components/ChatInput';
import { SuggestedQuestions } from '../components/SuggestedQuestions';
import { KnowledgeModal } from '../components/KnowledgeModal';
import {
  Conversation,
  ConversationSummary,
  KnowledgeArticle,
  Message,
  UserProfile,
} from '../types';
import {
  sendMessage,
  getConversations,
  getConversation,
  createConversation,
  deleteConversation,
  getKnowledgeArticles,
} from '../services/api';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface ChatPageProps {
  isSidebarMobileOpen: boolean;
  onCloseSidebarMobile: () => void;
  pendingQuestion?: string | null;
  onClearPendingQuestion?: () => void;
  user?: UserProfile | null;
}

export const ChatPage: React.FC<ChatPageProps> = ({
  isSidebarMobileOpen,
  onCloseSidebarMobile,
  pendingQuestion,
  onClearPendingQuestion,
  user,
}) => {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversation list on mount
  useEffect(() => {
    loadConversationList();

    const handleNewChatEvent = () => {
      handleNewConversation();
    };
    window.addEventListener('campusassist_new_chat', handleNewChatEvent);
    return () => {
      window.removeEventListener('campusassist_new_chat', handleNewChatEvent);
    };
  }, []);

  // Handle incoming question from another page (e.g., Knowledge Base "Ask AI" button)
  useEffect(() => {
    if (pendingQuestion) {
      handleSend(pendingQuestion);
      if (onClearPendingQuestion) onClearPendingQuestion();
    }
  }, [pendingQuestion]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation?.messages, isLoading]);

  const loadConversationList = async () => {
    try {
      const list = await getConversations();
      setConversations(list);
      // Select the first conversation if available and none selected yet
      if (list.length > 0 && !currentConversation) {
        handleSelectConversation(list[0].id);
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
    }
  };

  const handleSelectConversation = async (id: string) => {
    try {
      setErrorMessage(null);
      const convo = await getConversation(id);
      setCurrentConversation(convo);
    } catch (err) {
      console.error('Failed to load conversation details:', err);
      setErrorMessage('Could not load selected conversation.');
    }
  };

  const handleNewConversation = async () => {
    try {
      setErrorMessage(null);
      const newConvo = await createConversation('New Conversation');
      setCurrentConversation(newConvo);
      await loadConversationList();
    } catch (err) {
      console.error('Failed to create new conversation:', err);
      setErrorMessage('Could not initialize a new conversation.');
    }
  };

  const handleDeleteConversation = async (id: string) => {
    try {
      await deleteConversation(id);
      if (currentConversation?.id === id) {
        setCurrentConversation(null);
      }
      await loadConversationList();
    } catch (err) {
      console.error('Failed to delete conversation:', err);
      setErrorMessage('Could not delete conversation.');
    }
  };

  const handleSend = async (messageToSend?: string) => {
    const text = (messageToSend || inputMessage).trim();
    if (!text || isLoading) return;

    setInputMessage('');
    setErrorMessage(null);

    // Optimistically append user message to local state
    const tempUserMessage: Message = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    const targetConvoId = currentConversation?.id;

    setCurrentConversation(prev => {
      if (!prev) {
        return {
          id: 'temp-convo',
          title: text.slice(0, 36),
          messages: [tempUserMessage],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }
      return {
        ...prev,
        messages: [...prev.messages, tempUserMessage],
        updatedAt: new Date().toISOString(),
      };
    });

    setIsLoading(true);

    try {
      const response = await sendMessage(text, targetConvoId);

      const assistantMessage: Message = {
        id: response.messageId,
        role: 'assistant',
        content: response.reply,
        sources: response.sources,
        timestamp: new Date().toISOString(),
      };

      setCurrentConversation(prev => {
        if (!prev) return null;
        return {
          ...prev,
          id: response.conversationId,
          messages: [...prev.messages.filter(m => m.id !== tempUserMessage.id), tempUserMessage, assistantMessage],
          updatedAt: new Date().toISOString(),
        };
      });

      // Refresh sidebar list to reflect new titles and message counts
      loadConversationList();
    } catch (err: unknown) {
      console.error('Failed to send message:', err);
      setErrorMessage(
        err instanceof Error ? err.message : 'An error occurred while generating a response. Please retry.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (!currentConversation || currentConversation.messages.length < 2 || isLoading) return;

    // Find the last user message
    const messages = [...currentConversation.messages];
    let lastUserMessage: Message | null = null;

    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        lastUserMessage = messages[i];
        break;
      }
    }

    if (lastUserMessage) {
      // Remove the last assistant message and re-send
      setCurrentConversation(prev => {
        if (!prev) return null;
        const filtered = prev.messages.filter(
          (m, idx) => !(idx === prev.messages.length - 1 && m.role === 'assistant')
        );
        return { ...prev, messages: filtered };
      });

      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await sendMessage(lastUserMessage.content, currentConversation.id);
        const assistantMessage: Message = {
          id: response.messageId,
          role: 'assistant',
          content: response.reply,
          sources: response.sources,
          timestamp: new Date().toISOString(),
        };

        setCurrentConversation(prev => {
          if (!prev) return null;
          return {
            ...prev,
            messages: [...prev.messages, assistantMessage],
            updatedAt: new Date().toISOString(),
          };
        });
      } catch (err: unknown) {
        setErrorMessage(
          err instanceof Error ? err.message : 'Failed to regenerate response.'
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSourceClick = async (sourceTitle: string) => {
    try {
      const data = await getKnowledgeArticles(undefined, sourceTitle);
      if (data.articles.length > 0) {
        setSelectedArticle(data.articles[0]);
      } else {
        // Fallback: search with partial
        const fallbackData = await getKnowledgeArticles();
        const found = fallbackData.articles.find(a => 
          a.title.toLowerCase().includes(sourceTitle.toLowerCase()) ||
          sourceTitle.toLowerCase().includes(a.title.toLowerCase())
        );
        if (found) setSelectedArticle(found);
      }
    } catch (err) {
      console.error('Error fetching source article:', err);
    }
  };

  const messages = currentConversation?.messages || [];
  const showWelcome = messages.length === 0;

  return (
    <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden bg-slate-50/50 dark:bg-slate-950">
      {/* Sidebar with conversations */}
      <Sidebar
        conversations={conversations}
        activeConversationId={currentConversation?.id}
        onSelectConversation={handleSelectConversation}
        onNewConversation={handleNewConversation}
        onDeleteConversation={handleDeleteConversation}
        isOpenMobile={isSidebarMobileOpen}
        onCloseMobile={onCloseSidebarMobile}
      />

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col h-full overflow-hidden">
        {/* Error notification banner if any */}
        {errorMessage && (
          <div className="flex items-center justify-between gap-3 border-b border-red-200 bg-red-50 px-4 py-2 text-xs text-red-800 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-300">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => handleSend()}
              className="flex items-center gap-1 rounded bg-red-100 px-2 py-0.5 font-medium hover:bg-red-200 dark:bg-red-900/80 dark:hover:bg-red-800"
            >
              <RotateCcw className="h-3 w-3" />
              Retry
            </button>
          </div>
        )}

        {/* Scrollable messages container */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-4xl mx-auto w-full">
            {showWelcome ? (
              <SuggestedQuestions onSelect={(q) => handleSend(q)} user={user} />
            ) : (
              <div className="space-y-4">
                {messages.map((msg, index) => {
                  const isLastAssistant =
                    msg.role === 'assistant' && index === messages.length - 1;

                  return (
                    <ChatMessage
                      key={msg.id || index}
                      message={msg}
                      isLastAssistantMessage={isLastAssistant}
                      onRegenerate={handleRegenerate}
                      onSelectSource={handleSourceClick}
                    />
                  );
                })}

                {/* Loading state indicator */}
                {isLoading && (
                  <div className="flex w-full gap-3 py-3 justify-start">
                    <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white shadow-xs">
                      <span className="text-xs font-bold">AI</span>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-2xl border border-slate-200/90 bg-white px-4 py-3 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mr-1">
                        Consulting knowledge base
                      </span>
                      <span className="h-2 w-2 rounded-full bg-indigo-600 typing-dot-1" />
                      <span className="h-2 w-2 rounded-full bg-indigo-600 typing-dot-2" />
                      <span className="h-2 w-2 rounded-full bg-indigo-600 typing-dot-3" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Input box */}
        <ChatInput
          value={inputMessage}
          onChange={setInputMessage}
          onSend={() => handleSend()}
          isLoading={isLoading}
        />
      </div>

      {/* Source preview modal */}
      <KnowledgeModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
        onAskAboutArticle={(q) => handleSend(q)}
      />
    </div>
  );
};
