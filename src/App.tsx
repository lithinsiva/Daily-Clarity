import React, { useState, useEffect } from 'react';
import { 
  Sparkles, RefreshCw, ChevronRight, Share2, Check, ExternalLink, 
  Info, Trash2, Edit2, Plus, CheckSquare, BarChart2, Zap, 
  Calendar, Send, Sliders, X, Play, Pause, RotateCcw, AlertTriangle
} from 'lucide-react';

// --- TYPE INTERFACES ---
interface Habit {
  id: string;
  text: string;
  completed: boolean;
  isCustom?: boolean;
  priority?: boolean;
}

interface ClarityJourney {
  id: string;
  date: string;
  time: string;
  thought: string;
  plan: string[];
  insight: string;
}

export default function App() {
  // --- STATE CONTROL FLUIDS ---
  const [thought, setThought] = useState('');
  const [activeTab, setActiveTab] = useState<'checklist' | 'insights'>('checklist');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarTab, setSidebarTab] = useState<'journeys' | 'habits'>('journeys');
  
  // Interactive Mindfulness Routine Modal Engine
  const [routineActive, setRoutineActive] = useState(false);
  const [breathState, setBreathState] = useState<'In' | 'Hold' | 'Out' | 'Rest'>('In');
  const [breathSeconds, setBreathSeconds] = useState(4);
  const [routineTotalSeconds, setRoutineTotalSeconds] = useState(30);

  // Advanced Focus Timer Screens
  const [timerInput, setTimerInput] = useState<number>(25);
  const [timeLeft, setTimeLeft] = useState<number>(1500);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [focusActiveView, setFocusActiveView] = useState(false);
  const [breakCount, setBreakCount] = useState(0);

  // Custom scheduling sub-row index map
  const [activeScheduleId, setActiveScheduleId] = useState<string | null>(null);

  // Mock database initialization for Clarity Journeys historical log
  const [journeys, setJourneys] = useState<ClarityJourney[]>([
    {
      id: 'j1',
      date: 'May 30, 07:42 PM',
      time: '07:42 PM',
      thought: 'I am very stressed',
      plan: [
        'Take a moment to acknowledge your feelings and practice deep breathing.',
        'Identify one small, achievable task to focus on and complete.',
        'Plan a brief, restorative break for yourself later today.'
      ],
      insight: 'You can gently release the pressure of needing to solve everything at once; simply focus on this moment.'
    }
  ]);

  // Habit Core States
  const [habits, setHabits] = useState<Habit[]>([
    { id: '1', text: 'Drink sufficient water', completed: false },
    { id: '2', text: 'Move body & stretch', completed: false, priority: true },
    { id: '3', text: 'Mindful breathing (3m)', completed: false },
    { id: '4', text: 'Digital sunset (screens off)', completed: false }
  ]);
  const [newHabitText, setNewHabitText] = useState('');

  // Notion and API Integration Fields State
  const [notionKey, setNotionKey] = useState('secret_••••••••••••••••••••');
  const [notionDatabaseId, setNotionDatabaseId] = useState('');
  const [isParentDb, setIsParentDb] = useState(false);

  // --- MINDFULNESS ROUTINE RUNTIME LOOP ---
  useEffect(() => {
    let interval: any = null;
    if (routineActive && routineTotalSeconds > 0) {
      interval = setInterval(() => {
        setRoutineTotalSeconds(prev => prev - 1);
        setBreathSeconds(prev => {
          if (prev <= 1) {
            // Cycle through standard Box Breathing parameters (4s In -> 4s Hold -> 4s Out -> 4s Rest)
            if (breathState === 'In') { setBreathState('Hold'); return 4; }
            if (breathState === 'Hold') { setBreathState('Out'); return 4; }
            if (breathState === 'Out') { setBreathState('Rest'); return 4; }
            setBreathState('In'); return 4;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (routineTotalSeconds <= 0 && routineActive) {
      setRoutineActive(false);
      alert('✨ Mindfulness loop completed! Your alignment vector has reset.');
    }
    return () => clearInterval(interval);
  }, [routineActive, routineTotalSeconds, breathState]);

  // --- CORE FOCUS TIMER PIPELINE ---
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      alert('⏱️ Focus set finished! Take a restorative micro-break.');
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  // --- SYSTEM HANDLERS ---
  const triggerGetClarity = () => {
    if (!thought.trim()) return;
    // Trigger the breathing layout instead of a simple response box
    setRoutineTotalSeconds(30);
    setBreathState('In');
    setBreathSeconds(4);
    setRoutineActive(true);
  };

  const startFocusSession = () => {
    setTimeLeft(timerInput * 60);
    setIsTimerRunning(true);
    setFocusActiveView(true);
  };

  const handleToggleHabit = (id: string) => {
    setHabits(habits.map(h => h.id === id ? { ...h, completed: !h.completed } : h));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#0f1011] text-[#e3e4e6] font-sans antialiased selection:bg-emerald-500/20 selection:text-emerald-300">
      
      {/* HEADER CONTROL BLOCK */}
      <header className="border-b border-neutral-900 bg-[#141517]/80 backdrop-blur-md sticky top-0 z-40 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-neutral-200 bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 transition-all"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-500" /> History
          </button>

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

      {/* CENTRAL CENTERED CARD STACK LAYOUT */}
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        
        {/* APP CORE HEADER BRAND BRANDING */}
        <div className="text-center py-4 space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2">
            DailyClarity
          </h1>
          <p className="text-xs uppercase tracking-widest text-neutral-500 font-semibold">Turn Mental Chaos Into Focused Calm</p>
        </div>

        {/* CONDITION-BASED ENGINE RENDER SWITCHER */}
        {routineActive ? (
          /* --- INTUITIVE OVERLAY SCREEN: INTERACTIVE MINDFULNESS MODULE --- */
          <div className="bg-[#141517] border border-neutral-800 rounded-2xl p-8 text-center space-y-8 shadow-2xl animate-fadeIn">
            <div className="space-y-1">
              <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-400">Quiet the Mind</span>
              <h3 className="text-lg font-bold text-neutral-100">Mindfulness Breathing</h3>
            </div>

            {/* RADIAL CIRCLE METRIC DISPLAY */}
            <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-neutral-800" />
              <div 
                className="absolute inset-0 rounded-full border-4 border-emerald-500 transition-all duration-1000 scale-[1.02]"
                style={{ 
                  clipPath: `polygon(50% 50%, 50% 0%, ${breathSeconds >= 2 ? '100% 0%, 100% 100%' : '100% 0%'}, 50% 100%)`,
                  opacity: breathState === 'In' ? 1 : 0.6 
                }}
              />
              <div className="space-y-0.5 z-10">
                <span className="text-xs uppercase font-bold tracking-widest text-neutral-400 block">
                  {breathState === 'In' && 'Breathe In'}
                  {breathState === 'Hold' && 'Suspend'}
                  {breathState === 'Out' && 'Breathe Out'}
                  {breathState === 'Rest' && 'Pause'}
                </span>
                <span className="text-4xl font-mono font-bold text-white block">
                  {breathSeconds}s
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-neutral-400 italic">
                {breathState === 'In' && 'Fill your lungs with space and calm'}
                {breathState === 'Hold' && 'Hold the breath, feel the peace'}
                {breathState === 'Out' && 'Release tension, worry, and chaos'}
                {breathState === 'Rest' && 'Be still, expect clarity'}
              </p>
              <span className="text-[11px] block text-neutral-500 font-mono">{routineTotalSeconds} seconds remaining</span>
              
              <button 
                onClick={() => setRoutineActive(false)}
                className="text-xs font-bold text-neutral-400 hover:text-white uppercase tracking-wider underline pt-2"
              >
                Skip Routine →
              </button>
            </div>
          </div>
        ) : focusActiveView ? (
          /* --- INTUITIVE OVERLAY SCREEN: ACTIVE FOCUS TIMER VIEW --- */
          <div className="bg-[#141517] border border-neutral-800 rounded-2xl p-8 text-center space-y-6 shadow-2xl animate-fadeIn">
            <div className="space-y-1">
              <span className="text-[10px] font-bold tracking-widest uppercase text-purple-400">Focus Session Active</span>
              <p className="text-sm font-medium text-neutral-300">Stay focused every day and do whatever things but with full focus.</p>
            </div>

            <div className="text-6xl font-mono font-black tracking-tight text-white py-4">
              {formatTime(timeLeft)}
            </div>

            <div className="flex justify-center gap-3">
              <button 
                onClick={() => setFocusActiveView(false)}
                className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-5 py-2 rounded-xl text-xs font-bold transition-all"
              >
                Stop
              </button>
              <button 
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="bg-amber-500 hover:bg-amber-400 text-neutral-950 px-6 py-2 rounded-xl text-xs font-black transition-all"
              >
                {isTimerRunning ? 'Pause Focus' : 'Resume Session'}
              </button>
              <button 
                onClick={() => setBreakCount(prev => Math.min(5, prev + 1))}
                className="bg-purple-600/30 border border-purple-500/20 text-purple-300 px-5 py-2 rounded-xl text-xs font-bold transition-all"
              >
                Break ({breakCount}/5)
              </button>
            </div>
          </div>
        ) : (
          /* --- STANDARD CONSOLE LAYER DISPLAY --- */
          <>
            {/* CONSOLE INPUT TEXTAREA FIELD */}
            <div className="bg-[#141517] border border-neutral-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="relative">
                <textarea
                  className="w-full h-32 bg-transparent text-sm text-neutral-200 focus:outline-none placeholder:text-neutral-600 resize-none"
                  placeholder="What's on your mind? Tasks, worries, random thoughts — just dump it all here..."
                  value={thought}
                  onChange={(e) => setThought(e.target.value)}
                />
                <div className="absolute bottom-0 left-0 flex items-center gap-1 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                  <span>🎙️ Speak Thoughts</span>
                  <span className="ml-4 font-mono text-neutral-600">{thought.length}/500</span>
                </div>
              </div>

              <button
                onClick={triggerGetClarity}
                disabled={!thought.trim()}
                className="w-full bg-neutral-800/80 hover:bg-neutral-700 border border-neutral-700 text-neutral-100 disabled:opacity-40 font-bold text-xs py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Get Clarity ✨
              </button>
            </div>

            {/* SYSTEM RECOVERY MORNING HABITUATOR ALERT REMINDER */}
            <div className="bg-[#141517] border border-neutral-800 rounded-2xl p-5 text-center space-y-2">
              <span className="text-[10px] font-bold tracking-widest uppercase text-orange-400 block">🚨 Morning Habituator</span>
              <p className="text-xs text-neutral-400 max-w-md mx-auto">
                Establish a daily ritual. Schedule a gentle alert using the standard browser Web Notification API to check here tomorrow fresh at 8:00 AM.
              </p>
              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded-lg text-xs font-semibold">
                  Notification permission was denied
                </span>
              </div>
              <p className="text-[10px] text-neutral-500">Please update your browser site settings to allow notification alerts to schedule reminders.</p>
            </div>
          </>
        )}

        {/* PRIMARY INTERACTIVE MODULE CARDS DECK TABS */}
        <div className="bg-[#141517] border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="flex border-b border-neutral-800 bg-neutral-900/40">
            <button
              onClick={() => setActiveTab('checklist')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold border-b-2 transition-all ${
                activeTab === 'checklist' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/[0.02]' : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" /> CHECKLIST
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold border-b-2 transition-all ${
                activeTab === 'insights' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/[0.02]' : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" /> WEEKLY INSIGHTS
            </button>
          </div>

          <div className="p-5">
            {activeTab === 'checklist' ? (
              <div className="space-y-6">
                
                {/* HABIT CHECKLIST WRAPPER ROW TRACKER */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">Presence Building</span>
                  <div className="flex justify-between items-center">
                    <h3 className="text-base font-bold text-neutral-200">Daily Wellness Habits</h3>
                    <span className="text-xs text-neutral-400 font-mono">0/4 Done (0%)</span>
                  </div>
                </div>

                {/* 7-DAY CONSISTENCY COMPLIANCE TREND BAR */}
                <div className="space-y-1.5 bg-neutral-900/40 border border-neutral-800/60 p-3 rounded-xl">
                  <div className="flex justify-between text-[11px] font-bold text-neutral-400">
                    <span>7-Day Consistency Trend</span>
                    <span className="text-emerald-400">Weekly Flow <span className="bg-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded text-[10px]">0 checked off</span></span>
                  </div>
                  <div className="grid grid-cols-7 gap-1 pt-1 text-center font-mono text-[9px] text-neutral-500">
                    <div><div className="h-1 bg-neutral-800 rounded-full mb-1" />Sun</div>
                    <div><div className="h-1 bg-neutral-800 rounded-full mb-1" />Mon</div>
                    <div><div className="h-1 bg-neutral-800 rounded-full mb-1" />Tue</div>
                    <div><div className="h-1 bg-neutral-800 rounded-full mb-1" />Wed</div>
                    <div><div className="h-1 bg-neutral-800 rounded-full mb-1" />Thu</div>
                    <div><div className="h-1 bg-neutral-800 rounded-full mb-1" />Fri</div>
                    <div className="text-emerald-400"><div className="h-1 bg-emerald-500 rounded-full mb-1" />Sat (Today)</div>
                  </div>
                </div>

                {/* INTERACTIVE ROW CRUD GRID MAP */}
                <div className="space-y-2">
                  {habits.map(habit => (
                    <div key={habit.id} className="space-y-2">
                      <div className="flex items-center justify-between p-3.5 bg-neutral-900/60 border border-neutral-800 rounded-xl hover:border-neutral-700 transition-all">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => handleToggleHabit(habit.id)}
                            className={`w-4 h-4 rounded-full border transition-all ${habit.completed ? 'bg-emerald-500 border-emerald-400' : 'border-neutral-600'}`}
                          />
                          <span className={`text-sm ${habit.completed ? 'text-neutral-500 line-through' : 'text-neutral-200'}`}>
                            {habit.text}
                          </span>
                          {habit.priority && (
                            <span className="text-[9px] font-black bg-amber-500/10 border border-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded uppercase tracking-wider">Must</span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-neutral-500">
                          <button 
                            onClick={() => setActiveScheduleId(activeScheduleId === habit.id ? null : habit.id)}
                            className="p-1 hover:text-neutral-300 transition-colors"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-1 hover:text-neutral-300 transition-colors">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-1 hover:text-rose-400 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* --- INDIVIDUAL CALENDAR SCHEDULING DROPDOWN MATRIX --- */}
                      {activeScheduleId === habit.id && (
                        <div className="p-4 bg-neutral-900 border border-emerald-500/30 rounded-xl space-y-3 animate-fadeIn ml-4">
                          <div className="flex items-center gap-1 text-xs font-bold text-neutral-300">
                            <span>📅 Schedule Wellness Event</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="text-[9px] uppercase tracking-wider text-neutral-500 block mb-1">Date</label>
                              <input type="text" defaultValue="30-05-2026" className="w-full bg-[#141517] border border-neutral-800 rounded p-1.5 text-xs text-neutral-300 focus:outline-none" />
                            </div>
                            <div>
                              <label className="text-[9px] uppercase tracking-wider text-neutral-500 block mb-1">Time</label>
                              <input type="text" defaultValue="08:00" className="w-full bg-[#141517] border border-neutral-800 rounded p-1.5 text-xs text-neutral-300 focus:outline-none" />
                            </div>
                            <div>
                              <label className="text-[9px] uppercase tracking-wider text-neutral-500 block mb-1">Duration</label>
                              <select className="w-full bg-[#141517] border border-neutral-800 rounded p-1.5 text-xs text-neutral-300 focus:outline-none">
                                <option>30 minutes</option>
                                <option>1 hour</option>
                              </select>
                            </div>
                          </div>
                          <div className="flex justify-end gap-2 pt-1">
                            <button onClick={() => setActiveScheduleId(null)} className="text-[11px] text-neutral-400 px-3 py-1">Cancel</button>
                            <button className="bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-[11px] px-3 py-1 rounded">Add to Calendar</button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* HABIT INSERTION INLINE FIELD */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3 text-xs text-neutral-300 placeholder:text-neutral-600 focus:outline-none"
                    placeholder="Add custom habit (e.g., Read 10 pages f)..."
                    value={newHabitText}
                    onChange={(e) => setNewHabitText(e.target.value)}
                  />
                  <button className="bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 text-neutral-300 text-xs px-4 py-2 rounded-xl font-bold">
                    + Add
                  </button>
                </div>

                {/* FOCUS TIMER CONSOLE COMPONENT */}
                <div className="pt-4 border-t border-neutral-900 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-purple-400 block">Focus Timer</span>
                      <h4 className="text-xs font-bold text-neutral-300">Stay focused / 25m</h4>
                    </div>
                    <button 
                      onClick={startFocusSession}
                      className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all"
                    >
                      🚀 Start Focus
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-neutral-500 font-medium uppercase">Duration (mins):</span>
                    <input 
                      type="number" 
                      className="w-12 bg-neutral-900 border border-neutral-800 rounded p-1 text-center font-mono text-xs text-purple-400"
                      value={timerInput}
                      onChange={(e) => setTimerInput(parseInt(e.target.value, 10) || 25)}
                    />
                  </div>
                </div>

              </div>
            ) : (
              /* --- ANALYTICS INSIGHTS COMPONENT LAYER --- */
              <div className="space-y-6 animate-fadeIn">
                <div className="space-y-1">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest block">Metrics & Analytics</span>
                  <h3 className="text-base font-bold text-neutral-200">Weekly Performance Insights</h3>
                </div>

                <div className="grid grid-cols-3 gap-3 font-mono text-center">
                  <div className="bg-neutral-900/60 p-3 border border-neutral-800 rounded-xl">
                    <span className="text-[10px] text-neutral-500 block">COMPLETION RATE</span>
                    <span className="text-xl font-bold text-white mt-1 block">0%</span>
                  </div>
                  <div className="bg-neutral-900/60 p-3 border border-neutral-800 rounded-xl">
                    <span className="text-[10px] text-neutral-500 block">WEEKLY STREAK</span>
                    <span className="text-xl font-bold text-white mt-1 block">0d</span>
                  </div>
                  <div className="bg-neutral-900/60 p-3 border border-neutral-800 rounded-xl">
                    <span className="text-[10px] text-neutral-500 block">CHECK-INS</span>
                    <span className="text-xl font-bold text-white mt-1 block">0 / 28</span>
                  </div>
                </div>

                {/* GRAPH SHAPES PLACEHOLDER */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-neutral-400 block">Daily Reflection Strength</span>
                  <div className="h-16 flex items-end gap-2 pt-2 border-b border-neutral-800 px-2">
                    <div className="flex-1 bg-neutral-800 h-1 rounded-t" />
                    <div className="flex-1 bg-neutral-800 h-1 rounded-t" />
                    <div className="flex-1 bg-neutral-800 h-1 rounded-t" />
                    <div className="flex-1 bg-neutral-800 h-1 rounded-t" />
                    <div className="flex-1 bg-neutral-800 h-1 rounded-t" />
                    <div className="flex-1 bg-neutral-800 h-1 rounded-t" />
                    <div className="flex-1 bg-neutral-800 h-1 rounded-t" />
                  </div>
                  <div className="flex justify-between font-mono text-[9px] text-neutral-500 px-2">
                    <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                  </div>
                </div>

                {/* HABIT BREAKDOWN GRID SNAPSHOT */}
                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-bold text-neutral-400 block">Habit Consistency Breakdown</span>
                  <div className="space-y-2 font-mono text-[11px]">
                    {habits.map(h => (
                      <div key={h.id} className="flex justify-between items-center p-2 bg-neutral-900/40 border border-neutral-800/40 rounded-lg">
                        <span className="text-neutral-300 font-sans">{h.text}</span>
                        <div className="flex gap-1.5 text-neutral-500">
                          <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- PREMIUM DIRECT THIRD-PARTY API SYNC CONFIGURATORS --- */}
        <div className="bg-[#141517] border border-neutral-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
            <span className="text-amber-400 font-bold">⚡</span>
            <h4 className="text-xs font-black uppercase tracking-wider text-neutral-200">Direct Sync Integrations</h4>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 bg-neutral-900/50 border border-neutral-800 rounded-xl space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
                  💼 Configure Notion Workspace Credentials
                </span>
                <span className="text-[10px] bg-neutral-800 px-1.5 py-0.5 rounded font-mono text-neutral-400">Notion Settings</span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Notion Integration Key (Internal Token)</label>
                  <input 
                    type="password" 
                    className="w-full bg-[#141517] border border-neutral-800 rounded-lg p-2 font-mono text-neutral-400 focus:outline-none focus:border-neutral-700"
                    value={notionKey}
                    onChange={(e) => setNotionKey(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-neutral-500 uppercase block mb-1">Parent Page or Database ID</label>
                  <input 
                    type="text" 
                    placeholder="32-character hexadeci(mal) ID" 
                    className="w-full bg-[#141517] border border-neutral-800 rounded-lg p-2 font-mono text-neutral-400 placeholder:text-neutral-700 focus:outline-none focus:border-neutral-700"
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
                  <label htmlFor="parentDb" className="text-[11px] text-neutral-400 font-medium select-none">Parent is a Database (creates databases row)</label>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button className="bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black text-xs px-4 py-2 rounded-xl transition-all">
                  Save Settings
                </button>
              </div>
            </div>

            {/* SYNC ROUTE SHORTCUT BUTTONS BAR */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold text-neutral-400">
              <button className="p-2.5 bg-neutral-900/30 border border-neutral-800 rounded-xl hover:bg-neutral-900/60 hover:text-white transition-all flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" /> Google Calendar
              </button>
              <button className="p-2.5 bg-neutral-900/30 border border-neutral-800 rounded-xl hover:bg-neutral-900/60 hover:text-white transition-all flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-400" /> Send to Gmail
              </button>
              <button className="p-2.5 bg-neutral-900/30 border border-neutral-800 rounded-xl hover:bg-neutral-900/60 hover:text-white transition-all flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-neutral-200" /> Notion Workspace
              </button>
            </div>
          </div>
        </div>

        {/* ADS PLACEHOLDER BANNER */}
        <div className="bg-[#141517]/40 border border-neutral-900 rounded-xl p-8 text-center text-xs text-neutral-600 tracking-wider uppercase font-bold">
          Ad <span className="block text-[10px] text-neutral-700 font-normal mt-0.5">sponsored link placeholder</span>
        </div>

        {/* COMPACT FOOTER LOG RESET ROW */}
        <div className="flex justify-center gap-4 text-xs font-bold text-neutral-500 pt-4">
          <button className="hover:text-neutral-300 flex items-center gap-1"><RotateCcw className="w-3.5 h-3.5" /> New Day Reset</button>
          <span>•</span>
          <button className="hover:text-neutral-300 flex items-center gap-1"><Share2 className="w-3.5 h-3.5" /> Share Tool</button>
        </div>
      </main>

      {/* --- SLIDING SIDEBAR DRAWER FRAME: JOURNEYS & HABITS ANALYTICS DATABASE --- */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex justify-end animate-fadeIn">
          {/* Backdrop Mask */}
          <div onClick={() => setIsSidebarOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Sidebar Drawer Panel container */}
          <div className="relative w-80 h-full bg-[#141517] border-l border-neutral-800 p-5 space-y-6 flex flex-col shadow-2xl">
            <div className="flex justify-between items-center shrink-0">
              <div>
                <h3 className="text-sm font-black text-white">DailyClarity Insights</h3>
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Mental & Wellness Analytics</span>
              </div>
              <button onClick={() => setIsSidebarOpen(false)} className="p-1 text-neutral-500 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sidebar Tab Switchers */}
            <div className="flex border-b border-neutral-800 text-xs font-bold shrink-0">
              <button 
                onClick={() => setSidebarTab('journeys')}
                className={`flex-1 pb-2 border-b-2 text-center transition-all ${sidebarTab === 'journeys' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-neutral-500'}`}
              >
                Journeys
              </button>
              <button 
                onClick={() => setSidebarTab('habits')}
                className={`flex-1 pb-2 border-b-2 text-center transition-all ${sidebarTab === 'habits' ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-neutral-500'}`}
              >
                Habit Insights
              </button>
            </div>

            {/* Dynamic Content Panel Drawer Scrollbox */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
              {sidebarTab === 'journeys' ? (
                <div className="space-y-4">
                  {journeys.map(j => (
                    <div key={j.id} className="p-3.5 bg-neutral-900/60 border border-neutral-800 rounded-xl space-y-3">
                      <div className="flex justify-between items-center text-[10px] text-neutral-500 font-bold font-mono">
                        <span className="bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-300">📅 {j.date}</span>
                        <button className="text-emerald-400 hover:underline">Restore view →</button>
                      </div>
                      <p className="font-medium text-neutral-300 italic">"{j.thought}"</p>
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-bold tracking-wider uppercase text-neutral-500 block">Priorities</span>
                        {j.plan.map((p, idx) => (
                          <div key={idx} className="flex gap-1.5 text-neutral-400 leading-relaxed">
                            <span className="text-emerald-400 font-bold">{idx + 1}.</span>
                            <span>{p}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-neutral-500 pt-1 border-t border-neutral-800/60 leading-relaxed">
                        🌿 <span className="font-medium text-neutral-400">Insight:</span> {j.insight}
                      </p>
                    </div>
                  ))}
                  <button className="w-full text-center py-2 text-neutral-500 hover:text-neutral-300 font-bold border border-dashed border-neutral-800 rounded-xl transition-all">
                    Clear Recent History
                  </button>
                </div>
              ) : (
                /* Habit Historical Logs Display Column */
                <div className="space-y-4">
                  <div className="p-3.5 bg-neutral-900/60 border border-neutral-800 rounded-xl space-y-2">
                    <div className="flex justify-between items-center text-[10px] text-neutral-500 font-bold font-mono">
                      <span>📅 MAY 23, 05:32 PM</span>
                      <span className="text-emerald-400">5% Done</span>
                    </div>
                    <h4 className="font-bold text-neutral-300 text-sm">7-Day Habit Summary</h4>
                    <span className="text-neutral-500 block font-mono text-[11px]">0 of 28 tasks met</span>
                    <div className="space-y-1 pt-1 font-mono text-[11px] text-neutral-400">
                      <div className="flex justify-between"><span>May 23 (Sat)</span><span className="text-neutral-600">0/4 completed</span></div>
                      <div className="flex justify-between"><span>May 24 (Sun)</span><span className="text-neutral-600">0/4 completed</span></div>
                      <div className="flex justify-between"><span>May 25 (Mon)</span><span className="text-neutral-600">0/4 completed</span></div>
                    </div>
                  </div>

                  <div className="p-3 bg-red-950/20 border border-red-500/10 rounded-xl text-red-400/80 leading-relaxed">
                    ⚠ <span className="font-bold">Presence Needed:</span> Your alignment has drifted recently. Treat wellness as non-negotiable and let go of external distractions. You've got this!
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-neutral-800 text-center text-[10px] text-neutral-600 shrink-0 font-mono">
              SAVED LOCALLY ON THIS BROWSER
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
