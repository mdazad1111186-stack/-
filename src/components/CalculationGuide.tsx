import React from "react";
import { HelpCircle, Calculator, CheckCircle2, ShieldCheck, Zap, Info } from "lucide-react";

export const CalculationGuide: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden space-y-0">
      {/* Header Banner */}
      <div className="bg-blue-900 text-white p-5 flex items-center justify-between border-b border-blue-950">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-yellow-400 text-blue-900 rounded-lg shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-white">সাব-মিটারের বিদ্যুৎ বিল হিসাব করার নিয়ম নির্দেশিকা</h2>
            <p className="text-xs text-blue-200">বাড়িওয়ালা ও ভাড়াটিয়া উভয়ের জন্য ১০০% সঠিক ও নিরপেক্ষ হিসাবের গাইড</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6 text-sm text-slate-700 leading-relaxed">
        {/* Intro Highlight Box */}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-start gap-3">
          <ShieldCheck className="w-6 h-6 text-blue-800 shrink-0 mt-0.5" />
          <div className="text-xs text-blue-950 space-y-1">
            <strong className="font-bold text-sm block text-blue-900">কেন এই অ্যাপের হিসাব সবচেয়ে নিরপেক্ষ?</strong>
            বিদ্যুৎ অফিসের সরকারি বিলের কাগজ অনুযায়ী ডিমান্ড চার্জ, মিটার ভাড়া, ভ্যাট এবং ধাপ ভিত্তিক খরচ (Slab) সহ মোট টাকার আনুপাতিক হারে প্রতিটি সাব-মিটারের খরচ স্বয়ংক্রিয়ভাবে বণ্টন করা হয়। এতে কোনো ভাড়াটিয়ার প্রতি অবিচার হয় না।
          </div>
        </div>

        {/* Step-by-Step Mathematical Formula */}
        <div className="space-y-4">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Calculator className="w-4 h-4 text-blue-700" />
            হিসাবের গাণিতিক সূত্র (Mathematical Formula)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-900 block">১. ব্যবহৃত ইউনিট বের করার নিয়ম:</span>
              <p className="text-xs text-slate-600">
                ব্যবহৃত ইউনিট = (চলতি মাসের রিডিং - গত মাসের শেষ রিডিং)
              </p>
              <div className="bg-white p-2 rounded border border-slate-200 font-mono text-xs text-blue-800 font-bold">
                উদাহরণ: ৪৫০ - ৩৫০ = ১০০ ইউনিট
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-900 block">২. কার্যকর প্রতি ইউনিট রেট (Effective Rate):</span>
              <p className="text-xs text-slate-600">
                কার্যকর রেট = (মেইন মিটারের মোট চলিত বিল ÷ মেইন মিটারের মোট ব্যবহৃত ইউনিট)
              </p>
              <div className="bg-white p-2 rounded border border-slate-200 font-mono text-xs text-blue-800 font-bold">
                উদাহরণ: ৳২৫০০ ÷ ২৫০ ইউনিট = ৳১০.০০/ইউনিট
              </div>
            </div>
          </div>
        </div>

        {/* Arrears Calculation Guide Section */}
        <div className="space-y-3 pt-2">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-600" />
            বকেয়া বিল (Arrears & Late Fees) হিসাব করার সঠিক নিয়ম:
          </h3>

          <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-xl space-y-3 text-xs text-amber-950">
            <div className="space-y-1">
              <strong className="font-bold text-sm text-amber-900 block">১. মেইন মিটারের বকেয়া বা বিলম্ব ফি (Main Meter Late Surcharge):</strong>
              <p className="leading-relaxed">
                যদি কোনো কারণে গত মাসের মেইন বিল বকেয়া থাকে বা সরকারি বিলে সারচার্জ যুক্ত হয়, তবে বকেয়া টাকাটি চলতি মাসের মোট বিলে যোগ থাকে। আমাদের অ্যাপে <strong>"অতিরিক্ত চার্জ সেটিং"</strong>-এ সেই বকেয়া বা বিলম্ব ফি আলাদা করে বসিয়ে দিলে, চলতি মাসের প্রতি ইউনিট বিদ্যুতের দাম অহেতুক বৃদ্ধি পাবে না। বকেয়া ফি নিরপেক্ষভাবে সকল সাব-মিটারে বণ্টন হবে।
              </p>
            </div>

            <div className="space-y-1 border-t border-amber-200 pt-2">
              <strong className="font-bold text-sm text-amber-900 block">২. নির্দিষ্ট ভাড়াটিয়ার ব্যক্তিগত বকেয়া (Tenant Individual Arrears):</strong>
              <p className="leading-relaxed">
                যদি নির্দিষ্ট কোনো ভাড়াটিয়া বিগত মাসের বিল সম্পূর্ণ না দিয়ে থাকেন, তবে কেবল সেই ভাড়াটিয়ার সাব-মিটারের <strong>"ব্যক্তিগত বকেয়া (Arrears)"</strong> ঘরে বকেয়া টাকার পরিমাণ বসিয়ে দিন। এতে শুধু ওই ভাড়াটিয়ার চলতি মাসের প্রদেয় বিলের সাথে তার বকেয়া যোগ হবে, অন্য ভাড়াটিয়াদের বিলে কোনো প্রভাব পড়বে না।
              </p>
            </div>
          </div>
        </div>

        {/* Line Loss & Water Pump Explanation */}
        <div className="space-y-3 pt-2">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            মেইন মিটার ও সাব-মিটারে ইউনিট না মেলার ৩টি প্রধান কারণ:
          </h3>

          <ul className="space-y-2 text-xs text-slate-600 list-disc list-inside bg-slate-50 p-4 rounded-xl border border-slate-200">
            <li>
              <strong>পানি তোলার মোটর (Water Pump):</strong> মেইন মিটার থেকে পানি তোলার মোটর চলে কিন্তু সাব-মিটারে তা মাপা হয় না।
            </li>
            <li>
              <strong>সিঁড়ির বাতি ও সিকিউরিটি লাইট:</strong> সাধারণ লাইটিং ও গেটের বাতি সরাসরি মেইন মিটার থেকে সংযোগ থাকে।
            </li>
            <li>
              <strong>লাইন লস (System Loss):</strong> তারের রোধ (Resistance) এবং পুরোনো সাব-মিটারের যান্ত্রিক ত্রুটির কারণে ২-৫% ইউনিট পার্থক্য হতে পারে।
            </li>
          </ul>
        </div>

        {/* Best Practice Tips */}
        <div className="space-y-2 pt-2 border-t border-slate-200">
          <h3 className="font-bold text-sm text-slate-900">বাড়িওয়ালাদের জন্য পরামর্শ:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>প্রতি মাসের নির্দিষ্ট একই তারিখে (যেমন: ২৫ বা ৩০ তারিখে) সবকটি মিটারের রিডিং এক সাথে তুলুন।</span>
            </div>
            <div className="flex items-start gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>এই অ্যাপ থেকে ভাউচার তৈরি করে সরাসরি ভাড়াটিয়ার হোয়াটসঅ্যাপ বা প্রিন্ট করে দিন।</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
