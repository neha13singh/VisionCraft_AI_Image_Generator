import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://visioncraft-ai-image-generator-server.onrender.com/api',
  timeout: 120000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor
API.interceptors.request.use(
  config => {
    console.log('🚀 Starting request:', config.url);
    return config;
  },
  error => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
API.interceptors.response.use(
  response => {
    console.log('✅ API Response:', response.config.url, response.data);
    return response;
  },
  error => {
    console.error('❌ API Error:', error.config.url, error.response?.data);
    return Promise.reject(error);
  }
);

export const GetPosts = async () => await API.get("/post/");
export const CreatePost = async (data) => await API.post("/post/", data);
export const GenerateImageFromPrompt = async (data) => 
  await API.post("/generateImage/", data);
