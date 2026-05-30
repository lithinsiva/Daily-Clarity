import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, AlertCircle, Share2, Check, ExternalLink, Sun, Moon, Mic, MicOff } from "lucide-react";

interface Habit {
  id: number;
  text: string;
  completed: boolean;
}

export default function App() {
  // Core Application States
  const [thought, setThought] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'checklist' | 'insights'>('checklist');
  const [isListening, setIsListening] = useState(false);

  // Focus Timer Module States (25 mins)
  const [timeLeft, setTimeLeft] = useState(1500);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Daily Habits Checklist States
  const [habits, setHabits] = useState<Habit[]>([
    { id: 1, text: 'Drink sufficient water', completed: false },
    { id: 2, text: 'Move body & stretch', completed: false },
    { id: 3, text: 'Mindful breathing (3m)', completed: false },
    { id: 4, text: 'Digital sunset (screens off)', completed: false },
  ]);
  const [newHabitText, setNewHabitText] = useState('');

  // Pomodoro Timer Logic
  useEffect(() => {
    let timerCountdown: any = null;
    if (isTimerRunning && timeLeft > 0) {
      timerCountdown = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(timerCountdown);
  }, [isTimerRunning, timeLeft]);

  const toggleTimer = () => setIsTimerRunning(!isTimerRunning);
  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimeLeft(1500);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Checklist Actions
  const toggleHabit = (id: number) => {
    setHabits(habits.map((h) => (h.id === id ? { ...h, completed: !h.completed } : h)));
  };

  const addCustomHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitText.trim()) return;
    setHabits([...habits, { id: Date.now(), text: newHabitText.trim(), completed: false }]);
    setNewHabitText('');
  };

  // AI Response Simulation
  const handleGetClarity = () => {
    if (!thought.trim()) return;
    setIsLoading(true);
    setAiResponse(null);

    setTimeout(() => {
      setAiResponse(
        `🎯 ACTIONABLE PRIORITIES:\n1. Isolate your absolute single highest-impact target item.\n2. Lock down distractions for one deep-focus interval.\n\n🌿 INSIGHT: Focus on direction, not immediate perfection.`
      );
      setIsLoading(false);
    }, 1000);
  };

  const completedCount = habits.filter((h) => h.completed).length;
  const metricsPercent = habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#0d0e12] text-slate-200 font-sans flex flex-col items-center justify-start pt-8 pb-16 px-4">
      
      {/* Floating Focus Timer Block at the top */}
      <div className="w-full max-w-xl flex justify-end mb-4">
        <div className="bg-[#15171c] border border-slate-800/80 rounded-xl px-4 py-2 flex items-center gap-3 shadow-xl">
          <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Focus Mode</span>
          <div className="text-base font-black font-mono text-amber-500 tracking-tight">
            {formatTime(timeLeft)}
          </div>
          <button
            onClick={toggleTimer}
            className={`text-xs px-2 py-1 rounded font-bold transition-all ${
              isTimerRunning ? 'bg-amber-600/20 text-amber-400' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {isTimerRunning ? 'Pause' : 'Start'}
          </button>
          <button onClick={resetTimer} className="text-slate-500 hover:text-slate-300 text-xs font-bold">
            Reset
          </button>
        </div>
      </div>

      {/* Main Container Card matching your favorite look */}
      <div className="w-full max-w-xl bg-[#15171c] border border-slate-800/80 rounded-[28px] p-6 space-y-6 shadow-2xl">
        
        {/* App Title Header */}
        <div className="text-center space-y-1.5 pt-2">
          <div className="flex justify-center items-center gap-2">
            <h1 className="text-3xl font-black tracking-tight text-white">DailyClarity</h1>
            <span className="bg-amber-950/40 border border-amber-500/20 text-amber-500 text-[11px] font-black tracking-wide px-2.5 py-0.5 rounded-full shadow-sm">
              🔥 2 Days
            </span>
          </div>
          <p className="text-xs text-slate-400 font-semibold tracking-wide uppercase">
            Turn Mental Chaos Into Focused Calm
          </p>
        </div>

        {/* Brain Dump Input Field Area */}
        <div className="bg-[#1b1d24] border border-slate-800/60 rounded-2xl p-4 space-y-3">
          <textarea
            value={thought}
            onChange={(e) => setThought(e.target.value)}
            maxLength={500}
            rows={5}
            className="w-full bg-transparent text-slate-200 placeholder-slate-600 focus:outline-none resize-none text-sm leading-relaxed font-medium"
            placeholder="What's on your mind? Tasks, worries, random thoughts — just dump it all here..."
          />
          
          <div className="flex justify-between items-center pt-2 border-t border-slate-800/60 text-[11px] font-bold text-slate-500 font-mono">
            <button
              onClick={() => setIsListening(!isListening)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
                isListening ? 'bg-red-500/20 text-red-400' : 'bg-slate-800/40 text-slate-400 hover:bg-slate-800'
              }`}
            >
              {isListening ? <MicOff size={12} /> : <Mic size={12} />}
              Speak Thoughts
            </button>
            <span>{thought.length}/500</span>
          </div>
        </div>

        {/* Clean Gradient Get Clarity Button */}
        <button
          onClick={handleGetClarity}
          disabled={isLoading || !thought.trim()}
          className="w-full py-3.5 bg-gradient-to-b from-white to-slate-100 disabled:from-slate-800 disabled:to-slate-800 text-slate-950 disabled:text-slate-600 font-black rounded-2xl shadow-xl transition-all text-xs tracking-widest uppercase"
        >
          {isLoading ? 'Aligning Workspace...' : '✨ Get Clarity'}
        </button>

        {/* AI response display box */}
        {aiResponse && (
          <div className="bg-indigo-950/20 border border-indigo-500/20 rounded-2xl p-4 space-y-1">
            <span className="block text-[10px] font-black tracking-widest text-indigo-400 uppercase">AI Alignment Plan:</span>
            <p className="text-xs font-semibold text-slate-300 leading-relaxed whitespace-pre-wrap">{aiResponse}</p>
          </div>
        )}

        {/* Interactive Tabs Layout */}
        <div className="space-y-4 pt-2">
          <div className="flex border-b border-slate-800/80 gap-5 text-xs font-bold tracking-wider text-slate-500">
            <button
              onClick={() => setActiveTab('checklist')}
              className={`pb-2.5 border-b-2 transition-all ${
                activeTab === 'checklist' ? 'border-amber-500 text-white font-black' : 'border-transparent hover:text-slate-300'
              }`}
            >
              📋 CHECKLIST
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={`pb-2.5 border-b-2 transition-all ${
                activeTab === 'insights' ? 'border-amber-500 text-white font-black' : 'border-transparent hover:text-slate-300'
              }`}
            >
              📊 WEEKLY INSIGHTS
            </button>
          </div>

          {activeTab === 'checklist' ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">Presence Building</h4>
                  <h3 className="text-sm font-black text-white">Daily Wellness Habits</h3>
                </div>
                <span className="text-[11px] font-mono font-bold text-slate-400 bg-slate-900/60 px-2.5 py-1 rounded-md border border-slate-800">
                  {completedCount}/{habits.length} Done ({metricsPercent}%)
                </span>
              </div>

              <div className="space-y-2">
                {habits.map((h) => (
                  <div
                    key={h.id}
                    onClick={() => toggleHabit(h.id)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer select-none transition-all duration-150 ${
                      h.completed
                        ? 'bg-emerald-950/10 border-emerald-500/20 text-slate-500 line-through'
                        : 'bg-[#1b1d24] border-slate-800 text-slate-300 hover:bg-[#20232a]'
                    }`}
                  >
                    <span className="text-xs font-bold tracking-wide">{h.text}</span>
                    <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                      h.completed ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-600'
                    }`}>
                      {h.completed && (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Form Input to add custom items */}
              <form onSubmit={addCustomHabit} className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={newHabitText}
                  onChange={(e) => setNewHabitText(e.target.value)}
                  placeholder="Add custom habit..."
                  className="flex-1 bg-[#1b1d24] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-slate-700 font-medium"
                />
                <input type="submit" style={{display: 'none'}} />
                <button
                  type="submit"
                  className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs px-4 rounded-xl transition-all"
                >
                  + Add
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#1b1d24] border border-slate-800 rounded-xl p-3 text-center">
                  <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Completion</div>
                  <div className="text-xl font-black text-amber-500 font-mono mt-1">{metricsPercent}%</div>
                </div>
                <div className="bg-[#1b1d24] border border-slate-800 rounded-xl p-3 text-center">
                  <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Streak</div>
                  <div className="text-xl font-black text-amber-500 font-mono mt-1">{metricsPercent > 0 ? '2d' : '0d'}</div>
                </div>
                <div className="bg-[#1b1d24] border border-slate-800 rounded-xl p-3 text-center">
                  <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Check-ins</div>
                  <div className="text-xl font-black text-amber-500 font-mono mt-1">{completedCount}/{habits.length}</div>
                </div>
              </div>

              {/* Simple Pure CSS Graph Bar Matrix */}
              <div className="bg-[#1b1d24] border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Weekly Progress History</div>
                <div className="h-16 flex items-end gap-2.5 pt-2 border-b border-l border-slate-800/80 px-2">
                  <div className="w-full bg-amber-500/10 h-[30%] rounded-t" />
                  <div className="w-full bg-amber-500/10 h-[45%] rounded-t" />
                  <div className="w-full bg-amber-500/10 h-[20%] rounded-t" />
                  <div className="w-full bg-amber-500/20 h-[65%] rounded-t" />
                  <div className="w-full bg-amber-500/10 h-[40%] rounded-t" />
                  <div className={`w-full rounded-t transition-all ${metricsPercent > 0 ? 'bg-amber-500 shadow-md' : 'bg-amber-500/10'}`} style={{ height: `${Math.max(metricsPercent, 10)}%` }} />
                  <div className="w-full bg-amber-500/10 h-[15%] rounded-t" />
                </div>
                <div className="flex justify-between text-[9px] font-bold text-slate-600 uppercase font-mono tracking-widest px-0.5">
                  <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
