import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, RefreshCcw, AlertCircle, Share2, Check, ExternalLink, Sun, Moon, Mic, MicOff } from "lucide-react";
import RecentClaritiesDrawer, { SavedClarity, HabitReport } from "./components/RecentClaritiesDrawer";
import SyncPanel from "./components/SyncPanel";
import PomodoroTimer from "./components/PomodoroTimer";
import DailyHabitTracker from "./components/DailyHabitTracker";

/**
 * DAILY CLARITY - WEB CLIENT CONFIGURATION
 * 
 * To deploy this client connected to your secure Cloudflare Worker:
 * 1. Deploy the worker.js script to your Cloudflare account.
 * 2. Set your environment secret named GEMINI_KEY on the Cloudflare dashboard.
 * 3. Replace the placeholder below with your Cloudflare Worker URL (e.g., https://daily-clarity.your-subdomain.workers.dev).
 * 
 * If the WORKER_URL is left empty or as placeholder, the application automatically running
 * in AI Studio dev server defaults to using the built-in local Express API (/api/clarity) 
 * while maintaining a fully functioning local client-side daily usage simulation so you can 
 * test rate limits and upgrade cards live in real-time.
 */
// TODO: Replace with your Cloudflare Worker URL after deploying worker.js
const WORKER_URL: string = "https://dailyclarity.lithinsiva700.workers.dev";

interface ClarityResponse {
  priorities: string[];
  letGo: string;
  resetPhrase: string;
}

const getLocalDateString = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getYesterdayDateString = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return getLocalDateString(yesterday);
};

export default function App() {
  const [chaos, setChaos] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ClarityResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Usage tracking state (max 10 daily uses resetting at midnight UTC)
  const [userId, setUserId] = useState("");
  const [remainingUses, setRemainingUses] = useState(10);
  const [limitReached, setLimitReached] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Daily Streak tracker state
  const [streak, setStreak] = useState<number>(0);
  
  // Custom mindfulness greeting states
  const [microCopy, setMicroCopy] = useState("Your mind is a canvas. Let's create space.");
  const [loadingStep, setLoadingStep] = useState(0);

  // Recent clarities history state
  const [history, setHistory] = useState<SavedClarity[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Exported habit reports state and tab navigation control
  const [habitReports, setHabitReports] = useState<HabitReport[]>(() => {
    try {
      const saved = localStorage.getItem("dc_habit_reports");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [drawerTab, setDrawerTab] = useState<"clarities" | "habits">("clarities");

  // Dark mode theme toggle
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("daily_clarity_dark_mode") === "true";
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem("daily_clarity_dark_mode", String(isDarkMode));
  }, [isDarkMode]);

  const characterLimit = 500;

  // Breathing Exercise state variables
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathingTimer, setBreathingTimer] = useState(30);
  const [pendingResult, setPendingResult] = useState<ClarityResponse | null>(null);

  // Breathing Timer Countdown Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isBreathing) {
      setBreathingTimer(30);
      interval = setInterval(() => {
        setBreathingTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsBreathing(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBreathing]);

  // When breathing finishes or is skipped, set result with pendingResult
  useEffect(() => {
    if (!isBreathing && pendingResult) {
      setResult(pendingResult);
      setPendingResult(null);
      setMicroCopy("Take a quiet moment. Your focus is here.");
    }
  }, [isBreathing, pendingResult]);

  const handleSkipBreathing = () => {
    setIsBreathing(false);
    setBreathingTimer(0);
  };

  // Web Notification API morning reminder states
  const [reminderStatus, setReminderStatus] = useState<"idle" | "scheduled" | "unsupported" | "denied">("idle");

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!("Notification" in window)) {
        setReminderStatus("unsupported");
      } else if (Notification.permission === "granted") {
        const isScheduled = localStorage.getItem("daily_clarity_reminder_scheduled") === "true";
        if (isScheduled) {
          setReminderStatus("scheduled");
        }
      } else if (Notification.permission === "denied") {
        setReminderStatus("denied");
      }
    }
  }, []);

  useEffect(() => {
    if (reminderStatus === "scheduled" && typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      const now = new Date();
      const target = new Date();
      target.setDate(now.getDate() + 1);
      target.setHours(8, 0, 0, 0); // 8:00 AM next morning

      const msUntilTarget = target.getTime() - now.getTime();
      if (msUntilTarget > 0) {
        const timer = setTimeout(() => {
          if (Notification.permission === "granted") {
            new Notification("Good morning from DailyClarity! 🌤️", {
              body: "Time to turn today's mental chaos into focused calm and structure your day.",
              requireInteraction: true
            });
          }
        }, msUntilTarget);
        return () => clearTimeout(timer);
      }
    }
  }, [reminderStatus]);

  const handleScheduleReminder = async () => {
    if (typeof window === "undefined") return;
    if (!("Notification" in window)) {
      setReminderStatus("unsupported");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        localStorage.setItem("daily_clarity_reminder_scheduled", "true");
        setReminderStatus("scheduled");
        
        new Notification("DailyClarity Reminder Set! ⏰", {
          body: "We will remind you tomorrow morning at 8:00 AM. 🌿",
          tag: "daily-clarity-confirm"
        });
      } else {
        localStorage.setItem("daily_clarity_reminder_scheduled", "false");
        setReminderStatus("denied");
      }
    } catch (err) {
      console.error("Failed to request notification permission:", err);
      setReminderStatus("denied");
    }
  };

  const handleCancelReminder = () => {
    localStorage.setItem("daily_clarity_reminder_scheduled", "false");
    setReminderStatus("idle");
  };

  // Dictation / Web Speech API states
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    let rec: any = null;
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
        rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = "en-US";

        rec.onresult = (event: any) => {
          let addedText = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              addedText += event.results[i][0].transcript;
            }
          }
          if (addedText) {
            setChaos((prev) => {
              const cleanedPrev = prev.trim();
              const combined = cleanedPrev ? (cleanedPrev + " " + addedText.trim()) : addedText.trim();
              return combined.slice(0, characterLimit);
            });
          }
        };

        rec.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          setIsListening(false);
          if (event.error === "not-allowed") {
            setError("Microphone permission was denied. Please update browser settings.");
          } else if (event.error === "network") {
            setError("Speech recognition failed due to a network connection issue.");
          } else {
            setError(`Microphone error: ${event.error}`);
          }
        };

        rec.onend = () => {
          setIsListening(false);
        };

        setRecognition(rec);
      }
    }
    return () => {
      if (rec) {
        try {
          rec.abort();
        } catch (e) {
          // Ignore
        }
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognition) return;
    if (isListening) {
      recognition.stop();
      setIsListening(false);
      setMicroCopy("Listening stopped. Mind space updated.");
    } else {
      setError(null);
      try {
        recognition.start();
        setIsListening(true);
        setMicroCopy("Listening... Speak clearly to dictate.");
      } catch (err) {
        console.error("Recognition start error:", err);
      }
    }
  };

  // Initialize UserId & Free Usage limits & Load Recent History
  useEffect(() => {
    // 1. Generate or fetch anonymous userId
    let uId = localStorage.getItem("daily_clarity_uid");
    if (!uId) {
      const entropy = Date.now().toString(16) + Math.random().toString(16).substring(2) + navigator.userAgent.replace(/[^a-zA-Z0-9]/g, "").substring(0, 10);
      uId = "dc_user_" + entropy;
      localStorage.setItem("daily_clarity_uid", uId);
    }
    setUserId(uId);

    // 2. Fetch or reset local daily usage count at Midnight UTC
    const todayUTC = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const localUsageKey = `daily_clarity_uses_${todayUTC}`;
    const localUsesStr = localStorage.getItem(localUsageKey);
    const usesDone = localUsesStr ? parseInt(localUsesStr, 10) : 0;
    
    const remaining = Math.max(0, 10 - usesDone);
    setRemainingUses(remaining);

    // 3. Load Recent clarities history from localStorage
    try {
      const savedHistoryStr = localStorage.getItem("daily_clarity_history");
      if (savedHistoryStr) {
        setHistory(JSON.parse(savedHistoryStr));
      }
    } catch (e) {
      console.error("Error loading recent clarities history:", e);
    }

    // 4. Initialize and verify Daily Streak count
    try {
      const lastSessionDate = localStorage.getItem("daily_clarity_last_session_date");
      const storedStreak = parseInt(localStorage.getItem("daily_clarity_streak") || "0", 10);
      
      if (lastSessionDate) {
        const todayStr = getLocalDateString(new Date());
        const yesterdayStr = getYesterdayDateString();
        
        if (lastSessionDate === todayStr || lastSessionDate === yesterdayStr) {
          // Streak is still active/valid
          setStreak(storedStreak);
        } else {
          // Streak has broken
          setStreak(0);
          localStorage.setItem("daily_clarity_streak", "0");
        }
      } else {
        setStreak(0);
      }
    } catch (e) {
      console.error("Error loading daily streak:", e);
    }
  }, []);

  const recordSessionForStreak = () => {
    try {
      const todayStr = getLocalDateString(new Date());
      const yesterdayStr = getYesterdayDateString();
      const lastSessionDate = localStorage.getItem("daily_clarity_last_session_date");
      const storedStreak = parseInt(localStorage.getItem("daily_clarity_streak") || "0", 10);
      
      let newStreak = 1;
      if (lastSessionDate) {
        if (lastSessionDate === todayStr) {
          newStreak = storedStreak;
        } else if (lastSessionDate === yesterdayStr) {
          newStreak = storedStreak + 1;
        } else {
          newStreak = 1;
        }
      } else {
        newStreak = 1;
      }
      
      localStorage.setItem("daily_clarity_last_session_date", todayStr);
      localStorage.setItem("daily_clarity_streak", String(newStreak));
      setStreak(newStreak);
    } catch (e) {
      console.error("Error recording daily streak:", e);
    }
  };

  const saveToHistory = (newResult: ClarityResponse, rawChaos: string) => {
    const timestamp = new Date().toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
    
    const newItem: SavedClarity = {
      id: "clarity_" + Date.now(),
      timestamp,
      chaosText: rawChaos.substring(0, 100) + (rawChaos.length > 100 ? "..." : ""),
      priorities: newResult.priorities,
      letGo: newResult.letGo,
      resetPhrase: newResult.resetPhrase
    };

    const updatedHistory = [newItem, ...history].slice(0, 3);
    setHistory(updatedHistory);
    localStorage.setItem("daily_clarity_history", JSON.stringify(updatedHistory));

    // Update streak on completing a session
    recordSessionForStreak();
  };

  const handleRestoreSaved = (saved: SavedClarity) => {
    setResult({
      priorities: saved.priorities,
      letGo: saved.letGo,
      resetPhrase: saved.resetPhrase
    });
    setChaos(""); // Keep raw textarea clean to avoid distraction
    setIsDrawerOpen(false);
    setMicroCopy("Restored a previous session.");
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem("daily_clarity_history");
  };

  const handleClearReports = () => {
    setHabitReports([]);
    localStorage.removeItem("dc_habit_reports");
  };

  // Sync limit reached state
  useEffect(() => {
    if (remainingUses <= 0) {
      setLimitReached(true);
      setMicroCopy("You have found your clarity for today. Release the thoughts.");
    } else {
      setLimitReached(false);
    }
  }, [remainingUses]);

  // Loading indicator messages to cycle for mindfulness during call
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      const messages = [
        "Sifting through the noise...",
        "Gathering priorities...",
        "Breathing in, breathing out...",
        "Structuring clarity...",
      ];
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % messages.length);
      }, 2500);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleGetClarity = async (e: FormEvent) => {
    e.preventDefault();
    if (!chaos.trim()) return;

    // Pre-emptively block if client limit is hit
    if (remainingUses <= 0) {
      setLimitReached(true);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setPendingResult(null);
    setIsBreathing(true);

    const isLocal = !WORKER_URL || WORKER_URL.trim() === "YOUR_WORKER_URL_HERE" || WORKER_URL.trim() === "";

    try {
      let data: ClarityResponse;
      const todayUTC = new Date().toISOString().split("T")[0];

      let response;
      let usedLocalFallback = false;

      if (isLocal) {
        // Fallback to local server-side API in development/preview sandbox
        response = await fetch("/api/clarity", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ chaos })
        });
        usedLocalFallback = true;
      } else {
        try {
          const baseUrl = WORKER_URL.trim();
          const fetchUrl = baseUrl.endsWith("/") ? `${baseUrl}api/clarity` : `${baseUrl}/api/clarity`;
          
          response = await fetch(fetchUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-User-Id": userId
            },
            body: JSON.stringify({
              text: chaos,
              userId: userId
            })
          });
        } catch (fetchErr) {
          console.warn("External worker fetch failed, attempting local server fallback:", fetchErr);
          // Automatic recovery fallback if the outer worker is down or misconfigured
          response = await fetch("/api/clarity", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ chaos })
          });
          usedLocalFallback = true;
        }
      }

      if (response.status === 429) {
        setRemainingUses(0);
        localStorage.setItem(`daily_clarity_uses_${todayUTC}`, "10");
        throw new Error("You’ve used all 10 free clarities for today! Come back tomorrow for 10 more free sessions — or share this with a friend 🌿");
      }

      if (!response.ok) {
        const errPayload = await response.json().catch(() => ({}));
        throw new Error(errPayload.message || errPayload.error || "Failed to contact secure backend service.");
      }

      const payloadResult = await response.json();
      data = payloadResult;
      
      // Sync cloud worker remaining uses if returned
      if (!isLocal && !usedLocalFallback && typeof payloadResult.remainingUses === "number") {
        setRemainingUses(payloadResult.remainingUses);
        const localDone = 10 - payloadResult.remainingUses;
        localStorage.setItem(`daily_clarity_uses_${todayUTC}`, localDone.toString());
      } else {
        const localKey = `daily_clarity_uses_${todayUTC}`;
        const currentCount = parseInt(localStorage.getItem(localKey) || "0", 10) + 1;
        localStorage.setItem(localKey, currentCount.toString());
        setRemainingUses(Math.max(0, 10 - currentCount));
      }

      setPendingResult(data);
      saveToHistory(data, chaos);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred. Please try restructuring your thoughts.");
      setIsBreathing(false);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setChaos("");
    setResult(null);
    setError(null);
    setMicroCopy("New day, new clarity.");
  };

  const handleShare = () => {
    const shareText = "I use DailyClarity every morning to clear my head — try it free: https://yourdomain.pages.dev";
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  const theme = {
    bg: isDarkMode ? "bg-[#141816] text-[#E8F4F0]" : "bg-[#E8F4F0] text-[#2C2C2C]",
    card: isDarkMode ? "bg-[#1B201E] border border-[#2E3734] shadow-2xl shadow-black/80" : "bg-white shadow-2xl shadow-[#8A9B96]/20",
    text: isDarkMode ? "text-[#E8F4F0]" : "text-[#2C2C2C]",
    title: isDarkMode ? "text-[#E8F4F0]" : "text-[#2C2C2C]",
    subText: isDarkMode ? "text-[#8FA39D]" : "text-[#5A5A5A]",
    badge: isDarkMode ? "bg-[#242C29] text-[#B8D8CE] hover:bg-[#2C3632]" : "bg-[#F0F5F3] text-[#4A635D] hover:bg-[#E0E8E5]",
    input: isDarkMode ? "bg-[#171C1A] border-[#2D3633] text-[#E8F4F0] focus:ring-[#B8D8CE]" : "bg-[#F9FBFA] border-[#E0E8E5] text-[#2C2C2C] focus:ring-[#B8D8CE]",
    btn: isDarkMode ? "bg-[#B8D8CE] text-[#141816] hover:bg-[#A3C9BD]" : "bg-[#2C2C2C] text-white hover:bg-[#404040]",
    border: isDarkMode ? "border-[#2E3734]" : "border-[#F0F5F3]",
    accentText: isDarkMode ? "text-[#B8D8CE]" : "text-[#4A635D]",
    subtleLabel: isDarkMode ? "text-[#6A7C77]" : "text-[#8A9B96]",
    affiliateLink: isDarkMode ? "bg-[#171C1A] border-[#2D3633] text-[#8FA39D] hover:bg-[#242C29] hover:border-[#B8D8CE] hover:text-[#E8F4F0]" : "bg-gray-50 border-gray-100 text-neutral-600 hover:bg-[#F0F5F3] hover:border-[#B8D8CE] hover:text-[#2C2C2C]",
    partnerBadge: isDarkMode ? "bg-[#242C29] text-[#6A7C77]" : "bg-gray-100 text-neutral-400",
    adBlock: isDarkMode ? "bg-[#171C1A] border-[#2D3633] text-[#6A7C77]" : "bg-[#F9FBFA] border-[#E0E8E5] text-[#A0A0A0]"
  };

  const loadingMessages = [
    "Sifting through the noise...",
    "Gathering priorities...",
    "Breathing in, breathing out...",
    "Structuring clarity...",
  ];

  return (
    <div id="app-container" className={`min-h-screen ${theme.bg} flex flex-col items-center justify-between p-4 md:p-8 font-sans selection:bg-[#2C2C2C] selection:text-white relative transition-colors duration-300`}>
      <div className="flex-1" />

      {/* PROBLEM 3 - Setup Warning Banner if WORKER_URL is left as placeholder */}
      {(!WORKER_URL || WORKER_URL.trim() === "YOUR_WORKER_URL_HERE") && (
        <div 
          id="setup-warning-banner" 
          className="w-full max-w-[600px] bg-amber-500/10 border border-amber-500/30 text-amber-500 dark:text-amber-400 font-bold text-xs md:text-sm text-center py-2.5 px-4 rounded-2xl mb-4 shadow-xs z-10 animate-pulse"
        >
          ⚠️ Setup needed — connect your backend to activate AI features
        </div>
      )}

      {/* Main Container Card in Professional Polish theme */}
      <motion.main
        id="main-card-wrapper"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`w-full max-w-[600px] ${theme.card} rounded-[32px] p-6 md:p-10 flex flex-col gap-8 transition-all duration-300 relative overflow-hidden`}
      >
        
        {/* History Toggle Button at top-left of the card wrapper */}
        <button
          id="history-drawer-toggle"
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          className={`absolute top-4 left-6 flex items-center gap-1.5 ${theme.badge} px-3 py-1 rounded-full text-[11px] font-bold tracking-wide cursor-pointer select-none transition-colors border border-transparent`}
          title="Open recent clarities history list"
        >
          <span>📜</span>
          <span>History</span>
          {history.length > 0 && (
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
          )}
        </button>

        {/* Action Panel: Uses tracker + Dark Mode Button */}
        <div className="absolute top-4 right-6 flex items-center gap-2">
          {/* Freemium Limit Tracker Display Badge */}
          <div className={`flex items-center gap-1.5 ${theme.badge} px-3 py-1 rounded-full text-[12px] md:text-[11px] font-bold tracking-wide select-none transition-colors`}>
            <span className={`inline-block w-1.5 h-1.5 rounded-full ${remainingUses > 0 ? "bg-emerald-500 animate-pulse" : "bg-neutral-400"}`} />
            <span className="hidden sm:inline">{remainingUses} of 10 free uses remaining today</span>
            <span className="sm:hidden">{remainingUses} left</span>
          </div>

          {/* Dark Mode Theme Toggle Button */}
          <button
            id="theme-toggle"
            type="button"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors cursor-pointer border ${isDarkMode ? "bg-[#242C29] border-[#2E3734] text-[#B8D8CE] hover:bg-[#2C3632]" : "bg-[#F0F5F3] border-transparent text-[#4A635D] hover:bg-[#E0E8E5]"}`}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun size={13} strokeWidth={2.5} /> : <Moon size={13} strokeWidth={2.5} />}
          </button>
        </div>

        {/* Header Block inline with design spec */}
        <header id="app-header" className="text-center pt-12 sm:pt-2 flex flex-col items-center justify-center">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <h1 id="app-title" className={`text-4xl font-extrabold tracking-tight ${theme.title} sm:mt-1`}>
              DailyClarity
            </h1>
            {streak > 0 && (
              <motion.div
                key="streak-badge"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black tracking-wide border select-none ${
                  isDarkMode
                    ? "bg-orange-950/40 text-[#FFA366] border-orange-500/25"
                    : "bg-orange-50 text-orange-600 border-orange-100"
                }`}
                title={`Your current consecutive daily streak is ${streak} day${streak > 1 ? "s" : ""}!`}
              >
                <span>🔥</span>
                <span>{streak} Day{streak > 1 ? "s" : ""}</span>
              </motion.div>
            )}
          </div>
          <p id="app-tagline" className={`text-xs md:text-sm uppercase tracking-widest font-medium ${theme.subText} mt-1`}>
            Turn mental chaos into focused calm.
          </p>
        </header>

        {/* Input Phase or Results Phase */}
        <AnimatePresence mode="wait">
          {limitReached && !result && !isBreathing && !loading ? (
            /* Freemium Dynamic Upgrade Screen */
            <motion.div
              key="limit-upgrade-state"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-6 px-4 space-y-6 flex flex-col items-center justify-center"
            >
              <div className={`w-16 h-16 rounded-full ${isDarkMode ? "bg-[#242C29]" : "bg-[#E8F4F0]"} flex items-center justify-center text-3xl shadow-xs select-none`}>
                🌿
              </div>
              <div className="space-y-3 max-w-[420px]">
                <h3 className={`text-lg font-bold ${theme.text}`}>You have found your clarity for today.</h3>
                <p className={`text-sm leading-relaxed ${theme.subText}`}>
                  You've used all 10 free clarities for today! Come back tomorrow for 10 more free sessions — or share this with a friend 🌿
                </p>
              </div>

              <div className="pt-2 w-full flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleShare}
                  className={`w-full py-3.5 px-6 rounded-2xl font-bold ${theme.btn} transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md`}
                >
                  {copied ? (
                    <>
                      <Check size={16} className="text-[#2C2C2C] dark:text-[#E8F4F0]" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Share2 size={16} />
                      <span>Share DailyClarity</span>
                    </>
                  )}
                </button>
                <p className={`text-[10px] uppercase font-bold tracking-widest pt-1 ${theme.subtleLabel}`}>
                  New Day resets at midnight (00:00 UTC)
                </p>
              </div>
            </motion.div>
          ) : isBreathing ? (
            /* Subtle breathing exercise overlay */
            <motion.div
              key="breathing-exercise"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="py-4 flex flex-col items-center justify-center space-y-8 select-none animate-fade-in"
            >
              {(() => {
                const elapsed = 30 - breathingTimer;
                const cycle = elapsed % 12;

                let breathState: "inhale" | "hold" | "exhale" | "rest" = "inhale";
                let phaseText = "Inhale";
                let phaseInstructions = "Fill your lungs with focused energy";

                if (cycle < 4) {
                  breathState = "inhale";
                  phaseText = "Breathe In";
                  phaseInstructions = "Fill your lungs with space and calm";
                } else if (cycle < 6) {
                  breathState = "hold";
                  phaseText = "Suspend";
                  phaseInstructions = "Hold the breath, feel the peace";
                } else if (cycle < 10) {
                  breathState = "exhale";
                  phaseText = "Breathe Out";
                  phaseInstructions = "Release tension, worry, and chaos";
                } else {
                  breathState = "rest";
                  phaseText = "Pause";
                  phaseInstructions = "Be still, expect clarity";
                }

                const getScale = () => {
                  switch (breathState) {
                    case "inhale": return 1.35;
                    case "hold": return 1.35;
                    case "exhale": return 0.9;
                    case "rest": return 0.9;
                  }
                };

                const getOpacity = () => {
                  switch (breathState) {
                    case "inhale": return 0.8;
                    case "hold": return 1.0;
                    case "exhale": return 0.4;
                    case "rest": return 0.4;
                  }
                };

                return (
                  <>
                    <div className="text-center space-y-2">
                      <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${theme.accentText}`}>
                        Quiet the Mind
                      </span>
                      <h3 className={`text-2xl font-extrabold tracking-tight ${theme.title}`}>
                        Mindfulness Breathing
                      </h3>
                    </div>

                    {/* Rhythmic breathing circle animation */}
                    <div className="relative w-60 h-60 flex items-center justify-center">
                      {/* Visual pulsing glow rings */}
                      <motion.div
                        animate={{
                          scale: getScale() * 1.15,
                          opacity: getOpacity() * 0.15,
                        }}
                        transition={{
                          duration: 1.2,
                          ease: "easeInOut",
                        }}
                        className={`absolute w-44 h-44 rounded-full border border-emerald-400/30 ${isDarkMode ? "bg-emerald-500/5" : "bg-emerald-400/5"}`}
                      />
                      
                      <motion.div
                        animate={{
                          scale: getScale(),
                          opacity: getOpacity() * 0.25 + 0.15,
                        }}
                        transition={{
                          duration: 1.2,
                          ease: "easeInOut",
                        }}
                        className={`absolute w-32 h-32 rounded-full border-2 border-emerald-400/40 ${isDarkMode ? "bg-[#242C29]" : "bg-[#E8F4F0]"}`}
                      />

                      {/* Inner core circle */}
                      <motion.div
                        animate={{
                          scale: getScale() * 0.85,
                        }}
                        transition={{
                          duration: 1.2,
                          ease: "easeInOut",
                        }}
                        className={`w-24 h-24 rounded-full flex flex-col items-center justify-center z-10 font-bold transition-colors duration-500 shadow-md ${
                          isDarkMode ? "bg-[#B8D8CE] text-[#141816]" : "bg-[#2C2C2C] text-white"
                        }`}
                      >
                        <span className="text-[10px] uppercase tracking-[0.2em] font-extrabold opacity-75 mb-0.5 col">
                          {phaseText}
                        </span>
                        {/* Timer of current sub-phase */}
                        <span className="text-lg font-black">
                          {cycle < 4 ? `${4 - cycle}s` : ""}
                          {cycle >= 4 && cycle < 6 ? `${6 - cycle}s` : ""}
                          {cycle >= 6 && cycle < 10 ? `${10 - cycle}s` : ""}
                          {cycle >= 10 ? `${12 - cycle}s` : ""}
                        </span>
                      </motion.div>

                      {/* Circular border countdown progress */}
                      <svg className="absolute w-52 h-52 transform -rotate-90">
                        <circle
                          cx="104"
                          cy="104"
                          r="92"
                          className={`${isDarkMode ? "stroke-[#2D3633]" : "stroke-[#E0E8E5]"} fill-none`}
                          strokeWidth="3"
                        />
                        <motion.circle
                          cx="104"
                          cy="104"
                          r="92"
                          className="stroke-emerald-400 fill-none"
                          strokeWidth="3.5"
                          strokeDasharray="578"
                          animate={{
                            strokeDashoffset: 578 - (578 * breathingTimer) / 30,
                          }}
                          transition={{ duration: 1, ease: "linear" }}
                        />
                      </svg>
                    </div>

                    {/* Instructions */}
                    <div className="text-center space-y-1.5 max-w-[280px]">
                      <p className={`text-sm font-semibold leading-normal ${theme.text} transition-all duration-500 min-h-[40px] flex items-center justify-center`}>
                        {phaseInstructions}
                      </p>
                      <p className={`text-xs ${theme.subtleLabel}`}>
                        {breathingTimer} seconds remaining
                      </p>
                    </div>

                    {/* Skip Button */}
                    <button
                      type="button"
                      onClick={handleSkipBreathing}
                      className={`text-xs font-bold tracking-widest uppercase py-2 px-5 rounded-full border transition-all cursor-pointer ${
                        isDarkMode
                          ? "bg-[#242C29]/50 border-[#2D3633] text-[#6A7C77] hover:bg-[#2C3632] hover:text-[#B8D8CE]"
                          : "bg-[#F0F5F3]/50 border-transparent text-[#8A9B96] hover:bg-[#E0E8E5] hover:text-[#4A635D]"
                      }`}
                    >
                      Skip Routine &rarr;
                    </button>
                  </>
                );
              })()}
            </motion.div>
          ) : !result && !loading ? (
            /* Input Board */
            <motion.div
              key="input-form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <form id="chaos-form" onSubmit={handleGetClarity} className="flex flex-col gap-5">
                <div className="relative">
                  <textarea
                    id="chaos-textarea"
                    value={chaos}
                    onChange={(e) => setChaos(e.target.value.slice(0, characterLimit))}
                    placeholder="What's on your mind? Tasks, worries, random thoughts — just dump it all here..."
                    rows={5}
                    className={`w-full h-36 pt-5 px-5 pb-14 border rounded-2xl text-base resize-none focus:outline-none focus:ring-2 transition-all leading-relaxed ${theme.input} ${isDarkMode ? 'placeholder:text-[#5E706B]' : 'placeholder:text-[#A0A0A0]'}`}
                    required
                  />

                  {/* Web Speech Dictation Mic Toggle Element */}
                  {speechSupported && (
                    <button
                      id="speech-dictate-button"
                      type="button"
                      onClick={toggleListening}
                      className={`absolute bottom-3 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all duration-300 border ${
                        isListening
                          ? "bg-rose-500/10 border-rose-500 text-rose-500 animate-pulse"
                          : isDarkMode
                          ? "bg-[#242C29] border-[#2D3633] text-[#B8D8CE] hover:bg-[#2C3632]"
                          : "bg-[#F0F5F3] border-transparent text-[#4A635D] hover:bg-[#E0E8E5]"
                      }`}
                      title={isListening ? "Stop Dictating" : "Dictate Thoughts (Hands-Free)"}
                    >
                      {isListening ? (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping inline-block shrink-0" />
                          <MicOff size={11} strokeWidth={2.5} />
                          <span>Stop Listening</span>
                        </>
                      ) : (
                        <>
                          <Mic size={11} strokeWidth={2.5} className={isListening ? "text-rose-500" : ""} />
                          <span>Speak Thoughts</span>
                        </>
                      )}
                    </button>
                  )}

                  <span id="char-counter" className={`absolute bottom-4 right-4 text-[10px] font-semibold uppercase tracking-tighter select-none ${chaos.length > characterLimit * 0.9 ? 'text-rose-500 font-bold' : theme.subtleLabel}`}>
                    {chaos.length} / {characterLimit}
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    id="submit-button"
                    type="submit"
                    disabled={!chaos.trim()}
                    className={`w-full font-bold py-4 rounded-2xl hover:brightness-110 disabled:bg-neutral-200 disabled:hover:bg-neutral-200 disabled:text-neutral-400 transition-all cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg group ${theme.btn}`}
                  >
                    <Sparkles size={16} className={`${isDarkMode ? 'text-[#141816]' : 'text-[#B8D8CE]'} md:animate-pulse group-hover:scale-110 transition-transform`} />
                    <span>Get Clarity ✨</span>
                  </button>
                </div>
              </form>

              {/* Rhythmic Morning Habit Reminder Scheduling Section */}
              <div className={`mt-6 border-t ${theme.border} pt-5 flex flex-col items-center text-center space-y-3`}>
                <div className="space-y-1">
                  <p className={`text-xs font-bold uppercase tracking-widest ${theme.accentText}`}>
                    🌅 Morning Habituator
                  </p>
                  <p className={`text-xs ${theme.subText} max-w-[360px] mx-auto leading-relaxed`}>
                    Establish a daily ritual. Schedule a gentle alert using the standard browser Web Notification API to check here tomorrow fresh at 8:00 AM.
                  </p>
                </div>

                {reminderStatus === "scheduled" ? (
                  <div className="flex flex-col sm:flex-row items-center gap-2 justify-center pt-1">
                    <span className="text-xs font-semibold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl flex items-center gap-1.5 animate-pulse">
                      🔔 Active — Set for tomorrow 8:00 AM
                    </span>
                    <button
                      type="button"
                      onClick={handleCancelReminder}
                      className={`text-[11px] font-bold underline transition-colors cursor-pointer ${theme.subtleLabel} hover:text-rose-500`}
                    >
                      Turn Off
                    </button>
                  </div>
                ) : reminderStatus === "unsupported" ? (
                  <span className={`text-[11px] font-medium ${theme.subtleLabel}`}>
                    ⚠️ Web Notification API not supported in your browser or current sandbox.
                  </span>
                ) : reminderStatus === "denied" ? (
                  <div className="space-y-1 pt-1">
                    <span className="text-xs font-semibold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-xl inline-block">
                      🚫 Notification permission was denied
                    </span>
                    <p className={`text-[10px] ${theme.subtleLabel} max-w-[300px]`}>
                      Please update your browser site-settings to allow notification alerts to schedule reminders.
                    </p>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleScheduleReminder}
                    className={`text-xs font-bold tracking-widest uppercase px-5 py-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 hover:scale-[1.02] ${
                      isDarkMode
                        ? "bg-[#242C29] border-[#2D3633] text-[#B8D8CE] hover:bg-[#2C3632]"
                        : "bg-[#F0F5F3] border-transparent text-[#4A635D] hover:bg-[#E0E8E5]"
                    }`}
                  >
                    ⏰ Schedule Daily Reminder
                  </button>
                )}
              </div>
            </motion.div>
          ) : loading ? (
            /* Calming Pulsing Loader matching theme aesthetics */
            <motion.div
              key="loading-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 flex flex-col items-center justify-center space-y-6"
            >
              <div className="relative flex items-center justify-center">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className={`absolute w-16 h-16 rounded-full ${isDarkMode ? "bg-[#242C29]" : "bg-[#E8F4F0]"}`}
                />
                <motion.div
                  animate={{
                    scale: [1, 1.08, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${isDarkMode ? "bg-[#B8D8CE]" : "bg-[#2C2C2C]"}`}
                >
                  <Sparkles size={16} className={isDarkMode ? "text-[#141816]" : "text-[#E8F4F0]"} />
                </motion.div>
              </div>

              <div className="text-center space-y-1.5">
                <span className={`block text-sm font-semibold tracking-wide ${theme.text}`}>
                  Breathing in clarity...
                </span>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={loadingStep}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 0.8, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className={`text-xs font-medium ${theme.subText}`}
                  >
                    {loadingMessages[loadingStep]}
                  </motion.p>
                </AnimatePresence>
              </div>
            </motion.div>
          ) : result ? (
            /* Results Panel styled exactly with Professional Polish specs */
            <motion.div
              key="results-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className={`flex flex-col gap-6 pt-4 border-t ${theme.border}`}
            >
              <div className="space-y-5">
                
                {/* 1. Top Priorities */}
                <div className="flex items-start gap-4">
                  <span className="text-2xl mt-1 select-none">✅</span>
                  <div>
                    <p className={`text-xs font-black uppercase tracking-widest mb-1 ${theme.subText}`}>
                      Top Priorities
                    </p>
                    <div className="space-y-1.5 pt-0.5">
                      {result.priorities?.map((priority, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -18, y: 4 }}
                          animate={{ opacity: 1, x: 0, y: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 110,
                            damping: 13,
                            delay: index * 0.15 + 0.1
                          }}
                          className={`font-bold text-base leading-normal ${theme.text} flex items-start gap-1`}
                        >
                          <span className="text-emerald-500 font-extrabold select-none shrink-0">{index + 1}.</span>
                          <span>{priority}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Pomodoro Focus Timer Section */}
                    {result.priorities && result.priorities.length > 0 && (
                      <div className="mt-4 max-w-md">
                        <PomodoroTimer
                          firstPriority={result.priorities[0]}
                          isDarkMode={isDarkMode}
                          theme={theme}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Release This */}
                <div className="flex items-start gap-4">
                  <span className="text-2xl mt-1 select-none">🍃</span>
                  <div>
                    <p className={`text-xs font-black uppercase tracking-widest mb-1 ${theme.subText}`}>
                      Release This
                    </p>
                    <p className={`text-base leading-relaxed ${theme.text}`}>
                      {result.letGo}
                    </p>
                  </div>
                </div>

                {/* 3. Reset Phrase */}
                <div className="flex items-start gap-4">
                  <span className="text-2xl mt-1 select-none">🌤️</span>
                  <div>
                    <p className={`text-xs font-black uppercase tracking-widest mb-1 ${theme.subText}`}>
                      Reset Phrase
                    </p>
                    <p className={`text-lg font-medium italic leading-relaxed ${theme.accentText}`}>
                      "{result.resetPhrase}"
                    </p>
                  </div>
                </div>

              </div>

              {/* Direct Sync Workspace Integrations */}
              <SyncPanel
                priorities={result.priorities}
                letGo={result.letGo}
                resetPhrase={result.resetPhrase}
                isDarkMode={isDarkMode}
                theme={theme}
              />

              {/* ADSENSE INTEGRATION SLOT */}
              <div id="adsense-section" className={`border-t border-b ${theme.border} py-4 my-2 flex flex-col items-center`}>
                {/* REPLACE THIS WITH YOUR ADSENSE CODE */}
                <div
                  id="adsense-slot"
                  className={`w-[300px] h-[250px] border border-dashed rounded-xl flex flex-col justify-center items-center text-xs select-none uppercase tracking-widest font-semibold ${theme.adBlock}`}
                >
                  <span>Ad</span>
                  <span className={`text-[9px] lowercase tracking-normal mt-1 italic ${theme.subtleLabel}`}>Sponsored link placeholder</span>
                </div>
              </div>

              {/* AFFILIATE RECOMMENDATIONS & PARTNERS */}
              <div className="space-y-2 pt-1">
                <p className={`text-[10px] font-bold uppercase tracking-widest text-center ${theme.subtleLabel}`}>
                  Tools that help with clarity
                </p>
                <div id="affiliates-pills" className="flex flex-wrap justify-center gap-2">
                  <a
                    href="https://notion.so"
                    target="_blank"
                    rel="noreferrer noopener"
                    className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${theme.affiliateLink}`}
                  >
                    <span>Try Notion for free →</span>
                    <span className={`text-[8px] px-1 py-0.5 rounded-sm uppercase tracking-tighter select-none ${theme.partnerBadge}`}>[partner]</span>
                  </a>
                  <a
                    href="https://calm.com"
                    target="_blank"
                    rel="noreferrer noopener"
                    className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${theme.affiliateLink}`}
                  >
                    <span>Calm meditation app →</span>
                    <span className={`text-[8px] px-1 py-0.5 rounded-sm uppercase tracking-tighter select-none ${theme.partnerBadge}`}>[partner]</span>
                  </a>
                  <a
                    href="https://amazon.com/s?k=morning+journal"
                    target="_blank"
                    rel="noreferrer noopener"
                    className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${theme.affiliateLink}`}
                  >
                    <span>Morning Journal on Amazon →</span>
                    <span className={`text-[8px] px-1 py-0.5 rounded-sm uppercase tracking-tighter select-none ${theme.partnerBadge}`}>[partner]</span>
                  </a>
                </div>
              </div>

              {/* Centered Board Reset Button matching guidelines */}
              <footer className="flex justify-center pt-2 gap-4">
                <button
                  id="reset-button"
                  onClick={handleReset}
                  className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer ${theme.subtleLabel} ${isDarkMode ? 'hover:text-[#B8D8CE]' : 'hover:text-[#2C2C2C]'}`}
                >
                  <RefreshCcw size={12} strokeWidth={3} />
                  <span>New Day Reset</span>
                </button>
                <button
                  id="share-card-button"
                  onClick={handleShare}
                  className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer ${theme.subtleLabel} ${isDarkMode ? 'hover:text-[#B8D8CE]' : 'hover:text-[#2C2C2C]'}`}
                >
                  <Share2 size={12} strokeWidth={3} />
                  <span>{copied ? "Copied!" : "Share Tool"}</span>
                </button>
              </footer>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Dynamic Inner error feedback layout with Professional Polish accent */}
        {error && (
          <div id="error-banner" className={`pt-4 border-t ${theme.border} text-rose-800 text-xs md:text-sm flex items-start gap-2.5`}>
            <AlertCircle size={16} className="text-rose-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold uppercase tracking-wider text-rose-950 block">Error encountered</span>
              <p className="leading-relaxed font-light">{error}</p>
              <button
                type="button"
                onClick={handleReset}
                className={`underline block font-normal cursor-pointer mt-1 ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-neutral-600 hover:text-[#2C2C2C]'}`}
              >
                Reset Board
              </button>
            </div>
          </div>
        )}
      </motion.main>

      {/* Daily Habit Tracker component directly below the main card */}
      <DailyHabitTracker
        isDarkMode={isDarkMode}
        theme={theme}
        onExportReport={(newReport) => {
          setHabitReports((prev) => [newReport, ...prev].slice(0, 5));
          setDrawerTab("habits");
          setIsDrawerOpen(true);
        }}
      />

      {/* Footer Branding containing microCopy text matching styling guidelines */}
      <footer id="branding-footer" className="flex flex-col items-center gap-1 select-none max-w-[600px] w-full mt-auto">
        <p className={`text-[10px] font-semibold uppercase tracking-[0.2em] text-center ${theme.subtleLabel}`}>
          {microCopy}
        </p>
      </footer>

      {/* Final Spacer */}
      <div className="flex-1" />

      {/* Slide-out history drawer */}
      <RecentClaritiesDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        history={history}
        onClearHistory={handleClearHistory}
        onRestore={handleRestoreSaved}
        isDarkMode={isDarkMode}
        habitReports={habitReports}
        onClearReports={handleClearReports}
        activeTab={drawerTab}
        setActiveTab={setDrawerTab}
      />
    </div>
  );
}
