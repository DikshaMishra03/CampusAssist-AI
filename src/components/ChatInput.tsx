import React, { useRef, useEffect } from 'react';
import { Send, CornerDownLeft, Sparkles } from 'lucide-react';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  maxLength?: number;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSend,
  isLoading,
  maxLength = 1000,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea according to contents up to max height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 160)}px`;
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && value.trim().length > 0) {
        onSend();
      }
    }
  };

  const isOverLimit = value.length > maxLength;
  const isSendDisabled = isLoading || value.trim().length === 0 || isOverLimit;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-4">
      <div className="relative rounded-2xl border border-slate-200/90 bg-white p-2 shadow-sm transition-all focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900/95 dark:focus-within:border-indigo-500">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about admissions, academics, hostels, placement, or certificates..."
          rows={1}
          disabled={isLoading}
          className="w-full resize-none bg-transparent px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none dark:text-slate-100 dark:placeholder-slate-500"
          style={{ maxHeight: '160px' }}
        />

        <div className="flex items-center justify-between border-t border-slate-100 px-3 pt-2 text-xs text-slate-400 dark:border-slate-800/80 dark:text-slate-500">
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px]">
              <CornerDownLeft className="h-3 w-3" />
              <span>Press <strong className="font-semibold text-slate-600 dark:text-slate-300">Enter</strong> to send, <strong className="font-semibold text-slate-600 dark:text-slate-300">Shift + Enter</strong> for new line</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Character count */}
            <span className={`text-[11px] font-mono ${isOverLimit ? 'text-red-500 font-bold' : ''}`}>
              {value.length} / {maxLength}
            </span>

            {/* Send button */}
            <button
              onClick={onSend}
              disabled={isSendDisabled}
              aria-label="Send message"
              className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all ${
                isSendDisabled
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600'
                  : 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-500 active:scale-95'
              }`}
            >
              {isLoading ? (
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-400 border-t-white" />
              ) : (
                <Send className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>
      <div className="mt-1.5 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 text-center">
        <Sparkles className="h-3 w-3 text-indigo-500" />
        <span>CampusAssist answers directly from the official Apex Institute Knowledge Base</span>
      </div>
    </div>
  );
};
