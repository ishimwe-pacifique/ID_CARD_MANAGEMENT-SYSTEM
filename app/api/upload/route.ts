import { NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary, uploadBufferToCloudinary, verifyCloudinaryConnection } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const status = await verifyCloudinaryConnection();
    return NextResponse.json({
      success: status.connected,
      service: 'Cloudinary',
      cloudName: status.cloudName,
      connected: status.connected,
      status: status.status,
      error: status.error,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Cloudinary check failed';
    return NextResponse.json(
      {
        success: false,
        service: 'Cloudinary',
        connected: false,
        error: message,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';

    // 1. Handle multipart/form-data
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      const folder = (formData.get('folder') as string) || 'student_id_cards/photos';
      const studentId = formData.get('studentId') as string | null;

      if (!file) {
        return NextResponse.json(
          { success: false, error: 'No image file provided in request.' },
          { status: 400 }
        );
      }

      // Check mime type
      if (!file.type.startsWith('image/')) {
        return NextResponse.json(
          { success: false, error: 'Uploaded file must be a valid image (JPEG, PNG, WEBP, etc.).' },
          { status: 400 }
        );
      }

      // Maximum 10MB
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, error: 'Image size exceeds maximum limit of 10MB.' },
          { status: 400 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Clean public id if studentId is provided
      const safeStudentId = studentId
        ? studentId.replace(/[^a-zA-Z0-9_-]/g, '_')
        : undefined;

      const uploadResult = await uploadBufferToCloudinary(buffer, {
        folder,
        publicId: safeStudentId ? `${safeStudentId}_${Date.now()}` : undefined,
      });

      return NextResponse.json({
        success: true,
        url: uploadResult.secure_url,
        secure_url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
        format: uploadResult.format,
        width: uploadResult.width,
        height: uploadResult.height,
        bytes: uploadResult.bytes,
      });
    }

    // 2. Handle JSON payload { image: "data:image/...", folder?: "...", studentId?: "..." }
    const body = await req.json();
    const { image, folder = 'student_id_cards/photos', studentId } = body;

    if (!image) {
      return NextResponse.json(
        { success: false, error: 'No image data or URL provided.' },
        { status: 400 }
      );
    }

    const safeStudentId = studentId
      ? studentId.replace(/[^a-zA-Z0-9_-]/g, '_')
      : undefined;

    const uploadResult = await uploadToCloudinary(image, {
      folder,
      publicId: safeStudentId ? `${safeStudentId}_${Date.now()}` : undefined,
    });

    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
      secure_url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      format: uploadResult.format,
      width: uploadResult.width,
      height: uploadResult.height,
      bytes: uploadResult.bytes,
    });
  } catch (error: unknown) {
    console.error('Cloudinary API upload error:', error);
    const message = error instanceof Error ? error.message : 'Image upload to Cloudinary failed.';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
