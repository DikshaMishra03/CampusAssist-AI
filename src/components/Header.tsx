import React, { useState, useRef, useEffect } from 'react';
import {
  GraduationCap,
  MessageSquare,
  BookOpen,
  BarChart3,
  Plus,
  Sun,
  Moon,
  ShieldCheck,
  Menu,
  LogIn,
  LogOut,
  User,
  ChevronDown,
  Percent,
} from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  currentTab: 'chat' | 'knowledge' | 'analytics';
  onSelectTab: (tab: 'chat' | 'knowledge' | 'analytics') => void;
  onNewChat: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onToggleSidebarMobile?: () => void;
  user: UserProfile | null;
  onOpenLogin: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onNewChat,
  darkMode,
  onToggleDarkMode,
  onToggleSidebarMobile,
  user,
  onOpenLogin,
  onLogout,
}) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-md transition-colors dark:border-slate-800 dark:bg-slate-900/95 sm:px-6">
      {/* Left branding */}
      <div className="flex items-center gap-3">
        {onToggleSidebarMobile && (
          <button
            onClick={onToggleSidebarMobile}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 md:hidden"
            aria-label="Toggle conversation sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onSelectTab('chat')}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-blue-600 text-white shadow-md shadow-indigo-500/20">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                CampusAssist AI
              </span>
              <span className="hidden items-center gap-1 rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-700/10 dark:bg-indigo-950/70 dark:text-indigo-300 dark:ring-indigo-400/20 sm:inline-flex">
                <ShieldCheck className="h-3 w-3" /> AIET Official
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Your AI-powered campus support assistant
            </p>
          </div>
        </div>
      </div>

      {/* Center navigation tabs */}
      <nav className="hidden lg:flex items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800/80">
        <button
          onClick={() => onSelectTab('chat')}
          className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
            currentTab === 'chat'
              ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-400'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <MessageSquare className="h-3.5 w-3.5" />
          Assistant
        </button>

        <button
          onClick={() => onSelectTab('knowledge')}
          className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
            currentTab === 'knowledge'
              ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-400'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <BookOpen className="h-3.5 w-3.5" />
          Knowledge Base
        </button>

        <button
          onClick={() => onSelectTab('analytics')}
          className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
            currentTab === 'analytics'
              ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-400'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <BarChart3 className="h-3.5 w-3.5" />
          Analytics & Admin
        </button>
      </nav>

      {/* Right controls */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Status Indicator */}
        <div className="hidden xl:flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50/70 px-2.5 py-1 text-[11px] font-medium text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-400">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          System Online
        </div>

        {/* New Chat Button */}
        <button
          onClick={onNewChat}
          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-500 active:bg-indigo-700 transition"
          title="Start a fresh conversation"
        >
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">New Chat</span>
        </button>

        {/* Mobile Navigation View Switch */}
        <div className="flex lg:hidden items-center gap-1">
          <button
            onClick={() => onSelectTab(currentTab === 'chat' ? 'knowledge' : 'chat')}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-300"
            title="Switch View"
          >
            {currentTab === 'chat' ? <BookOpen className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
          </button>
        </div>

        {/* Theme Toggle (Dark / Light Mode) */}
        <button
          type="button"
          onClick={onToggleDarkMode}
          title={darkMode ? 'Switch to Light mode' : 'Switch to Dark mode'}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200/80 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition cursor-pointer"
          aria-label="Toggle color theme"
        >
          {darkMode ? (
            <Sun className="h-4 w-4 text-amber-400 transition-transform hover:rotate-45" />
          ) : (
            <Moon className="h-4 w-4 text-slate-600 transition-transform hover:-rotate-12" />
          )}
        </button>

        {/* User Sign In / Profile Area */}
        {user ? (
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setIsProfileMenuOpen(prev => !prev)}
              className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white p-1 pr-2.5 text-xs font-medium shadow-2xs hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800 transition"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-[11px]">
                {getInitials(user.name)}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  {user.name.split(' ')[0]}
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 capitalize">
                  {user.role}
                </p>
              </div>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl dark:border-slate-800 dark:bg-slate-900 z-50 text-xs">
                {/* User identity card */}
                <div className="border-b border-slate-100 pb-3 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-xs">
                      {getInitials(user.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-900 dark:text-white truncate">
                        {user.name}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {user.rollNumber && (
                    <div className="mt-2.5 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Roll / ID:</span>
                      <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                        {user.rollNumber}
                      </span>
                    </div>
                  )}

                  {user.department && (
                    <div className="mt-1 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Department:</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[130px]">
                        {user.department}
                      </span>
                    </div>
                  )}

                  {user.attendancePercent !== undefined && (
                    <div className="mt-1.5 flex items-center justify-between rounded-lg bg-emerald-50 px-2 py-1 text-[11px] text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                      <span className="flex items-center gap-1 font-medium">
                        <Percent className="h-3 w-3" /> Attendance
                      </span>
                      <span className="font-bold">{user.attendancePercent}% (Eligible)</span>
                    </div>
                  )}
                </div>

                {/* Sign Out Button */}
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onLogout();
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/50 transition"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenLogin}
            className="flex items-center gap-1.5 rounded-lg border border-indigo-200/90 bg-indigo-50/80 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 active:scale-95 transition dark:border-indigo-800/80 dark:bg-indigo-950/60 dark:text-indigo-300 dark:hover:bg-indigo-900/60 cursor-pointer"
          >
            <LogIn className="h-3.5 w-3.5" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};
