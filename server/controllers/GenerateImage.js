import * as dotenv from "dotenv";
import { createError } from "../error.js";
import { OpenAI } from 'openai';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 120000, // Increase timeout to 120 seconds
  maxRetries: 3,
  retryDelay: 1000, // Wait 1 second between retries
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
// import * as dotenv from "dotenv";
// import { createError } from "../error.js";
// import { Configuration, OpenAIApi } from "openai";

// dotenv.config();

// // Log environment check
// console.log('OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY);

// // Setup open ai api key
// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const openai = new OpenAIApi(configuration);
// console.log('OpenAI configuration initialized');

// export const generateImage = async (req, res, next) => {
//   console.log('Generate Image API called');
//   console.log('Request body:', req.body);

//   try {
//     const { prompt } = req.body;
    
//     if (!prompt) {
//       console.error('No prompt provided');
//       return next(createError(400, 'Prompt is required'));
//     }

//     console.log('Sending request to OpenAI with prompt:', prompt);

//     const response = await openai.createImage({
//       prompt,
//       n: 1,
//       size: "1024x1024",
//       response_format: "b64_json",
//     });

//     console.log('OpenAI Response received');
//     console.log('Response status:', response.status);
//     console.log('Response data structure:', Object.keys(response.data));

//     const generatedImage = response.data.data[0].b64_json;
//     console.log('Image generated successfully, b64_json length:', generatedImage.length);

//     return res.status(200).json({ 
//       success: true,
//       photo: generatedImage 
//     });

//   } catch (error) {
//     console.error('Error in generateImage:');
//     console.error('Error status:', error.status);
//     console.error('Error message:', error.message);
//     console.error('Full error object:', error);
//     console.error('Response error data:', error?.response?.data);

//     next(
//       createError(
//         error.status || 500,
//         error?.response?.data?.error?.message || error?.message || 'Internal Server Error'
//       )
//     );
//   }
// };