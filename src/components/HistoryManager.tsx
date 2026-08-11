import React from "react";
import { SavedHistoryItem } from "../types";
import { formatTaka, toBengaliNumeral } from "../utils/calculator";
import { History, Trash2, Download, RefreshCw, Calendar, FileJson, ArrowUpRight } from "lucide-react";

interface HistoryManagerProps {
  history: SavedHistoryItem[];
  onLoadHistoryItem: (item: SavedHistoryItem) => void;
  onDeleteHistoryItem: (id: string) => void;
  onClearHistory: () => void;
}

export const HistoryManager: React.FC<HistoryManagerProps> = ({
  history,
  onLoadHistoryItem,
  onDeleteHistoryItem,
  onClearHistory,
}) => {
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `electricity_bill_history_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCSV = () => {
    let csv = "মাস,তারিখ,মেইন মিটার বিল,মোট সাব-মিটার,মোট ব্যবহৃত ইউনিট,সর্বমোট প্রদেয়\n";
    history.forEach((h) => {
      csv += `"${h.monthYear}","${h.dateCreated}","${h.mainMeter.totalBillAmount}","${h.subMeters.length}","${h.result.summary.mainUnits}","${h.result.summary.calculatedTotal}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `electricity_bill_summary_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden space-y-0">
      {/* Header Banner */}
      <div className="bg-blue-900 text-white p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-blue-950">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-yellow-400 text-blue-900 rounded-lg shrink-0">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-white">পূর্ববর্তী সংরক্ষিত হিসাবের হিস্ট্রি</h2>
            <p className="text-xs text-blue-200">মাসের সংরক্ষিত বিদ্যুৎ বিলের রেকর্ড সমূহ</p>
          </div>
        </div>

        {history.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCSV}
              className="px-3 py-1.5 bg-blue-800 hover:bg-blue-700 text-blue-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-blue-700"
            >
              <Download className="w-3.5 h-3.5" /> CSV ডাউনলোড
            </button>
            <button
              type="button"
              onClick={handleExportJSON}
              className="px-3 py-1.5 bg-blue-800 hover:bg-blue-700 text-blue-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-blue-700"
            >
              <FileJson className="w-3.5 h-3.5" /> JSON ব্যাকআপ
            </button>
            <button
              type="button"
              onClick={onClearHistory}
              className="px-3 py-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 rounded-lg text-xs font-semibold flex items-center gap-1 border border-rose-800"
            >
              <Trash2 className="w-3.5 h-3.5" /> সব মুছুন
            </button>
          </div>
        )}
      </div>

      <div className="p-6">
        {history.length === 0 ? (
          <div className="text-center py-12 space-y-3 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <History className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">কোনো সংরক্ষিত হিস্ট্রি নেই</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              ক্যালকুলেটরে হিসাব সম্পাদন করে &quot;হিস্ট্রি সেভ করুন&quot; বাটনে ক্লিক করলে তা এখানে নিরাপদে সংরক্ষিত থাকবে।
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <div
                key={item.id}
                className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200 hover:border-slate-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-blue-900 text-white text-xs font-bold flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {item.monthYear}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">{item.dateCreated}</span>
                  </div>

                  <div className="text-xs text-slate-700 pt-1 flex items-center gap-3 flex-wrap">
                    <span>
                      মেইন রিডিং: <strong>{toBengaliNumeral(item.mainMeter.previousReading)}</strong> ➔ <strong>{toBengaliNumeral(item.mainMeter.currentReading)}</strong> ({toBengaliNumeral(item.result.summary.mainUnits)} Unit)
                    </span>
                    <span>•</span>
                    <span>সাব-মিটার: <strong>{toBengaliNumeral(item.subMeters.length)} টি</strong></span>
                    <span>•</span>
                    <span>মোট বিল: <strong>{formatTaka(item.mainMeter.totalBillAmount)}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => onLoadHistoryItem(item)}
                    className="px-3.5 py-2 bg-blue-900 hover:bg-blue-950 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-sm"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> ক্যালকুলেটরে লোড করুন <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteHistoryItem(item.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="মুছুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
