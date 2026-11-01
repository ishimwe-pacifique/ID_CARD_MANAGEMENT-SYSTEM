import mongoose from 'mongoose';

/**
 * Sanitizes MongoDB connection URIs where passwords contain special characters like '@'
 * that were not percent-encoded (e.g. Ishimwe@25517 -> Ishimwe%4025517).
 */
export function sanitizeMongoUri(uri: string): string {
  if (!uri) return '';
  
  // Check if standard or srv scheme
  const schemeMatch = uri.match(/^(mongodb(?:\+srv)?:\/\/)(.*)$/);
  if (!schemeMatch) return uri;

  const prefix = schemeMatch[1];
  const rest = schemeMatch[2];

  // The last '@' separates user:password from host
  const lastAtIndex = rest.lastIndexOf('@');
  if (lastAtIndex === -1) {
    // No auth part
    return uri;
  }

  const userPassPart = rest.slice(0, lastAtIndex);
  const hostAndOptions = rest.slice(lastAtIndex + 1);

  // In userPassPart, find the first ':' separating username and password
  const firstColonIndex = userPassPart.indexOf(':');
  if (firstColonIndex === -1) {
    // No password, just username
    return uri;
  }

  const username = userPassPart.slice(0, firstColonIndex);
  const rawPassword = userPassPart.slice(firstColonIndex + 1);

  // If password contains unencoded '@', encode it
  // Avoid double-encoding if already encoded (%40)
  const decodedPassword = decodeURIComponent(rawPassword);
  const encodedPassword = encodeURIComponent(decodedPassword);

  let finalHostAndOptions = hostAndOptions;
  // Ensure default DB is present if trailing slash or empty
  if (finalHostAndOptions.endsWith('/') || !finalHostAndOptions.includes('/')) {
    const cleanHost = finalHostAndOptions.replace(/\/$/, '');
    finalHostAndOptions = `${cleanHost}/student_id_db?retryWrites=true&w=majority`;
  }

  return `${prefix}${encodeURIComponent(decodeURIComponent(username))}:${encodedPassword}@${finalHostAndOptions}`;
}

const DEFAULT_URI = 'mongodb+srv://pacifique151:Ishimwe%4025517@cluster0.s2hzqcu.mongodb.net/student_id_db?retryWrites=true&w=majority';

const MONGODB_URI = sanitizeMongoUri(process.env.MONGODB_URI || DEFAULT_URI);

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 8000,
      autoIndex: true,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export { MONGODB_URI };
