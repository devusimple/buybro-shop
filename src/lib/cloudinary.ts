import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'da6vqxlwo',
  api_key: process.env.CLOUDINARY_API_KEY || '911176476158136',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'vNIaPp6ZYiIPSqQe7YUE9g_F_wc',
  secure: true,
});

export { cloudinary };

// Cloudinary folder for product images
export const CLOUDINARY_FOLDER = 'ecommerce';

// Preset for unsigned uploads (for client-side)
export const UPLOAD_PRESET = 'ecommerce_unsigned';

// Image transformation presets
export const imageTransformations = {
  // Thumbnail for product cards
  thumbnail: {
    width: 300,
    height: 300,
    crop: 'fill' as const,
    quality: 'auto' as const,
    format: 'auto' as const,
  },
  // Medium size for product details
  medium: {
    width: 600,
    height: 600,
    crop: 'fill' as const,
    quality: 'auto' as const,
    format: 'auto' as const,
  },
  // Large for hero images
  large: {
    width: 1200,
    height: 1200,
    crop: 'fill' as const,
    quality: 'auto' as const,
    format: 'auto' as const,
  },
  // Banner/hero size
  banner: {
    width: 1920,
    height: 600,
    crop: 'fill' as const,
    quality: 'auto' as const,
    format: 'auto' as const,
  },
  // Gallery thumbnail
  galleryThumb: {
    width: 100,
    height: 100,
    crop: 'fill' as const,
    quality: 'auto' as const,
    format: 'auto' as const,
  },
};

// Upload image from base64 or URL
export async function uploadImage(
  file: string | Buffer,
  options: {
    folder?: string;
    public_id?: string;
    resource_type?: 'image' | 'video' | 'raw' | 'auto';
  } = {}
): Promise<UploadApiResponse> {
  const result = await cloudinary.uploader.upload(file as string, {
    folder: options.folder || CLOUDINARY_FOLDER,
    public_id: options.public_id,
    resource_type: options.resource_type || 'auto',
    overwrite: true,
    transformation: { quality: 'auto', fetch_format: 'auto' },
  });
  return result;
}

// Upload multiple images
export async function uploadMultipleImages(
  files: (string | Buffer)[],
  options: {
    folder?: string;
    resource_type?: 'image' | 'video' | 'raw' | 'auto';
  } = {}
): Promise<UploadApiResponse[]> {
  const uploads = files.map(file => uploadImage(file, options));
  return Promise.all(uploads);
}

// Delete image by public ID
export async function deleteImage(publicId: string): Promise<{ result: string }> {
  return cloudinary.uploader.destroy(publicId);
}

// Delete multiple images
export async function deleteMultipleImages(publicIds: string[]): Promise<{ deleted: Record<string, string> }> {
  return cloudinary.api.delete_resources(publicIds);
}

// Get optimized URL for an image
export function getOptimizedUrl(
  publicId: string,
  transformation: keyof typeof imageTransformations = 'medium'
): string {
  return cloudinary.url(publicId, {
    ...imageTransformations[transformation],
    secure: true,
  });
}

// Get URL with custom transformations
export function getCustomUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    crop?: 'fill' | 'fit' | 'scale' | 'pad' | 'thumb';
    quality?: string | number;
    format?: string;
  } = {}
): string {
  return cloudinary.url(publicId, {
    width: options.width,
    height: options.height,
    crop: options.crop || 'fill',
    quality: options.quality || 'auto',
    format: options.format || 'auto',
    secure: true,
  });
}

// Extract public ID from Cloudinary URL
export function extractPublicId(url: string): string | null {
  try {
    const urlParts = url.split('/');
    const uploadIndex = urlParts.findIndex(part => part === 'upload');
    if (uploadIndex === -1) return null;
    
    // Get parts after 'upload' (skip version if present)
    let pathParts = urlParts.slice(uploadIndex + 1);
    if (pathParts[0]?.startsWith('v')) {
      pathParts = pathParts.slice(1);
    }
    
    // Remove file extension
    const fullPath = pathParts.join('/');
    const lastDotIndex = fullPath.lastIndexOf('.');
    return lastDotIndex !== -1 ? fullPath.substring(0, lastDotIndex) : fullPath;
  } catch {
    return null;
  }
}

// Generate signed upload parameters for client-side upload
export function generateUploadSignature(params: Record<string, unknown>): string {
  return cloudinary.utils.api_sign_request(
    params,
    process.env.CLOUDINARY_API_SECRET || ''
  );
}

// Get cloud name for client-side
export function getCloudName(): string {
  return process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'da6vqxlwo';
}

// Create upload preset signature for direct uploads
export function createUploadSignature(timestamp: number): { signature: string; apiKey: string; timestamp: number } {
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder: CLOUDINARY_FOLDER },
    process.env.CLOUDINARY_API_SECRET || ''
  );
  
  return {
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    timestamp,
  };
}
