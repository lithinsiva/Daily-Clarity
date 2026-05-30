import React, { useState, useEffect } from 'react';

interface Task {
  id: number;
  text: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  completed: boolean;
}

interface Message {
  id: number;
  sender: 'ai' | 'user';
  text: string;
}

export default function App() {
  // --- Tasks State ---
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: 'Define weekly core objectives', priority: 'HIGH', completed: true },
    { id: 2, text: 'Review alignment & focus metrics', priority: 'MEDIUM', completed: false },
    { id: 3, text: 'Complete 45-minute deep work block', priority: 'HIGH', completed: false },
  ]);
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('MEDIUM');

  // --- Timer State ---
  const [timeLeft, setTimeLeft] = useState(1500); // 25:00
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // --- Chat State ---
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'ai', text: "Hello! I am your Clarity Assistant. Let's optimize your focus today. What's blocking your productivity right now?" }
  ]);
  const [chatInput, setChatInput] = useState('');

  // --- Timer Logic ---
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

  // --- Task Actions ---
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    setTasks([...tasks, {
      id: Date.now(),
      text: newTaskText.trim(),
      priority: newTaskPriority,
      completed: false
    }]);
    setNewTaskText('');
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  // --- Chat Actions ---
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const userMsg: Message = { id: Date.now(), sender: 'user', text: chatInput.trim() };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = chatInput.toLowerCase();
    setChatInput('');

    setTimeout(() => {
      let aiText = "I've analyzed that benchmark. Let's isolate that variable and structure a clean 25-minute focus block to cross it off.";
      if (currentInput.includes('stress') || currentInput.includes('tired') || currentInput.includes('stuck')) {
        aiText = "Mental fatigue detected. I recommend pausing active tasks, completing a 3-minute mindful breathing exercise, and setting one tiny micro-goal.";
      }
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'ai',
        text: aiText
      }]);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-slate-200 font-sans flex flex-col p-6 lg:p-8 space-y-6">
      
      {/* Top Global Header Bar */}
      <header className="flex justify-between items-center bg-[#111217] border border-slate-800 rounded-2xl px-6 py-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-black text-white text-base shadow-lg shadow-indigo-600/20">
            ⚡
          </div>
          <div>
            <h1 className="font-bold text-white text-base tracking-tight">Daily Clarity Workspace</h1>
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Production Dashboard</p>
          </div>
        </div>
        <div className="text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1.5 rounded-xl font-mono">
          System Score: 92 / 100
        </div>
      </header>

      {/* Grid Layout Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1 w-full max-w-7xl mx-auto">
        
        {/* LEFT COLUMN: Controls & Performance (Takes 7/12 spaces) */}
        <div className="lg:col-span-7 space-y-6 w-full">
          
          {/* Top Half Controls: Timer & Alignment Side-by-Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Focus Timer Block */}
            <div className="bg-[#111217] border border-slate-800 rounded-2xl p-6 text-center space-y-5 shadow-xl flex flex-col justify-center min-h-[260px]">
              <div className="text-[10px] font-bold text-indigo-400 tracking-widest uppercase bg-indigo-500/5 w-fit mx-auto px-3 py-1 rounded-full border border-indigo-500/10">
                Deep Work Engine
              </div>
              <div className="text-5xl font-black text-white font-mono tracking-tight py-2">
                {formatTime(timeLeft)}
              </div>
              <div className="flex justify-center gap-2.5">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={`px-5 py-2 rounded-xl font-bold text-xs tracking-wider uppercase transition-all shadow-md ${
                    isTimerRunning ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                  }`}
                >
                  {isTimerRunning ? 'Pause' : 'Start'}
                </button>
                <button
                  onClick={() => { setIsTimerRunning(false); setTimeLeft(1500); }}
                  className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Task Quick-Add Entry */}
            <div className="bg-[#111217] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl min-h-[260px] flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Queue Objective</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Vector tasks directly into tracking vectors.</p>
              </div>
              <form onSubmit={handleAddTask} className="space-y-3">
                <input
                  type="text"
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  placeholder="Formulate highly actionable step..."
                  className="w-full bg-[#0b0c10] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-slate-700 transition-colors"
                />
                <div className="flex gap-2">
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as any)}
                    className="flex-1 bg-[#0b0c10] border border-slate-800 rounded-xl px-2.5 py-2 text-xs font-bold text-slate-300 focus:outline-none"
                  >
                    <option value="HIGH">HIGH Priority</option>
                    <option value="MEDIUM">MEDIUM Priority</option>
                    <option value="LOW">LOW Priority</option>
                  </select>
                  <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 rounded-xl transition-all">
                    + Push
                  </button>
                </div>
              </form>
            </div>

          </div>

          {/* Alignment Tasks Matrix List */}
          <div className="bg-[#111217] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">High-Alignment Task Vector</h3>
            <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3.5 bg-[#0b0c10] border border-slate-800/60 rounded-xl hover:border-slate-700 transition-all">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="w-4 h-4 rounded border-slate-700 text-indigo-600 focus:ring-0 focus:ring-offset-0 bg-transparent cursor-pointer"
                    />
                    <span className={`font-medium text-xs ${task.completed ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                      {task.text}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded tracking-wider ${
                      task.priority === 'HIGH' ? 'bg-rose-500/10 text-rose-400' : task.priority === 'MEDIUM' ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-500/10 text-slate-400'
                    }`}>
                      {task.priority}
                    </span>
                    <button onClick={() => deleteTask(task.id)} className="text-slate-600 hover:text-rose-400 text-xs transition-colors">
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Performance Performance Graph Simulation */}
          <div className="bg-[#111217] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Weekly Mental Clarity Metrics</div>
            <div className="h-28 flex items-end gap-2 pt-4 border-b border-l border-slate-800 px-2 relative">
              <div className="w-full bg-indigo-500/20 h-[65%] rounded-t-md transition-all relative group" />
              <div className="w-full bg-indigo-500/20 h-[70%] rounded-t-md transition-all relative group" />
              <div className="w-full bg-indigo-500/40 h-[82%] rounded-t-md transition-all relative group" />
              <div className="w-full bg-indigo-500/20 h-[75%] rounded-t-md transition-all relative group" />
              <div className="w-full bg-indigo-500/30 h-[88%] rounded-t-md transition-all relative group" />
              <div className="w-full bg-indigo-600 h-[95%] rounded-t-md relative group" />
            </div>
            <div className="flex justify-between text-[10px] font-semibold text-slate-500 uppercase px-2 font-mono">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Clarity AI Co-Pilot Chat Frame (Takes 5/12 spaces) */}
        <div className="lg:col-span-5 w-full h-full min-h-[500px] lg:min-h-[715px] flex">
          <div className="bg-[#111217] border border-slate-800 rounded-2xl flex flex-col justify-between overflow-hidden shadow-xl w-full">
            
            {/* Box Header */}
            <div className="bg-[#0b0c10]/40 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-white text-sm">Clarity Vector Chat</div>
                <div className="text-[10px] text-slate-500 font-medium mt-0.5">Cognitive Load Optimization Engine</div>
              </div>
              <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 uppercase font-mono">
                Active
              </span>
            </div>

            {/* Chat Conversation Logs */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 flex flex-col max-h-[350px] lg:max-h-[540px]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'ai'
                      ? 'bg-[#0b0c10] border border-slate-800 text-slate-300 rounded-tl-none self-start'
                      : 'bg-indigo-600 text-white rounded-tr-none self-end shadow-md shadow-indigo-600/5'
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            {/* Input Form Box */}
            <form onSubmit={handleSendMessage} className="p-4 bg-[#0b0c10]/40 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask how to reduce cognitive clutter..."
                className="flex-1 bg-[#0b0c10] border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-slate-700 transition-colors"
              />
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 rounded-xl flex items-center justify-center font-bold text-xs transition-all">
                Send
              </button>
            </form>

          </div>
        </div>

      </div>
    </div>
  );
}
