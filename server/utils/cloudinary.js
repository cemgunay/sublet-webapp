const { env } = require('process');

const cloudinary = require('cloudinary').v2;

// Configuration 
cloudinary.config({
  cloud_name: env.cloud_name,
  api_key: env.api_key,
  api_secret: env.api_secret,
});

module.exports = cloudinary;