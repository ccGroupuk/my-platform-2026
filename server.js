const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Gemini Setup
// Sanitize API Key (remove accidental spaces)
const apiKey = (process.env.GOOGLE_API_KEY || "").replace(/\s/g, "");
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Health Check
app.get('/', (req, res) => {
    res.json({ status: "API is running", service: "AI Architect Backend" });
});

// The Missing Webhook Endpoint
app.post('/webhook/architect-v4', async (req, res) => {
    console.log("📥 Received Webhook Request:", JSON.stringify(req.body).substring(0, 200));

    try {
        const userMessage = req.body.message || "Generate a simple app";

        // Construct the prompt (Same as n8n)
        const prompt = `
        You are a senior Software Architect. Given a user's request, generate a small React-based application blueprint. 

        Return EXACTLY a JSON object with this structure:
        {
          "app_name": "Short Name",
          "primary_color": "#hexcolor",
          "core_logic_javascript": "The main React logic/hooks for the feature",
          "database_schema": "PostgreSQL schema sql for this feature"
        }

        Do not include markdown formatting indicators in the JSON itself.
        
        User Request: ${userMessage}
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown code blocks if Gemini adds them
        const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const jsonResponse = JSON.parse(cleanedText);

        console.log("📤 Sending Response:", JSON.stringify(jsonResponse).substring(0, 200));
        res.json(jsonResponse);

    } catch (error) {
        console.error("❌ Error generating content:", error);
        res.status(500).json({ error: "Failed to generate blueprint", details: error.message });
    }
});

// Debug Endpoint: List Available Models
app.get('/debug', async (req, res) => {
    try {
        // Use the same key to test access
        const genAI = new GoogleGenerativeAI(apiKey);
        // Note: genAI.listModels() isn't directly exposed in all versions, 
        // we might access it via the API directly if SDK fails, 
        // but let's try a simple generation test on a known older model 'embedding-001' or just return config.

        // Actually, let's just use the basic fetch to the API to list models to be sure
        const fetch = require('node-fetch'); // Need to ensure node-fetch is available? Native fetch in Node 18!

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        res.json({
            key_preview: apiKey ? apiKey.substring(0, 5) + "..." : "MISSING",
            api_response: data
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${port}`);
});
