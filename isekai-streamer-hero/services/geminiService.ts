
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

// Memory Cache (RAM) - 1st layer for speed
const memoryCache: Record<string, string> = {};

// IndexedDB Helper
const DB_NAME = 'IsekaiStreamerDB';
const STORE_NAME = 'imageCache';
const DB_VERSION = 1;

const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
};

const getFromDB = async (key: string): Promise<string | null> => {
  try {
    const db = await initDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => resolve(null);
    });
  } catch (e) {
    return null;
  }
};

const saveToDB = async (key: string, data: string): Promise<void> => {
  try {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(data, key);
  } catch (e) {
    console.warn('Failed to save image to DB', e);
  }
};

export const clearImageCache = async (): Promise<void> => {
    try {
        const db = await initDB();
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.clear();
        // Clear memory cache as well
        for (const key in memoryCache) delete memoryCache[key];
        console.log("Image cache cleared.");
    } catch (e) {
        console.error("Failed to clear image cache", e);
    }
};

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
  const cacheKey = `monster_${monsterName}_${isBoss}_tier${tier}`;
  
  // 1. Check Memory
  if (memoryCache[cacheKey]) return memoryCache[cacheKey];

  // 2. Check DB
  const dbImage = await getFromDB(cacheKey);
  if (dbImage) {
      memoryCache[cacheKey] = dbImage;
      return dbImage;
  }

  // 3. Generate
  try {
    const prompt = `Pixel art, simple sprite, monster: ${monsterName}. NO BACKGROUND, NO TEXT, NO LETTERS, NO WORDS. Solid bright green background #00FF00. Retro game style.`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio: "1:1" } }
    });
    const rawImage = extractImageFromResponse(response);
    if (rawImage) {
        const processed = await removeBackground(rawImage);
        memoryCache[cacheKey] = processed;
        await saveToDB(cacheKey, processed); // Save persistent
        return processed;
    }
    return null;
  } catch (error) { return null; }
};

export const generateAllyImage = async (allyName: string): Promise<string | null> => {
  const cacheKey = `ally_${allyName}`;
  
  if (memoryCache[cacheKey]) return memoryCache[cacheKey];
  
  const dbImage = await getFromDB(cacheKey);
  if (dbImage) {
      memoryCache[cacheKey] = dbImage;
      return dbImage;
  }

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
        memoryCache[cacheKey] = processed;
        await saveToDB(cacheKey, processed);
        return processed;
    }
    return null;
  } catch (error) { return null; }
};

export const generateStageBackground = async (theme: string): Promise<string | null> => {
  const cacheKey = `bg_${theme}`;

  if (memoryCache[cacheKey]) return memoryCache[cacheKey];

  const dbImage = await getFromDB(cacheKey);
  if (dbImage) {
      memoryCache[cacheKey] = dbImage;
      return dbImage;
  }

  try {
    const prompt = `Anime fantasy landscape: ${theme}. 16:9 aspect ratio. NO TEXT, NO CHARACTERS. High contrast.`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
        config: { imageConfig: { aspectRatio: "16:9" } }
    });
    const img = extractImageFromResponse(response);
    if (img) {
        memoryCache[cacheKey] = img;
        await saveToDB(cacheKey, img);
        return img;
    }
    return img;
  } catch (error) { return null; }
}
