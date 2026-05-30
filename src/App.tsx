import React, { useState } from 'react';

interface Habit {
  id: number;
  text: string;
  completed: boolean;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'checklist' | 'insights'>('checklist');
  const [thought, setThought] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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

  // 🧠 The "Get Clarity" AI Processor Engine
  const handleGetClarity = () => {
    if (!thought.trim()) return;
    setIsLoading(true);
    setAiResponse(null);

    // Dynamic analysis engine based on the user's specific inputs
    setTimeout(() => {
      const lowerThought = thought.toLowerCase();
      let analysis = "";

      if (lowerThought.includes('work') || lowerThought.includes('job') || lowerThought.includes('task')) {
        analysis = "🎯 CLARITY ANALYSIS: Your executive focus is fractured by operational noise. Action plan: Isolate your top single high-impact target right now. Turn off all secondary notifications and execute a clean 25-minute block. Let go of the rest until tomorrow.";
      } else if (lowerThought.includes('stress') || lowerThought.includes('worry') || lowerThought.includes('anxious') || lowerThought.includes('feel')) {
        analysis = "🌿 CLARITY ANALYSIS: Emotional or mental overload detected. Your mind is trying to solve things all at once. Action plan: Take 3 slow, deep belly breaths right now. Write down what you can control on a physical piece of paper, and consciously park what you cannot control.";
      } else {
        analysis = "✨ CLARITY ANALYSIS: Mental static cleared. We have mapped your thoughts out of your working memory. Action plan: Protect your energy baseline. Choose one simple administrative task from your list, cross it out completely, and celebrate the clean momentum.";
      }

      setAiResponse(analysis);
      setIsLoading(false);
    }, 1200);
  };

  const completedCount = habits.filter(h => h.completed).length;
  const completionRate = habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#12141c] text-slate-100 font-sans flex flex-col items-center py-12 px-4 selection:bg-orange-500/30">
      
      {/* Main Container */}
      <div className="w-full max-w-2xl bg-[#1a1d29] rounded-2xl border border-slate-800 shadow-2xl p-6 md:p-8 space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-2 relative border-b border-slate-800 pb-6">
          <div className="absolute top-0 right-0 bg-amber-500/10 text-amber-500 font-medium text-xs px-2.5 py-1 rounded-full border border-amber-500/20">
            🔥 1 Day
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2">
            DailyClarity
          </h1>
          <p className="text-xs tracking-widest text-slate-400 uppercase font-semibold">
            Turn Mental Chaos Into Focused Calm
          </p>
        </div>

        {/* Brain Dump Input Section */}
        <div className="bg-[#222636] rounded-xl p-5 border border-slate-700/50 space-y-4">
          <label className="block text-sm font-medium text-slate-300">
            What's on your mind? Tasks, worries, random thoughts — just dump it all here...
          </label>
          <div className="relative">
            <textarea
              value={thought}
              onChange={(e) => setThought(e.target.value)}
              maxLength={500}
              rows={4}
              className="w-full bg-[#161924] border border-slate-700 rounded-lg p-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 resize-none transition-all text-sm"
              placeholder="Start typing your thoughts away..."
            />
            <div className="absolute bottom-3 right-3 text-xs text-slate-500 font-mono">
              {thought.length}/500
            </div>
          </div>
          <div className="flex justify-between items-center gap-2">
            <button
              onClick={() => { setThought(''); setAiResponse(null); }}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              Clear Input
            </button>
            <button 
              onClick={handleGetClarity}
              disabled={isLoading || !thought.trim()}
              className="w-full sm:w-auto px-6 py-2.5 bg-slate-100 hover:bg-white disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-bold rounded-xl shadow-lg shadow-black/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-sm"
            >
              {isLoading ? '🤖 Processing...' : '✨ Get Clarity'}
            </button>
          </div>
        </div>

        {/* AI Insight Real-time Output Panel */}
        {renderAiOutput(isLoading, aiResponse)}

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 gap-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab('checklist')}
            className={`pb-3 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'checklist' ? 'border-orange-500 text-orange-500 font-bold' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            📋 CHECKLIST
          </button>
          <button
            onClick={() => setActiveTab('insights')}
            className={`pb-3 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'insights' ? 'border-orange-500 text-orange-500 font-bold' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            📊 WEEKLY INSIGHTS
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === 'checklist' ? (
          <div className="space-y-6">
            {/* Habit Section Header */}
            <div>
              <h2 className="text-xs font-bold tracking-wider text-slate-400 uppercase">Presence Building</h2>
              <h3 className="text-xl font-bold text-white mt-1">Daily Wellness Habits</h3>
              <div className="text-xs text-slate-400 mt-1 font-medium bg-emerald-500/10 text-emerald-400 w-fit px-2 py-0.5 rounded border border-emerald-500/20">
                {completedCount}/{habits.length} Done ({completionRate}%)
              </div>
            </div>

            {/* Habit Items List */}
            <div className="space-y-2.5">
              {habits.map((habit) => (
                <div
                  key={habit.id}
                  onClick={() => handleToggleHabit(habit.id)}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer select-none transition-all duration-200 ${
                    habit.completed
                      ? 'bg-emerald-500/5 border-emerald-500/30 text-slate-400 line-through'
                      : 'bg-[#1e2231] border-slate-800 text-slate-200 hover:border-slate-700 hover:bg-[#23283a]'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                      habit.completed ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-600 bg-transparent'
                    }`}>
                      {habit.completed && (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm font-medium">{habit.text}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Custom Habit Form */}
            <form onSubmit={handleAddHabit} className="flex gap-2">
              <input
                type="text"
                value={newHabit}
                onChange={(e) => setNewHabit(e.target.value)}
                placeholder="Add custom habit (e.g., Read 10 pages) 📝..."
                className="flex-1 bg-[#161924] border border-slate-700/70 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
              />
              <button
                type="submit"
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-sm px-4 rounded-xl transition-all"
              >
                + Add
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Metrics Dashboard Layout */}
            <div>
              <h2 className="text-xs font-bold tracking-wider text-slate-400 uppercase">Metrics & Analysis</h2>
              <h3 className="text-xl font-bold text-white mt-1">Weekly Performance Insights</h3>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#1e2231] border border-slate-800 rounded-xl p-4 text-center">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completion Rate</div>
                <div className="text-2xl font-black text-white mt-1 font-mono">{completionRate}%</div>
              </div>
              <div className="bg-[#1e2231] border border-slate-800 rounded-xl p-4 text-center">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Weekly Streak</div>
                <div className="text-2xl font-black text-white mt-1 font-mono">0d</div>
              </div>
              <div className="bg-[#1e2231] border border-slate-800 rounded-xl p-4 text-center">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Check-ins</div>
                <div className="text-2xl font-black text-white mt-1 font-mono">{completedCount}/28</div>
              </div>
            </div>

            {/* Habit Consistency Progress Bars */}
            <div className="bg-[#1e2231] border border-slate-800 rounded-xl p-5 space-y-4">
              <h4 className="text-xs font-bold tracking-wider text-slate-400 uppercase">Habit Consistency Breakdown</h4>
              <div className="space-y-3">
                {habits.map(habit => (
                  <div key={habit.id} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-300">{habit.text}</span>
                      <span className="text-slate-400 font-mono">{habit.completed ? '1/7 days (14%)' : '0/7 days (0%)'}</span>
                    </div>
                    <div className="w-full bg-[#161924] h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${habit.completed ? 'bg-emerald-500 w-[14%]' : 'bg-slate-700 w-0'}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function renderAiOutput(isLoading: boolean, response: string | null) {
  if (isLoading) {
    return (
      <div className="bg-slate-800/30 border border-dashed border-slate-700 rounded-xl p-4 text-center text-sm text-slate-400 animate-pulse">
        🤖 AI Co-Pilot is analyzing your mental bandwidth alignment vectors...
      </div>
    );
  }
  if (response) {
    return (
      <div className="bg-indigo-950/40 border border-indigo-500/30 text-indigo-200 rounded-xl p-4 text-sm leading-relaxed shadow-inner">
        {response}
      </div>
    );
  }
  return null;
}
