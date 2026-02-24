import { NextRequest, NextResponse } from 'next/server';
import { cloudinary, uploadImage, deleteImage, extractPublicId } from '@/lib/cloudinary';

// POST /api/upload - Upload an image to Cloudinary
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { file, folder, publicId } = body;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    const result = await uploadImage(file, {
      folder: folder || 'ecommerce',
      public_id: publicId,
    });

    return NextResponse.json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
      },
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}

// DELETE /api/upload - Delete an image from Cloudinary
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { success: false, error: 'No URL provided' },
        { status: 400 }
      );
    }

    const publicId = extractPublicId(url);
    if (!publicId) {
      return NextResponse.json(
        { success: false, error: 'Invalid Cloudinary URL' },
        { status: 400 }
      );
    }

    await deleteImage(publicId);

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}

// GET /api/upload/sign - Get signed upload parameters
export async function GET(request: NextRequest) {
  try {
    const timestamp = Math.round(Date.now() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder: 'ecommerce' },
      process.env.CLOUDINARY_API_SECRET || ''
    );

    return NextResponse.json({
      success: true,
      data: {
        signature,
        timestamp,
        apiKey: process.env.CLOUDINARY_API_KEY,
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      },
    });
  } catch (error) {
    console.error('Error generating signature:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate signature' },
      { status: 500 }
    );
  }
}
