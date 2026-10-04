import React, { useState, useEffect } from 'react';
import {
  Search,
  BookOpen,
  Filter,
  ExternalLink,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  FolderTree,
} from 'lucide-react';
import { KnowledgeArticle, Category } from '../types';
import { getKnowledgeArticles } from '../services/api';
import { KnowledgeModal } from '../components/KnowledgeModal';

interface KnowledgeBasePageProps {
  onAskInChat: (question: string) => void;
}

export const KnowledgeBasePage: React.FC<KnowledgeBasePageProps> = ({ onAskInChat }) => {
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);

  useEffect(() => {
    loadArticles();
  }, [selectedCategory, searchQuery]);

  const loadArticles = async () => {
    setIsLoading(true);
    try {
      const data = await getKnowledgeArticles(selectedCategory, searchQuery);
      setArticles(data.articles);
      if (categories.length === 0) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error('Failed to load knowledge articles:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryColor = (cat: Category) => {
    switch (cat) {
      case 'Admissions':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/60';
      case 'Academics':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/60';
      case 'Departments':
        return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900/60';
      case 'Student Services':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/60';
      case 'Placements':
        return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900/60';
      case 'Campus':
        return 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-900/60';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800';
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50/60 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Hero */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-xs uppercase tracking-wider">
              <BookOpen className="h-4 w-4" />
              <span>Institutional Knowledge Base</span>
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Campus Information Directory
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
              Explore the verified repository powering CampusAssist AI. All answers given by the assistant are directly grounded in these structured records.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-center shadow-2xs dark:border-slate-800 dark:bg-slate-900">
              <span className="block text-lg font-bold text-slate-900 dark:text-white">
                {articles.length}
              </span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                Active Articles
              </span>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-center shadow-2xs dark:border-slate-800 dark:bg-slate-900">
              <span className="block text-lg font-bold text-slate-900 dark:text-white">
                {categories.length || 7}
              </span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                Categories
              </span>
            </div>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search policies, admissions, timings, hostels, fees..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          {/* Category filter pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === 'All'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Article Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-48 animate-pulse rounded-2xl border border-slate-200 bg-white/60 p-5 dark:border-slate-800 dark:bg-slate-900/60"
              />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-800">
            <FolderTree className="mx-auto h-10 w-10 text-slate-400" />
            <h3 className="mt-3 text-sm font-semibold text-slate-800 dark:text-slate-200">
              No articles found
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              No matching knowledge entries found for "{searchQuery}". Try a different keyword or category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {articles.map((article) => {
              const colorClass = getCategoryColor(article.category);
              return (
                <div
                  key={article.id}
                  onClick={() => setSelectedArticle(article)}
                  className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs hover:border-indigo-400 hover:shadow-md cursor-pointer transition-all dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-indigo-600"
                >
                  <div>
                    {/* Top Category Badge & Reference */}
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold border ${colorClass}`}
                      >
                        {article.category}
                      </span>
                      {article.officialReference && (
                        <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 truncate max-w-[120px]">
                          {article.officialReference}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400 leading-snug">
                      {article.title}
                    </h3>

                    {/* Summary */}
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                      {article.summary}
                    </p>
                  </div>

                  {/* Footer actions */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1">
                      <span>Updated:</span>
                      <strong className="font-normal text-slate-600 dark:text-slate-300">{article.lastUpdated}</strong>
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAskInChat(`Tell me about ${article.title}`);
                      }}
                      className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2 py-1 text-[11px] font-semibold text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/70 dark:text-indigo-300 dark:hover:bg-indigo-900 transition"
                      title="Ask AI directly in chat"
                    >
                      <Sparkles className="h-3 w-3" />
                      <span>Ask AI</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Article Detail Modal */}
      <KnowledgeModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
        onAskAboutArticle={onAskInChat}
      />
    </div>
  );
};
