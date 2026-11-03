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

export type ClassFilter = 'All classes' | 'S1' | 'S2' | 'S3' | 'L3 BDC' | 'L3 FBO' | 'L4 BDC' | 'L4 FBO' | 'L5 BDC' | 'L5 FBO';
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
  'L3 BDC',
  'L3 FBO',
  'L4 BDC',
  'L4 FBO',
  'L5 BDC',
  'L5 FBO',
];

export const CLASS_TRACKS = {
  S: ['S1', 'S2', 'S3'],
  L_BDC: ['L3 BDC', 'L4 BDC', 'L5 BDC'],
  L_FBO: ['L3 FBO', 'L4 FBO', 'L5 FBO'],
} as const;

export const DISTRICTS_SECTORS: Record<string, string[]> = {
  'Nyarugenge': ['Gitega', 'Kanyinya', 'Kigali', 'Kimisagara', 'Mageragere', 'Muhima', 'Nyakabanda', 'Nyamirambo', 'Nyarugenge', 'Rwezamenyo'],
  'Gasabo': ['Bumbogo', 'Gatsata', 'Gikomero', 'Gisozi', 'Jabana', 'Jali', 'Kacyiru', 'Kimihurura', 'Kimironko', 'Kinyinya', 'Ndera', 'Nduba', 'Remera', 'Rusororo', 'Rutunga'],
  'Kicukiro': ['Gahanga', 'Gatenga', 'Gikondo', 'Kagarama', 'Kanombe', 'Kicukiro', 'Kigarama', 'Masaka', 'Niboye', 'Nyarugunga'],
  'Bugesera': ['Gashora', 'Juru', 'Kamabuye', 'Mareba', 'Mayange', 'Musenyi', 'Mwogo', 'Ngeruka', 'Ntarama', 'Nyamata', 'Nyarugenge', 'Rilima', 'Ruhuha', 'Rweru', 'Shyara'],
  'Gatsibo': ['Gasange', 'Gatsibo', 'Gitoki', 'Kabarore', 'Kageyo', 'Kiramuruzi', 'Kiziguro', 'Muhura', 'Murambi', 'Ngarama', 'Nyagihanga', 'Remera', 'Rugarama', 'Rwimbogo'],
  'Huye': ['Gishamvu', 'Huye', 'Karama', 'Kigoma', 'Kinazi', 'Maraba', 'Mbazi', 'Mukura', 'Ngoma', 'Ruhashya', 'Rusatira', 'Rwaniro', 'Simbi', 'Tumba'],
  'Musanze': ['Busogo', 'Cyuve', 'Gacaca', 'Gashaki', 'Gataraga', 'Kimonyi', 'Kinigi', 'Muhoza', 'Muko', 'Musanze', 'Nkotsi', 'Nyange', 'Remera', 'Rwaza', 'Shingiro'],
  'Rubavu': ['Bugeshi', 'Busasamana', 'Cyanzarwe', 'Gisenyi', 'Kanama', 'Kanzenze', 'Mudende', 'Nyamyumba', 'Nyundo', 'Rubavu', 'Rugerero'],
  'Muhanga': ['Cyeza', 'Kabacuzi', 'Kibangu', 'Kiyumba', 'Muhanga', 'Mushishiro', 'Nyabinoni', 'Nyamabuye', 'Nyamiyaga', 'Rongi', 'Rugendabari'],
  'Rwamagana': ['Fumbwe', 'Gahengeri', 'Gishari', 'Karenge', 'Kigabiro', 'Muhazi', 'Munyaga', 'Munyiginya', 'Musha', 'Muyumbu', 'Mwulire', 'Nyakaliro', 'Nzige', 'Rubona'],
};