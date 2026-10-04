import React, { useState } from 'react';
import {
  GraduationCap,
  User,
  Copy,
  Check,
  RotateCw,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
  isLastAssistantMessage: boolean;
  onRegenerate?: () => void;
  onSelectSource?: (sourceTitle: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isLastAssistantMessage,
  onRegenerate,
  onSelectSource,
}) => {
  const [copied, setCopied] = useState(false);
  const isAssistant = message.role === 'assistant';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to format content into paragraphs, bullet lists, and numbered lists
  const renderFormattedContent = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let currentList: { type: 'ul' | 'ol'; items: string[] } | null = null;

    const flushList = () => {
      if (currentList) {
        if (currentList.type === 'ul') {
          elements.push(
            <ul key={`ul-${elements.length}`} className="my-2 space-y-1 pl-5 list-disc text-inherit marker:text-indigo-500">
              {currentList.items.map((item, i) => (
                <li key={i} className="leading-relaxed">
                  {parseInlineFormatting(item)}
                </li>
              ))}
            </ul>
          );
        } else {
          elements.push(
            <ol key={`ol-${elements.length}`} className="my-2 space-y-1 pl-5 list-decimal text-inherit marker:text-indigo-500">
              {currentList.items.map((item, i) => (
                <li key={i} className="leading-relaxed">
                  {parseInlineFormatting(item)}
                </li>
              ))}
            </ol>
          );
        }
        currentList = null;
      }
    };

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) {
        flushList();
        return;
      }

      // Check bullet point
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')) {
        const itemText = trimmed.replace(/^[-*•]\s+/, '');
        if (!currentList || currentList.type !== 'ul') {
          flushList();
          currentList = { type: 'ul', items: [itemText] };
        } else {
          currentList.items.push(itemText);
        }
      }
      // Check numbered list like "1. " or "2) "
      else if (/^\d+[\.\)]\s+/.test(trimmed)) {
        const itemText = trimmed.replace(/^\d+[\.\)]\s+/, '');
        if (!currentList || currentList.type !== 'ol') {
          flushList();
          currentList = { type: 'ol', items: [itemText] };
        } else {
          currentList.items.push(itemText);
        }
      } else {
        flushList();
        elements.push(
          <p key={`p-${elements.length}`} className="my-1.5 leading-relaxed first:mt-0 last:mb-0">
            {parseInlineFormatting(trimmed)}
          </p>
        );
      }
    });

    flushList();
    return elements;
  };

  // Helper for bold and inline code: **text** and `code`
  const parseInlineFormatting = (str: string): React.ReactNode => {
    // Match **bold** or `code`
    const parts = str.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-semibold">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={index}
            className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[11px] text-indigo-700 dark:bg-slate-800 dark:text-indigo-300"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={`group flex w-full gap-3 py-3 transition-colors ${
        isAssistant ? 'justify-start' : 'justify-end'
      }`}
    >
      {/* Assistant Avatar */}
      {isAssistant && (
        <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white shadow-xs">
          <GraduationCap className="h-4 w-4" />
        </div>
      )}

      {/* Message Bubble Container */}
      <div className={`flex flex-col max-w-[85%] md:max-w-[75%] ${isAssistant ? 'items-start' : 'items-end'}`}>
        <div
          className={`relative rounded-2xl px-4 py-3 text-sm shadow-xs ${
            isAssistant
              ? 'border border-slate-200/90 bg-white text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100'
              : 'bg-indigo-600 text-white dark:bg-indigo-600'
          }`}
        >
          {/* Main message text */}
          <div className="space-y-1">
            {renderFormattedContent(message.content)}
          </div>

          {/* Sources Section for Assistant */}
          {isAssistant && message.sources && message.sources.length > 0 && (
            <div className="mt-3.5 pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                <BookOpen className="h-3 w-3 text-indigo-500" />
                <span>Knowledge Sources:</span>
              </div>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {message.sources.map((source, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSelectSource && onSelectSource(source)}
                    className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-indigo-950/60 dark:hover:text-indigo-300 transition-colors"
                  >
                    <span>{source}</span>
                    <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info: Timestamp and Action Buttons */}
        <div className={`mt-1 flex items-center gap-2 px-1 text-[11px] text-slate-400 dark:text-slate-500`}>
          <span>{formattedTime}</span>

          {isAssistant && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {/* Copy button */}
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 rounded px-1.5 py-0.5 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300"
                title="Copy response to clipboard"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              {/* Regenerate button */}
              {isLastAssistantMessage && onRegenerate && (
                <button
                  onClick={onRegenerate}
                  className="flex items-center gap-1 rounded px-1.5 py-0.5 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300"
                  title="Regenerate this response"
                >
                  <RotateCw className="h-3 w-3" />
                  <span>Regenerate</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* User Avatar */}
      {!isAssistant && (
        <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-xl bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  );
};
