import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

// High limits for base64 image try-on transfers
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));

// Initialize Gemini with recommended aistudio-build telemetry headers
const apiKey = process.env.GEMINI_API_KEY || "AIzaSyDqOw5uKsm9hRmTOTOcWPlNpkl9dRCAMRU";
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// AI Stylist Endpoint (Ruby)
app.post('/api/stylist', async (req, res) => {
  try {
    const { message, history, catalog } = req.body;

    // Convert catalog to structured string to ground Gemini in inventory
    const catalogSnippet = catalog && catalog.length > 0 
      ? `Our active inventory: \n${catalog.map((p: any) => `- ${p.name} (Category: ${p.category}, Price: ₦${p.price.toLocaleString()}, Sizes: ${p.sizes.join(', ')}). Description: ${p.description}`).join('\n')}`
      : "Our catalog is currently loading.";

    const systemInstruction = `You are Ruby, the premium personal AI stylist for Fab Ruby Clothiers, a super chic Lagos boutique selling women's luxury clothing, matching sets, tops, and blazers. 
Ground your suggestions strictly in the boutique's active catalogue below. If an item matches their request, recommend by its exact name, price in Naira, and a description.
Be warm, stylish, confident, and speak with Lagos flair. Say things like 'Oya let's style you!', 'babe', 'sharp look', 'fine girl'. Keep it professional but fun and fashion-forward.

${catalogSnippet}`;

    const contents = [];
    if (history && history.length > 0) {
      for (const h of history) {
        contents.push({
          role: h.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: h.content }]
        });
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("AI Stylist Error:", error);
    res.status(500).json({ error: error.message || "Failed to prompt AI Stylist." });
  }
});

// AI Virtual Try-on Endpoint (using gemini-2.5-flash-image)
app.post('/api/tryon', async (req, res) => {
  try {
    const { personImage, clothingImage } = req.body;

    if (!personImage || !clothingImage) {
      return res.status(400).json({ error: "Both person image and clothing image are required." });
    }

    // Clean base64 strings (remove data:image/jpeg;base64, prefixes if present)
    const cleanPerson = personImage.replace(/^data:image\/\w+;base64,/, "");
    const cleanClothing = clothingImage.replace(/^data:image\/\w+;base64,/, "");

    const systemInstruction = `You are a fashion virtual try-on AI. You will receive two images: a photo of a person and a photo of a clothing item. Generate a photorealistic image of the person wearing the clothing item. Preserve the person's face, skin tone, body shape, and background as closely as possible. Only change what they are wearing. Do not alter their appearance in any other way. Output only the generated image.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: cleanPerson
          }
        },
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: cleanClothing
          }
        },
        {
          text: "Generate a realistic image of this person wearing this clothing item."
        }
      ],
      config: {
        systemInstruction,
        imageConfig: {
          aspectRatio: "1:1",
        }
      }
    });

    // Locate the output image in candidate parts
    let base64Image = null;
    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      const parts = candidates[0].content?.parts;
      if (parts) {
        for (const part of parts) {
          if (part.inlineData) {
            base64Image = part.inlineData.data;
            break;
          }
        }
      }
    }

    if (base64Image) {
      res.json({ imageUrl: `data:image/png;base64,${base64Image}` });
    } else {
      // Return a descriptive text response if model returns feedback or text instead of image
      console.warn("TryOn Response did not contain inlineData. Text output:", response.text);
      res.status(422).json({ error: "AI could not generate the try-on image. Ensure both photos are well-lit and clear." });
    }
  } catch (error: any) {
    console.error("AI Virtual Try-On Error:", error);
    res.status(500).json({ error: error.message || "Server Error processing AI try-on." });
  }
});

// Vite Setup on Express container
async function initServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Fab Ruby boutique backend serving on http://0.0.0.0:${PORT}`);
  });
}

initServer();
