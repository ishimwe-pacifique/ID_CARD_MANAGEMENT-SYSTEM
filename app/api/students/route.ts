import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import StudentModel from '@/lib/models/Student';
import { SEED_STUDENTS } from '@/app/utils';
import { Student } from '@/app/types';

export async function GET() {
  try {
    await connectToDatabase();

    const count = await StudentModel.countDocuments();
    if (count === 0) {
      // Auto seed initial data to MongoDB Atlas on first load
      console.log('Seeding initial students to MongoDB Atlas...');
      await StudentModel.insertMany(SEED_STUDENTS);
    }

    const students = await StudentModel.find({}).sort({ createdAt: -1 }).lean();

    // Map _id to clean object
    const sanitizedStudents = students.map((s) => ({
      id: s.id,
      name: s.name,
      className: s.className,
      gender: s.gender,
      contact: s.contact || '',
      residence: s.residence || '',
      status: s.status || 'Active',
      initials: s.initials || '',
      photoUrl: s.photoUrl || '',
      fatherName: s.fatherName || '',
      motherName: s.motherName || '',
      dob: s.dob || '',
      bloodGroup: s.bloodGroup || '',
      emergencyContact: s.emergencyContact || '',
      issueDate: s.issueDate || '',
      expiryDate: s.expiryDate || '',
    }));

    return NextResponse.json({
      success: true,
      students: sanitizedStudents,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch students';
    console.error('Error fetching students from MongoDB:', error);
    return NextResponse.json(
      {
        success: false,
        error: message,
        fallback: SEED_STUDENTS,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    // Handle bulk import or array of students
    if (Array.isArray(body)) {
      const operations = body.map((student: Student) => ({
        updateOne: {
          filter: { id: student.id },
          update: { $set: student },
          upsert: true,
        },
      }));

      await StudentModel.bulkWrite(operations);

      return NextResponse.json({
        success: true,
        message: `Successfully synced ${body.length} students into MongoDB.`,
      });
    }

    // Handle single student create/upsert
    const studentData: Student = body;
    if (!studentData.id || !studentData.name) {
      return NextResponse.json(
        { success: false, error: 'Student ID and name are required.' },
        { status: 400 }
      );
    }

    const student = await StudentModel.findOneAndUpdate(
      { id: studentData.id },
      { $set: studentData },
      { upsert: true, new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      student,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to save student';
    console.error('Error saving student to MongoDB:', error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    if (body.ids && Array.isArray(body.ids)) {
      const result = await StudentModel.deleteMany({ id: { $in: body.ids } });
      return NextResponse.json({
        success: true,
        deletedCount: result.deletedCount,
      });
    }

    if (body.id) {
      await StudentModel.deleteOne({ id: body.id });
      return NextResponse.json({
        success: true,
        message: `Deleted student ${body.id}`,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Must provide id or ids array' },
      { status: 400 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete student';
    console.error('Error deleting student from MongoDB:', error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
