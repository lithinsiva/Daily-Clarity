import React, { useState } from 'react';
import { 
  Sparkles, RefreshCw, Share2, Trash2, Edit2, 
  CheckSquare, BarChart2, Calendar, X, RotateCcw
} from 'lucide-react';

interface Habit {
  id: string;
  text: string;
  completed: boolean;
}

interface ActionPlan {
  steps: string[];
  insight: string;
}

export default function App() {
  // --- STATE ENVIRONMENT ---
  const [thought, setThought] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [actionPlan, setActionPlan] = useState<ActionPlan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'checklist' | 'insights'>('checklist');

  // Integration Settings
  const [notionKey, setNotionKey] = useState('secret_••••••••••••••••••••');
  const [notionDatabaseId, setNotionDatabaseId] = useState('');
  const [isParentDb, setIsParentDb] = useState(false);

  // Focus Parameters
  const [timerInput, setTimerInput] = useState<number>(25);

  // Habits Vector
  const [habits, setHabits] = useState<Habit[]>([
    { id: '1', text: 'Drink sufficient water', completed: false },
    { id: '2', text: 'Move body & stretch', completed: false },
    { id: '3', text: 'Mindful breathing (3m)', completed: false },
    { id: '4', text: 'Digital sunset (screens off)', completed: false }
  ]);
  const [newHabitText, setNewHabitText] = useState('');

  // --- HANDLERS ---
  const handleGetClarity = () => {
    if (!thought.trim()) return;
    setIsLoading(true);
    
    setTimeout(() => {
      setActionPlan({
        steps: [
          'Take a moment to acknowledge your feelings and practice deep breathing.',
          'Identify one small, achievable task to focus on and complete.',
          'Plan a brief, restorative break for yourself later today.'
        ],
        insight: 'You can gently release the pressure of needing to solve everything at once; simply focus on this moment.'
      });
      setIsLoading(false);
      setIsModalOpen(true); // Triggers the clean popup modal animation loop
    }, 800);
  };

  const handleToggleHabit = (id: string) => {
    setHabits(habits.map(h => h.id === id ? { ...h, completed: !h.completed } : h));
  };

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitText.trim()) return;
    setHabits([...habits, {
      id: Date.now().toString(),
      text: newHabitText.trim(),
      completed: false
    }]);
    setNewHabitText('');
  };

  return (
    <div className="min-h-screen bg-[#0f1011] text-[#e3e4e6] font-sans antialiased relative">
      
      {/* HEADER SECTION */}
      <header className="border-b border-neutral-900 bg-[#141517]/80 backdrop-blur-md sticky top-0 z-40 px-6 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-white tracking-tight">DailyClarity</h1>
            <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold border border-neutral-800 bg-neutral-900 px-2 py-0.5 rounded ml-2">Beta v1.0</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full text-[11px] font-bold">
              🔥 2 Days
            </div>
            <div className="text-[11px] font-medium text-neutral-400 border border-neutral-800 bg-neutral-900/60 px-2.5 py-1 rounded-full">
              ⚡ <span className="text-emerald-400 font-bold">9 of 10</span> free uses remaining today
            </div>
          </div>
        </div>
      </header>

      {/* SPLIT WINDOW PRESENTATION LAYOUT */}
      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 px-6 py-8">
        
        {/* INPUT STACK (LEFT COLUMN) */}
        <div className="space-y-6">
          <div className="bg-[#141517] border border-neutral-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="space-y-1">
              <h2 className="text-sm font-bold text-neutral-200">Mental Core Input Workspace</h2>
              <p className="text-xs text-neutral-500">Unload your tasks, lingering thoughts, or background anxieties below.</p>
            </div>

            <div className="relative border border-neutral-800/80 rounded-xl p-3 bg-neutral-900/20">
              <textarea
                className="w-full h-36 bg-transparent text-sm text-neutral-200 focus:outline-none placeholder:text-neutral-600 resize-none font-medium leading-relaxed"
                placeholder="What's on your mind? Just dump it all out here raw..."
                value={thought}
                onChange={(e) => setThought(e.target.value)}
              />
              <div className="flex justify-between items-center text-[10px] font-bold text-neutral-500 uppercase tracking-wider pt-2 border-t border-neutral-900">
                <span>🎙️ Voice dictation ready</span>
                <span className="font-mono text-neutral-600">{thought.length}/500</span>
              </div>
            </div>

            <button
              onClick={handleGetClarity}
              disabled={isLoading || !thought.trim()}
              className="w-full bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-100 font-bold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-1.5 disabled:opacity-40"
            >
              {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
              <span>Get Clarity ✨</span>
            </button>
          </div>

          {/* WARNING BLOCK */}
          <div className="bg-[#141517] border border-neutral-800 rounded-2xl p-5 text-center space-y-2">
            <span className="text-[10px] font-bold tracking-widest uppercase text-orange-400 block">🚨 Morning Habituator</span>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Establish a daily ritual. Schedule a gentle alert check here tomorrow fresh at 8:00 AM.
            </p>
            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-lg text-xs font-semibold">
                Notification permission was denied
              </span>
            </div>
          </div>
        </div>

        {/* DASHBOARD STATUS STACK (RIGHT COLUMN) */}
        <div className="space-y-6">
          <div className="bg-[#141517] border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="flex border-b border-neutral-800 bg-neutral-900/30">
              <button
                onClick={() => setActiveTab('checklist')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-black border-b-2 transition-all ${
                  activeTab === 'checklist' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/[0.01]' : 'border-transparent text-neutral-400 hover:text-neutral-300'
                }`}
              >
                <CheckSquare className="w-3.5 h-3.5" /> CHECKLIST
              </button>
              <button
                onClick={() => setActiveTab('insights')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-black border-b-2 transition-all ${
                  activeTab === 'insights' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/[0.01]' : 'border-transparent text-neutral-400 hover:text-neutral-300'
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5" /> WEEKLY INSIGHTS
              </button>
            </div>

            <div className="p-5">
              {activeTab === 'checklist' ? (
                <div className="space-y-5">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">Presence Building</span>
                      <h3 className="text-sm font-bold text-neutral-200">Daily Wellness Habits</h3>
                    </div>
                    <span className="text-xs text-neutral-400 font-mono">0/4 Done (0%)</span>
                  </div>

                  <div className="space-y-2">
                    {habits.map(habit => (
                      <div key={habit.id} className="flex items-center justify-between p-3.5 bg-neutral-900/60 border border-neutral-800 rounded-xl">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => handleToggleHabit(habit.id)}
                            className={`w-4 h-4 rounded-full border transition-all ${habit.completed ? 'bg-emerald-500 border-emerald-400' : 'border-neutral-600'}`}
                          />
                          <span className={`text-xs font-medium ${habit.completed ? 'text-neutral-500 line-through' : 'text-neutral-200'}`}>
                            {habit.text}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-neutral-600">
                          <button className="p-1 hover:text-neutral-300"><Edit2 className="w-3.5 h-3.5" /></button>
                          <button className="p-1 hover:text-rose-400"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleAddHabit} className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 text-xs text-neutral-300 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-700"
                      placeholder="Add custom habit (e.g., Read 10 pages)..."
                      value={newHabitText}
                      onChange={(e) => setNewHabitText(e.target.value)}
                    />
                    <button type="submit" className="bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 text-neutral-300 text-xs px-4 py-2 rounded-xl font-bold transition-colors">
                      + Add
                    </button>
                  </form>

                  <div className="pt-4 border-t border-neutral-900 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-purple-400 block">Focus Timer</span>
                      <h4 className="text-xs font-bold text-neutral-300">Pomodoro Mode Focus Setup</h4>
                      <div className="flex items-center gap-1.5 mt-1 text-[10px] text-neutral-500">
                        <span>Set Duration (mins):</span>
                        <input 
                          type="number" 
                          className="w-10 bg-neutral-900 border border-neutral-800 rounded p-0.5 text-center font-mono text-purple-400 text-[10px]"
                          value={timerInput}
                          onChange={(e) => setTimerInput(parseInt(e.target.value, 10) || 25)}
                        />
                      </div>
                    </div>
                    <button className="bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/20 text-purple-300 text-xs font-bold px-4 py-2 rounded-xl transition-all">
                      🚀 Start Focus
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 py-2 text-center text-xs text-neutral-500">
                  <BarChart2 className="w-8 h-8 text-neutral-700 mx-auto mb-1" />
                  <p>Weekly data stream metrics visualization active.</p>
                  <div className="h-1 bg-neutral-800 rounded-full w-24 mx-auto" />
                </div>
              )}
            </div>
          </div>

          {/* INTEGRATIONS SYNC */}
          <div className="bg-[#141517] border border-neutral-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
              <span className="text-amber-400 font-bold">⚡</span>
              <h4 className="text-xs font-black uppercase tracking-wider text-neutral-200">Direct Sync Integrations</h4>
            </div>

            <div className="p-4 bg-neutral-900/40 border border-neutral-800 rounded-xl space-y-3">
              <span className="text-xs font-bold text-neutral-300 block">💼 Configure Notion Workspace Credentials</span>
              
              <div className="space-y-2 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Notion Integration Key (Internal Token)</label>
                  <input 
                    type="password" 
                    className="w-full bg-[#141517] border border-neutral-800 rounded-lg p-2 font-mono text-neutral-400 focus:outline-none"
                    value={notionKey}
                    onChange={(e) => setNotionKey(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Parent Page or Database ID</label>
                  <input 
                    type="text" 
                    placeholder="32-character hexadecimal ID" 
                    className="w-full bg-[#141517] border border-neutral-800 rounded-lg p-2 font-mono text-neutral-400 focus:outline-none"
                    value={notionDatabaseId}
                    onChange={(e) => setNotionDatabaseId(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <input 
                    type="checkbox" 
                    id="parentDb"
                    checked={isParentDb}
                    onChange={(e) => setIsParentDb(e.target.checked)}
                    className="rounded bg-[#141517] border-neutral-800 text-emerald-500 focus:ring-0" 
                  />
                  <label htmlFor="parentDb" className="text-[11px] text-neutral-400 font-medium select-none">Parent is a Database</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* --- EXACT POPUP MODAL ANIMATION BOX --- */}
      {isModalOpen && actionPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-[#141517] border border-neutral-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-4 relative transform scale-100 transition-transform duration-300 animate-fadeIn">
            
            {/* Modal Exit Button */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1 text-neutral-500 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-400">AI Alignment Plan</span>
              <h3 className="text-base font-black text-white mt-0.5">Your Mind-Dump Breakdown</h3>
            </div>

            <div className="space-y-2.5 text-xs">
              {actionPlan.steps.map((step, idx) => (
                <div key={idx} className="flex gap-2.5 text-neutral-300 leading-relaxed bg-neutral-900/60 p-3 border border-neutral-800/40 rounded-xl">
                  <span className="text-emerald-400 font-black font-mono">{idx + 1}.</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-neutral-900 text-xs leading-relaxed text-neutral-400">
              🌿 <span className="font-bold text-neutral-300">Insight:</span> {actionPlan.insight}
            </div>

            <div className="pt-2 flex justify-end">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs px-4 py-2 rounded-xl transition-colors"
              >
                Close Output
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="max-w-6xl mx-auto px-6 pb-8 pt-4 flex justify-center gap-4 text-xs font-bold text-neutral-600 border-t border-neutral-900/60">
        <button className="hover:text-neutral-400 flex items-center gap-1"><RotateCcw className="w-3.5 h-3.5" /> New Day Reset</button>
        <span>•</span>
        <button className="hover:text-neutral-400 flex items-center gap-1"><Share2 className="w-3.5 h-3.5" /> Share Tool</button>
      </footer>

    </div>
  );
}
