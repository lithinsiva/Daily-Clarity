import React, { useState } from 'react';

export default function App() {
  const [thought, setThought] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetClarity = () => {
    if (!thought.trim()) return;
    setIsLoading(true);
    setAiResponse(null);

    setTimeout(() => {
      const lowerThought = thought.toLowerCase();
      let responseText = "";

      if (lowerThought.includes('work') || lowerThought.includes('task') || lowerThought.includes('study') || lowerThought.includes('exam')) {
        responseText = "🎯 EXECUTIVE FOCUS ALIGNMENT:\n\nYour cognitive bandwidth is currently divided among multiple operational variables. To rebuild execution momentum:\n\n1. Isolate your absolute single highest-impact target right now.\n2. Turn off all secondary device notifications.\n3. Run one dedicated 25-minute focused execution block. Park all secondary items until this block is complete.";
      } else if (lowerThought.includes('stress') || lowerThought.includes('worry') || lowerThought.includes('anxious') || lowerThought.includes('tired') || lowerThought.includes('overwhelm')) {
        responseText = "🌿 MENTAL STRESS MITIGATION:\n\nHigh working-memory load detected. Your mind is trying to simulate solutions to multiple future problems simultaneously.\n\nAction Step: Take 3 slow, deep abdominal breaths immediately. Document everything you can actively control right now on a physical notepad, and consciously give yourself permission to release the variables you cannot control.";
      } else {
        responseText = "✨ COGNITIVE SPACE OPTIMIZATION:\n\nMental static successfully externalized from your working memory workspace!\n\nAction Step: Protect this clear space. Choose one micro-task that takes less than two minutes, execute it immediately, and enjoy the clean momentum.";
      }

      setAiResponse(responseText);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#11131e] text-slate-100 font-sans flex flex-col items-center justify-center py-10 px-4">
      <div className="w-full max-w-5xl bg-[#1a1d2c] rounded-2xl border border-slate-800 shadow-2xl p-6 md:p-8 space-y-6">
        
        {/* Header Section */}
        <div className="text-center relative pb-2">
          <h1 className="text-4xl font-black tracking-tight text-white">DailyClarity</h1>
          <p className="text-xs tracking-widest text-slate-400 uppercase font-bold mt-1">
            Turn Mental Chaos Into Focused Calm
          </p>
        </div>

        {/* Two-Column Middle Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          
          {/* Left Column: Input Panel */}
          <div className="bg-[#222638] rounded-xl p-5 border border-slate-700/40 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold tracking-wider text-slate-300">
                What's on your mind? Tasks, worries, random thoughts — just dump it all here...
              </label>
              <textarea
                value={thought}
                onChange={(e) => setThought(e.target.value)}
                maxLength={500}
                rows={8}
                className="w-full bg-[#161926] border border-slate-700 rounded-lg p-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500/40 resize-none text-sm leading-relaxed"
                placeholder="Start typing your thoughts away..."
              />
            </div>
            
            <div className="flex justify-between items-center">
              <button
                onClick={() => { setThought(''); setAiResponse(null); }}
                className="text-xs text-slate-400 hover:text-slate-200 transition-colors font-medium"
              >
                Clear Input
              </button>
              
              <button 
                onClick={handleGetClarity}
                disabled={isLoading || !thought.trim()}
                className="px-6 py-2.5 bg-white text-slate-950 hover:bg-slate-100 disabled:bg-slate-800 disabled:text-slate-600 font-bold rounded-xl shadow-md transition-all text-xs tracking-wider uppercase"
              >
                {isLoading ? 'Processing...' : 'Get Clarity'}
              </button>
            </div>
          </div>

          {/* Right Column: Response Panel */}
          <div className="bg-[#222638] rounded-xl p-5 border border-slate-700/40 flex flex-col space-y-2">
            <span className="block text-xs font-bold tracking-wider text-slate-300">
              AI Response:
            </span>
            
            <div className="flex-1 bg-[#161926] border border-slate-700 rounded-lg p-4 flex flex-col justify-start overflow-y-auto">
              {isLoading ? (
                <div className="text-orange-400 text-xs font-medium animate-pulse">
                  🤖 Analyzing mental logs...
                </div>
              ) : aiResponse ? (
                <div className="text-xs font-medium text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {aiResponse}
                </div>
              ) : (
                <div className="text-xs text-slate-500 font-medium italic">
                  Your response summary will appear here.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
