import React, { useState, useEffect, useMemo } from "react";
import {
  MainMeter,
  SubMeter,
  CalculationMethod,
  CommonAllocation,
  SavedHistoryItem,
} from "./types";
import {
  calculateSubMeterBills,
  getDefaultSubMeters,
} from "./utils/calculator";
import { Header } from "./components/Header";
import { MainMeterInput } from "./components/MainMeterInput";
import { SubMetersList } from "./components/SubMetersList";
import { CalculationResultCard } from "./components/CalculationResultCard";
import { TenantVoucher } from "./components/TenantVoucher";
import { HistoryManager } from "./components/HistoryManager";
import { AiBillAdvisor } from "./components/AiBillAdvisor";
import { CalculationGuide } from "./components/CalculationGuide";
import { CheckCircle2 } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("calculator");

  // Main Meters List State with LocalStorage Persistence for Arrears & Multi-Meter support
  const [mainMeters, setMainMeters] = useState<MainMeter[]>(() => {
    try {
      const saved = localStorage.getItem("submeter_mainmeters_v2");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: "main_1",
        name: "মেইন মিটার ১",
        previousReading: 1200,
        currentReading: 1580,
        totalBillAmount: 3250,
        demandCharge: 120,
        meterRent: 40,
        vat: 150,
        arrears: 0,
        monthYear: "মে ২০২৬",
        provider: "DESCO",
      },
    ];
  });

  const [activeMainIndex, setActiveMainIndex] = useState<number>(0);

  // Sub Meters State (persisted to LocalStorage)
  const [subMeters, setSubMeters] = useState<SubMeter[]>(() => {
    try {
      const saved = localStorage.getItem("submeter_list_v2");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return getDefaultSubMeters(3);
  });

  // Options State
  const [method, setMethod] = useState<CalculationMethod>("effective_rate");
  const [flatRate, setFlatRate] = useState<number>(8.5);
  const [commonAllocation, setCommonAllocation] = useState<CommonAllocation>("equal");

  // History State
  const [history, setHistory] = useState<SavedHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem("submeter_history_v1");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync main meters state to LocalStorage so Arrears (জের) automatically persists!
  useEffect(() => {
    try {
      localStorage.setItem("submeter_mainmeters_v2", JSON.stringify(mainMeters));
    } catch (e) {
      console.error("Failed to save main meters to LocalStorage", e);
    }
  }, [mainMeters]);

  // Sync sub meters state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem("submeter_list_v2", JSON.stringify(subMeters));
    } catch (e) {
      console.error("Failed to save submeters to LocalStorage", e);
    }
  }, [subMeters]);

  // Sync History to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem("submeter_history_v1", JSON.stringify(history));
    } catch (e) {
      console.error("Failed to save history to LocalStorage", e);
    }
  }, [history]);

  // Active Main Meter fallback
  const activeMainMeter = mainMeters[activeMainIndex] || mainMeters[0] || {
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

  // Add new Main Meter
  const handleAddMainMeter = () => {
    const nextIndex = mainMeters.length + 1;
    const newMeter: MainMeter = {
      id: `main_${Date.now()}`,
      name: `মেইন মিটার ${nextIndex}`,
      previousReading: 0,
      currentReading: 0,
      totalBillAmount: 0,
      demandCharge: 120,
      meterRent: 40,
      vat: 100,
      arrears: 0,
      monthYear: activeMainMeter.monthYear || "মে ২০২৬",
      provider: activeMainMeter.provider || "DESCO",
    };
    setMainMeters((prev) => [...prev, newMeter]);
    setActiveMainIndex(mainMeters.length);
    showToast(`নতুন মেইন মিটার (${newMeter.name}) যুক্ত করা হয়েছে!`);
  };

  // Remove Main Meter
  const handleRemoveMainMeter = (indexToRemove: number) => {
    if (mainMeters.length <= 1) {
      showToast("সর্বনিম্ন একটি মেইন মিটার থাকা আবশ্যক");
      return;
    }
    const targetName = mainMeters[indexToRemove]?.name || "মিটার";
    setMainMeters((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setActiveMainIndex((prev) => (prev >= indexToRemove && prev > 0 ? prev - 1 : 0));
    showToast(`${targetName} মুছে ফেলা হয়েছে`);
  };

  // Update Active Main Meter
  const handleUpdateActiveMainMeter = (updated: MainMeter) => {
    setMainMeters((prev) =>
      prev.map((m, idx) => (idx === activeMainIndex ? updated : m))
    );
  };

  // Real-time Calculation Result for Active Main Meter
  const calculationResult = useMemo(() => {
    return calculateSubMeterBills(
      activeMainMeter,
      subMeters,
      method,
      flatRate,
      commonAllocation
    );
  }, [activeMainMeter, subMeters, method, flatRate, commonAllocation]);

  // Switch Submeter Count Preset (3 or 4)
  const handleQuickPreset = (count: number) => {
    setSubMeters(getDefaultSubMeters(count));
    showToast(`${count} টি সাব-মিটার রিসেট করা হয়েছে`);
  };

  // Save current calculation to history
  const handleSaveHistory = () => {
    const newItem: SavedHistoryItem = {
      id: `hist_${Date.now()}`,
      dateCreated: new Date().toLocaleDateString("bn-BD", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      monthYear: activeMainMeter.monthYear || "চলতি মাস",
      mainMeter: { ...activeMainMeter },
      subMeters: [...subMeters],
      result: calculationResult,
    };

    setHistory((prev) => [newItem, ...prev]);
    showToast("হিসাব সফলভাবে হিস্ট্রিতে সংরক্ষণ করা হয়েছে!");
  };

  // Carry Over Current Readings as Previous Readings for Next Month (Preserves Arrears!)
  const handleCarryOverReadings = () => {
    // Update active main meter readings while keeping arrears preserved
    const updatedMeters = mainMeters.map((m, idx) => {
      if (idx === activeMainIndex) {
        return {
          ...m,
          previousReading: m.currentReading,
          currentReading: m.currentReading + 100,
          monthYear: "জুন ২০২৬",
        };
      }
      return m;
    });

    const nextSubMeters = subMeters.map((sm) => ({
      ...sm,
      previousReading: sm.currentReading,
      currentReading: sm.currentReading + 50,
    }));

    setMainMeters(updatedMeters);
    setSubMeters(nextSubMeters);
    showToast("আগামী মাসের হিসাবের জন্য বর্তমান রিডিং সেট ও পূর্বে জের স্বয়ংক্রিয়ভাবে সংরক্ষিত রয়েছে!");
  };

  // Load Past History Item
  const handleLoadHistoryItem = (item: SavedHistoryItem) => {
    handleUpdateActiveMainMeter(item.mainMeter);
    setSubMeters(item.subMeters);
    setActiveTab("calculator");
    showToast(`${item.monthYear} এর হিসাব ক্যালকুলেটরে লোড করা হয়েছে`);
  };

  // Delete History Item
  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
    showToast("হিস্ট্রি ডিলিট করা হয়েছে");
  };

  // Clear All History
  const handleClearHistory = () => {
    if (window.confirm("আপনি কি নিশ্চিত যে সকল সংরক্ষিত হিস্ট্রি মুছে ফেলতে চান?")) {
      setHistory([]);
      showToast("সকল হিস্ট্রি মুছে ফেলা হয়েছে");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 pb-12">
      {/* Toast Notification Floating Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-emerald-500/50 flex items-center gap-2.5 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        subMeterCount={subMeters.length}
        setQuickPreset={handleQuickPreset}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {activeTab === "calculator" && (
          <div className="space-y-6">
            {/* Top Grid: Main Meter Input & Submeters List */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Main Meter Input */}
              <div className="lg:col-span-5">
                <MainMeterInput
                  mainMeters={mainMeters}
                  activeMainIndex={activeMainIndex}
                  onSelectMainMeter={setActiveMainIndex}
                  onAddMainMeter={handleAddMainMeter}
                  onRemoveMainMeter={handleRemoveMainMeter}
                  onChangeActiveMainMeter={handleUpdateActiveMainMeter}
                  method={method}
                  setMethod={setMethod}
                  flatRate={flatRate}
                  setFlatRate={setFlatRate}
                />
              </div>

              {/* Right Column: Sub-Meters Inputs */}
              <div className="lg:col-span-7">
                <SubMetersList
                  subMeters={subMeters}
                  onChange={setSubMeters}
                  onResetCount={handleQuickPreset}
                />
              </div>
            </div>

            {/* Bottom Section: Result Summary Dashboard */}
            <CalculationResultCard
              result={calculationResult}
              commonAllocation={commonAllocation}
              setCommonAllocation={setCommonAllocation}
              onViewVouchers={() => setActiveTab("vouchers")}
              onSaveHistory={handleSaveHistory}
              onCarryOverReadings={handleCarryOverReadings}
            />
          </div>
        )}

        {activeTab === "vouchers" && (
          <TenantVoucher mainMeter={activeMainMeter} result={calculationResult} />
        )}

        {activeTab === "history" && (
          <HistoryManager
            history={history}
            onLoadHistoryItem={handleLoadHistoryItem}
            onDeleteHistoryItem={handleDeleteHistoryItem}
            onClearHistory={handleClearHistory}
          />
        )}

        {activeTab === "ai" && (
          <AiBillAdvisor result={calculationResult} />
        )}

        {activeTab === "guide" && <CalculationGuide />}
      </main>
    </div>
  );
}
