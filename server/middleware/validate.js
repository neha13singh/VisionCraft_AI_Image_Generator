export const validatePost = (req, res, next) => {
  console.log('🔍 Validating post data...');
  const { name, prompt, photo } = req.body;
  
  if (!name || !prompt || !photo) {
    console.log('❌ Validation failed: Missing required fields');
    return res.status(400).json({
      success: false,
      message: "Name, prompt and photo are required"
    });
  }
  
  console.log('✅ Validation passed');
  next();
}; 