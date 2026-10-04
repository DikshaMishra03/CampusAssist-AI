import React from 'react';
import {
  Clock,
  FileText,
  FileCheck,
  Briefcase,
  GraduationCap,
  CreditCard,
  Building,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { UserProfile } from '../types';

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void;
  user?: UserProfile | null;
}

const DEFAULT_QUESTIONS = [
  {
    text: 'What are the college timings?',
    category: 'Academics',
    icon: Clock,
  },
  {
    text: 'How do I apply for a bonafide certificate?',
    category: 'Student Services',
    icon: FileText,
  },
  {
    text: 'What documents are required for admission?',
    category: 'Admissions',
    icon: FileCheck,
  },
  {
    text: 'How can I contact the placement cell?',
    category: 'Placements',
    icon: Briefcase,
  },
  {
    text: 'What is the attendance requirement?',
    category: 'Academics',
    icon: GraduationCap,
  },
  {
    text: 'What should I do if I lose my student ID?',
    category: 'Student Services',
    icon: CreditCard,
  },
  {
    text: 'Does the college provide hostel facilities?',
    category: 'Student Services',
    icon: Building,
  },
  {
    text: 'When are semester examinations conducted?',
    category: 'Academics',
    icon: HelpCircle,
  },
];

export const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({ onSelect, user }) => {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6">
      <div className="text-center mb-6">
        {user ? (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Signed in as {user.name} ({user.role})</span>
          </div>
        ) : null}

        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {user ? `Welcome back, ${user.name.split(' ')[0]}!` : 'Welcome to CampusAssist AI'}
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
          The verified intelligent assistant for Apex Institute of Engineering & Technology. Ask questions about admissions, academics, campus life, departments, and services.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {DEFAULT_QUESTIONS.map((q, idx) => {
          const Icon = q.icon;
          return (
            <button
              key={idx}
              onClick={() => onSelect(q.text)}
              className="flex items-start gap-3 rounded-xl border border-slate-200/90 bg-white p-3 text-left shadow-2xs hover:border-indigo-400 hover:bg-indigo-50/40 hover:shadow-xs transition dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-indigo-700 dark:hover:bg-slate-800/80 group"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400 group-hover:scale-105 transition-transform">
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  {q.text}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                  {q.category}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
