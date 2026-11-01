export interface Student {
  id: string;
  name: string;
  className: string;
  gender: 'Male' | 'Female';
  contact: string;
  residence: string;
  status: 'Active' | 'Inactive';
  initials: string;
  photoUrl?: string;
  fatherName?: string;
  motherName?: string;
  dob?: string;
  bloodGroup?: string;
  emergencyContact?: string;
  issueDate?: string;
  expiryDate?: string;
}

export interface SchoolSettings {
  schoolName: string;
  district: string;
  email: string;
  phone: string;
  academicYear: string;
  headTeacherName: string;
  headTeacherSignatureText: string;
  motto: string;
  themeColor: string;
  accentColor: string;
  cardStyle: CardStyle;
  logoText: string;
  customLogoUrl?: string;
}

export type CardStyle = 'classic' | 'modern' | 'minimalist' | 'tech' | 'executive';

export interface ImportedStudentRow {
  'Full Name'?: string;
  Name?: string;
  'Student Name'?: string;
  'Student ID'?: string;
  ID?: string;
  Class?: string;
  Level?: string;
  Programme?: string;
  Gender?: string;
  Contact?: string;
  Phone?: string;
  Residence?: string;
  'Place of Residence'?: string;
  "Father's Name"?: string;
  Father?: string;
  "Mother's Name"?: string;
  Mother?: string;
  'Date of Birth'?: string;
  DOB?: string;
  'Blood Group'?: string;
  Status?: string;
  Photo?: string;
  [key: string]: string | undefined;
}

export interface ImportResult {
  students: Student[];
  errors: string[];
}

export type ClassFilter = 'All classes' | 'S1' | 'S2' | 'S3' | 'L3' | 'L4' | 'L5';
export type CardSide = 'front' | 'back';
export type Theme = 'light' | 'dark';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export const CLASS_OPTIONS: ClassFilter[] = [
  'All classes',
  'S1',
  'S2',
  'S3',
  'L3',
  'L4',
  'L5',
];

export const CLASS_TRACKS = {
  S: ['S1', 'S2', 'S3'],
  L: ['L3', 'L4', 'L5'],
} as const;