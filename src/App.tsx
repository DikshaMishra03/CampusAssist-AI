import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ChatPage } from './pages/ChatPage';
import { KnowledgeBasePage } from './pages/KnowledgeBasePage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { LoginModal } from './components/LoginModal';
import { UserProfile } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'chat' | 'knowledge' | 'analytics'>('chat');
  
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('campusassist_dark');
      if (saved !== null) {
        return saved === 'true';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  // User state
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('campusassist_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);

  // Sync dark mode class on root <html> and <body>
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    try {
      localStorage.setItem('campusassist_dark', String(darkMode));
    } catch {
      // storage unavailable
    }
  }, [darkMode]);

  const handleToggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const handleLogin = (newUser: UserProfile) => {
    setUser(newUser);
    try {
      localStorage.setItem('campusassist_user', JSON.stringify(newUser));
    } catch {
      // storage unavailable
    }
  };

  const handleLogout = () => {
    setUser(null);
    try {
      localStorage.removeItem('campusassist_user');
    } catch {
      // storage unavailable
    }
  };

  const handleAskInChat = (question: string) => {
    setPendingQuestion(question);
    setCurrentTab('chat');
  };

  const handleNewChat = () => {
    setCurrentTab('chat');
    // Dispatch a custom event to notify ChatPage to create a new session
    window.dispatchEvent(new CustomEvent('campusassist_new_chat'));
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      {/* Universal Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onNewChat={handleNewChat}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        onToggleSidebarMobile={() => setIsSidebarMobileOpen(prev => !prev)}
        user={user}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden">
        {currentTab === 'chat' && (
          <ChatPage
            isSidebarMobileOpen={isSidebarMobileOpen}
            onCloseSidebarMobile={() => setIsSidebarMobileOpen(false)}
            pendingQuestion={pendingQuestion}
            onClearPendingQuestion={() => setPendingQuestion(null)}
            user={user}
          />
        )}

        {currentTab === 'knowledge' && (
          <KnowledgeBasePage onAskInChat={handleAskInChat} />
        )}

        {currentTab === 'analytics' && (
          <AnalyticsPage />
        )}
      </main>

      {/* Authentication Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}
