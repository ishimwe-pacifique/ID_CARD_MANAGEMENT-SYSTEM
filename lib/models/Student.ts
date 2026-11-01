import mongoose, { Schema, Document, Model } from 'mongoose';
import { Student as StudentType } from '@/app/types';

export interface IStudentDocument extends Omit<StudentType, 'id'>, Document {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema = new Schema<IStudentDocument>(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    className: { type: String, required: true, trim: true },
    gender: { type: String, enum: ['Male', 'Female'], required: true },
    contact: { type: String, default: '' },
    residence: { type: String, default: '' },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    initials: { type: String, default: '' },
    photoUrl: { type: String, default: '' },
    fatherName: { type: String, default: '' },
    motherName: { type: String, default: '' },
    dob: { type: String, default: '' },
    bloodGroup: { type: String, default: '' },
    emergencyContact: { type: String, default: '' },
    issueDate: { type: String, default: '' },
    expiryDate: { type: String, default: '' },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_, ret) => {
        // delete _id and __v for clean client responses
        delete (ret as Record<string, unknown>)._id;
        delete (ret as Record<string, unknown>).__v;
        return ret;
      },
    },
  }
);

// Prevent mongoose overwrite error in Next.js HMR
export const StudentModel: Model<IStudentDocument> =
  mongoose.models.Student || mongoose.model<IStudentDocument>('Student', StudentSchema);

export default StudentModel;
