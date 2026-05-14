const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function testCloudinary() {
  console.log('--- Cloudinary Diagnostic ---');
  console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
  console.log('API Key:', process.env.CLOUDINARY_API_KEY ? 'Present' : 'MISSING');
  console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? 'Present' : 'MISSING');

  try {
    console.log('\n1. Testing API Ping...');
    const pingResult = await cloudinary.api.ping();
    console.log('✅ Ping Successful:', pingResult);

    console.log('\n2. Testing Image Upload (Small Data URI)...');
    // A tiny 1x1 transparent pixel
    const result = await cloudinary.uploader.upload('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', {
      folder: 'test_folder'
    });
    console.log('✅ Upload Successful!');
    console.log('Public ID:', result.public_id);
    console.log('Secure URL:', result.secure_url);

    console.log('\n3. Cleaning up test image...');
    await cloudinary.uploader.destroy(result.public_id);
    console.log('✅ Cleanup Successful!');

    console.log('\n--- DIAGNOSIS: Cloudinary is WORKING correctly ---');
  } catch (error) {
    console.error('\n❌ DIAGNOSIS: Cloudinary is NOT working');
    console.error('Error Details:', JSON.stringify(error, null, 2));
    if (error.message) console.error('Message:', error.message);
  }
}

testCloudinary();
