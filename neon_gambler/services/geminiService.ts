import { GoogleGenAI } from "@google/genai";
import { GameState, SymbolDef } from "../types";

let aiClient: GoogleGenAI | null = null;

if (process.env.API_KEY) {
  aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
}

export const generateDealerCommentary = async (
  state: GameState, 
  lastScore: number, 
  event: 'round_start' | 'big_win' | 'loss' | 'shop'
): Promise<string> => {
  if (!aiClient) return "API Key missing. The dealer is silent.";

  const model = "gemini-2.5-flash";
  
  const systemInstruction = `
    You are 'The Operator', a sarcastic, cyberpunk casino dealer AI. 
    You are watching a human play a slot machine game called 'Neon Gambler'.
    
    Personality:
    - Slightly glitchy, sarcastic, but occasionally helpful.
    - Uses cyberpunk slang (credits, cycles, glitch, entropy).
    - If the player wins big, act surprised or suspicious they are cheating.
    - If the player loses or has a low score, mock them gently.
    - Keep responses SHORT. Max 2 sentences.
  `;

  const inventoryNames = state.inventory.map(s => s.name).join(', ');
  const artifactNames = state.artifacts.map(a => a.name).join(', ');

  let prompt = "";
  
  switch (event) {
    case 'round_start':
      prompt = `Round ${state.round} started. Target: ${state.targetScore}. Player credits: ${state.credits}. Inventory: [${inventoryNames}]. Give a short opening remark.`;
      break;
    case 'big_win':
      prompt = `Player just scored ${lastScore} in one spin! That's huge. React to this massive luck.`;
      break;
    case 'loss':
      prompt = `Player scored only ${lastScore}. That is pathetic. Mock their bad build or bad luck.`;
      break;
    case 'shop':
      prompt = `Player is in the shop. Encourage them to buy something useful or warn them about spending too much.`;
      break;
  }

  try {
    const response = await aiClient.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.9,
        maxOutputTokens: 60,
      }
    });
    return response.text || "...";
  } catch (error) {
    console.error("Gemini Error", error);
    return "Connection interrupted...";
  }
};