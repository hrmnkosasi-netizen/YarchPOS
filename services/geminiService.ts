
import { GoogleGenAI } from "@google/genai";
import { CartItem, Transaction } from '../types';

const MODEL_NAME = 'gemini-3-flash-preview';

/**
 * Generates a friendly receipt message or customer note based on the purchase.
 */
export const generateReceiptMessage = async (items: CartItem[], total: number): Promise<string> => {
  try {
    // Always use process.env.API_KEY directly as per guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
    
    const itemList = items.map(i => `${i.quantity}x ${i.name}`).join(', ');
    const prompt = `
      Buatlah pesan singkat, ramah, dan lucu (maksimal 2 kalimat) untuk struk pembelian pelanggan.
      Pelanggan membeli: ${itemList}.
      Total belanja: Rp${total.toLocaleString('id-ID')}.
      Gunakan Bahasa Indonesia yang gaul tapi sopan.
    `;

    // Always use ai.models.generateContent to query GenAI with both the model name and prompt.
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    // The response.text property directly returns the string output (not a method).
    return response.text || "Terima kasih telah berbelanja!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Terima kasih! Jangan lupa datang kembali.";
  }
};

/**
 * Analyzes sales data to provide business insights.
 */
export const generateBusinessInsight = async (transactions: Transaction[]): Promise<string> => {
  try {
    // Always use process.env.API_KEY directly as per guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

    // Simplify data for the prompt to save tokens
    const recentSales = transactions.slice(-10).map(t => ({
      date: t.date.split('T')[0],
      total: t.total
    }));

    const totalRevenue = transactions.reduce((acc, curr) => acc + curr.total, 0);

    const prompt = `
      Bertindaklah sebagai konsultan bisnis kuliner senior.
      Berikut adalah data penjualan ringkas dari Warung Pintar:
      - Total Pendapatan Tercatat: Rp${totalRevenue.toLocaleString('id-ID')}
      - 10 Transaksi Terakhir (Sample): ${JSON.stringify(recentSales)}

      Berikan 3 poin analisis singkat dan saran strategis untuk meningkatkan penjualan dalam Bahasa Indonesia.
      Format output dengan bullet points. Jangan gunakan markdown bold (**).
    `;

    // Always use ai.models.generateContent to query GenAI with both the model name and prompt.
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    // The response.text property directly returns the string output (not a method).
    return response.text || "Data penjualan belum cukup untuk analisis mendalam.";
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "Maaf, sistem AI sedang sibuk. Coba lagi nanti.";
  }
};
