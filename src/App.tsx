import React, { useState, useEffect } from 'react';

interface Habit {
  id: number;
  text: string;
  completed: boolean;
}

export default function App() {
  // --- Brain Dump & AI State ---
  const [thought, setThought] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // --- Tab Navigation State ---
  const [activeTab, setActiveTab] = useState<'checklist' | 'insights'>('checklist');

  // --- Focus Timer State (25 Minutes = 1500 Seconds) ---
  const [timeLeft, setTimeLeft] = useState(1500);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // --- Habits Tracker State ---
  const [habits, setHabits] = useState<Habit[]>([
    { id: 1, text: 'Drink sufficient water', completed: false },
    { id: 2, text: 'Move body & stretch', completed: false },
    { id: 3, text: 'Mindful breathing (3m)', completed: false },
    { id: 4, text: 'Digital sunset (screens off)', completed: false },
  ]);
  const [newHabit, setNewHabit] = useState('');

  // --- Focus Timer Logic Hooks ---
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // --- Habit Management Actions ---
  const handleToggleHabit = (id: number) => {
    setHabits(habits.map(h => h.id === id ? { ...h, completed: !h.completed } : h));
  };

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabit.trim()) return;
    setHabits([...habits, { id: Date.now(), text: newHabit.trim(), completed: false }]);
    setNewHabit('');
  };

  // --- Brain Dump AI Prompt Logic Simulation ---
  const handleGetClarity = () => {
    if (!thought.trim()) return;
    setIsLoading(true);
    setAiResponse(null);

    setTimeout(() => {
      const lowerThought = thought.toLowerCase();
      let responseText = "";

      if (lowerThought.includes('work') || lowerThought.includes('task') || lowerThought.includes('study') || lowerThought.includes('exam')) {
        responseText = "🎯 EXECUTIVE FOCUS ALIGNMENT:\n\nYour cognitive bandwidth is currently divided among multiple operational variables. To rebuild execution momentum:\n\n1. Isolate your absolute single highest-impact target right now.\n2. Turn off all secondary device notifications.\n3. Run one dedicated 25-minute focused execution block using the timer below.";
      } else if (lowerThought.includes('stress') || lowerThought.includes('worry') || lowerThought.includes('anxious') || lowerThought.includes('tired') || lowerThought.includes('overwhelm')) {
        responseText = "🌿 MENTAL STRESS MITIGATION:\n\nHigh working-memory load detected. Your mind is trying to simulate solutions to multiple future problems simultaneously.\n\nAction Step: Take 3 slow, deep abdominal breaths immediately. Complete the 'Mindful breathing' item in your checklist layout below.";
      } else {
        responseText = "✨ COGNITIVE SPACE OPTIMIZATION:\n\nMental static successfully externalized from your working memory workspace!\n\nAction Step: Protect this clear space. Choose one micro-task from your daily routine, complete it immediately, and check it off.";
      }

      setAiResponse(responseText);
      setIsLoading(false);
    }, 1000);
  };

  // --- Metrics Calculations ---
  const completedCount = habits.filter(h => h.completed).length;
  const completionRate = habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#11131e] text-slate-100 font-sans flex flex-col items-center py-10 px-4 selection:bg-indigo-500/30">
      <div className="w-full max-w-5xl bg-[#1a1d2c] rounded-2xl border border-slate-800 shadow-2xl p-6 md:p-8 space-y-8">
        
        {/* Global Header Bar Component */}
        <div className="flex flex-col sm:flex-row justify-between items-center border-b border-slate-800 pb-6 gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-4xl font-black tracking-tight text-white">DailyClarity</h1>
            <p className="text-xs tracking-widest text-slate-400 uppercase font-bold mt-1">
              Turn Mental Chaos Into Focused Calm
            </p>
          </div>
          
          {/* Integrated Pomodoro Focus Engine */}
          <div className="bg-[#222638] border border-slate-700/50 rounded-xl px-5 py-3 flex items-center gap-4 shadow-inner">
            <div className="text-center">
              <div className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Focus Timer</div>
              <div className="text-2xl font-black font-mono text-white mt-0.5 tracking-tight">{formatTime(timeLeft)}</div>
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                  isTimerRunning ? 'bg-amber-600 text-white hover:bg-amber-500' : 'bg-white text-slate-950 hover:bg-slate-100'
                }`}
              >
                {isTimerRunning ? 'Pause' : 'Start'}
              </button>
              <button
                onClick={() => { setIsTimerRunning(false); setTimeLeft(1500); }}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 px-2.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Two-Column Workspace Layout (Directly matching Google AI Studio screenshots) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          
          {/* Left Panel: Brain Dump input field area */}
          <div className="bg-[#222638] rounded-xl p-5 border border-slate-700/40 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold tracking-wider text-slate-300 uppercase">
                What's on your mind? Tasks, worries, random thoughts — just dump it all here...
              </label>
              <textarea
                value={thought}
                onChange={(e) => setThought(e.target.value)}
                maxLength={500}
                rows={7}
                className="w-full bg-[#161926] border border-slate-700 rounded-lg p-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 resize-none text-sm leading-relaxed font-medium"
                placeholder="Start typing your thoughts away to clear up cognitive load..."
              />
              <div className="text-[10px] font-mono text-slate-500 text-right">{thought.length}/500</div>
            </div>
            
            <div className="flex justify-between items-center pt-1">
              <button
                onClick={() => { setThought(''); setAiResponse(null); }}
                className="text-xs text-slate-400 hover:text-slate-200 transition-colors font-medium underline decoration-slate-600"
              >
                Clear Input
              </button>
              
              <button 
                onClick={handleGetClarity}
                disabled={isLoading || !thought.trim()}
                className="px-6 py-2.5 bg-white text-slate-950 hover:bg-slate-100 disabled:bg-slate-800 disabled:text-slate-600 font-black rounded-xl shadow-md transition-all text-xs tracking-wider uppercase"
              >
                {isLoading ? 'Processing...' : 'Get Clarity ✨'}
              </button>
            </div>
          </div>

          {/* Right Panel: AI Response Workspace Output */}
          <div className="bg-[#222638] rounded-xl p-5 border border-slate-700/40 flex flex-col space-y-2 min-h-[240px]">
            <span className="block text-xs font-bold tracking-wider text-slate-300 uppercase">
              AI Response:
            </span>
            
            <div className="flex-1 bg-[#161926] border border-slate-700 rounded-lg p-4 flex flex-col justify-start overflow-y-auto">
              {isLoading ? (
                <div className="text-indigo-400 text-xs font-bold tracking-wide animate-pulse flex items-center gap-2 m-auto">
                  🤖 Running alignment metrics diagnostics...
                </div>
              ) : aiResponse ? (
                <div className="text-xs font-medium text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                  {aiResponse}
                </div>
              ) : (
                <div className="text-xs text-slate-500 font-medium italic m-auto text-center max-w-[240px]">
                  Your clear action-plan priorities will build out dynamically inside this workspace window module.
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Dashboard Tabbed Navigation Sub-System Module */}
        <div className="space-y-6 pt-4 border-t border-slate-800">
          <div className="flex border-b border-slate-800 gap-6 text-xs font-bold tracking-wider">
            <button
              onClick={() => setActiveTab('checklist')}
              className={`pb-3 border-b-2 transition-all ${
                activeTab === 'checklist' ? 'border-indigo-500 text-indigo-400 font-black' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              📋 CHECKLIST
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={`pb-3 border-b-2 transition-all ${
                activeTab === 'insights' ? 'border-indigo-500 text-indigo-400 font-black' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              📊 WEEKLY INSIGHTS
            </button>
          </div>

          {/* Tab Content Display Logic Controllers */}
          {activeTab === 'checklist' ? (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <h2 className="text-xs font-bold tracking-wider text-slate-400 uppercase">Presence Building</h2>
                <h3 className="text-xl font-black text-white mt-0.5">Daily Wellness Habits</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {habits.map((habit) => (
                  <div
                    key={habit.id}
                    onClick={() => handleToggleHabit(habit.id)}
                    className={`flex items-center gap-3.5 p-4 rounded-xl border cursor-pointer select-none transition-all duration-150 ${
                      habit.completed
                        ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-400 line-through'
                        : 'bg-[#222638] border-slate-800 text-slate-200 hover:border-slate-700 hover:bg-[#282d42]'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                      habit.completed ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-600 bg-transparent'
                    }`}>
                      {habit.completed && (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className="text-xs font-bold tracking-wide">{habit.text}</span>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddHabit} className="flex gap-2 max-w-md pt-2">
                <input
                  type="text"
                  value={newHabit}
                  onChange={(e) => setNewHabit(e.target.value)}
                  placeholder="Formulate custom target objective habit..."
                  className="flex-1 bg-[#161924] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-slate-600 transition-colors"
                />
                <button
                  type="submit"
                  className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs px-4 rounded-xl transition-all"
                >
                  + Add
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h2 className="text-xs font-bold tracking-wider text-slate-400 uppercase">Performance Metrics</h2>
                <h3 className="text-xl font-black text-white mt-0.5">Overall Weekly Progress</h3>
              </div>

              {/* Analytics Metric Cards Grid System Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#222638] border border-slate-800 rounded-xl p-4 text-center shadow-md">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Completion Rate</div>
                  <div className="text-3xl font-black text-indigo-400 mt-1.5 font-mono">{completionRate}%</div>
                </div>
                <div className="bg-[#222638] border border-slate-800 rounded-xl p-4 text-center shadow-md">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Weekly Streak</div>
                  <div className="text-3xl font-black text-indigo-400 mt-1.5 font-mono">{completionRate > 50 ? '1d' : '0d'}</div>
                </div>
                <div className="bg-[#222638] border border-slate-800 rounded-xl p-4 text-center shadow-md">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Check-ins</div>
                  <div className="text-3xl font-black text-indigo-400 mt-1.5 font-mono">{completedCount} / {habits.length}</div>
                </div>
              </div>

              {/* Simple Embedded SVG/CSS Visual Layout Chart Component */}
              <div className="bg-[#222638] border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-300">Daily Reflection Strength Profile</div>
                <div className="h-24 flex items-end gap-3 pt-4 border-b border-l border-slate-700/60 px-3 relative">
                  <div className="w-full bg-indigo-500/10 h-[20%] rounded-t hover:bg-indigo-500/20 transition-all" />
                  <div className="w-full bg-indigo-500/10 h-[35%] rounded-t hover:bg-indigo-500/20 transition-all" />
                  <div className="w-full bg-indigo-500/10 h-[15%] rounded-t hover:bg-indigo-500/20 transition-all" />
                  <div className="w-full bg-indigo-500/10 h-[50%] rounded-t hover:bg-indigo-500/20 transition-all" />
                  <div className="w-full bg-indigo-500/20 h-[40%] rounded-t hover:bg-indigo-500/30 transition-all" />
                  <div className={`w-full rounded-t transition-all ${completionRate > 0 ? 'bg-indigo-500' : 'bg-indigo-500/10'}`} style={{ height: `${Math.max(completionRate, 10)}%` }} />
                  <div className="w-full bg-indigo-500/10 h-[5%] rounded-t" />
                </div>
                <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono px-1">
                  <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
