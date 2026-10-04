import React from 'react';
import { X, BookOpen, Calendar, Tag, ShieldCheck, Bookmark } from 'lucide-react';
import { KnowledgeArticle } from '../types';

interface KnowledgeModalProps {
  article: KnowledgeArticle | null;
  onClose: () => void;
  onAskAboutArticle?: (articleTitle: string) => void;
}

export const KnowledgeModal: React.FC<KnowledgeModalProps> = ({
  article,
  onClose,
  onAskAboutArticle,
}) => {
  if (!article) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-xl max-h-[85vh] flex flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 transition-all">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 p-4 dark:border-slate-800">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                {article.category}
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                {article.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
          {/* Summary Banner */}
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-3 text-indigo-950 dark:border-indigo-900/50 dark:bg-indigo-950/30 dark:text-indigo-200">
            <span className="font-semibold block text-[11px] uppercase tracking-wider text-indigo-700 dark:text-indigo-300 mb-1">
              Summary
            </span>
            <p className="leading-relaxed text-xs">{article.summary}</p>
          </div>

          {/* Full Content */}
          <div className="space-y-2">
            <span className="font-semibold block text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Full Knowledge Entry
            </span>
            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 leading-relaxed whitespace-pre-line text-slate-800 dark:border-slate-800/80 dark:bg-slate-950/60 dark:text-slate-200">
              {article.content}
            </div>
          </div>

          {/* Metadata Footer */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {article.officialReference && (
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Bookmark className="h-3.5 w-3.5 text-indigo-500" />
                <span>Ref: <strong className="font-medium text-slate-700 dark:text-slate-300">{article.officialReference}</strong></span>
              </div>
            )}

            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Calendar className="h-3.5 w-3.5 text-indigo-500" />
              <span>Verified: <strong className="font-medium text-slate-700 dark:text-slate-300">{article.lastUpdated}</strong></span>
            </div>
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap pt-2">
              <Tag className="h-3.5 w-3.5 text-slate-400" />
              {article.tags.map((tag, i) => (
                <span
                  key={i}
                  className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between border-t border-slate-100 p-3 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-950/40">
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Official Institutional Document</span>
          </div>

          {onAskAboutArticle && (
            <button
              onClick={() => {
                onAskAboutArticle(`Tell me more about ${article.title}`);
                onClose();
              }}
              className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-500 active:scale-95 transition"
            >
              Ask AI about this
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
