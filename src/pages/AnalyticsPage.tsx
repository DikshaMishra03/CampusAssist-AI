import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  MessageSquare,
  Users,
  HelpCircle,
  ShieldCheck,
  Server,
  Cpu,
  RefreshCw,
  Clock,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { AnalyticsData } from '../types';
import { getAnalytics, checkServerHealth } from '../services/api';

export const AnalyticsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [health, setHealth] = useState<{ status: string; geminiConfigured: boolean; model: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [analyticsData, healthData] = await Promise.all([
        getAnalytics(),
        checkServerHealth().catch(() => null),
      ]);
      setAnalytics(analyticsData);
      setHealth(healthData);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const maxHits = analytics?.categoryDistribution.reduce((max, item) => Math.max(max, item.count), 1) || 1;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50/60 dark:bg-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 ring-1 ring-inset ring-amber-700/20 dark:bg-amber-950/60 dark:text-amber-300">
                Admin & Operations View
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">· Demo Environment</span>
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Assistant Analytics & Insights
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl">
              Real-time telemetry on student queries, knowledge coverage, category distribution, and system performance.
            </p>
          </div>

          <button
            onClick={loadData}
            disabled={isLoading}
            className="inline-flex items-center gap-2 self-start sm:self-auto rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 active:scale-95 transition dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin text-indigo-600' : ''}`} />
            <span>Refresh Telemetry</span>
          </button>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Conversations</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {analytics?.totalConversations ?? 0}
            </p>
            <p className="mt-1 text-[11px] text-slate-400">Recorded sessions</p>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Messages</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400">
                <MessageSquare className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {analytics?.totalMessages ?? 0}
            </p>
            <p className="mt-1 text-[11px] text-slate-400">User & Assistant turns</p>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Knowledge Articles</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/80 dark:text-blue-400">
                <Layers className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {analytics?.totalArticles ?? 20}
            </p>
            <p className="mt-1 text-[11px] text-slate-400">Across {analytics?.totalCategories ?? 7} categories</p>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Unanswered Queries</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/80 dark:text-rose-400">
                <HelpCircle className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {analytics?.totalUnanswered ?? 0}
            </p>
            <p className="mt-1 text-[11px] text-slate-400">Identified knowledge gaps</p>
          </div>
        </div>

        {/* 2-Column Section: Category Distribution & System Architecture */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Distribution Chart */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Most Common Question Categories
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Distribution of student requests across campus domains
                </p>
              </div>
              <BarChart3 className="h-4 w-4 text-indigo-500" />
            </div>

            <div className="space-y-3.5 mt-4">
              {analytics?.categoryDistribution && analytics.categoryDistribution.length > 0 ? (
                analytics.categoryDistribution.map((item) => {
                  const percentage = Math.round((item.count / maxHits) * 100);
                  return (
                    <div key={item.category} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-medium">
                        <span className="text-slate-700 dark:text-slate-300">{item.category}</span>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {item.count} queries
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center text-xs text-slate-400">
                  No category telemetry recorded yet.
                </div>
              )}
            </div>
          </div>

          {/* System Architecture & Health */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Architecture & Safety Health
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Subsystem configuration and LLM grounding metrics
                </p>
              </div>
              <Cpu className="h-4 w-4 text-emerald-500" />
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              <div className="py-3 flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <Cpu className="h-3.5 w-3.5 text-indigo-500" />
                  Primary LLM Engine
                </span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  Google Gemini 3.8 Flash
                </span>
              </div>

              <div className="py-3 flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  API Key Security
                </span>
                <span className="inline-flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Server-Side Only (Zero Client Leak)
                </span>
              </div>

              <div className="py-3 flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-indigo-500" />
                  Retrieval Layer
                </span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  Modular Ranked Scoring (Vector DB Ready)
                </span>
              </div>

              <div className="py-3 flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <Server className="h-3.5 w-3.5 text-blue-500" />
                  Conversation Context
                </span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  Multi-turn Context Memory (In-Memory / Extensible)
                </span>
              </div>

              <div className="py-3 flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Anti-Hallucination Policy
                </span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  Strict Knowledge Grounding Enforced
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Unanswered Queries Table (Knowledge Gap Detection) */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Unanswered Queries & Knowledge Gaps
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Log of student questions where the AI correctly declined to hallucinate and requested departmental intervention
              </p>
            </div>
            <span className="rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
              {analytics?.unansweredQueries.length ?? 0} Recorded
            </span>
          </div>

          {analytics?.unansweredQueries && analytics.unansweredQueries.length > 0 ? (
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 dark:border-slate-800">
                    <th className="pb-2 font-semibold">User Query</th>
                    <th className="pb-2 font-semibold">Logged At</th>
                    <th className="pb-2 font-semibold">Action Required</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {analytics.unansweredQueries.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 font-medium text-slate-800 dark:text-slate-200">
                        "{item.query}"
                      </td>
                      <td className="py-2.5 text-slate-500">
                        {new Date(item.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-2.5">
                        <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/60">
                          Review for KB Addition
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-400 dark:border-slate-800">
              <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500 mb-2 opacity-80" />
              <span>All user questions to date have been successfully resolved by the knowledge base!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
