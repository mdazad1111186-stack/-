import React, { useState } from "react";
import { CalculationResult, MainMeter } from "../types";
import { formatTaka, toBengaliNumeral } from "../utils/calculator";
import {
  Printer,
  Copy,
  Check,
  Building,
  User,
  Zap,
  Phone,
  MessageSquare,
  FileText,
} from "lucide-react";

interface TenantVoucherProps {
  mainMeter: MainMeter;
  result: CalculationResult;
}

export const TenantVoucher: React.FC<TenantVoucherProps> = ({ mainMeter, result }) => {
  const [selectedSubId, setSelectedSubId] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { subMeters, summary } = result;

  const filteredMeters =
    selectedSubId === "all"
      ? subMeters
      : subMeters.filter((sm) => sm.id === selectedSubId);

  // Generate WhatsApp / SMS shareable message text
  const generateTextMessage = (sm: typeof subMeters[0]) => {
    const totalArrears = (sm.tenantArrears || 0) + (sm.sharedMainArrearsShare || 0);
    let arrearsLine = "";
    if (totalArrears > 0) {
      arrearsLine = `\n⚠️ *বিগত মাসের বকেয়া (Arrears):* ${formatTaka(totalArrears)}`;
    }

    return `⚡ *বিদ্যুৎ বিল রসিদ - ${mainMeter.monthYear || "চলতি মাস"}* ⚡
-----------------------------------
🏠 *ফ্ল্যাট/মিটার:* ${sm.name}
👤 *ভাড়াটিয়া:* ${sm.tenantName || "সম্মানিত ভাড়াটিয়া"}
-----------------------------------
📊 পূর্বের রিডিং: ${toBengaliNumeral(sm.previousReading)}
📊 বর্তমান রিডিং: ${toBengaliNumeral(sm.currentReading)}
💡 মোট ব্যবহৃত ইউনিট: ${toBengaliNumeral(sm.units)} Unit
💧 কমন/লাইন লস শেয়ার: +${toBengaliNumeral(sm.allocatedCommonUnits)} Unit
💵 প্রতি ইউনিট রেট: ${formatTaka(summary.effectiveRatePerUnit)}

💰 *বিল বিবরণ:*
- বিদ্যুৎ শক্তি চার্জ: ${formatTaka(sm.energyCharge + sm.commonCharge)}
- মিটার চার্জ/ডিমান্ড/অন্যান্য: ${formatTaka(sm.fixedChargeShare + sm.fixedFee)}${arrearsLine}
-----------------------------------
🏷️ *সর্বমোট প্রদেয় বিল:* ${formatTaka(sm.totalPayable)}
-----------------------------------
ধন্যবাদান্তে,
বাড়িওয়ালা / হিসাব বিভাগ`;
  };

  const handleCopyText = (sm: typeof subMeters[0]) => {
    const text = generateTextMessage(sm);
    navigator.clipboard.writeText(text);
    setCopiedId(sm.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="bg-blue-900 text-white p-5 rounded-xl shadow-sm border border-blue-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-yellow-400" />
            ভাড়াটিয়াদের বিদ্যুৎ বিল রসিদ ও ভাউচার
          </h2>
          <p className="text-xs text-blue-200">
            প্রতিটি সাব-মিটারের জন্য আলাদা রসিদ প্রিন্ট করুন বা হোয়াটসঅ্যাপে সরাসরি টেক্সট পাঠান
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Submeter Filter Selector */}
          <select
            value={selectedSubId}
            onChange={(e) => setSelectedSubId(e.target.value)}
            className="bg-blue-950 text-white text-xs font-semibold px-3 py-2 rounded-lg border border-blue-800 focus:outline-none"
          >
            <option value="all">সকল ভাড়াটিয়ার রসিদ (All)</option>
            {subMeters.map((sm) => (
              <option key={sm.id} value={sm.id}>
                {sm.name} - {sm.tenantName}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-blue-950 font-bold rounded-lg text-xs flex items-center gap-2 shrink-0 transition-all shadow-sm"
          >
            <Printer className="w-4 h-4" /> প্রিন্ট করুন
          </button>
        </div>
      </div>

      {/* Printable Vouchers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-1 print:gap-4">
        {filteredMeters.map((sm) => (
          <div
            key={sm.id}
            className="bg-white rounded-xl border-2 border-slate-200 shadow-sm p-6 space-y-5 print:border-black print:shadow-none print:break-inside-avoid relative"
          >
            {/* Voucher Header */}
            <div className="flex items-center justify-between border-b-2 border-dashed border-slate-300 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-900 text-yellow-400 flex items-center justify-center font-bold">
                  <Zap className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">বিদ্যুৎ বিল পরিশোধের ভাউচার</h3>
                  <span className="text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 inline-block">
                    মাস: {mainMeter.monthYear || "মে ২০২৬"}
                  </span>
                </div>
              </div>

              {/* Copy WhatsApp text button */}
              <button
                type="button"
                onClick={() => handleCopyText(sm)}
                className="print:hidden text-xs font-bold px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-300 flex items-center gap-1.5 transition-all"
                title="হোয়াটসঅ্যাপের জন্য টেক্সট কপি করুন"
              >
                {copiedId === sm.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-blue-700" /> কপি হয়েছে!
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-3.5 h-3.5 text-blue-700" /> হোয়াটসঅ্যাপে পাঠান
                  </>
                )}
              </button>
            </div>

            {/* Tenant Info */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-500 block text-[10px] font-bold">ফ্ল্যাট / মিটার:</span>
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-slate-400" /> {sm.name}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] font-bold">ভাড়াটিয়ার নাম:</span>
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" /> {sm.tenantName || "সম্মানিত ভাড়াটিয়া"}
                </span>
              </div>
            </div>

            {/* Meter Reading Summary */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 bg-slate-100 rounded-xl">
                <span className="text-slate-500 block text-[10px]">পূর্বের রিডিং</span>
                <span className="font-extrabold text-slate-800 text-sm">{toBengaliNumeral(sm.previousReading)}</span>
              </div>
              <div className="p-2.5 bg-slate-100 rounded-xl">
                <span className="text-slate-500 block text-[10px]">বর্তমান রিডিং</span>
                <span className="font-extrabold text-slate-800 text-sm">{toBengaliNumeral(sm.currentReading)}</span>
              </div>
              <div className="p-2.5 bg-blue-50 text-blue-950 rounded-xl border border-blue-200">
                <span className="text-blue-800 block text-[10px] font-bold">ব্যবহৃত ইউনিট</span>
                <span className="font-black text-blue-950 text-sm">{toBengaliNumeral(sm.units)} Unit</span>
              </div>
            </div>

            {/* Financial Breakdown Items */}
            <div className="space-y-2 text-xs border-t border-slate-200 pt-3">
              <div className="flex items-center justify-between text-slate-700 py-1 border-b border-slate-100">
                <span>মূল বিদ্যুৎ বিল ({toBengaliNumeral(sm.units)} Unit × {formatTaka(summary.effectiveRatePerUnit)}):</span>
                <span className="font-semibold text-slate-900">{formatTaka(sm.energyCharge)}</span>
              </div>

              {sm.allocatedCommonUnits > 0 && (
                <div className="flex items-center justify-between text-slate-700 py-1 border-b border-slate-100">
                  <span>কমন পানি পাম্প/লাইন লস শেয়ার ({toBengaliNumeral(sm.allocatedCommonUnits)} Unit):</span>
                  <span className="font-semibold text-slate-900">{formatTaka(sm.commonCharge)}</span>
                </div>
              )}

              {sm.fixedChargeShare > 0 && (
                <div className="flex items-center justify-between text-slate-700 py-1 border-b border-slate-100">
                  <span>ডিমান্ড/ভ্যাট/মিটার ভাড়া শেয়ার:</span>
                  <span className="font-semibold text-slate-900">{formatTaka(sm.fixedChargeShare)}</span>
                </div>
              )}

              {sm.fixedFee > 0 && (
                <div className="flex items-center justify-between text-slate-700 py-1 border-b border-slate-100">
                  <span>নির্দিষ্ট অতিরিক্ত চার্জ (পানি/গার্ড):</span>
                  <span className="font-semibold text-slate-900">{formatTaka(sm.fixedFee)}</span>
                </div>
              )}

              {((sm.tenantArrears || 0) + (sm.sharedMainArrearsShare || 0)) > 0 && (
                <div className="flex items-center justify-between text-amber-900 bg-amber-50 px-2 py-1 rounded border border-amber-200">
                  <span className="font-bold">বিগত মাসের বকেয়া (Arrears):</span>
                  <span className="font-extrabold">{formatTaka((sm.tenantArrears || 0) + (sm.sharedMainArrearsShare || 0))}</span>
                </div>
              )}
            </div>

            {/* Total Payable Box */}
            <div className="bg-slate-900 text-white p-4 rounded-xl flex items-center justify-between mt-4">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">সর্বমোট প্রদেয় বিল:</span>
                <span className="text-xs text-amber-400 font-medium">তারিখের মধ্যে পরিশোধযোগ্য</span>
              </div>
              <div className="text-xl font-black text-amber-400">
                {formatTaka(sm.totalPayable)}
              </div>
            </div>

            {/* Signature row */}
            <div className="flex items-center justify-between pt-6 text-[11px] text-slate-400 border-t border-slate-200">
              <div className="border-t border-slate-400 pt-1 w-28 text-center">ভাড়াটিয়ার স্বাক্ষর</div>
              <div className="border-t border-slate-400 pt-1 w-28 text-center">বাড়িওয়ালার স্বাক্ষর</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
