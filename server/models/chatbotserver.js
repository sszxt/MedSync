import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Use a more standard key name for the API key on the server
const geminiApiKey = process.env.GEMINI_API_KEY; // Make sure your .env has GEMINI_API_KEY
if (!geminiApiKey) {
  console.error("GEMINI_API_KEY is not set in the environment variables.");
  process.exit(1);
}

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(geminiApiKey);

app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required." });
    }
    
    console.log("Received prompt:", prompt);

    // Initialize the generative model (ensure that "gemini-pro" is the correct model identifier)
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(prompt);
    console.log("Generation result:", result);

    // Determine if result.response.text is a function or property
    let responseText;
    if (result && result.response) {
      if (typeof result.response.text === "function") {
        responseText = result.response.text();
      } else {
        responseText = result.response.text;
      }
    } else {
      responseText = "No response received.";
    }

    res.json({ response: responseText });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
