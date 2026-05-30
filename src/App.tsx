import React, { useState } from 'react';

interface Habit {
  id: number;
  text: string;
  completed: boolean;
}

export default function App() {
  const [thought, setThought] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Exact initial habits from your workspace setup
  const [habits, setHabits] = useState<Habit[]>([
    { id: 1, text: 'Drink sufficient water', completed: false },
    { id: 2, text: 'Move body & stretch', completed: false },
    { id: 3, text: 'Mindful breathing (3m)', completed: false },
    { id: 4, text: 'Digital sunset (screens off)', completed: false },
  ]);
  const [newHabit, setNewHabit] = useState('');

  const handleToggleHabit = (id: number) => {
    setHabits(habits.map(h => h.id === id ? { ...h, completed: !h.completed } : h));
  };

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabit.trim()) return;
    setHabits([...habits, { id: Date.now(), text: newHabit.trim(), completed: false }]);
    setNewHabit('');
  };

  // 🧠 Exact "Get Clarity" Processing Logic Engine
  const handleGetClarity = () => {
    if (!thought.trim()) return;
    setIsLoading(true);
    setAiResponse(null);

    // Matches the analytical logic structure from Google AI Studio
    setTimeout(() => {
      const lowerThought = thought.toLowerCase();
      let responseText = "";

      if (lowerThought.includes('work') || lowerThought.includes('task') || lowerThought.includes('study') || lowerThought.includes('exam')) {
        responseText = "🎯 EXECUTIVE FOCUS ALIGNMENT:\n\nYour cognitive bandwidth is currently divided among multiple operational variables. To rebuild execution momentum:\n1. Isolate your absolute single highest-impact target right now.\n2. Turn off all secondary device notifications.\n3. Run one dedicated 25-minute focused execution block. Park all secondary items until this block is complete.";
      } else if (lowerThought.includes('stress') || lowerThought.includes('worry') || lowerThought.includes('anxious') || lowerThought.includes('tired') || lowerThought.includes('overwhelm')) {
        responseText = "🌿 MENTAL STRESS MITIGATION:\n\nHigh working-memory load detected. Your mind is trying to simulate solutions to multiple future problems simultaneously.\n\nAction Step: Take 3 slow, deep abdominal breaths immediately. Document everything you can actively control right now on a physical notepad, and consciously give yourself permission to release the variables you cannot control.";
      } else {
        responseText = "✨ COGNITIVE SPACE OPTIMIZATION:\n\nMental static successfully externalized from your working memory workspace! \n\nAction Step: Look at your 'Presence Building' checklist below. Pick one immediate wellness habit, complete it, and check it off to establish a positive momentum loops.";
      }

      setAiResponse(responseText);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#11131e] text-slate-100 font-sans flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-4xl bg-[#1a1d2c] rounded-2xl border border-slate-800 shadow-2xl p-6 md:p-8 space-y-8">
        
        {/* Header Section */}
        <div className="text-center relative border-b border-slate-800 pb-5">
          <div className="absolute top-0 right-0 bg-amber-500/10 text-amber-500 font-semibold text-xs px-3 py-1 rounded-full border border-amber-500/20">
            🔥 1 Day Streak
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white">DailyClarity</h1>
          <p className="text-xs tracking-widest text-slate-400 uppercase font-bold mt-1">
            Turn Mental Chaos Into Focused Calm
          </p>
        </div>

        {/* Two-Column Middle Layout - Exact replica of Google AI Studio Photo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          
          {/* Left Column: Thought Input Frame */}
          <div className="bg-[#222638] rounded-xl p-5 border border-slate-700/40 space-y-4 h-full flex flex-col justify-between">
            <div>
              <label className="block text-xs font-bold tracking-wider text-slate-400 uppercase mb-2">
                Brain Dump Workspace
              </label>
              <textarea
                value={thought}
                onChange={(e) => setThought(e.target.value)}
                maxLength={500}
                rows={6}
                className="w-full bg-[#161926] border border-slate-700/80 rounded-lg p-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500/40 resize-none text-sm leading-relaxed"
                placeholder="What's on your mind? Tasks, worries, random thoughts — just dump it all here..."
              />
            </div>
            
            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => { setThought(''); setAiResponse(null); }}
                className="text-xs text-slate-400 hover:text-slate-200 transition-colors underline decoration-slate-600 font-medium"
              >
                Clear Input
              </button>
              
              <button 
                onClick={handleGetClarity}
                disabled={isLoading || !thought.trim()}
                className="px-6 py-2.5 bg-black hover:bg-slate-900 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center text-xs tracking-wider uppercase"
              >
                {isLoading ? 'Processing...' : 'Get Clarity'}
              </button>
            </div>
          </div>

          {/* Right Column: AI Live Analytics Frame */}
          <div className="bg-[#222638] rounded-xl p-5 border border-slate-700/40 min-h-[220px] flex flex-col">
            <span className="block text-xs font-bold tracking-wider text-slate-400 uppercase mb-3">
              AI Response Workspace
            </span>
            
            <div className="flex-1 flex flex-col justify-center">
              {isLoading ? (
                <div className="text-center text-xs text-orange-400 font-medium animate-pulse">
                  🤖 Analyzing cognitive vectors...
                </div>
              ) : aiResponse ? (
                <div className="bg-[#161926] border border-slate-700 rounded-lg p-4 text-xs font-medium text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {aiResponse}
                </div>
              ) : (
                <div className="text-center text-xs text-slate-500 font-medium italic">
                  Your structured breakdown will generate here once you click "Get Clarity".
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Lower Row: Daily Wellness Habits Checklist */}
        <div className="border-t border-slate-800 pt-6 space-y-4">
          <div>
            <h2 className="text-xs font-bold tracking-wider text-slate-400 uppercase">Presence Building</h2>
            <h3 className="text-xl font-black text-white mt-0.5">Daily Wellness Habits</h3>
          </div>

          {/* Interactive Checkboxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {habits.map((habit) => (
              <div
                key={habit.id}
                onClick={() => handleToggleHabit(habit.id)}
                className={`flex items-center gap-3.5 p-4 rounded-xl border cursor-pointer select-none transition-all ${
                  habit.completed
                    ? 'bg-emerald-500/5 border-emerald-500/30 text-slate-400 line-through'
                    : 'bg-[#222638] border-slate-800 text-slate-200 hover:border-slate-700'
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
                <span className="text-xs font-bold">{habit.text}</span>
              </div>
            ))}
          </div>

          {/* Quick Add Custom Habits */}
          <form onSubmit={handleAddHabit} className="flex gap-2 max-w-md pt-2">
            <input
              type="text"
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              placeholder="Add custom target objective..."
              className="flex-1 bg-[#161924] border border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs px-4 rounded-xl transition-all"
            >
              + Add
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
