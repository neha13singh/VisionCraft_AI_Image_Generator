import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api/",
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

// Add response interceptor
API.interceptors.response.use(
  response => {
    console.log('✅ Request successful:', response.config.url);
    return response;
  },
  error => {
    if (error.code === 'ECONNABORTED') {
      console.error('⏰ Request timeout');
      return Promise.reject({
        response: {
          data: { message: 'Request took too long. Please try again.' }
        }
      });
    }
    console.error('❌ Request failed:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const GetPosts = async () => await API.get("/post/");
export const CreatePost = async (data) => await API.post("/post/", data);
export const GenerateImageFromPrompt = async (data) => 
  await API.post("/generateImage/", data);
