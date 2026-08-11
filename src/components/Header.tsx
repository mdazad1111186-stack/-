import React from "react";
import { Zap, Calculator, Receipt, History, HelpCircle, Bot, Layers } from "lucide-react";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  subMeterCount: number;
  setQuickPreset: (count: number) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  subMeterCount,
  setQuickPreset,
}) => {
  return (
    <header className="bg-blue-900 text-white shadow-md border-b border-blue-950 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-4 gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-yellow-400 text-blue-900 flex items-center justify-center font-bold shadow-md shadow-yellow-500/20 shrink-0">
              <Zap className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                বিদ্যুৎ সাব-মিটার ক্যালকুলেটর
              </h1>
              <p className="text-xs text-blue-200 font-medium">
                মেইন মিটার ও সাব-মিটারের বিদ্যুৎ বিল হিসাব ও রসিদ তৈরির আধুনিক অ্যাপ
              </p>
            </div>
          </div>

          {/* Quick Preset Selector */}
          <div className="flex items-center bg-blue-950/80 p-1 rounded-lg border border-blue-800/80 text-xs font-semibold">
            <span className="text-blue-200 px-2.5 py-1 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-yellow-400" /> মিটার সংখ্যা:
            </span>
            <button
              id="preset-3-btn"
              type="button"
              onClick={() => setQuickPreset(3)}
              className={`px-3 py-1.5 rounded-md transition-all ${
                subMeterCount === 3
                  ? "bg-yellow-400 text-blue-950 font-bold shadow-sm"
                  : "text-blue-200 hover:text-white hover:bg-blue-800/60"
              }`}
            >
              ৩ টি সাব-মিটার
            </button>
            <button
              id="preset-4-btn"
              type="button"
              onClick={() => setQuickPreset(4)}
              className={`px-3 py-1.5 rounded-md transition-all ${
                subMeterCount === 4
                  ? "bg-yellow-400 text-blue-950 font-bold shadow-sm"
                  : "text-blue-200 hover:text-white hover:bg-blue-800/60"
              }`}
            >
              ৪ টি সাব-মিটার
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-none text-sm font-medium border-t border-blue-800/60 pt-2">
          <button
            id="nav-tab-calculator"
            type="button"
            onClick={() => setActiveTab("calculator")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
              activeTab === "calculator"
                ? "bg-blue-700 text-white font-bold shadow-sm ring-1 ring-blue-500"
                : "text-blue-200 hover:text-white hover:bg-blue-800/60"
            }`}
          >
            <Calculator className="w-4 h-4" />
            বিল ক্যালকুলেটর
          </button>

          <button
            id="nav-tab-vouchers"
            type="button"
            onClick={() => setActiveTab("vouchers")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
              activeTab === "vouchers"
                ? "bg-blue-700 text-white font-bold shadow-sm ring-1 ring-blue-500"
                : "text-blue-200 hover:text-white hover:bg-blue-800/60"
            }`}
          >
            <Receipt className="w-4 h-4" />
            রসিদ ও ভাউচার
          </button>

          <button
            id="nav-tab-history"
            type="button"
            onClick={() => setActiveTab("history")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
              activeTab === "history"
                ? "bg-blue-700 text-white font-bold shadow-sm ring-1 ring-blue-500"
                : "text-blue-200 hover:text-white hover:bg-blue-800/60"
            }`}
          >
            <History className="w-4 h-4" />
            সংরক্ষিত হিস্ট্রি
          </button>

          <button
            id="nav-tab-ai"
            type="button"
            onClick={() => setActiveTab("ai")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
              activeTab === "ai"
                ? "bg-yellow-400 text-blue-950 font-bold shadow-sm"
                : "text-blue-200 hover:text-white hover:bg-blue-800/60"
            }`}
          >
            <Bot className="w-4 h-4" />
            এআই সহকারী (AI Advisor)
          </button>

          <button
            id="nav-tab-guide"
            type="button"
            onClick={() => setActiveTab("guide")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
              activeTab === "guide"
                ? "bg-blue-700 text-white font-bold shadow-sm ring-1 ring-blue-500"
                : "text-blue-200 hover:text-white hover:bg-blue-800/60"
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            হিসাব নির্দেশিকা
          </button>
        </nav>
      </div>
    </header>
  );
};
