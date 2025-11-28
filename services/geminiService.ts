import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { Transaction, Category, FinancialSummary } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const MODEL_FAST = 'gemini-2.5-flash';

export const categorizeTransaction = async (description: string): Promise<Category> => {
  try {
    const prompt = `
      You are TraKit's financial categorization engine for Indian students and gig-workers.
      Categorize the following transaction description into exactly one of these categories:
      Food, Travel, Shopping, Bills, Essentials, Entertainment, Health, Other.

      Description: "${description}"

      Rules:
      - Return ONLY the category name as a plain string. Do not add punctuation.
      - 'Zomato', 'Swiggy', 'Blinkit' (food), 'Chai', 'Canteen', 'Mess', 'Tiffin', 'Burger' -> 'Food'
      - 'Uber', 'Ola', 'Rapido', 'Auto', 'Bus', 'Metro', 'Petrol', 'Fuel' -> 'Travel'
      - 'Recharge', 'Jio', 'Airtel', 'Wifi', 'Electricity', 'Rent' -> 'Bills'
      - 'Movies', 'Netflix', 'Spotify', 'Concert', 'Game' -> 'Entertainment'
      - 'Groceries', 'Vegetables', 'Milk', 'Zepto', 'Instamart', 'Medicine' -> 'Essentials'
      - 'Clothes', 'Amazon', 'Flipkart', 'Myntra', 'Shoes' -> 'Shopping'
      - 'Doctor', 'Pharmacy', 'Test', 'Checkup' -> 'Health'

      Response:
    `;

    const response = await ai.models.generateContent({
      model: MODEL_FAST,
      contents: prompt,
    });

    const text = response.text?.trim();
    
    // Map response to enum
    const categoryMap: Record<string, Category> = {
      'Food': Category.FOOD,
      'Travel': Category.TRAVEL,
      'Shopping': Category.SHOPPING,
      'Bills': Category.BILLS,
      'Essentials': Category.ESSENTIALS,
      'Entertainment': Category.ENTERTAINMENT,
      'Health': Category.HEALTH,
      'Other': Category.OTHER,
      'Income': Category.INCOME
    };

    // Direct match
    if (text && categoryMap[text]) {
        return categoryMap[text];
    }

    // Fuzzy match
    for (const key in categoryMap) {
      if (text?.toLowerCase().includes(key.toLowerCase())) {
        return categoryMap[key];
      }
    }
    return Category.OTHER;

  } catch (error) {
    console.error("Error categorizing transaction:", error);
    return Category.OTHER;
  }
};

export const getFinancialAdvice = async (
  chatSession: Chat | null,
  userMessage: string,
  transactions: Transaction[]
): Promise<{ text: string, newChat: Chat }> => {
  
  // 1. Prepare Data Context
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Sort by date desc
  const sortedTx = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const thisMonthTx = sortedTx.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const todayTx = thisMonthTx.filter(t => {
    const d = new Date(t.date);
    return d.getDate() === now.getDate();
  });

  const totalIncome = thisMonthTx.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = thisMonthTx.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const todayExpense = todayTx.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysRemaining = daysInMonth - now.getDate();
  const dailyAverage = now.getDate() > 0 ? (totalExpense / now.getDate()).toFixed(2) : 0;
  
  // Safe to spend estimate (assuming we want to break even or save a bit)
  // If balance is negative, safe spend is 0.
  const safeToSpend = daysRemaining > 0 ? (Math.max(0, balance) / daysRemaining).toFixed(0) : 0;

  // Recent transactions text
  const recentTxText = sortedTx.slice(0, 30).map(t => 
    `- ${t.date}: ${t.description} (${t.category}) | ${t.type === 'income' ? '+' : '-'}₹${t.amount}`
  ).join('\n');

  // 2. Define Persona & Rules
  const systemInstruction = `
    You are **TraKit AI**, a smart financial assistant built for **Indian students, gig workers, and beginners**.
    Your goal is to help users manage money with simple, friendly, and actionable advice.

    **Core Persona:**
    - **Tone:** Friendly, motivating, simple (no jargon).
    - **Context:** User is likely in India (uses ₹, refers to Zomato, Uber, Chai, etc.).
    - **Role:** Financial buddy, not a strict accountant.

    **Response Rules:**

    **SCENARIO 1: User enters an expense (e.g., "Uber 230", "Lunch 150", "I spent 500 on clothes")**
    If the user text implies adding or tracking an expense, ignore standard paragraph format and respond with exactly these 4 lines:
    1. **Category**: [Category Name]
    2. **Today’s Total**: ₹[Add this new amount to 'Today's Spending So Far' provided in context]
    3. **Impact**: [One short sentence on how this affects monthly budget]
    4. **Tip**: [A simple savings tip, ONLY if necessary/helpful]

    **SCENARIO 2: General Financial Questions (e.g., "Analyze my spending", "How am I doing?")**
    Use this exact structure with headers:
    
    🧾 **Summary**
    [1 sentence summary of the situation]

    📊 **Insights**
    [Bullet point about a trend, e.g., "Your food spending is high this week."]

    💡 **Advice**
    [Actionable, specific tip, e.g., "Try cooking dinner to save ₹500."]

    **SCENARIO 3: "How much can I spend today?"**
    1. Analyze the 'Recommended Safe Daily Spend' provided in context.
    2. Compare with 'Today's Spending So Far'.
    3. Give a clear, simple recommendation: "You can safely spend ₹X more today to stay on track."

    **General constraints:**
    - Keep answers short.
    - Never give investment or legal advice.
    - If specific data is missing, make reasonable, safe estimates based on the context provided.
  `;

  // 3. Create or Resume Chat
  let currentChat = chatSession;
  if (!currentChat) {
    currentChat = ai.chats.create({
      model: MODEL_FAST,
      config: {
        systemInstruction: systemInstruction,
      },
    });
  }

  // 4. Inject Dynamic Context into the prompt
  const contextPrompt = `
    [Live Financial Context - Date: ${now.toLocaleDateString()}]
    - Monthly Income: ₹${totalIncome}
    - Monthly Expenses: ₹${totalExpense}
    - Current Balance: ₹${balance}
    - Today's Spending So Far: ₹${todayExpense}
    - Days Remaining in Month: ${daysRemaining}
    - Average Daily Spend: ₹${dailyAverage}
    - Recommended Safe Daily Spend: ₹${safeToSpend}
    
    [Recent Transactions]
    ${recentTxText}
    
    User Query: "${userMessage}"
    
    (Respond as TraKit AI based on the system instructions.)
  `;

  try {
    const response = await currentChat.sendMessage({ message: contextPrompt });
    return { text: response.text || "I'm having trouble analyzing that right now.", newChat: currentChat };
  } catch (error) {
    console.error("Chat error:", error);
    return { text: "Sorry, I couldn't process your request. Please try again.", newChat: currentChat };
  }
};