import React, { useState } from "react";
import { CalculationResult } from "../types";
import { Bot, Send, Sparkles, AlertCircle, Lightbulb, HelpCircle, CheckCircle2 } from "lucide-react";

interface AiBillAdvisorProps {
  result: CalculationResult | null;
}

export const AiBillAdvisor: React.FC<AiBillAdvisorProps> = ({ result }) => {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sampleQuestions = [
    "মেইন মিটারের ইউনিট এবং সাব-মিটারগুলোর যোগফল কেন মেলে না?",
    "আমাদের পানির পাম্পের বিদ্যুৎ বিল সাব-মিটারে কীভাবে ভাগ করে দেওয়া উচিত?",
    "ভাড়াটিয়ার সাথে বিদ্যুৎ বিল নিয়ে কোন বিভ্রান্তি এড়ানোর নিরপেক্ষ উপায় কী?",
    "বাসাবাড়ির বিদ্যুৎ বিল কমানোর ৫টি সেরা উপায় কী?",
  ];

  const handleAskAdvisor = async (promptText?: string) => {
    const query = promptText || question;
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/gemini/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: query,
          billData: result
            ? {
                mainUnits: result.summary.mainUnits,
                mainTotalAmount: result.summary.mainTotalAmount,
                sumSubUnits: result.summary.sumSubUnits,
                commonUnits: result.summary.commonUnits,
                effectiveRatePerUnit: result.summary.effectiveRatePerUnit,
              }
            : null,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "AI অনুরোধে ত্রুটি ঘটেছে");
      }

      setAnswer(data.answer);
    } catch (err: any) {
      console.error("AI Assistant Error:", err);
      setError(err.message || "এআই সহকারীর প্রতিক্রিয়া পাওয়া যায়নি।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden space-y-0">
      {/* Top Banner */}
      <div className="bg-blue-900 text-white p-5 flex items-center justify-between border-b border-blue-950">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-yellow-400 text-blue-900 rounded-lg shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-white flex items-center gap-2">
              বিদ্যুৎ বিল এআই উপদেষ্টা (AI Bill Advisor)
              <span className="text-[10px] bg-yellow-400 text-blue-950 px-2 py-0.5 rounded-full font-black uppercase">
                Gemini AI
              </span>
            </h2>
            <p className="text-xs text-blue-200">বিদ্যুৎ বিল সংক্রান্ত যেকোনো জটিল প্রশ্নের বুদ্ধিমান সমাধান</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Sample Prompt Chips */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            দ্রুত প্রশ্ন করতে নিচের নমুনা প্রশ্নে ক্লিক করুন:
          </label>
          <div className="flex flex-wrap gap-2">
            {sampleQuestions.map((sq, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setQuestion(sq);
                  handleAskAdvisor(sq);
                }}
                className="text-xs bg-slate-100 hover:bg-blue-50 hover:text-blue-900 hover:border-blue-300 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 transition-all font-medium text-left"
              >
                {sq}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAskAdvisor();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="আপনার প্রশ্ন বাংলায় লিখুন (যেমন: লাইন লস কীভাবে কমানো যায়)..."
            className="flex-1 px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 text-sm font-medium outline-none"
          />
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="px-6 py-3 bg-blue-900 hover:bg-blue-950 disabled:opacity-50 text-white font-bold rounded-lg text-xs flex items-center gap-2 shrink-0 transition-all shadow-sm"
          >
            {loading ? (
              <Sparkles className="w-4 h-4 animate-spin text-yellow-400" />
            ) : (
              <>
                <Send className="w-4 h-4 text-yellow-400" /> এআই এর উত্তর নিন
              </>
            )}
          </button>
        </form>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* AI Answer Display Card */}
        {answer && (
          <div className="bg-blue-50/50 rounded-xl p-6 border border-blue-200 space-y-3">
            <div className="flex items-center gap-2 text-blue-950 font-bold text-sm pb-2 border-b border-blue-200">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <span>বিদ্যুৎ বিশেষজ্ঞ এআই উত্তর:</span>
            </div>
            <div className="text-slate-800 text-sm leading-relaxed whitespace-pre-line font-normal">
              {answer}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
