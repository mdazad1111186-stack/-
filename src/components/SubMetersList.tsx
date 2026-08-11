import React from "react";
import { SubMeter } from "../types";
import { toBengaliNumeral } from "../utils/calculator";
import { Plus, Trash2, Users, Layers, RotateCcw, Building2, User } from "lucide-react";

interface SubMetersListProps {
  subMeters: SubMeter[];
  onChange: (updated: SubMeter[]) => void;
  onResetCount: (count: number) => void;
}

export const SubMetersList: React.FC<SubMetersListProps> = ({
  subMeters,
  onChange,
  onResetCount,
}) => {
  const handleUpdateSubMeter = (index: number, field: keyof SubMeter, value: any) => {
    const updated = [...subMeters];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    onChange(updated);
  };

  const handleAddSubMeter = () => {
    const newIndex = subMeters.length + 1;
    const newMeter: SubMeter = {
      id: `sub_meter_${Date.now()}_${newIndex}`,
      name: `${newIndex}ম সাব-মিটার (ফ্ল্যাট/দোকান)`,
      tenantName: `ভাড়াটিয়া ${newIndex}`,
      previousReading: 0,
      currentReading: 0,
      fixedFee: 0,
      note: "",
    };
    onChange([...subMeters, newMeter]);
  };

  const handleRemoveSubMeter = (index: number) => {
    if (subMeters.length <= 1) return;
    const updated = subMeters.filter((_, i) => i !== index);
    onChange(updated);
  };

  const totalSubUnits = subMeters.reduce((acc, curr) => {
    const prev = Number(curr.previousReading) || 0;
    const c = Number(curr.currentReading) || 0;
    return acc + Math.max(0, c - prev);
  }, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header Banner */}
      <div className="bg-blue-900 text-white px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-blue-950">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-yellow-400 text-blue-900 rounded-lg shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-white">২. সাব-মিটার সমূহের রিডিং ইনপুট</h2>
            <p className="text-xs text-blue-200">প্রতিটি সাব-মিটারের পূর্বের ও বর্তমান রিডিং দিন</p>
          </div>
        </div>

        {/* Action Controls & Total Sub Units Badge */}
        <div className="flex items-center gap-2">
          <div className="bg-blue-950/90 border border-blue-700/60 px-3 py-1.5 rounded-xl text-xs flex items-center gap-2">
            <span className="text-blue-200">মোট সাব-মিটার ইউনিট:</span>
            <span className="text-yellow-400 font-extrabold text-sm">
              {toBengaliNumeral(totalSubUnits)} <span className="text-[10px] font-normal">Unit</span>
            </span>
          </div>

          <button
            type="button"
            onClick={() => onResetCount(3)}
            className="px-2.5 py-1.5 bg-blue-800 hover:bg-blue-700 text-blue-100 text-xs rounded-lg font-medium border border-blue-700 flex items-center gap-1 transition-colors"
            title="৩টি সাব-মিটারে রিসেট করুন"
          >
            <RotateCcw className="w-3.5 h-3.5" /> ৩টি
          </button>
          <button
            type="button"
            onClick={() => onResetCount(4)}
            className="px-2.5 py-1.5 bg-blue-800 hover:bg-blue-700 text-blue-100 text-xs rounded-lg font-medium border border-blue-700 flex items-center gap-1 transition-colors"
            title="৪টি সাব-মিটারে রিসেট করুন"
          >
            <RotateCcw className="w-3.5 h-3.5" /> ৪টি
          </button>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-4">
        {subMeters.map((sm, index) => {
          const prev = Number(sm.previousReading) || 0;
          const curr = Number(sm.currentReading) || 0;
          const units = Math.max(0, curr - prev);

          return (
            <div
              key={sm.id || index}
              className="bg-slate-50/80 rounded-xl p-4 sm:p-5 border border-slate-200 hover:border-slate-300 transition-all space-y-4 shadow-2xs"
            >
              {/* Card Title Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 gap-2">
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <span className="w-7 h-7 rounded-full bg-blue-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {toBengaliNumeral(index + 1)}
                  </span>
                  <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {/* Meter / Location Name */}
                    <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <input
                        type="text"
                        value={sm.name}
                        onChange={(e) => handleUpdateSubMeter(index, "name", e.target.value)}
                        placeholder="মিটার / ফ্ল্যাটের নাম"
                        className="w-full text-xs font-bold text-slate-800 bg-transparent border-none focus:outline-none"
                      />
                    </div>
                    {/* Tenant Name */}
                    <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <input
                        type="text"
                        value={sm.tenantName}
                        onChange={(e) => handleUpdateSubMeter(index, "tenantName", e.target.value)}
                        placeholder="ভাড়াটিয়ার নাম"
                        className="w-full text-xs font-medium text-slate-700 bg-transparent border-none focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Individual Consumed Unit Badge & Delete Button */}
                <div className="flex items-center gap-2">
                  <div className="bg-blue-100/80 border border-blue-300 px-3 py-1 rounded-xl text-xs text-blue-950 font-bold shrink-0">
                    {toBengaliNumeral(units)} <span className="text-[10px] font-normal text-blue-800">ইউনিট</span>
                  </div>

                  {subMeters.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSubMeter(index)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="সাব-মিটারটি মুছুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Readings Inputs & Arrears */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Previous Reading */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    পূর্বের রিডিং (Prev)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={sm.previousReading || ""}
                    onChange={(e) => handleUpdateSubMeter(index, "previousReading", parseFloat(e.target.value) || 0)}
                    placeholder="০"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-semibold text-slate-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                {/* Current Reading */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    বর্তমান রিডিং (Curr)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={sm.currentReading || ""}
                    onChange={(e) => handleUpdateSubMeter(index, "currentReading", parseFloat(e.target.value) || 0)}
                    placeholder="০"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-semibold text-slate-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                {/* Fixed Fee (Optional e.g. Water pump or guard share) */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    নির্দিষ্ট ফিক্সড ফি (পানি/কমন ৳)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={sm.fixedFee || ""}
                    onChange={(e) => handleUpdateSubMeter(index, "fixedFee", parseFloat(e.target.value) || 0)}
                    placeholder="৳ ০"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-semibold text-slate-800 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                {/* Tenant Individual Arrears */}
                <div>
                  <label className="block text-[11px] font-bold text-amber-900 mb-1">
                    ব্যক্তিগত বকেয়া (Arrears ৳)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={sm.arrears || ""}
                    onChange={(e) => handleUpdateSubMeter(index, "arrears", parseFloat(e.target.value) || 0)}
                    placeholder="৳ ০"
                    className="w-full px-3 py-1.5 rounded-lg border border-amber-300 bg-amber-50/60 font-bold text-amber-950 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>
            </div>
          );
        })}

        {/* Add New SubMeter Button */}
        <button
          id="add-submeter-btn"
          type="button"
          onClick={handleAddSubMeter}
          className="w-full py-3 border-2 border-dashed border-slate-300 hover:border-blue-600 hover:bg-blue-50/50 rounded-xl text-slate-700 hover:text-blue-900 text-xs font-bold flex items-center justify-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" /> আরও একটি সাব-মিটার যোগ করুন
        </button>
      </div>
    </div>
  );
};
