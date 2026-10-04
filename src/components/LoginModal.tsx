import React, { useState } from 'react';
import {
  X,
  GraduationCap,
  Lock,
  Mail,
  User,
  CheckCircle2,
  Building,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { UserProfile } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserProfile) => void;
}

const DEMO_STUDENT: UserProfile = {
  id: 'usr-student-01',
  name: 'Aarav Sharma',
  email: 'aarav.sharma@aiet-campus.edu.in',
  role: 'student',
  rollNumber: '22CSE042',
  department: 'Computer Science & Engineering',
  semester: '5th Semester',
  cgpa: 8.64,
  attendancePercent: 84,
  hostelResident: true,
};

const DEMO_FACULTY: UserProfile = {
  id: 'usr-faculty-01',
  name: 'Dr. Sunita Kulkarni',
  email: 'hod.ece@aiet-campus.edu.in',
  role: 'faculty',
  rollNumber: 'FAC-EC-102',
  department: 'Electronics & Communication',
  semester: 'Faculty / HOD',
};

const DEMO_APPLICANT: UserProfile = {
  id: 'usr-applicant-01',
  name: 'Priya Mehra',
  email: 'priya.mehra@gmail.com',
  role: 'applicant',
  department: 'Prospective 2026 B.Tech',
};

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
}) => {
  const [activeTab, setActiveTab] = useState<'student' | 'faculty' | 'applicant'>('student');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Please enter your Student Roll Number or Campus Email.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    // Create user profile from input
    const isEmail = identifier.includes('@');
    const user: UserProfile = {
      id: `usr-${Date.now()}`,
      name: isEmail ? identifier.split('@')[0].replace('.', ' ') : identifier.toUpperCase(),
      email: isEmail ? identifier : `${identifier.toLowerCase()}@aiet-campus.edu.in`,
      role: activeTab,
      rollNumber: !isEmail ? identifier.toUpperCase() : '23CSE099',
      department: activeTab === 'faculty' ? 'Electronics & Communication' : 'Computer Science & Engineering',
      semester: activeTab === 'faculty' ? 'Faculty / Staff' : '3rd Year B.Tech',
      attendancePercent: 82,
      cgpa: 8.2,
      hostelResident: true,
    };

    onLogin(user);
    onClose();
  };

  const handleQuickLogin = (profile: UserProfile) => {
    onLogin(profile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-600 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur-xs text-white">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold leading-tight">AIET Campus Portal</h3>
                <p className="text-xs text-indigo-100">Sign in to your university account</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-white/80 hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Account Type Tabs */}
          <div className="mt-4 flex rounded-xl bg-black/20 p-1">
            <button
              type="button"
              onClick={() => { setActiveTab('student'); setError(null); }}
              className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition ${
                activeTab === 'student' ? 'bg-white text-indigo-900 shadow-xs' : 'text-white/80 hover:text-white'
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('faculty'); setError(null); }}
              className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition ${
                activeTab === 'faculty' ? 'bg-white text-indigo-900 shadow-xs' : 'text-white/80 hover:text-white'
              }`}
            >
              Faculty
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('applicant'); setError(null); }}
              className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition ${
                activeTab === 'applicant' ? 'bg-white text-indigo-900 shadow-xs' : 'text-white/80 hover:text-white'
              }`}
            >
              Applicant
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Quick Demo Sign In Cards (1-Click) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              <span>Quick 1-Click Demo Profiles</span>
              <Sparkles className="h-3 w-3 text-indigo-500" />
            </div>

            {activeTab === 'student' && (
              <button
                type="button"
                onClick={() => handleQuickLogin(DEMO_STUDENT)}
                className="w-full flex items-center justify-between rounded-xl border border-indigo-200/80 bg-indigo-50/60 p-3 text-left hover:bg-indigo-100/70 hover:border-indigo-400 transition group dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-xs">
                    AS
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {DEMO_STUDENT.name}
                      </span>
                      <span className="rounded bg-indigo-100 px-1.5 py-0.2 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                        {DEMO_STUDENT.rollNumber}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      3rd Year B.Tech CSE · Attendance: 84%
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-indigo-600 group-hover:translate-x-0.5 transition-transform dark:text-indigo-400" />
              </button>
            )}

            {activeTab === 'faculty' && (
              <button
                type="button"
                onClick={() => handleQuickLogin(DEMO_FACULTY)}
                className="w-full flex items-center justify-between rounded-xl border border-purple-200/80 bg-purple-50/60 p-3 text-left hover:bg-purple-100/70 hover:border-purple-400 transition group dark:border-purple-900/60 dark:bg-purple-950/40 dark:hover:bg-purple-900/50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600 text-white font-bold text-xs shadow-xs">
                    SK
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">
                        {DEMO_FACULTY.name}
                      </span>
                      <span className="rounded bg-purple-100 px-1.5 py-0.2 text-[10px] font-semibold text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                        HOD ECE
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Electronics & Comm. · Cabin EC-102
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-purple-600 group-hover:translate-x-0.5 transition-transform dark:text-purple-400" />
              </button>
            )}

            {activeTab === 'applicant' && (
              <button
                type="button"
                onClick={() => handleQuickLogin(DEMO_APPLICANT)}
                className="w-full flex items-center justify-between rounded-xl border border-emerald-200/80 bg-emerald-50/60 p-3 text-left hover:bg-emerald-100/70 hover:border-emerald-400 transition group dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-xs">
                    PM
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                        {DEMO_APPLICANT.name}
                      </span>
                      <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                        Applicant
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Prospective B.Tech Student (Admissions)
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-emerald-600 group-hover:translate-x-0.5 transition-transform dark:text-emerald-400" />
              </button>
            )}
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full dark:border-slate-800" />
            <span className="bg-white dark:bg-slate-900 px-3 text-[11px] uppercase tracking-wider text-slate-400 font-medium">
              Or sign in with ID
            </span>
          </div>

          {/* Error notice */}
          {error && (
            <div className="rounded-lg bg-red-50 p-2.5 text-xs text-red-700 border border-red-200 dark:bg-red-950/50 dark:border-red-900 dark:text-red-300">
              {error}
            </div>
          )}

          {/* Manual Credentials Form */}
          <form onSubmit={handleManualSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {activeTab === 'student' ? 'Student Roll Number or Email' : 'Campus Email ID'}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={activeTab === 'student' ? 'e.g. 22CSE042 or student@aiet.edu' : 'e.g. faculty@aiet-campus.edu.in'}
                  className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Password / ERP PIN
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>Remember session</span>
              </label>
              <a
                href="#forgot"
                onClick={(e) => { e.preventDefault(); setError('Please contact IT Desk: support@aiet-campus.edu.in or Counter 4.'); }}
                className="text-indigo-600 hover:underline dark:text-indigo-400"
              >
                Forgot PIN?
              </a>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-indigo-600 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 active:scale-[0.99] transition mt-2"
            >
              Sign In to CampusAssist
            </button>
          </form>

          <p className="text-center text-[11px] text-slate-400 dark:text-slate-500">
            Official Authentication Portal · Apex Institute of Engineering & Technology
          </p>
        </div>
      </div>
    </div>
  );
};
