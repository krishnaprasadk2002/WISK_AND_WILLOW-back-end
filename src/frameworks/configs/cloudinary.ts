import { v2 as cloudinary } from 'cloudinary';

// Helper function to upload image to Cloudinary
async function uploadCloudinary(imgBase64: string) {
    // Configuration
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET
    });

    try {
        const result = await cloudinary.uploader.upload(imgBase64, {
            folder: 'Wisk_And_Willow',
        });
        return result.secure_url;
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw new Error('Failed to upload image');
    }
}


export default uploadCloudinary

