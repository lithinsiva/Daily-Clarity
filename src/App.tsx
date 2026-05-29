import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  CheckSquare, 
  Clock, 
  BrainCircuit, 
  TrendingUp, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle,
  AlertCircle,
  Sparkles,
  Send,
  User,
  Bot
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

// Mock Data for Analytics
const initialPerformanceData = [
  { day: "Mon", clarity: 65, tasks: 4 },
  { day: "Tue", clarity: 70, tasks: 5 },
  { day: "Wed", clarity: 80, tasks: 7 },
  { day: "Thu", clarity: 75, tasks: 6 },
  { day: "Fri", clarity: 85, tasks: 8 },
  { day: "Sat", clarity: 90, tasks: 9 },
  { day: "Sun", clarity: 95, tasks: 7 },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [tasks, setTasks] = useState([
    { id: 1, text: "Define weekly core objectives", completed: true, priority: "high" },
    { id: 2, text: "Review alignment & focus metrics", completed: false, priority: "medium" },
    { id: 3, text: "Complete 45-minute deep work block", completed: false, priority: "high" },
  ]);
  const [newTask, setNewTask] = useState("");
  const [taskPriority, setTaskPriority] = useState("medium");
  
  // Timer State
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState("work"); // work, break

  // Chatbot State
  const [messages, setMessages] = useState([
    { id: 1, sender: "bot", text: "Hello! I am your Clarity Assistant. Let's optimize your focus today. What's blocking your productivity right now?" }
  ]);
  const [chatInput, setChatInput] = useState("");

  // Timer Logic
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (timerMode === "work") {
        alert("Deep work block complete! Take a well-deserved break.");
        setTimerMode("break");
        setTimeLeft(5 * 60);
      } else {
        alert("Break over! Ready to lock back in?");
        setTimerMode("work");
        setTimeLeft(25 * 60);
      }
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft, timerMode]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Task Handlers
  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: newTask, completed: false, priority: taskPriority }]);
    setNewTask("");
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  // Chat Handlers
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = { id: Date.now(), sender: "user", text: chatInput };
    setMessages(prev => [...prev, userMessage]);
    setChatInput("");

    // Professional AI simulated response logic
    setTimeout(() => {
      let botText = "Let's break that down into small, actionable steps. Try setting a 25-minute single-tasking timer right now to build momentum.";
      if (chatInput.toLowerCase().includes("tired") || chatInput.toLowerCase().includes("burnout")) {
        botText = "Burnout reduces clarity significantly. I recommend stopping your current task immediately, drinking some water, and using our 5-minute break mode.";
      } else if (chatInput.toLowerCase().includes("distracted") || chatInput.toLowerCase().includes("phone")) {
        botText = "Physical distance is your best defense. Put your phone in another room, close unnecessary tabs, and let's clear one urgent task.";
      }
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: "bot", text: botText }]);
    }, 8000);
  };

  return (
    <div className="flex h-screen bg-[#09090b] text-zinc-100 font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[#121214] border-r border-zinc-800 flex flex-col justify-between p-4">
        <div>
          <div className="flex items-center gap-3 px-2 py-4 mb-4">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-600/30">
              <BrainCircuit size={24} />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">Daily Clarity</h1>
              <p className="text-xs text-zinc-500 font-medium">V20.26 Stable Build</p>
            </div>
          </div>

          <nav className="space-y-1">
            {[
              { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
              { id: "tasks", label: "Task Alignment", icon: CheckSquare },
              { id: "timer", label: "Focus Matrix", icon: Clock },
              { id: "ai", label: "Clarity AI Co-Pilot", icon: BrainCircuit },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? "bg-zinc-800 text-white shadow-inner" 
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                  }`}
                >
                  <Icon size={18} className={isActive ? "text-indigo-400" : "text-zinc-500"} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow-md shadow-indigo-500/10">
            HQ
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-zinc-300 truncate">Workspace Active</p>
            <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Production Ready
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 bg-[#09090b] flex flex-col overflow-hidden">
        <header className="h-16 border-b border-zinc-800 bg-[#121214]/50 backdrop-blur-md flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <span>Workspace</span>
            <span className="text-zinc-600">/</span>
            <span className="text-zinc-200 font-medium capitalize">{activeTab}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-zinc-500 font-medium">Daily Score</p>
              <p className="text-sm font-bold text-indigo-400">92 / 100</p>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Stat Metric Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  { title: "Deep Work Sessions", value: "4 / 6", desc: "+1.2 hours over daily average", icon: Clock, color: "text-indigo-400" },
                  { title: "Objective Completion", value: "88%", desc: "11 of 13 trackable tasks closed", icon: CheckSquare, color: "text-emerald-400" },
                  { title: "Focus Metric Index", value: "84.2", desc: "Optimal psychological flow zone", icon: TrendingUp, color: "text-purple-400" },
                ].map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div key={i} className="bg-[#121214] border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-all duration-200 shadow-sm">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-semibold text-zinc-400 tracking-wide uppercase">{stat.title}</span>
                        <Icon size={18} className={stat.color} />
                      </div>
                      <p className="text-2xl font-bold tracking-tight text-white mb-1">{stat.value}</p>
                      <p className="text-xs text-zinc-500 font-medium">{stat.desc}</p>
                    </div>
                  );
                })}
              </div>

              {/* Data Visual Analytics Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#121214] border border-zinc-800 rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2">
                    <TrendingUp size={16} className="text-indigo-400" /> Weekly Mental Clarity Index
                  </h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={initialPerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                        <XAxis dataKey="day" stroke="#71717a" fontSize={11} />
                        <YAxis stroke="#71717a" fontSize={11} domain={[50, 100]} />
                        <Tooltip contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46", borderRadius: "8px", color: "#f4f4f5" }} />
                        <Line type="monotone" dataKey="clarity" stroke="#4f46e5" strokeWidth={2.5} dot={{ fill: "#4f46e5", r: 4 }} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-[#121214] border border-zinc-800 rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2">
                    <CheckSquare size={16} className="text-emerald-400" /> Executive Actions Executed
                  </h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={initialPerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                        <XAxis dataKey="day" stroke="#71717a" fontSize={11} />
                        <YAxis stroke="#71717a" fontSize={11} />
                        <Tooltip contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46", borderRadius: "8px", color: "#f4f4f5" }} />
                        <Bar dataKey="tasks" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={32} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "tasks" && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-[#121214] border border-zinc-800 rounded-xl p-6">
                <h2 className="text-lg font-bold text-white mb-2">High-Alignment Task Vector</h2>
                <p className="text-xs text-zinc-400 mb-5">Map core high-impact tasks to minimize decision fatigue.</p>
                
                <form onSubmit={addTask} className="flex gap-3 mb-6">
                  <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Formulate highly actionable objective..."
                    className="flex-1 bg-[#1c1c1f] border border-zinc-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder-zinc-600"
                  />
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value)}
                    className="bg-[#1c1c1f] border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 text-zinc-300"
                  >
                    <option value="high">High priority</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                  <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-4 flex items-center justify-center gap-2 text-sm font-semibold transition-colors shadow-lg shadow-indigo-600/10">
                    <Plus size={16} /> Track
                  </button>
                </form>

                <div className="space-y-2">
                  {tasks.map((task) => (
                    <div 
                      key={task.id} 
                      className={`flex items-center justify-between p-3 border rounded-lg transition-all duration-200 ${
                        task.completed 
                          ? "bg-zinc-900/30 border-zinc-900 text-zinc-500" 
                          : "bg-[#1c1c1f] border-zinc-800 text-zinc-200 hover:border-zinc-700"
                      }`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <button onClick={() => toggleTask(task.id)} className="text-zinc-500 hover:text-indigo-400 transition-colors flex-shrink-0">
                          {task.completed ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Circle size={18} />}
                        </button>
                        <span className={`text-sm truncate ${task.completed ? "line-through font-normal" : "font-medium"}`}>{task.text}</span>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          task.priority === "high" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" :
                          task.priority === "medium" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                          "bg-zinc-700/30 text-zinc-400 border border-zinc-700/40"
                        }`}>
                          {task.priority}
                        </span>
                        <button onClick={() => deleteTask(task.id)} className="text-zinc-600 hover:text-rose-400 transition-colors p-1">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "timer" && (
            <div className="max-w-md mx-auto text-center space-y-6 py-8">
              <div className="bg-[#121214] border border-zinc-800 rounded-2xl p-8 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
                <div className="mb-4">
                  <span className="text-xs font-bold tracking-widest text-indigo-400 uppercase bg-indigo-500/5 border border-indigo-500/10 px-3 py-1 rounded-full">
                    {timerMode === "work" ? "Deep Work Engine" : "Strategic Regeneration"}
                  </span>
                </div>
                
                <h2 className="text-7xl font-light font-mono text-white tracking-tight my-6 select-none">{formatTime(timeLeft)}</h2>
                
                <div className="flex justify-center gap-3 mb-4">
                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className={`px-8 py-3 rounded-xl text-sm font-semibold shadow-lg transition-all duration-200 ${
                      isTimerRunning 
                        ? "bg-zinc-800 hover:bg-zinc-700 text-white" 
                        : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20"
                    }`}
                  >
                    {isTimerRunning ? "Pause" : "Initiate Block"}
                  </button>
                  <button
                    onClick={() => {
                      setIsTimerRunning(false);
                      setTimeLeft(timerMode === "work" ? 25 * 60 : 5 * 60);
                    }}
                    className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 px-5 py-3 rounded-xl text-sm font-medium transition-colors"
                  >
                    Reset
                  </button>
                </div>
                <p className="text-xs text-zinc-500 font-medium">Isolate variables. Focus purely on one key action standard.</p>
              </div>
            </div>
          )}

          {activeTab === "ai" && (
            <div className="max-w-3xl mx-auto h-[550px] bg-[#121214] border border-zinc-800 rounded-xl flex flex-col overflow-hidden shadow-xl">
              <div className="p-4 border-b border-zinc-800 bg-[#121214] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Clarity Vector Chat</h3>
                    <p className="text-[10px] text-zinc-500 font-medium">Cognitive Load Optimization Engine</p>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Online</span>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#09090b]/40">
                {messages.map((m) => (
                  <div key={m.id} className={`flex gap-3 max-w-[85%] ${m.sender === "user" ? "ml-auto flex-row-reverse" : ""}`}>
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center border flex-shrink-0 ${
                      m.sender === "user" ? "bg-zinc-800 border-zinc-700 text-zinc-200" : "bg-indigo-600/10 border-indigo-600/20 text-indigo-400"
                    }`}>
                      {m.sender === "user" ? <User size={14} /> : <Bot size={14} />}
                    </div>
                    <div className={`p-3 rounded-xl text-sm leading-relaxed ${
                      m.sender === "user" ? "bg-indigo-600 text-white font-medium shadow-md shadow-indigo-600/10" : "bg-[#1c1c1f] border border-zinc-800 text-zinc-300"
                    }`}>
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="p-4 border-t border-zinc-800 bg-[#121214] flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask how to reduce clutter or optimize execution strategies..."
                  className="flex-1 bg-[#1c1c1f] border border-zinc-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder-zinc-600"
                />
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-4 flex items-center justify-center transition-colors shadow-lg shadow-indigo-600/10">
                  <Send size={15} />
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
