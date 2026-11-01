import mongoose, { Schema, Document, Model } from 'mongoose';
import { SchoolSettings as SchoolSettingsType } from '@/app/types';

export interface ISchoolSettingsDocument extends SchoolSettingsType, Document {
  key: string;
  createdAt: Date;
  updatedAt: Date;
}

const SchoolSettingsSchema = new Schema<ISchoolSettingsDocument>(
  {
    key: { type: String, required: true, unique: true, default: 'active_school_settings' },
    schoolName: { type: String, default: 'GS CYAHAFI / TSS KIGALI CITY' },
    district: { type: String, default: 'NYARUGENGE DISTRICT' },
    email: { type: String, default: 'groupescolairecyahafi@gmail.com' },
    phone: { type: String, default: '+250 788 000 000' },
    academicYear: { type: String, default: '2025-2026' },
    headTeacherName: { type: String, default: 'H. T. MUGISHA Jean Paul' },
    headTeacherSignatureText: { type: String, default: "Head Teacher's Signature" },
    motto: { type: String, default: 'Knowledge • Discipline • Excellence' },
    themeColor: { type: String, default: '#1b4d34' },
    accentColor: { type: String, default: '#285d3d' },
    cardStyle: {
      type: String,
      enum: ['classic', 'modern', 'minimalist', 'tech', 'executive'],
      default: 'classic',
    },
    logoText: { type: String, default: 'GS CYAHAFI' },
    customLogoUrl: { type: String, default: '' },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_, ret) => {
        delete (ret as Record<string, unknown>)._id;
        delete (ret as Record<string, unknown>).__v;
        delete (ret as Record<string, unknown>).key;
        return ret;
      },
    },
  }
);

export const SchoolSettingsModel: Model<ISchoolSettingsDocument> =
  mongoose.models.SchoolSettings ||
  mongoose.model<ISchoolSettingsDocument>('SchoolSettings', SchoolSettingsSchema);

export default SchoolSettingsModel;
