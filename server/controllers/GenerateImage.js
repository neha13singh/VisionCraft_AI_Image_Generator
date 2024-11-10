import pkg from 'openai';
const { OpenAI } = pkg;
import * as dotenv from "dotenv";
import { createError } from "../error.js";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 120000,
  maxRetries: 3,
  retryDelay: 1000
});

export const generateImage = async (req, res, next) => {
  try {
    const { prompt } = req.body;
    console.log('📝 Received prompt:', prompt);
    
    if (!prompt) {
      return next(createError(400, "Prompt is required"));
    }

    console.log('🔄 Calling OpenAI API...');
    const response = await openai.images.generate({
      prompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    });
    
    console.log('✅ OpenAI response received');
    
    if (!response.data || !response.data[0]) {
      console.error('❌ No image data in response');
      return next(createError(500, "Failed to generate image"));
    }

    const generatedImage = response.data[0].b64_json;
    console.log('🖼️ Image generated successfully');
    
    res.status(200).json({ photo: generatedImage });
  } catch (error) {
    console.error('OpenAI Error:', error);
    
    if (error.name === 'TimeoutError') {
      return next(createError(408, "Request timed out. Please try again."));
    }
    
    if (error.name === 'APIError') {
      return next(createError(400, error.message));
    }

    next(createError(500, "Failed to generate image"));
  }
};
