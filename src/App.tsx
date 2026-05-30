import React, { useState, useEffect } from 'react';
import { 
  Sparkles, RefreshCw, AlertCircle, Share2, Check, ExternalLink, 
  Sun, Moon, Mic, MicOff, Info, Trash2, Edit2, Plus, CheckSquare, BarChart2, Zap 
} from 'lucide-react';

// --- TYPE DEFINITIONS ---
interface Habit {
  id: string;
  text: string;
  completed: boolean;
  isCustom?: boolean;
}

interface DailyHistory {
  [dateStr: string]: {
    [habitText: string]: boolean;
  };
}

export default function App() {
  // --- STATE MANAGEMENT ---
  const [thought, setThought] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'checklist' | 'insights'>('checklist');
  const [isListening, setIsListening] = useState(false);
  
  // Free Uses Limit Counter (Defaulting to 9 out of 10 remaining today)
  const [freeUses, setFreeUses] = useState(() => {
    const saved = localStorage.getItem('dc_free_uses');
    return saved ? parseInt(saved, 10) : 9;
  });

  // Notification API Permission State
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' ? Notification.permission : 'default'
  );

  // Focus Timer Module States
  const [timerInput, setTimerInput] = useState<number>(25);
  const [timeLeft, setTimeLeft] = useState<number>(1500); // 25 * 60
  const [totalDuration, setTotalDuration] = useState<number>(1500);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Habit Checklist Base States
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('dc_habits');
    if (saved) return JSON.parse(saved);
    return [
      { id: '1', text: 'Drink sufficient water', completed: false },
      { id: '2', text: 'Move body & stretch', completed: false },
      { id: '3', text: 'Mindful breathing (3m)', completed: false },
      { id: '4', text: 'Digital sunset (screens off)', completed: false }
    ];
  });
  
  const [newHabitText, setNewHabitText] = useState('');
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  // 7-Day History Database Tracker Structure
  const [history, setHistory] = useState<DailyHistory>(() => {
    const saved = localStorage.getItem('dc_history_db');
    return saved ? JSON.parse(saved) : {};
  });

  const [selectedHistoryDay, setSelectedHistoryDay] = useState<string | null>(null);

  // --- PERSISTENCE EFFECT PIPELINES ---
  useEffect(() => {
    localStorage.setItem('dc_habits', JSON.stringify(habits));
    localStorage.setItem('dc_free_uses', freeUses.toString());
    // Update local history snapshot for the modern date record string
    const todayStr = getLocalDateString(0);
    const todayState: { [key: string]: boolean } = {};
    habits.forEach(h => { todayState[h.text] = h.completed; });
    
    setHistory(prev => {
      const updated = { ...prev, [todayStr]: todayState };
      localStorage.setItem('dc_history_db', JSON.stringify(updated));
      return updated;
    });
  }, [habits, freeUses]);

  // --- TIME UTILITIES ---
  function getLocalDateString(offsetDays: number = 0): string {
    const d = new Date();
    d.setDate(d.getDate() - offsetDays);
    return d.toISOString().split('T')[0];
  }

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const getLast7DaysMeta = () => {
    const items = [];
    for (let i = 6; i >= 0; i--) {
      const dateStr = getLocalDateString(i);
      const d = new Date(dateStr);
      const dayName = dayLabels[d.getDay()];
      items.push({
        dateStr,
        label: i === 0 ? 'Sat (Today)' : dayName,
        isToday: i === 0
      });
    }
    return items;
  };

  // --- CORE SYSTEM METRIC METERS ---
  const completedCount = habits.filter(h => h.completed).length;
  const completionPercent = habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;

  // Streak Tracker Core Formula Engine (75%+ completion constitutes a valid check-in day)
  const calculateStreak = (): number => {
    let streak = 0;
    let index = 0;
    while (index < 365) {
      const dStr = getLocalDateString(index);
      const dayData = history[dStr];
      if (!dayData) break;
      
      const dayHabitKeys = Object.keys(dayData);
      if (dayHabitKeys.length === 0) break;
      
      const dayDone = dayHabitKeys.filter(k => dayData[k]).length;
      const dayPct = (dayDone / dayHabitKeys.length) * 100;
      
      if (dayPct >= 75) {
        streak++;
      } else if (index === 0) {
        // Skip check constraint broken if today is still active and incomplete
        index++;
        continue;
      } else {
        break;
      }
      index++;
    }
    return streak;
  };

  // Total checkins over last 7 days calculation
  const totalPossibleCheckinsLastWeek = habits.length * 7;
  const actualCheckinsLastWeek = getLast7DaysMeta().reduce((acc, day) => {
    const dayData = history[day.dateStr] || {};
    const doneCount = Object.keys(dayData).filter(k => dayData[k]).length;
    return acc + doneCount;
  }, 0);

  // --- FOCUS COUNTER PIPELINE ---
  useEffect(() => {
    let intervalId: any = null;
    if (isTimerRunning && timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      triggerTimerCompletionAlert();
    }
    return () => clearInterval(intervalId);
  }, [isTimerRunning, timeLeft]);

  const handleStartFocus = () => {
    const totalSecs = timerInput * 60;
    setTotalDuration(totalSecs);
    setTimeLeft(totalSecs);
    setIsTimerRunning(true);
  };

  const triggerTimerCompletionAlert = () => {
    if (notificationPermission === 'granted') {
      new Notification('Focus Session Complete!', {
        body: 'Excellent focus! Take a quick break to recharge your mental clarity.',
        icon: '/vite.svg'
      });
    }
    alert('⏱️ Focus Interval Finished! Sensational presence work.');
  };

  const requestNotificationAuth = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const res = await Notification.requestPermission();
      setNotificationPermission(res);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // --- HABIT OPERATIONS ---
  const handleAddCustomHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitText.trim()) return;
    const newHabit: Habit = {
      id: Date.now().toString(),
      text: newHabitText.trim(),
      completed: false,
      isCustom: true
    };
    setHabits([...habits, newHabit]);
    setNewHabitText('');
  };

  const handleToggleHabit = (id: string) => {
    setHabits(habits.map(h => h.id === id ? { ...h, completed: !h.completed } : h));
  };

  const handleRemoveHabit = (id: string) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  const startEditHabit = (id: string, text: string) => {
    setEditingHabitId(id);
    setEditingText(text);
  };

  const saveEditHabit = (id: string) => {
    setHabits(habits.map(h => h.id === id ? { ...h, text: editingText } : h));
    setEditingHabitId(null);
  };

  // --- FAKE CLARITY ACTION WRAPPER ---
  const handleGetClarity = () => {
    if (!thought.trim() || freeUses <= 0) return;
    setIsLoading(true);
    setTimeout(() => {
      setAiResponse(
        `## 🧘 AI Clarity Realignment Plan\n\n### ⚡ ACTIONABLE PRIORITIES:\n1. **Isolate your absolute single highest-impact target item.** Focus deeply on execution rather than running micro tasks.\n2. **Lock down physical workspace distractions** for one complete 25-minute Pomodoro block.\n\n🌿 *INSIGHT:* Momentum follows intentional focus. Choose direction over immediate perfection.`
      );
      setFreeUses(prev => Math.max(0, prev - 1));
      setIsLoading(false);
    }, 1200);
  };

  // --- PREMIUM VARIABLE DESIGN COLORS ---
  const getFreeUsesColor = () => {
    if (freeUses >= 8) return 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5';
    if (freeUses >= 3) return 'text-amber-400 border-amber-500/20 bg-amber-500/5';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10 animate-pulse';
  };

  const getDayBoxColor = (dateStr: string) => {
    const dayData = history[dateStr];
    if (!dayData) return 'bg-neutral-800 border-neutral-700 text-neutral-500';
    const keys = Object.keys(dayData);
    if (keys.length === 0) return 'bg-neutral-800 border-neutral-700 text-neutral-500';
    const done = keys.filter(k => dayData[k]).length;
    const pct = (done / keys.length) * 100;

    if (pct === 100) return 'bg-cyan-500 text-neutral-950 font-bold border-cyan-400';
    if (pct >= 75) return 'bg-cyan-700/60 text-cyan-200 border-cyan-600/40';
    if (pct >= 50) return 'bg-neutral-600 text-neutral-200 border-neutral-500';
    if (pct >= 25) return 'bg-neutral-700 text-neutral-300 border-neutral-600';
    return 'bg-neutral-800 border-neutral-700 text-neutral-400';
  };

  return (
    <div className="min-h-screen bg-[#141416] text-neutral-100 font-sans antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* HEADER META NAVIGATION BLOCK */}
      <header className="border-b border-neutral-800/80 bg-[#1a1a1c]/60 backdrop-blur-md sticky top-0 z-50 px-4 py-3 sm:px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl shadow-lg shadow-cyan-500/10">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-neutral-50 via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
                DailyClarity
              </h1>
              <p className="text-xs text-neutral-400 font-medium tracking-wide uppercase">Turn Mental Chaos Into Focused Calm</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* STREAK FLAG COUNTER */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-full text-xs font-semibold">
              <Zap className="w-3.5 h-3.5 fill-purple-400" />
              <span>🔥 {calculateStreak()} Days</span>
            </div>

            {/* FREEMIUM CONTAINER USES */}
            <div className={`px-3 py-1.5 border rounded-full text-xs font-medium transition-all duration-300 ${getFreeUsesColor()}`}>
              ✓ {freeUses} of 10 free uses remaining today
            </div>
          </div>
        </div>
      </header>

      {/* SYSTEM CENTRAL BASE CONTAINER GRID */}
      <main className="max-w-5xl mx-auto px-4 py-8 sm:px-6 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: CORE INPUT CLARITY CONSOLE */}
        <section className="md:col-span-5 flex flex-col gap-6">
          <div className="bg-[#1a1a1c] border border-neutral-800/80 rounded-2xl p-5 shadow-xl shadow-black/20">
            <h2 className="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" /> Clarity Realignment Engine
            </h2>
            <textarea
              className="w-full h-32 bg-[#232326] border border-neutral-700/60 rounded-xl p-3 text-sm text-neutral-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all placeholder:text-neutral-500 resize-none"
              placeholder="Type out what is stressing you or splitting your attention right now..."
              value={thought}
              onChange={(e) => setThought(e.target.value)}
            />
            
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleGetClarity}
                disabled={isLoading || !thought.trim() || freeUses <= 0}
                className="flex-1 bg-neutral-100 hover:bg-white text-neutral-900 disabled:bg-neutral-800 disabled:text-neutral-600 font-semibold text-sm py-2.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-white/5 active:scale-[0.98]"
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>Get Clarity</span>
              </button>
            </div>
          </div>

          {/* REALTIME AI PANEL FEEDBACK CONTAINER */}
          {aiResponse && (
            <div className="bg-[#1a1a1c] border border-cyan-500/20 rounded-2xl p-5 shadow-lg shadow-cyan-500/5 animate-fadeIn">
              <div className="prose prose-invert text-xs text-neutral-300 leading-relaxed whitespace-pre-line">
                {aiResponse}
              </div>
            </div>
          )}

          {/* ADSENSE PLACEHOLDER CONSOLE */}
          <div className="bg-[#1a1a1c]/40 border border-neutral-800/50 rounded-xl p-4 text-center">
            <span className="text-[10px] text-neutral-600 font-bold tracking-widest uppercase block mb-1">Sponsored Context Block</span>
            <div className="h-16 flex items-center justify-center bg-neutral-900/40 rounded-lg text-xs text-neutral-500 border border-dashed border-neutral-800">
              Premium Wellness Optimization Integration Link
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: INTERACTIVE PRESENCE INTERACTIVE MODULE */}
        <section className="md:col-span-7 flex flex-col gap-6">
          <div className="bg-[#1a1a1c] border border-neutral-800/80 rounded-2xl shadow-xl shadow-black/20 overflow-hidden">
            
            {/* TABS SELECTOR PANEL CONTAINER */}
            <div className="flex border-b border-neutral-800/60 bg-[#161618]">
              <button
                onClick={() => setActiveTab('checklist')}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold border-b-2 transition-all duration-200 ${
                  activeTab === 'checklist' 
                    ? 'border-cyan-500 bg-cyan-500/5 text-cyan-400' 
                    : 'border-transparent text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/30'
                }`}
              >
                <CheckSquare className="w-4 h-4" />
                <span>CHECKLIST</span>
              </button>
              <button
                onClick={() => setActiveTab('insights')}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold border-b-2 transition-all duration-200 ${
                  activeTab === 'insights' 
                    ? 'border-cyan-500 bg-cyan-500/5 text-cyan-400' 
                    : 'border-transparent text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/30'
                }`}
              >
                <BarChart2 className="w-4 h-4" />
                <span>WEEKLY INSIGHTS</span>
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'checklist' ? (
                <div className="space-y-6">
                  {/* PRESENCE BUILDING CONTAINER METRIC HEADER */}
                  <div>
                    <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest block mb-0.5">PRESENCE BUILDING</span>
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-neutral-200">Daily Wellness Habits</h3>
                      <span className="text-xs font-semibold px-2.5 py-1 bg-neutral-800 text-neutral-300 rounded-md">
                        {completedCount}/{habits.length} Done ({completionPercent}%)
                      </span>
                    </div>
                  </div>

                  {/* HABITS ITERATIVE GENERATOR LIST */}
                  <div className="space-y-2.5">
                    {habits.map((habit) => (
                      <div 
                        key={habit.id}
                        className={`flex items-center justify-between p-3.5 bg-[#232326] border rounded-xl transition-all duration-200 group ${
                          habit.completed ? 'border-cyan-500/20 bg-cyan-500/[0.01]' : 'border-neutral-700/60 hover:border-neutral-600'
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <button
                            onClick={() => handleToggleHabit(habit.id)}
                            className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                              habit.completed 
                                ? 'bg-cyan-500 border-cyan-400 text-neutral-900' 
                                : 'border-neutral-600 hover:border-cyan-500'
                            }`}
                          >
                            {habit.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </button>

                          {editingHabitId === habit.id ? (
                            <input
                              type="text"
                              className="bg-neutral-800 border border-cyan-500 text-sm text-neutral-100 rounded px-2 py-0.5 w-full focus:outline-none"
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              onBlur={() => saveEditHabit(habit.id)}
                              onKeyDown={(e) => e.key === 'Enter' && saveEditHabit(habit.id)}
                              autoFocus
                            />
                          ) : (
                            <span className={`text-sm font-medium truncate ${habit.completed ? 'text-neutral-500 line-through' : 'text-neutral-200'}`}>
                              {habit.text}
                            </span>
                          )}
                        </div>

                        {/* INTERACTIVE ROW CRUD BUTTONS */}
                        <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity ml-2 shrink-0">
                          <button className="p-1 hover:text-cyan-400 transition-colors" title="Habit Details">
                            <Info className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => startEditHabit(habit.id, habit.text)}
                            className="p-1 hover:text-amber-400 transition-colors" 
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => handleRemoveHabit(habit.id)}
                            className="p-1 hover:text-rose-400 transition-colors" 
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* CUSTOM HABIT INSERTION FIELD */}
                  <form onSubmit={handleAddCustomHabit} className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 bg-[#161618] border border-neutral-800 text-xs text-neutral-300 rounded-xl px-3.5 py-2.5 placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all"
                      placeholder="Add custom habit (e.g., Read 10 pages 📚)..."
                      value={newHabitText}
                      onChange={(e) => setNewHabitText(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold px-4 py-2.5 rounded-xl border border-neutral-700 transition-all flex items-center gap-1.5 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  </form>

                  {/* 7-DAY CONSISTENCY MATRIX LOG MODULE */}
                  <div className="pt-4 border-t border-neutral-800/60">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">7-Day Consistency Trend</h4>
                        <p className="text-[11px] text-neutral-500 mt-0.5">
                          Weekly Flow: <span className="text-cyan-400 font-medium">{actualCheckinsLastWeek} checked off</span>
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                      {getLast7DaysMeta().map((day) => (
                        <button
                          key={day.dateStr}
                          onClick={() => setSelectedHistoryDay(selectedHistoryDay === day.dateStr ? null : day.dateStr)}
                          className={`p-2 rounded-xl border text-center flex flex-col items-center gap-1 transition-all ${getDayBoxColor(day.dateStr)} ${
                            selectedHistoryDay === day.dateStr ? 'ring-2 ring-white/20 scale-[1.02]' : 'hover:scale-[1.01]'
                          }`}
                        >
                          <span className="text-[10px] font-bold block tracking-tight truncate w-full">{day.label}</span>
                          <span className="text-[9px] opacity-80 block">
                            {(() => {
                              const dayData = history[day.dateStr];
                              if (!dayData) return '0%';
                              const keys = Object.keys(dayData);
                              if (keys.length === 0) return '0%';
                              const done = keys.filter(k => dayData[k]).length;
                              return `${Math.round((done / keys.length) * 100)}%`;
                            })()}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* SELECTABLE MICRO-DAY DRILLDOWN DRILL MODULE CONTAINER */}
                    {selectedHistoryDay && (
                      <div className="mt-3 p-3 bg-neutral-900/80 border border-neutral-800 rounded-xl animate-fadeIn">
                        <p className="text-xs font-bold text-neutral-300 mb-1.5">Snapshot Detail: {selectedHistoryDay}</p>
                        {history[selectedHistoryDay] ? (
                          <div className="space-y-1">
                            {Object.keys(history[selectedHistoryDay]).map((k) => (
                              <div key={k} className="flex items-center gap-2 text-[11px]">
                                <div className={`w-3 h-3 rounded flex items-center justify-center border text-neutral-950 ${history[selectedHistoryDay][k] ? 'bg-cyan-400 border-cyan-300' : 'border-neutral-700'}`}>
                                  {history[selectedHistoryDay][k] && <Check className="w-2.5 h-2.5 stroke-[4]" />}
                                </div>
                                <span className={history[selectedHistoryDay][k] ? 'text-neutral-400 line-through' : 'text-neutral-300'}>{k}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[11px] text-neutral-500 italic">No structured entries tracked on this calendar date index.</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* PREMIUM ENHANCED POMODORO CORE MODAL MODULE */}
                  <div className="pt-4 border-t border-neutral-800/60 bg-gradient-to-b from-transparent to-purple-500/[0.02] p-4 rounded-xl border border-purple-500/10">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-base">⏱️</span>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400">FOCUS TIMER</h4>
                      </div>
                      <span className="text-[11px] text-neutral-400 italic">"Stay focused / 25m"</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 mb-1">Duration (mins)</label>
                          <input
                            type="number"
                            disabled={isTimerRunning}
                            className="w-16 bg-[#161618] border border-neutral-800 rounded-lg p-1.5 text-center text-sm font-semibold text-purple-300 focus:outline-none focus:border-purple-500"
                            value={timerInput}
                            onChange={(e) => {
                              const val = Math.max(1, parseInt(e.target.value, 10) || 1);
                              setTimerInput(val);
                              setTimeLeft(val * 60);
                            }}
                          />
                        </div>

                        <div className="flex flex-col justify-end h-full pt-4">
                          <span className="text-2xl font-mono font-bold tracking-tight text-neutral-100">
                            {formatTime(timeLeft)}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {isTimerRunning ? (
                          <button
                            onClick={() => setIsTimerRunning(false)}
                            className="bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                          >
                            Pause
                          </button>
                        ) : (
                          <button
                            onClick={handleStartFocus}
                            className="bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/10 px-5 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
                          >
                            Start Focus
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setIsTimerRunning(false);
                            setTimeLeft(timerInput * 60);
                          }}
                          className="p-2 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-xl text-neutral-400 hover:text-neutral-200 transition-colors text-xs"
                          title="Reset Timer"
                        >
                          Reset
                        </button>
                      </div>
                    </div>

                    {/* FOCUS DURATION FILLING BAR */}
                    <div className="w-full h-1 bg-neutral-900 rounded-full mt-4 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-600 to-indigo-500 transition-all duration-300"
                        style={{ width: `${((totalDuration - timeLeft) / totalDuration) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* MORNING REMINDER UX DRIVER INTEGRATION */}
                  <div className="p-3.5 bg-neutral-900/60 border border-neutral-800 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
                        🔔 Morning Habituator System Reminders
                      </p>
                      {notificationPermission === 'denied' ? (
                        <p className="text-[11px] text-amber-500 font-medium">
                          ⚠ Notification permission was denied. Please update your browser site-settings to allow notification alerts to schedule reminders.
                        </p>
                      ) : (
                        <p className="text-[11px] text-neutral-500">
                          Receive browser notification alerts instantly to schedule your presence alignment blocks.
                        </p>
                      )}
                    </div>
                    {notificationPermission !== 'granted' && (
                      <button
                        type="button"
                        onClick={requestNotificationAuth}
                        className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 underline shrink-0 whitespace-nowrap"
                      >
                        Enable Notifications
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* IN-TAB INSIGHT METRICS & ANALYTICS VIEW CONSOLE */
                <div className="space-y-5 animate-fadeIn">
                  <div>
                    <span className="text-[10px] text-purple-400 font-bold uppercase tracking-widest block mb-0.5">METRIC ENGINE</span>
                    <h3 className="text-base font-bold text-neutral-200">Overall Weekly Progress</h3>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-[#232326] border border-neutral-800 rounded-xl p-3 text-center">
                      <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">COMPLETION RATE</span>
                      <span className="text-xl font-bold text-cyan-400 block mt-1">{completionPercent}%</span>
                    </div>
                    <div className="bg-[#232326] border border-neutral-800 rounded-xl p-3 text-center">
                      <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">WEEKLY STREAK</span>
                      <span className="text-xl font-bold text-purple-400 block mt-1">{calculateStreak()}d</span>
                    </div>
                    <div className="bg-[#232326] border border-neutral-800 rounded-xl p-3 text-center">
                      <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">CHECK-INS</span>
                      <span className="text-sm font-bold text-neutral-200 block mt-2">{actualCheckinsLastWeek}/{totalPossibleCheckinsLastWeek}</span>
                    </div>
                  </div>

                  {/* HABIT-BY-HABIT ANALYTICS BAR METER */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Habit Breakdown Meter</h4>
                    
                    <div className="space-y-3">
                      {habits.map((h) => {
                        // Scan 7-day database parameters for individual compliance frequency
                        const history7Days = getLast7DaysMeta();
                        const checkedCount = history7Days.filter(day => {
                          const data = history[day.dateStr] || {};
                          return data[h.text] === true;
                        }).length;
                        const individualPct = Math.round((checkedCount / 7) * 100);

                        return (
                          <div key={h.id} className="space-y-1">
                            <div className="flex justify-between text-xs font-medium">
                              <span className="text-neutral-300">{h.text}</span>
                              <span className="text-neutral-500">{checkedCount}/7 days ({individualPct}%)</span>
                            </div>
                            <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800/40">
                              <div 
                                className="h-full bg-gradient-to-r from-cyan-500 to-cyan-600 transition-all duration-500"
                                style={{ width: `${individualPct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* AFFILIATE EXTERNAL PROMOTION GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a 
              href="https://amazon.com" 
              target="_blank" 
              rel="noreferrer" 
              className="p-4 bg-[#1a1a1c] border border-neutral-800/80 rounded-xl hover:border-neutral-700 transition-all flex items-center justify-between group shadow-lg shadow-black/10"
            >
              <div>
                <h4 className="text-xs font-bold text-neutral-200 group-hover:text-cyan-400 transition-colors">Premium Analog Grid Journal</h4>
                <p className="text-[11px] text-neutral-500 mt-0.5">Solidify habits offline using tactical logging.</p>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-neutral-600 group-hover:text-neutral-400 transition-colors" />
            </a>

            <a 
              href="https://amazon.com" 
              target="_blank" 
              rel="noreferrer" 
              className="p-4 bg-[#1a1a1c] border border-neutral-800/80 rounded-xl hover:border-neutral-700 transition-all flex items-center justify-between group shadow-lg shadow-black/10"
            >
              <div>
                <h4 className="text-xs font-bold text-neutral-200 group-hover:text-cyan-400 transition-colors">Visual Time Cube Block</h4>
                <p className="text-[11px] text-neutral-500 mt-0.5">Physical Pomodoro accessories for intense focus.</p>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-neutral-600 group-hover:text-neutral-400 transition-colors" />
            </a>
          </div>
        </section>
      </main>

      {/* COMPACT SYSTEM FOOTER */}
      <footer className="border-t border-neutral-900 bg-[#161618] mt-16 py-6 text-center text-xs text-neutral-600 font-medium">
        <p>© 2026 DailyClarity Platforms Inc. All global configuration parameters reserved.</p>
      </footer>
    </div>
  );
}
