import React from "react";
import {
  CalculationResult,
  CommonAllocation,
} from "../types";
import { formatTaka, toBengaliNumeral } from "../utils/calculator";
import {
  PieChart,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  Save,
  ArrowRight,
  TrendingUp,
  Droplets,
  Share2,
} from "lucide-react";

interface CalculationResultCardProps {
  result: CalculationResult;
  commonAllocation: CommonAllocation;
  setCommonAllocation: (alloc: CommonAllocation) => void;
  onViewVouchers: () => void;
  onSaveHistory: () => void;
  onCarryOverReadings: () => void;
}

export const CalculationResultCard: React.FC<CalculationResultCardProps> = ({
  result,
  commonAllocation,
  setCommonAllocation,
  onViewVouchers,
  onSaveHistory,
  onCarryOverReadings,
}) => {
  const { summary, subMeters } = result;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden space-y-0">
      {/* Top Banner */}
      <div className="bg-blue-900 text-white px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-blue-950">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-yellow-400 text-blue-900 rounded-lg shrink-0">
            <PieChart className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-white">৩. স্বয়ংক্রিয় হিসাবের ফলাফল (Calculation Summary)</h2>
            <p className="text-xs text-blue-200">প্রতিটি সাব-মিটারের চূড়ান্ত বিদ্যুৎ বিলের বিবরণ</p>
          </div>
        </div>

        {/* Total Payable Summary Badge */}
        <div className="bg-yellow-400 text-blue-950 px-4 py-2 rounded-xl text-right shadow-sm shrink-0">
          <div className="text-[10px] text-blue-900 uppercase tracking-wide font-bold">মেইন বিল মোট:</div>
          <div className="text-lg font-black">{formatTaka(summary.mainTotalAmount)}</div>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Main Meter Units */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="text-xs font-semibold text-slate-500">মেইন মিটার মোট ইউনিট</div>
            <div className="text-xl font-black text-slate-900 mt-1">
              {toBengaliNumeral(summary.mainUnits)} <span className="text-xs font-normal text-slate-600">Unit</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">মেইন মিটারের ব্যবহূত শক্তি</div>
          </div>

          {/* Sub-meters Total Units */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="text-xs font-semibold text-slate-500">সাব-মিটারের যোগফল</div>
            <div className="text-xl font-black text-slate-900 mt-1">
              {toBengaliNumeral(summary.sumSubUnits)} <span className="text-xs font-normal text-slate-600">Unit</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">সব সাব-মিটারের মোট ব্যবহৃত ইউনিট</div>
          </div>

          {/* Common / Line Loss Units */}
          <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200">
            <div className="text-xs font-bold text-amber-900 flex items-center justify-between">
              <span>কমন / না-মেলা ইউনিট</span>
              <Droplets className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <div className="text-xl font-black text-amber-900 mt-1">
              {toBengaliNumeral(summary.commonUnits)} <span className="text-xs font-normal text-amber-800">Unit</span>
            </div>
            <div className="text-[10px] text-amber-700 mt-0.5">পানি পাম্প/লাইন লস/সিড়ি বাতি</div>
          </div>

          {/* Effective Rate Per Unit */}
          <div className="bg-blue-50 p-3.5 rounded-xl border border-blue-200">
            <div className="text-xs font-bold text-blue-900 flex items-center justify-between">
              <span>কার্যকর প্রতি ইউনিট গড় হার</span>
              <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div className="text-xl font-black text-blue-900 mt-1">
              {formatTaka(summary.effectiveRatePerUnit)}
            </div>
            <div className="text-[10px] text-blue-700 mt-0.5">প্রতি ইউনিট প্রকৃত গড় খরচ</div>
          </div>
        </div>

        {/* Warning if Sub-meters sum exceeds Main Meter */}
        {summary.hasOverConsumption && (
          <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-900">
              <strong className="font-bold">সতর্কতা: </strong> সাব-মিটার সমূহের মোট ব্যবহৃত ইউনিট ({toBengaliNumeral(summary.sumSubUnits)}) মেইন মিটারের ইউনিটের ({toBengaliNumeral(summary.mainUnits)}) চেয়ে বেশি হয়েছে। অনুগ্রহ করে রিডিং ইনপুট পুনঃপরীক্ষা করুন।
            </div>
          </div>
        )}

        {/* Common Line Loss / Water Pump Distribution Selector */}
        {summary.commonUnits > 0 && (
          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-200 space-y-2">
            <label className="block text-xs font-bold text-blue-950 flex items-center gap-1.5">
              <Share2 className="w-4 h-4 text-blue-700" />
              কমন / পানি পাম্পের অতিরিক্ত {toBengaliNumeral(summary.commonUnits)} ইউনিট বিল বণ্টনের নিয়ম:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setCommonAllocation("equal")}
                className={`px-3 py-2 rounded-xl text-xs text-left border transition-all ${
                  commonAllocation === "equal"
                    ? "bg-blue-900 text-white font-bold border-blue-900 shadow-sm"
                    : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                }`}
              >
                ১. সকলের মাঝে সমান বণ্টন (Equal)
              </button>

              <button
                type="button"
                onClick={() => setCommonAllocation("proportional")}
                className={`px-3 py-2 rounded-xl text-xs text-left border transition-all ${
                  commonAllocation === "proportional"
                    ? "bg-blue-900 text-white font-bold border-blue-900 shadow-sm"
                    : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                }`}
              >
                ২. ব্যবহার অনুপাতে বণ্টন (Proportional)
              </button>

              <button
                type="button"
                onClick={() => setCommonAllocation("none")}
                className={`px-3 py-2 rounded-xl text-xs text-left border transition-all ${
                  commonAllocation === "none"
                    ? "bg-blue-900 text-white font-bold border-blue-900 shadow-sm"
                    : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                }`}
              >
                ৩. কোনো বণ্টন হবে না (No Allocation)
              </button>
            </div>
          </div>
        )}

        {/* Sub-meters Breakdown Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-blue-900 text-white text-[11px] font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3">মিটার ও ভাড়াটিয়া</th>
                <th className="p-3 text-center">রিডিং (পূর্ব - বর্তমান)</th>
                <th className="p-3 text-center">ব্যবহৃত ইউনিট</th>
                <th className="p-3 text-center">কমন ইউনিট</th>
                <th className="p-3 text-right">মূল বিদ্যুৎ বিল</th>
                <th className="p-3 text-right">ডিমান্ড/ভ্যাট/ফি</th>
                <th className="p-3 text-right text-amber-300">বকেয়া (Arrears)</th>
                <th className="p-3 text-right">সর্বমোট প্রদেয়</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              {subMeters.map((sm, idx) => {
                const totalArrearsForSub = (sm.tenantArrears || 0) + (sm.sharedMainArrearsShare || 0);
                return (
                  <tr key={sm.id || idx} className="hover:bg-blue-50/60 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{sm.name}</div>
                      <div className="text-[11px] text-slate-500">{sm.tenantName || "ভাড়াটিয়া"}</div>
                    </td>
                    <td className="p-3 text-center text-slate-700">
                      {toBengaliNumeral(sm.previousReading)} - {toBengaliNumeral(sm.currentReading)}
                    </td>
                    <td className="p-3 text-center">
                      <span className="font-bold text-slate-900">{toBengaliNumeral(sm.units)}</span> Unit
                    </td>
                    <td className="p-3 text-center text-amber-700 font-semibold">
                      +{toBengaliNumeral(sm.allocatedCommonUnits)} Unit
                    </td>
                    <td className="p-3 text-right text-slate-800">
                      {formatTaka(sm.energyCharge + sm.commonCharge)}
                    </td>
                    <td className="p-3 text-right text-slate-600">
                      {formatTaka(sm.fixedChargeShare + sm.fixedFee)}
                    </td>
                    <td className="p-3 text-right font-bold text-amber-900">
                      {totalArrearsForSub > 0 ? (
                        <span className="bg-amber-100 text-amber-950 px-2 py-0.5 rounded border border-amber-300">
                          {formatTaka(totalArrearsForSub)}
                        </span>
                      ) : (
                        <span className="text-slate-400">৳ ০</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <span className="font-black text-sm text-blue-950 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 inline-block">
                        {formatTaka(sm.totalPayable)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-300 text-slate-900">
              <tr>
                <td colSpan={2} className="p-3 text-right">মোট যোগফল:</td>
                <td className="p-3 text-center">{toBengaliNumeral(summary.sumSubUnits)} Unit</td>
                <td className="p-3 text-center text-amber-800">+{toBengaliNumeral(summary.commonUnits)} Unit</td>
                <td colSpan={3} className="p-3 text-right">বিল সামঞ্জস্য (মোট প্রদেয়):</td>
                <td className="p-3 text-right text-base text-slate-950 font-black">
                  {formatTaka(summary.calculatedTotal)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            id="view-receipts-btn"
            type="button"
            onClick={onViewVouchers}
            className="w-full sm:w-auto px-5 py-3 bg-blue-900 hover:bg-blue-950 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <Receipt className="w-4 h-4" /> রসিদ ও ভাউচার ডাউনলোড/কপি করুন
          </button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              id="save-history-btn"
              type="button"
              onClick={onSaveHistory}
              className="flex-1 sm:flex-none px-4 py-3 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
            >
              <Save className="w-4 h-4" /> হিস্ট্রি সেভ করুন
            </button>

            <button
              id="carry-over-btn"
              type="button"
              onClick={onCarryOverReadings}
              className="flex-1 sm:flex-none px-4 py-3 bg-yellow-400 hover:bg-yellow-500 text-blue-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              title="বর্তমান রিডিংগুলোকে আগামী মাসের পূর্বের রিডিং হিসেবে সেট করুন"
            >
              আগামী মাসের জন্য রিডিং সেট <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
