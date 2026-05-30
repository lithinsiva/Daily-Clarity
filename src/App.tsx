import React, { useState, useEffect } from 'react';

interface Habit {
  id: number;
  text: string;
  completed: boolean;
}

export default function App() {
  // --- Core Application Logic States ---
  const [thought, setThought] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'checklist' | 'insights'>('checklist');

  // --- Core Habit Collection States ---
  const [habits, setHabits] = useState<Habit[]>([
    { id: 1, text: 'Drink sufficient water', completed: false },
    { id: 2, text: 'Move body & stretch', completed: false },
    { id: 3, text: 'Mindful breathing (3m)', completed: false },
    { id: 4, text: 'Digital sunset (screens off)', completed: false },
  ]);
  const [newHabitText, setNewHabitText] = useState('');

  // --- 25-Minute Focus Timer Module States ---
  const [timeLeft, setTimeLeft] = useState(1500); // 1500 Seconds = 25 Mins
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // --- Pomodoro Active Counting Effect Hook ---
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

  const toggleFocusTimer = () => setIsTimerRunning(!isTimerRunning);
  const resetFocusTimer = () => {
    setIsTimerRunning(false);
    setTimeLeft(1500);
  };

  const formatTimerString = (totalSeconds: number) => {
    const minPart = Math.floor(totalSeconds / 60);
    const secPart = totalSeconds % 60;
    return `${minPart.toString().padStart(2, '0')}:${secPart.toString().padStart(2, '0')}`;
  };

  // --- Dynamic Analytics Logic ---
  const completedHabitsCount = habits.filter((h) => h.completed).length;
  const metricsPercentRate = habits.length > 0 ? Math.round((completedHabitsCount / habits.length) * 100) : 0;

  const handleToggleHabitItem = (id: number) => {
    setHabits(habits.map((h) => (h.id === id ? { ...h, completed: !h.completed } : h)));
  };

  const handleCreateCustomHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitText.trim()) return;
    setHabits([...habits, { id: Date.now(), text: newHabitText.trim(), completed: false }]);
    setNewHabitText('');
  };

  // --- Brain Dump Optimization Simulation Execution ---
  const runClarityAnalysisEngine = () => {
    if (!thought.trim()) return;
    setIsLoading(true);
    setAiResponse(null);

    setTimeout(() => {
      const parsedText = thought.toLowerCase();
      let responseOutput = "";

      if (parsedText.includes('work') || parsedText.includes('task') || parsedText.includes('exam') || parsedText.includes('study')) {
        responseOutput = "🎯 EXECUTIVE CALM INTERVENTION:\n\n1. Lock down your active browser viewports down to 1 primary panel.\n2. Run your integrated 25-minute Pomodoro block right now.\n3. Clear away secondary items until your top metric target shows completed status.";
      } else if (parsedText.includes('stress') || parsedText.includes('worry') || parsedText.includes('anxious') || parsedText.includes('overwhelm')) {
        responseOutput = "🌿 INNER METRIC STABILIZATION:\n\nWorking memory capacity overflow identified.\n\nTake a 3-minute break, complete your Mindful Breathing objective item below, and set aside the worries outside your control layout today.";
      } else {
        responseOutput = "✨ SYSTEM OPTIMIZATION COMPLETED:\n\nStatic successfully detached from operational focus loops!\n\nPick a single micro-task habit from your checklist panel view and complete it right now to gain forward inertia.";
      }

      setAiResponse(responseOutput);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0d0e12] text-slate-200 font-sans flex flex-col items-center justify-start pt-8 pb-16 px-4 selection:bg-amber-500/30">
      
      {/* Dynamic Upper Top Bar Floating Modular Timer Block Grid Wrapper */}
      <div className="w-full max-w-xl flex justify-end mb-4">
        <div className="bg-[#1b1d24] border border-slate-800/80 rounded-xl px-4 py-2 flex items-center gap-3.5 shadow-xl">
          <span className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Focus Mode</span>
          <div className="text-lg font-black font-mono text-amber-500 tracking-tight">
            {formatTimerString(timeLeft)}
          </div>
          <div className="flex gap-1 border-l border-slate-800 pl-2">
            <button
              onClick={toggleFocusTimer}
              className={`p-1.5 rounded-md text-xs font-bold transition-all ${
                isTimerRunning ? 'bg-amber-600/20 text-amber-400 hover:bg-amber-600/30' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {isTimerRunning ? 'Pause' : 'Start'}
            </button>
            <button
              onClick={resetFocusTimer}
              className="text-slate-500 hover:text-slate-300 p-1.5 text-xs transition-colors"
              title="Reset Timer"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Main Single Card Interface Panel matching image_58c26b.jpg */}
      <div className="w-full max-w-xl bg-[#15171c] border border-slate-800/80 rounded-[28px] p-6 space-y-6 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.7)] relative overflow-hidden">
        
        {/* Dynamic App Identity Column Layout Area */}
        <div className="text-center space-y-1.5 relative z-10 pt-2">
          <div className="flex justify-center items-center gap-2">
            <h1 className="text-3xl font-black tracking-tight text-white">DailyClarity</h1>
            <span className="bg-amber-900/40 border border-amber-500/20 text-amber-500 text-[11px] font-black tracking-wide px-2.5 py-0.5 rounded-full shadow-sm">
              🔥 2 Days
            </span>
          </div>
          <p className="text-xs text-
