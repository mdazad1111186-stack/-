import {
  MainMeter,
  SubMeter,
  CalculationMethod,
  CommonAllocation,
  CalculationResult,
  SubMeterResult,
} from "../types";

// Convert numbers to Bengali digits (e.g. 123 -> ১২৩)
export function toBengaliNumeral(num: number | string | undefined | null): string {
  if (num === undefined || num === null || Number.isNaN(Number(num))) return "০";
  const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  const str = String(num);
  return str.replace(/[0-9]/g, (digit) => bengaliDigits[parseInt(digit, 10)]);
}

// Format Taka currency with Bengali numerals (e.g. ৳১,২৫০.৫০)
export function formatTaka(amount: number, useBnDigits = true): string {
  const formatted = amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  if (useBnDigits) {
    return `৳ ${toBengaliNumeral(formatted)}`;
  }
  return `Tk ${formatted}`;
}

// Main calculation logic function
export function calculateSubMeterBills(
  mainMeter: MainMeter,
  subMeters: SubMeter[],
  method: CalculationMethod = "effective_rate",
  flatRate: number = 8.5,
  commonAllocation: CommonAllocation = "equal"
): CalculationResult {
  const mainPrev = Number(mainMeter.previousReading) || 0;
  const mainCurr = Number(mainMeter.currentReading) || 0;
  const mainUnits = Math.max(0, mainCurr - mainPrev);

  const mainTotalAmount = Number(mainMeter.totalBillAmount) || 0;
  const mainDemandCharge = Number(mainMeter.demandCharge) || 0;
  const mainMeterRent = Number(mainMeter.meterRent) || 0;
  const mainVat = Number(mainMeter.vat) || 0;
  const mainArrears = Number(mainMeter.arrears) || 0; // মেইন বিলে থাকা বকেয়া/সারচার্জ

  let sumSubUnits = 0;
  const processedSubMeters = subMeters.map((sm, index) => {
    const p = Number(sm.previousReading) || 0;
    const c = Number(sm.currentReading) || 0;
    const units = Math.max(0, c - p);
    sumSubUnits += units;
    return {
      ...sm,
      id: sm.id || `sub_${index + 1}`,
      name: sm.name || `সাব-মিটার ${index + 1}`,
      previousReading: p,
      currentReading: c,
      units,
      fixedFee: Number(sm.fixedFee) || 0,
      arrears: Number(sm.arrears) || 0,
    };
  });

  const commonUnits = Math.max(0, mainUnits - sumSubUnits);
  const hasOverConsumption = sumSubUnits > mainUnits;

  // Calculate Base Effective Rate
  // Net energy amount excluding fixed charges and arrears so unit rate stays accurate
  const currentMonthBillWithoutArrears = Math.max(0, mainTotalAmount - mainArrears);
  const netEnergyCost = Math.max(0, currentMonthBillWithoutArrears - (mainDemandCharge + mainMeterRent + mainVat));

  let effectiveRatePerUnit = 8.5;

  if (method === "effective_rate") {
    if (mainUnits > 0 && currentMonthBillWithoutArrears > 0) {
      // Calculate unit rate excluding main arrears to prevent unfair rate inflation
      effectiveRatePerUnit = currentMonthBillWithoutArrears / mainUnits;
    } else if (mainUnits > 0 && mainTotalAmount > 0) {
      effectiveRatePerUnit = mainTotalAmount / mainUnits;
    } else {
      effectiveRatePerUnit = flatRate || 8.5;
    }
  } else if (method === "flat_rate") {
    effectiveRatePerUnit = Number(flatRate) || 8.5;
  } else if (method === "slab") {
    effectiveRatePerUnit = mainUnits > 0 && currentMonthBillWithoutArrears > 0 ? currentMonthBillWithoutArrears / mainUnits : flatRate || 8.5;
  }

  const numSubMeters = processedSubMeters.length;

  const subMeterResults: SubMeterResult[] = processedSubMeters.map((sm) => {
    let allocatedCommonUnits = 0;

    if (commonAllocation === "equal" && numSubMeters > 0) {
      allocatedCommonUnits = commonUnits / numSubMeters;
    } else if (commonAllocation === "proportional" && sumSubUnits > 0) {
      allocatedCommonUnits = (sm.units / sumSubUnits) * commonUnits;
    }

    const totalBillableUnits = sm.units + allocatedCommonUnits;
    const energyCharge = sm.units * effectiveRatePerUnit;
    const commonCharge = allocatedCommonUnits * effectiveRatePerUnit;

    // Shared demand + vat + meter rent
    const fixedChargeShare = numSubMeters > 0 ? (mainDemandCharge + mainMeterRent + mainVat) / numSubMeters : 0;

    // Main meter arrears share (if any main meter arrears exist and shared equally)
    const sharedMainArrearsShare = numSubMeters > 0 ? mainArrears / numSubMeters : 0;

    // Individual tenant arrears
    const tenantArrears = sm.arrears || 0;

    const totalPayable = energyCharge + commonCharge + fixedChargeShare + sm.fixedFee + tenantArrears + sharedMainArrearsShare;

    return {
      ...sm,
      allocatedCommonUnits: Math.round(allocatedCommonUnits * 100) / 100,
      totalBillableUnits: Math.round(totalBillableUnits * 100) / 100,
      energyCharge: Math.round(energyCharge * 100) / 100,
      commonCharge: Math.round(commonCharge * 100) / 100,
      fixedChargeShare: Math.round(fixedChargeShare * 100) / 100,
      tenantArrears: Math.round(tenantArrears * 100) / 100,
      sharedMainArrearsShare: Math.round(sharedMainArrearsShare * 100) / 100,
      totalPayable: Math.round(totalPayable * 100) / 100,
    };
  });

  const calculatedTotal = subMeterResults.reduce((acc, curr) => acc + curr.totalPayable, 0);

  return {
    summary: {
      mainUnits,
      sumSubUnits,
      commonUnits: Math.round(commonUnits * 100) / 100,
      hasOverConsumption,
      effectiveRatePerUnit: Math.round(effectiveRatePerUnit * 100) / 100,
      mainTotalAmount,
      mainArrears: Math.round(mainArrears * 100) / 100,
      netEnergyCost: Math.round(netEnergyCost * 100) / 100,
      calculatedTotal: Math.round(calculatedTotal * 100) / 100,
      difference: Math.round((mainTotalAmount - calculatedTotal) * 100) / 100,
      method,
      commonAllocation,
    },
    subMeters: subMeterResults,
  };
}

// Default initial state generator for 3 or 4 sub-meters
export function getDefaultSubMeters(count: number = 3): SubMeter[] {
  const presetNames = [
    { name: "১ম তলা (ফ্ল্যাট ১এ)", tenant: "মাসুদ হাসান" },
    { name: "২য় তলা (ফ্ল্যাট ২এ)", tenant: "আব্দুর রহিম" },
    { name: "৩য় তলা (ফ্ল্যাট ৩এ)", tenant: "কামরুল ইসলাম" },
    { name: "৪র্থ তলা (ফ্ল্যাট ৪এ)", tenant: "সাইফুল আলম" },
    { name: "দোকান / বাণিজ্যিক মিটার", tenant: "আলম ট্রেডার্স" },
  ];

  return Array.from({ length: count }, (_, i) => {
    const preset = presetNames[i] || { name: `সাব-মিটার ${i + 1}`, tenant: `ভাড়াটিয়া ${i + 1}` };
    return {
      id: `sub_meter_${Date.now()}_${i + 1}`,
      name: preset.name,
      tenantName: preset.tenant,
      previousReading: (i + 1) * 120,
      currentReading: (i + 1) * 120 + 85 + (i * 15),
      fixedFee: 0,
      note: "",
    };
  });
}
