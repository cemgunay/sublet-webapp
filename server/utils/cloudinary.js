const { env } = require('process');

const cloudinary = require('cloudinary').v2;

// Configuration 
cloudinary.config({
  cloud_name: env.CLOUD_NAME,
  api_key: env.API_KEY,
  api_secret: env.API_SECRET,
});

module.exports = cloudinary;