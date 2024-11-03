import Post from "../models/Posts.js";
import * as dotenv from "dotenv";
import { createError } from "../error.js";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  timeout: 120000, // 2 minutes
});

// Get all posts
export const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({});
    return res.status(200).json({ success: true, data: posts });
  } catch (error) {
    return next(
      createError(
        error.status,
        error?.response?.data?.error.message || error.message
      )
    );
  }
};

// Create new post
export const createPost = async (req, res, next) => {
  try {
    console.log('📝 Starting post creation process...');
    const { name, prompt, photo } = req.body;

    // Validate input
    if (!photo) {
      return next(createError(400, "Image data is required"));
    }

    console.log('☁️ Uploading to Cloudinary...');
    const photoUrl = await cloudinary.uploader.upload(photo, {
      timeout: 120000,
      resource_type: 'auto',
      quality: 'auto:low',
      fetch_format: 'auto',
      flags: 'lossy',
      transformation: [
        { width: 1024, height: 1024, crop: 'limit' }
      ]
    });

    console.log('💾 Creating database entry...');
    const newPost = await Post.create({
      name,
      prompt,
      photo: photoUrl.secure_url,
    });

    console.log('✅ Post created successfully!');
    return res.status(201).json({ 
      success: true, 
      data: newPost 
    });
  } catch (error) {
    console.error('❌ Error in createPost:', error);
    if (error.http_code === 499) {
      return next(createError(408, "Upload timed out. Please try again."));
    }
    return next(createError(
      error.http_code || 500,
      error.message || "Failed to create post"
    ));
  }
};

// Add this function to test Cloudinary connection
export const testCloudinary = async (req, res, next) => {
  try {
    console.log('🌤️ Testing Cloudinary configuration...');
    console.log('Config:', {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      // Don't log the full secret
      api_secret: process.env.CLOUDINARY_API_SECRET ? 'present' : 'missing'
    });

    // Test the connection by trying to get account details
    const accountInfo = await cloudinary.api.usage();
    console.log('✅ Cloudinary connected successfully!');
    console.log('Account Info:', accountInfo);

    return res.status(200).json({
      success: true,
      message: 'Cloudinary connection successful',
      accountInfo
    });
  } catch (error) {
    console.error('❌ Cloudinary Error:', error);
    return next(createError(
      500,
      `Cloudinary connection failed: ${error.message}`
    ));
  }
};
