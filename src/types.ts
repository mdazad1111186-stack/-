export interface MainMeter {
  id?: string;
  name?: string; // "মেইন মিটার ১", "মেইন মিটার ২", ইত্যাদি
  previousReading: number;
  currentReading: number;
  totalBillAmount: number;
  demandCharge: number;
  meterRent: number;
  vat: number;
  arrears?: number; // মেইন মিটারের গত মাসের বকেয়া বা বিলম্ব ফি / সারচার্জ / জের
  monthYear: string;
  provider?: string; // "DPDC" | "DESCO" | "REB" | "BPDB" | "NESCO" | "WZPDC" | "Custom"
}

export interface SubMeter {
  id: string;
  name: string;
  tenantName: string;
  previousReading: number;
  currentReading: number;
  fixedFee: number;
  arrears?: number; // ভাড়াটিয়ার ব্যক্তিগত বিগত মাসের বকেয়া বিল
  note: string;
}

export type CalculationMethod = "effective_rate" | "flat_rate" | "slab";
export type CommonAllocation = "equal" | "proportional" | "none";

export interface SubMeterResult extends SubMeter {
  units: number;
  allocatedCommonUnits: number;
  totalBillableUnits: number;
  energyCharge: number;
  commonCharge: number;
  fixedChargeShare: number;
  tenantArrears: number;
  sharedMainArrearsShare: number;
  totalPayable: number;
}

export interface CalculationSummary {
  mainUnits: number;
  sumSubUnits: number;
  commonUnits: number;
  hasOverConsumption: boolean;
  effectiveRatePerUnit: number;
  mainTotalAmount: number;
  mainArrears: number;
  netEnergyCost: number;
  calculatedTotal: number;
  difference: number;
  method: CalculationMethod;
  commonAllocation: CommonAllocation;
}

export interface CalculationResult {
  summary: CalculationSummary;
  subMeters: SubMeterResult[];
}

export interface SavedHistoryItem {
  id: string;
  dateCreated: string;
  monthYear: string;
  mainMeter: MainMeter;
  subMeters: SubMeter[];
  result: CalculationResult;
}
