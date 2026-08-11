import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Initialize Gemini Client safely
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing in environment variables.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health Check API
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Calculate Electricity Bill API
app.post("/api/calculate", (req, res) => {
  try {
    const {
      mainMeter,
      subMeters,
      method = "effective_rate", // "effective_rate" | "flat_rate" | "slab"
      flatRate = 8.5,
      commonAllocation = "equal", // "equal" | "proportional" | "none"
      extraFixedFeeName = "পানি পাম্প ও কমন লাইট",
    } = req.body;

    if (!mainMeter || typeof mainMeter.currentReading !== "number" || typeof mainMeter.previousReading !== "number") {
      return res.status(400).json({ error: "মেইন মিটারের রিডিং সঠিক নয়।" });
    }

    const mainPrev = Number(mainMeter.previousReading);
    const mainCurr = Number(mainMeter.currentReading);
    const mainUnits = Math.max(0, mainCurr - mainPrev);
    const mainTotalAmount = Number(mainMeter.totalBillAmount || 0);
    const mainDemandCharge = Number(mainMeter.demandCharge || 0);
    const mainMeterRent = Number(mainMeter.meterRent || 0);
    const mainVat = Number(mainMeter.vat || 0);
    const mainArrears = Number(mainMeter.arrears || 0);

    // Sum of submeter units
    let sumSubUnits = 0;
    const processedSubMeters = subMeters.map((sm: any, index: number) => {
      const p = Number(sm.previousReading || 0);
      const c = Number(sm.currentReading || 0);
      const units = Math.max(0, c - p);
      sumSubUnits += units;
      return {
        id: sm.id || `sub_${index + 1}`,
        name: sm.name || `সাব-মিটার ${index + 1}`,
        tenantName: sm.tenantName || "",
        previousReading: p,
        currentReading: c,
        units,
        fixedFee: Number(sm.fixedFee || 0),
        arrears: Number(sm.arrears || 0),
        note: sm.note || "",
      };
    });

    // Unmetered / Line Loss / Common units
    const commonUnits = Math.max(0, mainUnits - sumSubUnits);
    const hasOverConsumption = sumSubUnits > mainUnits;

    // Calculation per unit rate (exclude arrears from energy cost)
    const currentMonthBillWithoutArrears = Math.max(0, mainTotalAmount - mainArrears);
    let baseRatePerUnit = 0;
    let netEnergyCost = Math.max(0, currentMonthBillWithoutArrears - (mainDemandCharge + mainMeterRent + mainVat));

    if (method === "effective_rate") {
      baseRatePerUnit = mainUnits > 0 ? (currentMonthBillWithoutArrears > 0 ? currentMonthBillWithoutArrears / mainUnits : 8.5) : 8.5;
    } else if (method === "flat_rate") {
      baseRatePerUnit = Number(flatRate) || 8.5;
    } else if (method === "slab") {
      baseRatePerUnit = mainUnits > 0 && currentMonthBillWithoutArrears > 0 ? currentMonthBillWithoutArrears / mainUnits : 8.5;
    }

    // Allocate common units
    const numSubMeters = processedSubMeters.length;

    const subMeterResults = processedSubMeters.map((sm: any) => {
      let allocatedCommonUnits = 0;

      if (commonAllocation === "equal" && numSubMeters > 0) {
        allocatedCommonUnits = commonUnits / numSubMeters;
      } else if (commonAllocation === "proportional" && sumSubUnits > 0) {
        allocatedCommonUnits = (sm.units / sumSubUnits) * commonUnits;
      }

      const totalBillableUnits = sm.units + allocatedCommonUnits;
      const energyCharge = sm.units * baseRatePerUnit;
      const commonCharge = allocatedCommonUnits * baseRatePerUnit;

      // Fixed charges proportion
      const fixedChargeShare = numSubMeters > 0 ? (mainDemandCharge + mainMeterRent + mainVat) / numSubMeters : 0;
      const sharedMainArrearsShare = numSubMeters > 0 ? mainArrears / numSubMeters : 0;
      const tenantArrears = Number(sm.arrears || 0);

      const subTotal = energyCharge + commonCharge + fixedChargeShare + sm.fixedFee + tenantArrears + sharedMainArrearsShare;

      return {
        ...sm,
        allocatedCommonUnits: Math.round(allocatedCommonUnits * 100) / 100,
        totalBillableUnits: Math.round(totalBillableUnits * 100) / 100,
        energyCharge: Math.round(energyCharge * 100) / 100,
        commonCharge: Math.round(commonCharge * 100) / 100,
        fixedChargeShare: Math.round(fixedChargeShare * 100) / 100,
        tenantArrears: Math.round(tenantArrears * 100) / 100,
        sharedMainArrearsShare: Math.round(sharedMainArrearsShare * 100) / 100,
        totalPayable: Math.round(subTotal * 100) / 100,
      };
    });

    const calculatedTotal = subMeterResults.reduce((acc: number, curr: any) => acc + curr.totalPayable, 0);

    res.json({
      success: true,
      summary: {
        mainUnits,
        sumSubUnits,
        commonUnits: Math.round(commonUnits * 100) / 100,
        hasOverConsumption,
        effectiveRatePerUnit: Math.round(baseRatePerUnit * 100) / 100,
        mainTotalAmount,
        mainArrears: Math.round(mainArrears * 100) / 100,
        netEnergyCost: Math.round(netEnergyCost * 100) / 100,
        calculatedTotal: Math.round(calculatedTotal * 100) / 100,
        difference: Math.round((mainTotalAmount - calculatedTotal) * 100) / 100,
        method,
        commonAllocation,
      },
      subMeters: subMeterResults,
    });
  } catch (err: any) {
    console.error("Calculation Error:", err);
    res.status(500).json({ error: "হিসাব করতে সমস্যা হয়েছে: " + err.message });
  }
});

// Gemini AI Assistant for Bill Questions and Electricity Tips
app.post("/api/gemini/advisor", async (req, res) => {
  try {
    const { question, billData } = req.body;
    const ai = getGeminiClient();

    const systemInstruction = `
আপনি একজন অভিজ্ঞ বাংলাদেশী ইলেকট্রিক্যাল ইঞ্জিনিয়ার ও বিদ্যুৎ বিল বিশেষজ্ঞ। 
বাঙালি বাড়িওয়ালা এবং ভাড়াটিয়াদের বিদ্যুৎ মিটার, মেইন মিটার ও সাব-মিটারের বিল বন্টন এবং বিদ্যুৎ সাশ্রয় সংক্রান্ত প্রশ্নের উত্তর বাংলায় সহজ, সুন্দর ও স্পষ্ট ভাষায় দেবেন।

রীতি ও নির্দেশাবলী:
১. সবসময় বাংলায় উত্তর দিন।
২. মেইন মিটার ও সাব-মিটারের রিডিং বা হিসাব সম্পর্কিত কোনো তথ্য থাকলে তা বিশ্লেষণ করে সুন্দরভাবে বুঝিয়ে দিন।
৩. কোনো ঝগড়া বা বিভ্রান্তি না হয় এমনভাবে নিরপেক্ষ গাণিতিক ব্যাখ্যা দিন।
৪. বুলেট পয়েন্ট ও প্রয়োজনীয় সংখ্যা ব্যবহার করুন।
`;

    let contextPrompt = `গ্রাহকের প্রশ্ন: "${question || "আমাদের সাব-মিটারে বিল কীভাবে ভাগ করা সঠিক এবং নিরপেক্ষ হবে?"}"\n`;

    if (billData) {
      contextPrompt += `
বর্তমান বিলের তথ্য:
- মেইন মিটারের মোট ইউনিট: ${billData.mainUnits} Unit
- মেইন মিটারের মোট বিল: ৳${billData.mainTotalAmount}
- সাব মিটারগুলোর মোট ব্যবহৃত ইউনিট: ${billData.sumSubUnits} Unit
- কমন লাইন লস / না-মেলা ইউনিট: ${billData.commonUnits} Unit
- প্রতি ইউনিট কার্যকর গড় রেট: ৳${billData.effectiveRatePerUnit}
`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: contextPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ answer: response.text });
  } catch (err: any) {
    console.error("Gemini Advisor Error:", err);
    res.status(500).json({
      error: "AI সহকারীর সাথে যোগাযোগ করতে সমস্যা হয়েছে। অনুগ্রহ করে পরে চেষ্টা করুন।",
      details: err.message,
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
