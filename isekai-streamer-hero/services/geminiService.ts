import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

const monsterCache: Record<string, string> = {};
const allyCache: Record<string, string> = {};
const backgroundCache: Record<string, string> = {};

const extractImageFromResponse = (response: any): string | null => {
   if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
                return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
            }
        }
    }
    return null;
}

const removeBackground = async (base64Data: string): Promise<string> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) { resolve(base64Data); return; }
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            const bgR = data[0], bgG = data[1], bgB = data[2];
            const threshold = 130;
            for (let i = 0; i < data.length; i += 4) {
                const dist = Math.sqrt(Math.pow(data[i]-bgR,2)+Math.pow(data[i+1]-bgG,2)+Math.pow(data[i+2]-bgB,2));
                if (dist < threshold) data[i + 3] = 0;
            }
            ctx.putImageData(imageData, 0, 0);
            resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = () => resolve(base64Data);
        img.src = base64Data;
    });
};

export const generateMonsterImage = async (monsterName: string, isBoss: boolean, level: number): Promise<string | null> => {
  const tier = Math.floor(level / 5);
  const cacheKey = `${monsterName}_${isBoss}_tier${tier}`;
  if (monsterCache[cacheKey]) return monsterCache[cacheKey];

  try {
    // Strictly forbid text to avoid low quality/broken results
    const prompt = `Pixel art, simple sprite, monster: ${monsterName}. NO BACKGROUND, NO TEXT, NO LETTERS, NO WORDS. Solid bright green background #00FF00. Retro game style.`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio: "1:1" } }
    });
    const rawImage = extractImageFromResponse(response);
    if (rawImage) {
        const processed = await removeBackground(rawImage);
        monsterCache[cacheKey] = processed;
        return processed;
    }
    return null;
  } catch (error) { return null; }
};

export const generateAllyImage = async (allyName: string): Promise<string | null> => {
  if (allyCache[allyName]) return allyCache[allyName];

  try {
    const prompt = `Tiny pixel art, character: ${allyName}. NO TEXT, NO LETTERS. Solid bright green background #00FF00. 16-bit. Standing still.`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio: "1:1" } }
    });
    const rawImage = extractImageFromResponse(response);
    if (rawImage) {
        const processed = await removeBackground(rawImage);
        allyCache[allyName] = processed;
        return processed;
    }
    return null;
  } catch (error) { return null; }
};

export const generateStageBackground = async (theme: string): Promise<string | null> => {
  if (backgroundCache[theme]) return backgroundCache[theme];
  try {
    const prompt = `Anime fantasy landscape: ${theme}. 16:9 aspect ratio. NO TEXT, NO CHARACTERS. High contrast.`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
        config: { imageConfig: { aspectRatio: "16:9" } }
    });
    const img = extractImageFromResponse(response);
    if (img) backgroundCache[theme] = img;
    return img;
  } catch (error) { return null; }
}
