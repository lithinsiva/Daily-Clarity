import React, { useState, useEffect } from 'react';

type Page = 'dashboard' | 'alignment' | 'matrix' | 'copilot';

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
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  
  // Tasks State
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: 'Define weekly core objectives', priority: 'HIGH', completed: true },
    { id: 2, text: 'Review alignment & focus metrics', priority: 'MEDIUM', completed: false },
    { id: 3, text: 'Complete 45-minute deep work block', priority: 'HIGH', completed: false },
  ]);
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('MEDIUM');

  // Timer State
  const [timeLeft, setTimeLeft] = useState(1500); // 25:00
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Chat State
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'ai', text: "Hello! I am your Clarity Assistant. Let's optimize your focus today. What's blocking your productivity right now?" }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Timer Logic
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

  // Task Actions
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

  // Chat Action
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const userMsg: Message = { id: Date.now(), sender: 'user', text: chatInput.trim() };
    setMessages(prev => [...prev, userMsg]);
    setChatInput('');

    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'ai',
        text: "I've analyzed that bottleneck. Let's isolate that variable and structure a 25-minute deep work block to break through it."
      }]);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] text-slate-200 font-sans flex text-sm">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[#111217] border-r border-slate-800 p-5 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-black text-white text-base shadow-lg shadow-indigo-600/20">
              ⚡
            </div>
            <div>
              <div className="font-bold text-white text-base tracking-tight">Daily Clarity</div>
              <div className="text-xs text-slate-500 font-medium">V20.26 Stable Build</div>
            </div>
          </div>

          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '📊' },
              { id: 'alignment', label: 'Task Alignment', icon: '🎯' },
              { id: 'matrix', label: 'Focus Matrix', icon: '⏱️' },
              { id: 'copilot', label: 'Clarity AI Co-Pilot', icon: '🤖' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id as Page)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-medium transition-all duration-150 ${
                  currentPage === item.id
                    ? 'bg-indigo-600/10 text-indigo-400 font-semibold shadow-inner'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-3.5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white text-xs shadow-md">
            HQ
          </div>
          <div>
            <div className="font-semibold text-white text-xs">Workspace Active</div>
            <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Production Ready
            </div>
          </div>
        </div>
      </aside>

      {/* Main Panel Area */}
      <main className="flex-1 bg-[#0b0c10] overflow-y-auto">
        
        {/* Top Navbar Header */}
        <header className="border-b border-slate-800/80 px-8 py-4.5 bg-[#0b0c10]/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 tracking-wide uppercase">
            <span>Workspace</span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-200 capitalize">{currentPage}</span>
          </div>
          <div className="text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1.5 rounded-lg font-mono">
            Daily Score: 92 / 100
          </div>
        </header>

        {/* Dynamic Page Views */}
        <div className="p-8 max-w-5xl mx-auto w-full">
          {currentPage === 'dashboard' && (
            <div className="space-y-8">
              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-5">
                <div className="bg-[#111217] border border-slate-800 rounded-xl p-5 relative overflow-hidden">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Deep Work Sessions</div>
                  <div className="text-3xl font-black text-white mt-2 font-mono">4 / 6</div>
                  <div className="text-xs text-indigo-400 mt-1.5 font-medium">+1.2 hours over daily average</div>
                </div>
                <div className="bg-[#111217] border border-slate-800 rounded-xl p-5 relative overflow-hidden">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Objective Completion</div>
                  <div className="text-3xl font-black text-white mt-2 font-mono">88%</div>
                  <div className="text-xs text-emerald-400 mt-1.5 font-medium">11 of 13 trackable tasks closed</div>
                </div>
                <div className="bg-[#111217] border border-slate-800 rounded-xl p-5 relative overflow-hidden">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Focus Metric Index</div>
                  <div className="text-3xl font-black text-white mt-2 font-mono">84.2</div>
                  <div className="text-xs text-purple-400 mt-1.5 font-medium">Optimal psychological flow zone</div>
                </div>
              </div>

              {/* Graphical Simulation Container */}
              <div className="grid grid-cols-5 gap-5">
                <div className="col-span-3 bg-[#111217] border border-slate-800 rounded-xl p-5 space-y-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Weekly Mental Clarity Index</div>
                  <div className="h-48 flex items-end gap-2 pt-4 border-b border-l border-slate-800 px-2 relative">
                    <div className="absolute inset-0 flex flex-col justify-between text-[10px] text-slate-600 font-mono pointer-events-none select-none pl-1 pt-2">
                      <div>100</div><div>75</div><div>50</div>
                    </div>
                    <div className="w-full bg-indigo-500/20 hover:bg-indigo-500/30 h-[65%] rounded-t-md transition-all relative group"><span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800 text-[10px] px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity font-mono">65</span></div>
                    <div className="w-full bg-indigo-500/20 hover:bg-indigo-500/30 h-[70%] rounded-t-md transition-all relative group"><span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800 text-[10px] px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity font-mono">70</span></div>
                    <div className="w-full bg-indigo-500/40 hover:bg-indigo-500/50 h-[82%] rounded-t-md transition-all relative group"><span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800 text-[10px] px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity font-mono">82</span></div>
                    <div className="w-full bg-indigo-500/20 hover:bg-indigo-500/30 h-[75%] rounded-t-md transition-all relative group"><span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800 text-[10px] px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity font-mono">75</span></div>
                    <div className="w-full bg-indigo-500/30 hover:bg-indigo-500/40 h-[88%] rounded-t-md transition-all relative group"><span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800 text-[10px] px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity font-mono">88</span></div>
                    <div className="w-full bg-indigo-500/30 hover:bg-indigo-500/40 h-[91%] rounded-t-md transition-all relative group"><span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800 text-[10px] px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity font-mono">91</span></div>
                    <div className="w-full bg-indigo-600 h-[95%] rounded-t-md relative group"><span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] px-1 rounded font-mono font-bold">95</span></div>
                  </div>
                  <div className="flex justify-between text-[10px] font-semibold text-slate-500 uppercase px-2 font-mono">
                    <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                  </div>
                </div>

                <div className="col-span-2 bg-[#111217] border border-slate-800 rounded-xl p-5 space-y-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Executive Actions Executed</div>
                  <div className="h-48 flex items-end justify-between pt-4 border-b border-slate-800 px-4">
                    <div className="w-6 bg-emerald-500/40 h-[35%] rounded-t-sm" />
                    <div className="w-6 bg-emerald-500/40 h-[45%] rounded-t-sm" />
                    <div className="w-6 bg-emerald-500/60 h-[68%] rounded-t-sm" />
                    <div className="w-6 bg-emerald-500/40 h-[60%] rounded-t-sm" />
                    <div className="w-6 bg-emerald-500/70 h-[80%] rounded-t-sm" />
                    <div className="w-6 bg-emerald-500 h-[92%] rounded-t-sm" />
                    <div className="w-6 bg-emerald-500/70 h-[72%] rounded-t-sm" />
                  </div>
                  <div className="flex justify-between text-[10px] font-semibold text-slate-500 uppercase px-1 font-mono">
                    <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentPage === 'alignment' && (
            <div className="bg-[#111217] border border-slate-800 rounded-xl p-6 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white">High-Alignment Task Vector</h2>
                <p className="text-xs text-slate-400 mt-1">Map core high-impact tasks to minimize decision fatigue.</p>
              </div>

              {/* Add Task Form */}
              <form onSubmit={handleAddTask} className="flex gap-3 bg-[#0b0c10] p-2 rounded-xl border border-slate-800">
                <input
                  type="text"
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  placeholder="Formulate highly actionable objective..."
                  className="flex-1 bg-transparent px-3 py-2 text-slate-200 placeholder-slate-600 focus:outline-none text-sm"
                />
                <select
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value as any)}
                  className="bg-[#111217] border border-slate-800 rounded-lg px-3 text-xs font-bold text-slate-300 focus:outline-none"
                >
                  <option value="HIGH">HIGH</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="LOW">LOW</option>
                </select>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 rounded-lg transition-all">
                  + Track
                </button>
              </form>

              {/* Task Items Container */}
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 bg-[#0b0c10] border border-slate-800/60 rounded-xl hover:border-slate-700 transition-all">
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask(task.id)}
                        className="w-4 h-4 rounded border-slate-700 text-indigo-600 focus:ring-0 focus:ring-offset-0 bg-transparent cursor-pointer"
                      />
                      <span className={`font-medium text-sm ${task.completed ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                        {task.text}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded tracking-wider ${
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
          )}

          {currentPage === 'matrix' && (
            <div className="max-w-md mx-auto bg-[#111217] border border-slate-800 rounded-xl p-8 text-center space-y-6 shadow-xl">
              <div className="text-xs font-bold text-indigo-400 tracking-widest uppercase bg-indigo-500/5 w-fit mx-auto px-3 py-1 rounded-full border border-indigo-500/10">
                Deep Work Engine
              </div>
              <div className="text-6xl font-black text-white font-mono tracking-tight py-4 selection:bg-none">
                {formatTime(timeLeft)}
              </div>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className={`px-6 py-2.5 rounded-xl font-bold text-xs tracking-wider uppercase transition-all shadow-md ${
                    isTimerRunning ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/10'
                  }`}
                >
                  {isTimerRunning ? 'Pause Block' : 'Initiate Block'}
                </button>
                <button
                  onClick={() => { setIsTimerRunning(false); setTimeLeft(1500); }}
                  className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
                >
                  Reset
                </button>
              </div>
              <p className="text-xs text-slate-500 font-medium pt-2">Isolate variables. Focus purely on one key action standard.</p>
            </div>
          )}

          {currentPage === 'copilot' && (
            <div className="bg-[#111217] border border-slate-800 rounded-xl h-[500px] flex flex-col justify-between overflow-hidden">
              {/* Header inside window */}
              <div className="bg-[#0b0c10]/40 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-sm">Clarity Vector Chat</div>
                  <div className="text-[10px] text-slate-500 font-medium mt-0.5">Cognitive Load Optimization Engine</div>
                </div>
                <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 uppercase font-mono">
                  Online
                </span>
              </div>

              {/* Message Flow Area */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4 flex flex-col">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`max-w-[75%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                      msg.sender === 'ai'
                        ? 'bg-[#0b0c10] border border-slate-800 text-slate-300 rounded-tl-none self-start'
                        : 'bg-indigo-600 text-white rounded-tr-none self-end shadow-md shadow-indigo-600/5'
                    }`}
                  >
                    {msg.text}
                  </div>
                ))}
              </div>

              {/* Prompt Entry Form */}
              <form onSubmit={handleSendMessage} className="p-4 bg-[#0b0c10]/40 border-t border-slate-800 flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask how to reduce clutter or optimize execution strategies..."
                  className="flex-1 bg-[#0b0c10] border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-slate-700 transition-colors"
                />
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 rounded-xl flex items-center justify-center font-bold text-sm transition-all">
                  ➡️
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
