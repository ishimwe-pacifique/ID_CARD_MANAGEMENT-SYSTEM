import { Student, ImportedStudentRow, ImportResult, CLASS_TRACKS, SchoolSettings } from './types';

export const FRONT_PHOTO_URL =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80';

export const DEFAULT_SCHOOL_SETTINGS: SchoolSettings = {
  schoolName: 'GS CYAHAFI / TSS KIGALI CITY',
  district: 'NYARUGENGE DISTRICT',
  email: 'groupescolairecyahafi@gmail.com',
  phone: '+250 788 000 000',
  academicYear: '2025-2026',
  headTeacherName: 'H. T. MUGISHA Jean Paul',
  headTeacherSignatureText: "Head Teacher's Signature",
  motto: 'Knowledge • Discipline • Excellence',
  themeColor: '#1b4d34',
  accentColor: '#285d3d',
  cardStyle: 'classic',
  logoText: 'GS CYAHAFI',
};

export const SEED_STUDENTS: Student[] = [
  {
    id: 'GS-2025-001',
    name: 'IRAKOZE Ange',
    className: 'S1',
    gender: 'Male',
    contact: '0788250300',
    residence: 'Nyarugenge - Nyamirambo',
    status: 'Active',
    initials: 'IA',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    fatherName: 'MUGIRANEZA Jean Claude',
    motherName: 'UWERA Joseline Hasina',
    dob: '2009-04-12',
    bloodGroup: 'O+',
    emergencyContact: '0788250300',
    issueDate: '2025-01-10',
    expiryDate: '2026-12-31',
  },
  {
    id: 'GS-2025-002',
    name: 'UWIMANA Divine',
    className: 'S2',
    gender: 'Female',
    contact: '0788124576',
    residence: 'Nyarugenge - Kimisagara',
    status: 'Active',
    initials: 'UD',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    fatherName: 'HABIMANA Emmanuel',
    motherName: 'MUKARWEGO Beatrice',
    dob: '2008-08-23',
    bloodGroup: 'A+',
    emergencyContact: '0788124576',
    issueDate: '2025-01-10',
    expiryDate: '2026-12-31',
  },
  {
    id: 'GS-2025-003',
    name: 'MUGISHA Eric',
    className: 'S3',
    gender: 'Male',
    contact: '0722458912',
    residence: 'Gasabo - Remera',
    status: 'Active',
    initials: 'ME',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
    fatherName: 'BIZIMANA Innocent',
    motherName: 'UWAMAHORO Chantal',
    dob: '2007-11-05',
    bloodGroup: 'B+',
    emergencyContact: '0722458912',
    issueDate: '2025-01-10',
    expiryDate: '2026-12-31',
  },
  {
    id: 'GS-2025-004',
    name: 'MUKAMANA Alice',
    className: 'S1',
    gender: 'Female',
    contact: '0788341209',
    residence: 'Nyarugenge - Gitega',
    status: 'Active',
    initials: 'MA',
    photoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80',
    fatherName: 'GAKWAYA Vedaste',
    motherName: 'NYIRABAKUNZI Marie',
    dob: '2009-02-19',
    bloodGroup: 'O-',
    emergencyContact: '0788341209',
    issueDate: '2025-01-10',
    expiryDate: '2026-12-31',
  },
  {
    id: 'GS-2025-005',
    name: 'NDAYISENGA Patrick',
    className: 'L4',
    gender: 'Male',
    contact: '0733124567',
    residence: 'Kicukiro - Kagarama',
    status: 'Inactive',
    initials: 'NP',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    fatherName: 'NDAGIJIMANA Jean',
    motherName: 'MUKESHIMANA Vestine',
    dob: '2006-07-30',
    bloodGroup: 'AB+',
    emergencyContact: '0733124567',
    issueDate: '2025-01-10',
    expiryDate: '2026-12-31',
  },
];

export function generateInitials(name: string): string {
  if (!name) return 'ST';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function getClassTrack(className: string): string[] {
  return className.startsWith('L') ? [...CLASS_TRACKS.L] : [...CLASS_TRACKS.S];
}

export function normalizeClassName(className: string): string {
  const cleaned = className.trim().toUpperCase().replace(/^OL\s*/, 'S');
  return cleaned || 'S1';
}

export function generateStudentId(prefix = 'GS-2025'): string {
  const randNum = Math.floor(100 + Math.random() * 900);
  return `${prefix}-${randNum}`;
}

export function parseImportedRow(row: ImportedStudentRow, index: number): Student {
  const name = String(
    row['Full Name'] || row['Name'] || row['Student Name'] || `Student ${index + 1}`
  ).trim();

  const rawClass = String(row['Class'] || row['Level'] || row['Programme'] || 'S1');
  const className = normalizeClassName(rawClass);

  const rawGender = String(row['Gender'] || '').trim().toLowerCase();
  const gender: 'Male' | 'Female' = rawGender.startsWith('f') ? 'Female' : 'Male';

  const contact = String(row['Contact'] || row['Phone'] || row['Emergency Contact'] || '').trim();
  const residence = String(
    row['Residence'] || row['Place of Residence'] || 'Kigali City'
  ).trim();

  const id = String(
    row['Student ID'] || row['ID'] || `GS-2025-${String(index + 10).padStart(3, '0')}`
  ).trim();

  const fatherName = String(row["Father's Name"] || row['Father'] || 'Parent / Guardian').trim();
  const motherName = String(row["Mother's Name"] || row['Mother'] || 'Parent / Guardian').trim();
  const dob = String(row['Date of Birth'] || row['DOB'] || '2008-01-01').trim();
  const bloodGroup = String(row['Blood Group'] || 'O+').trim();
  const rawStatus = String(row['Status'] || 'Active').trim().toLowerCase();
  const status: 'Active' | 'Inactive' = rawStatus === 'inactive' ? 'Inactive' : 'Active';
  const photoUrl = row['Photo'] ? String(row['Photo']).trim() : undefined;

  return {
    id,
    name,
    className,
    gender,
    contact,
    residence,
    status,
    initials: generateInitials(name),
    fatherName,
    motherName,
    dob,
    bloodGroup,
    emergencyContact: contact,
    photoUrl,
    issueDate: '2025-01-10',
    expiryDate: '2026-12-31',
  };
}

export function importStudentsFromRows(rows: ImportedStudentRow[]): ImportResult {
  const students: Student[] = [];
  const errors: string[] = [];

  rows.forEach((row, index) => {
    try {
      const student = parseImportedRow(row, index);
      if (!student.name || student.name.startsWith('Student ')) {
        // If there's literally no name key
        if (!row['Full Name'] && !row['Name'] && !row['Student Name']) {
          errors.push(`Row ${index + 1}: Missing student name column`);
          return;
        }
      }
      students.push(student);
    } catch (error) {
      errors.push(`Row ${index + 1}: ${error instanceof Error ? error.message : 'Parse error'}`);
    }
  });

  return { students, errors };
}

export function filterStudents(
  students: Student[],
  query: string,
  classFilter: string,
  genderFilter: string = 'All',
  statusFilter: string = 'All'
): Student[] {
  const lowerQuery = query.toLowerCase().trim();
  return students.filter((student) => {
    const matchesQuery =
      !lowerQuery ||
      student.name.toLowerCase().includes(lowerQuery) ||
      student.id.toLowerCase().includes(lowerQuery) ||
      student.className.toLowerCase().includes(lowerQuery) ||
      student.residence.toLowerCase().includes(lowerQuery) ||
      student.contact.includes(lowerQuery);

    const matchesClass = classFilter === 'All classes' || student.className === classFilter;
    const matchesGender = genderFilter === 'All' || student.gender === genderFilter;
    const matchesStatus = statusFilter === 'All' || student.status === statusFilter;

    return matchesQuery && matchesClass && matchesGender && matchesStatus;
  });
}

export async function downloadExcelTemplate() {
  const XLSX = await import('xlsx');
  const sampleData = [
    {
      'Full Name': 'KABERA Kevin',
      'Student ID': 'GS-2025-010',
      Class: 'S1',
      Gender: 'Male',
      "Father's Name": 'KABERA Justin',
      "Mother's Name": 'UWASE Clarisse',
      Contact: '0788112233',
      Residence: 'Nyarugenge - Nyamirambo',
      'Date of Birth': '2009-05-14',
      'Blood Group': 'O+',
      Status: 'Active',
    },
    {
      'Full Name': 'GASANA Aline',
      'Student ID': 'GS-2025-011',
      Class: 'S2',
      Gender: 'Female',
      "Father's Name": 'GASANA Claude',
      "Mother's Name": 'MUKESHIMANA Jeanne',
      Contact: '0788445566',
      Residence: 'Gasabo - Kacyiru',
      'Date of Birth': '2008-09-20',
      'Blood Group': 'A+',
      Status: 'Active',
    },
    {
      'Full Name': 'RUTAGENGWA David',
      'Student ID': 'GS-2025-012',
      Class: 'L4',
      Gender: 'Male',
      "Father's Name": 'RUTAGENGWA Alex',
      "Mother's Name": 'NYIRAHABIMANA Consolee',
      Contact: '0733778899',
      Residence: 'Kicukiro - Gikondo',
      'Date of Birth': '2006-12-11',
      'Blood Group': 'B+',
      Status: 'Active',
    },
  ];

  const ws = XLSX.utils.json_to_sheet(sampleData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Students_Template');
  XLSX.writeFile(wb, 'student_import_template.xlsx');
}

export async function exportStudentsToExcel(students: Student[], fileName = 'students_roster.xlsx') {
  const XLSX = await import('xlsx');
  const exportData = students.map((s) => ({
    'Student ID': s.id,
    'Full Name': s.name,
    Class: s.className,
    Gender: s.gender,
    Status: s.status,
    Contact: s.contact,
    Residence: s.residence,
    "Father's Name": s.fatherName || '',
    "Mother's Name": s.motherName || '',
    'Date of Birth': s.dob || '',
    'Blood Group': s.bloodGroup || '',
  }));

  const ws = XLSX.utils.json_to_sheet(exportData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Students');
  XLSX.writeFile(wb, fileName);
}

const STORAGE_KEYS = {
  STUDENTS: 'edupass_students_v1',
  SETTINGS: 'edupass_school_settings_v1',
};

export function loadSavedStudents(): Student[] {
  if (typeof window === 'undefined') return SEED_STUDENTS;
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to load students from localStorage:', e);
  }
  return SEED_STUDENTS;
}

export function saveStudents(students: Student[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  } catch (e) {
    console.error('Failed to save students to localStorage:', e);
  }
}

export function loadSavedSettings(): SchoolSettings {
  if (typeof window === 'undefined') return DEFAULT_SCHOOL_SETTINGS;
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_SCHOOL_SETTINGS, ...parsed };
    }
  } catch (e) {
    console.error('Failed to load settings from localStorage:', e);
  }
  return DEFAULT_SCHOOL_SETTINGS;
}

export function saveSettings(settings: SchoolSettings) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings to localStorage:', e);
  }
}

export function formatDate(date: Date = new Date()): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).toUpperCase();
}