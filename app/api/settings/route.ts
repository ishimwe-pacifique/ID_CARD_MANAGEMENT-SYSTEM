import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import SchoolSettingsModel from '@/lib/models/SchoolSettings';
import { DEFAULT_SCHOOL_SETTINGS } from '@/app/utils';
import { SchoolSettings } from '@/app/types';

export async function GET() {
  try {
    await connectToDatabase();

    let settings = await SchoolSettingsModel.findOne({ key: 'active_school_settings' }).lean();

    if (!settings) {
      console.log('Seeding default school settings to MongoDB...');
      const created = await SchoolSettingsModel.create({
        key: 'active_school_settings',
        ...DEFAULT_SCHOOL_SETTINGS,
      });
      settings = created.toObject();
    }

    const sanitizedSettings: SchoolSettings = {
      schoolName: settings.schoolName || DEFAULT_SCHOOL_SETTINGS.schoolName,
      district: settings.district || DEFAULT_SCHOOL_SETTINGS.district,
      email: settings.email || DEFAULT_SCHOOL_SETTINGS.email,
      phone: settings.phone || DEFAULT_SCHOOL_SETTINGS.phone,
      academicYear: settings.academicYear || DEFAULT_SCHOOL_SETTINGS.academicYear,
      headTeacherName: settings.headTeacherName || DEFAULT_SCHOOL_SETTINGS.headTeacherName,
      headTeacherSignatureText:
        settings.headTeacherSignatureText || DEFAULT_SCHOOL_SETTINGS.headTeacherSignatureText,
      motto: settings.motto || DEFAULT_SCHOOL_SETTINGS.motto,
      themeColor: settings.themeColor || DEFAULT_SCHOOL_SETTINGS.themeColor,
      accentColor: settings.accentColor || DEFAULT_SCHOOL_SETTINGS.accentColor,
      cardStyle: settings.cardStyle || DEFAULT_SCHOOL_SETTINGS.cardStyle,
      logoText: settings.logoText || DEFAULT_SCHOOL_SETTINGS.logoText,
      customLogoUrl: settings.customLogoUrl || '',
    };

    return NextResponse.json({
      success: true,
      settings: sanitizedSettings,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch school settings';
    console.error('Error fetching settings from MongoDB:', error);
    return NextResponse.json(
      {
        success: false,
        error: message,
        fallback: DEFAULT_SCHOOL_SETTINGS,
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const newSettings: SchoolSettings = await req.json();

    const updated = await SchoolSettingsModel.findOneAndUpdate(
      { key: 'active_school_settings' },
      { $set: newSettings },
      { upsert: true, new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      settings: updated,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to save settings';
    console.error('Error saving settings to MongoDB:', error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  return PUT(req);
}
