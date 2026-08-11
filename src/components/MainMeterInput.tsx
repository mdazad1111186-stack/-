import React, { useState } from "react";
import { MainMeter, CalculationMethod } from "../types";
import { toBengaliNumeral } from "../utils/calculator";
import {
  Gauge,
  DollarSign,
  Settings2,
  ChevronDown,
  ChevronUp,
  Calendar,
  Plus,
  Trash2,
  Sparkles,
  Info,
  Clock,
  Layers
} from "lucide-react";

interface MainMeterInputProps {
  mainMeters: MainMeter[];
  activeMainIndex: number;
  onSelectMainMeter: (index: number) => void;
  onAddMainMeter: () => void;
  onRemoveMainMeter: (index: number) => void;
  onChangeActiveMainMeter: (updated: MainMeter) => void;
  method: CalculationMethod;
  setMethod: (m: CalculationMethod) => void;
  flatRate: number;
  setFlatRate: (rate: number) => void;
}

export const MainMeterInput: React.FC<MainMeterInputProps> = ({
  mainMeters,
  activeMainIndex,
  onSelectMainMeter,
  onAddMainMeter,
  onRemoveMainMeter,
  onChangeActiveMainMeter,
  method,
  setMethod,
  flatRate,
  setFlatRate,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const activeMeter = mainMeters[activeMainIndex] || mainMeters[0] || {
    name: "মেইন মিটার ১",
    previousReading: 0,
    currentReading: 0,
    totalBillAmount: 0,
    demandCharge: 0,
    meterRent: 0,
    vat: 0,
    arrears: 0,
    monthYear: "মে ২০২৬",
    provider: "DESCO",
  };

  const prev = Number(activeMeter.previousReading) || 0;
  const curr = Number(activeMeter.currentReading) || 0;
  const units = Math.max(0, curr - prev);

  const handleChange = (field: keyof MainMeter, value: any) => {
    onChangeActiveMainMeter({
      ...activeMeter,
      [field]: value,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden space-y-0">
      {/* Top Banner Header */}
      <div className="bg-blue-900 text-white px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-950">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-yellow-400 text-blue-900 rounded-lg shrink-0">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-white flex items-center gap-2">
              ১. মেইন মিটারের তথ্য (Main Meter)
            </h2>
            <p className="text-xs text-blue-200">বিদ্যুৎ অফিসের মূল মিটারের রিডিং, জের ও মোট বিল</p>
          </div>
        </div>

        {/* Consumed Units Display Badge */}
        <div className="bg-blue-950/90 border border-blue-700/60 px-3.5 py-1.5 rounded-xl flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs text-blue-200 font-medium">ব্যবহৃত:</span>
          <span className="text-base font-extrabold text-yellow-400">
            {toBengaliNumeral(units)} <span className="text-xs font-normal">ইউনিট</span>
          </span>
        </div>
      </div>

      {/* Main Meters Selection Bar (মেন মিটার বাড়ানোর অপশন) */}
      <div className="bg-blue-50/70 p-3.5 border-b border-blue-200 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 overflow-x-auto max-w-full py-0.5 scrollbar-none">
          <span className="text-xs font-bold text-blue-950 shrink-0 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-blue-700" /> মিটারের তালিকা:
          </span>
          {mainMeters.map((m, idx) => (
            <button
              key={m.id || idx}
              type="button"
              onClick={() => onSelectMainMeter(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                idx === activeMainIndex
                  ? "bg-blue-900 text-white shadow-sm ring-2 ring-blue-600/30"
                  : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
              }`}
            >
              <Gauge className="w-3.5 h-3.5 text-yellow-400" />
              <span>{m.name || `মেইন মিটার ${idx + 1}`}</span>
            </button>
          ))}
        </div>

        {/* Action Buttons for Main Meter Management */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onAddMainMeter}
            className="px-3 py-1.5 bg-yellow-400 hover:bg-yellow-500 text-blue-950 font-bold rounded-lg text-xs flex items-center gap-1 shadow-sm transition-all"
            title="নতুন আরেকটি মেইন মিটার যুক্ত করুন"
          >
            <Plus className="w-3.5 h-3.5" /> মেইন মিটার যোগ করুন
          </button>

          {mainMeters.length > 1 && (
            <button
              type="button"
              onClick={() => onRemoveMainMeter(activeMainIndex)}
              className="p-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-lg border border-rose-300 transition-all"
              title="বর্তমান মেইন মিটার মুছে ফেলুন"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* Meter Custom Name & Details Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              মিটায়ের নাম / লেবেল
            </label>
            <input
              type="text"
              value={activeMeter.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="যেমন: মেইন মিটার ১ (গ্রাউন্ড ফ্লোর)"
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 text-sm font-semibold bg-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" /> মাসের নাম ও বছর
            </label>
            <input
              type="text"
              value={activeMeter.monthYear}
              onChange={(e) => handleChange("monthYear", e.target.value)}
              placeholder="যেমন: মে ২০২৬"
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 text-sm font-medium bg-slate-50/50 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              বিদ্যুৎ বিতরণকারী প্রতিষ্ঠান
            </label>
            <select
              value={activeMeter.provider || "DESCO"}
              onChange={(e) => handleChange("provider", e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 text-sm font-medium bg-slate-50/50 outline-none"
            >
              <option value="DESCO">ডেসকো (DESCO)</option>
              <option value="DPDC">ডিপিডিসি (DPDC)</option>
              <option value="REB">পল্লী বিদ্যুৎ (Palli Bidyut / REB)</option>
              <option value="BPDB">পিডিবি (BPDB)</option>
              <option value="NESCO">নেসকো (NESCO)</option>
              <option value="WZPDC">ওয়েস্ট জোন (WZPDC)</option>
              <option value="Custom">অন্যান্য / কাস্টম</option>
            </select>
          </div>
        </div>

        {/* Primary Input Grid: Previous, Current, Total Bill, Arrears (পূর্বে জের) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Previous Reading */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              পূর্বের রিডিং (Previous)
            </label>
            <input
              id="main-prev-reading-input"
              type="number"
              min="0"
              step="any"
              value={activeMeter.previousReading || ""}
              onChange={(e) => handleChange("previousReading", parseFloat(e.target.value) || 0)}
              placeholder="০"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white font-semibold text-slate-800 text-base outline-none"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">গত মাসের শেষ রিডিং</span>
          </div>

          {/* Current Reading */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              বর্তমান রিডিং (Current)
            </label>
            <input
              id="main-curr-reading-input"
              type="number"
              min="0"
              step="any"
              value={activeMeter.currentReading || ""}
              onChange={(e) => handleChange("currentReading", parseFloat(e.target.value) || 0)}
              placeholder="০"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 bg-white font-semibold text-slate-800 text-base outline-none"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">চলতি মাসের রিডিং</span>
          </div>

          {/* Total Bill Amount */}
          <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-200">
            <label className="block text-xs font-bold text-blue-900 mb-1 flex items-center justify-between">
              <span>মেইন বিলের মোট টাকা (Tk)</span>
              <DollarSign className="w-3.5 h-3.5 text-blue-700" />
            </label>
            <input
              id="main-total-bill-input"
              type="number"
              min="0"
              step="any"
              value={activeMeter.totalBillAmount || ""}
              onChange={(e) => handleChange("totalBillAmount", parseFloat(e.target.value) || 0)}
              placeholder="৳ ০"
              className="w-full px-3 py-2 rounded-lg border border-blue-300 focus:ring-2 focus:ring-blue-500 bg-white font-bold text-blue-950 text-base outline-none"
            />
            <span className="text-[11px] text-blue-800 mt-1 block">বিল পেপারের মোট টাকা</span>
          </div>

          {/* Persistent Arrears / Previous Balance Input Card (পূর্বে জের) */}
          <div className="bg-amber-50/80 p-3.5 rounded-xl border border-amber-300 relative">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-extrabold text-amber-950 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-700" />
                পূর্বে জের (Arrears ৳)
              </label>
              <span className="text-[9px] bg-amber-200 text-amber-950 font-black px-1.5 py-0.5 rounded flex items-center gap-0.5">
                <Sparkles className="w-2.5 h-2.5 text-amber-700" /> স্বয়ংক্রিয় সংরক্ষিত
              </span>
            </div>
            <input
              id="main-arrears-input"
              type="number"
              min="0"
              step="any"
              value={activeMeter.arrears || ""}
              onChange={(e) => handleChange("arrears", parseFloat(e.target.value) || 0)}
              placeholder="৳ ০"
              className="w-full px-3 py-2 rounded-lg border border-amber-400 bg-white font-extrabold text-amber-950 text-base outline-none focus:ring-2 focus:ring-amber-500"
            />
            <span className="text-[10px] text-amber-900 mt-1 block font-medium">
              *একবার দিলে পরবর্তীতে স্বয়ংক্রিয়ভাবে থাকবে, প্রয়োজনে বদলাতে পারবেন
            </span>
          </div>
        </div>

        {/* Persistent Arrears Guidance Tooltip Box */}
        <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-950 leading-relaxed">
            <strong className="font-bold text-amber-900">পূর্বে জের (Arrears) সংরক্ষণের নিয়ম:</strong> মেইন মিটারের পূর্বের বকেয়া বা বিলম্ব ফি একবার ইনপুট দিলে তা স্বয়ংক্রিয়ভাবে অ্যাপে সংরক্ষিত থাকে এবং আগামী মাসের হিসাবেও বজায় থাকবে। আপনি চাইলেই যেকোনো সময় সরাসরি এখান থেকে পরিবর্তন বা ০ করতে পারেন।
          </div>
        </div>

        {/* Billing Calculation Method Selection */}
        <div className="pt-2">
          <label className="block text-xs font-bold text-slate-700 mb-2.5">
            বিল হিসাব করার পদ্ধতি নির্বাচন করুন (Billing Calculation Method):
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Effective Rate Method */}
            <button
              id="method-effective-rate-btn"
              type="button"
              onClick={() => setMethod("effective_rate")}
              className={`p-3.5 rounded-xl text-left border text-xs transition-all ${
                method === "effective_rate"
                  ? "bg-blue-50 border-blue-600 text-blue-950 ring-2 ring-blue-500/30 font-semibold"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <div className="font-bold text-sm mb-1 text-blue-900 flex items-center justify-between">
                <span>১. গড় ও সমানুপাতিক রেট</span>
                {method === "effective_rate" && <span className="text-[10px] bg-blue-800 text-white px-2 py-0.5 rounded-full">নির্বাচিত</span>}
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                (মেইন বিলের মোট টাকা ÷ মোট ইউনিট) = প্রদেয় কার্যকর রেট। সবচেয়ে সঠিক পদ্ধতি।
              </p>
            </button>

            {/* Flat Rate Method */}
            <button
              id="method-flat-rate-btn"
              type="button"
              onClick={() => setMethod("flat_rate")}
              className={`p-3.5 rounded-xl text-left border text-xs transition-all ${
                method === "flat_rate"
                  ? "bg-blue-50 border-blue-600 text-blue-950 ring-2 ring-blue-500/30 font-semibold"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <div className="font-bold text-sm mb-1 text-blue-900 flex items-center justify-between">
                <span>২. নির্দিষ্ট ইউনিট রেট</span>
                {method === "flat_rate" && <span className="text-[10px] bg-blue-800 text-white px-2 py-0.5 rounded-full">নির্বাচিত</span>}
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                প্রতি ইউনিটের দর নিজে ঠিক করুন (যেমন: ৳৯.০০/ইউনিট)।
              </p>
            </button>

            {/* Slab Rate Method */}
            <button
              id="method-slab-btn"
              type="button"
              onClick={() => setMethod("slab")}
              className={`p-3.5 rounded-xl text-left border text-xs transition-all ${
                method === "slab"
                  ? "bg-blue-50 border-blue-600 text-blue-950 ring-2 ring-blue-500/30 font-semibold"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <div className="font-bold text-sm mb-1 text-blue-900 flex items-center justify-between">
                <span>৩. স্ল্যাব ভিত্তিক গড় হার</span>
                {method === "slab" && <span className="text-[10px] bg-blue-800 text-white px-2 py-0.5 rounded-full">নির্বাচিত</span>}
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                সরকারি ট্যারিফ স্ল্যাবের উপর ভিত্তি করে মোট খরচের গড় অনুপাত।
              </p>
            </button>
          </div>

          {/* Flat Rate Input */}
          {method === "flat_rate" && (
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
              <label className="text-xs font-bold text-amber-900 whitespace-nowrap">
                প্রতি ইউনিট দর (৳/kWh):
              </label>
              <input
                type="number"
                step="0.1"
                min="1"
                value={flatRate}
                onChange={(e) => setFlatRate(parseFloat(e.target.value) || 0)}
                className="w-28 px-3 py-1.5 rounded-lg border border-amber-300 font-bold text-slate-900 bg-white"
              />
              <span className="text-xs text-amber-800">টাকা প্রতি ইউনিট</span>
            </div>
          )}
        </div>

        {/* Toggle Advanced Charges */}
        <div className="border-t border-slate-200 pt-3">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs font-semibold text-slate-600 hover:text-blue-800 flex items-center gap-1.5 py-1"
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>অতিরিক্ত চার্জ সেটিং (ডিমান্ড চার্জ, মিটার ভাড়া, ভ্যাট)</span>
            {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showAdvanced && (
            <div className="mt-3 p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  ডিমান্ড চার্জ (Demand Charge)
                </label>
                <input
                  type="number"
                  value={activeMeter.demandCharge || ""}
                  onChange={(e) => handleChange("demandCharge", parseFloat(e.target.value) || 0)}
                  placeholder="৳ ০"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  মিটার ভাড়া (Meter Rent)
                </label>
                <input
                  type="number"
                  value={activeMeter.meterRent || ""}
                  onChange={(e) => handleChange("meterRent", parseFloat(e.target.value) || 0)}
                  placeholder="৳ ০"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  ভ্যাট / VAT (টাকায়)
                </label>
                <input
                  type="number"
                  value={activeMeter.vat || ""}
                  onChange={(e) => handleChange("vat", parseFloat(e.target.value) || 0)}
                  placeholder="৳ ০"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold outline-none"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
