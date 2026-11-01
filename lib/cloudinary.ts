import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with environment credentials
// Cloudinary SDK automatically parses process.env.CLOUDINARY_URL if present,
// but we explicitly pass fallback options for complete reliability in Next.js runtime.

const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'dprqevbvs';
const apiKey = process.env.CLOUDINARY_API_KEY || '751831559951954';
const apiSecret = process.env.CLOUDINARY_API_SECRET || 'rISmZAt40f1ZiwExymliYT7POgk';

if (process.env.CLOUDINARY_URL) {
  cloudinary.config({
    secure: true,
  });
} else {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

export interface CloudinaryUploadResult {
  url: string;
  secure_url: string;
  public_id: string;
  format?: string;
  width?: number;
  height?: number;
  bytes?: number;
}

/**
 * Upload a Base64 string, Data URI, or Remote URL to Cloudinary
 */
export async function uploadToCloudinary(
  fileData: string,
  options: {
    folder?: string;
    publicId?: string;
    transformation?: Record<string, unknown>[];
  } = {}
): Promise<CloudinaryUploadResult> {
  const { folder = 'student_id_cards/photos', publicId, transformation } = options;

  const result = await cloudinary.uploader.upload(fileData, {
    folder,
    public_id: publicId,
    resource_type: 'image',
    overwrite: true,
    transformation: transformation || [
      { quality: 'auto:good' },
      { fetch_format: 'auto' },
    ],
  });

  return {
    url: result.url,
    secure_url: result.secure_url,
    public_id: result.public_id,
    format: result.format,
    width: result.width,
    height: result.height,
    bytes: result.bytes,
  };
}

/**
 * Upload a Buffer (e.g. from multipart form upload) to Cloudinary via upload_stream
 */
export async function uploadBufferToCloudinary(
  buffer: Buffer,
  options: {
    folder?: string;
    publicId?: string;
    filename?: string;
  } = {}
): Promise<CloudinaryUploadResult> {
  const { folder = 'student_id_cards/photos', publicId } = options;

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: 'image',
        overwrite: true,
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error('Cloudinary upload stream returned empty result'));
        } else {
          resolve({
            url: result.url,
            secure_url: result.secure_url,
            public_id: result.public_id,
            format: result.format,
            width: result.width,
            height: result.height,
            bytes: result.bytes,
          });
        }
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Verify Cloudinary connection and configuration
 */
export async function verifyCloudinaryConnection() {
  try {
    const pingResult = await cloudinary.api.ping();
    return {
      connected: pingResult.status === 'ok',
      cloudName: cloudinary.config().cloud_name,
      status: pingResult.status,
    };
  } catch (error: unknown) {
    return {
      connected: false,
      cloudName: cloudinary.config().cloud_name,
      error: error instanceof Error ? error.message : 'Unknown Cloudinary error',
    };
  }
}

export { cloudinary };
export default cloudinary;
