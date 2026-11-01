import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import StudentModel from '@/lib/models/Student';

export async function GET() {
  try {
    const mongooseInstance = await connectToDatabase();
    const isConnected = mongooseInstance.connection.readyState === 1;
    const host = mongooseInstance.connection.host || 'MongoDB Atlas';
    const dbName = mongooseInstance.connection.name || 'student_id_db';
    
    let studentCount = 0;
    if (isConnected) {
      studentCount = await StudentModel.countDocuments();
    }

    return NextResponse.json({
      ok: true,
      connected: isConnected,
      host,
      database: dbName,
      studentCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error connecting to database';
    return NextResponse.json(
      {
        ok: false,
        connected: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
