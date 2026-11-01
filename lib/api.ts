import { Student, SchoolSettings } from '@/app/types';

export interface DbStatusResponse {
  ok: boolean;
  connected: boolean;
  host?: string;
  database?: string;
  studentCount?: number;
  error?: string;
}

export async function getDbStatus(): Promise<DbStatusResponse> {
  try {
    const res = await fetch('/api/db-status', { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err: unknown) {
    return {
      ok: false,
      connected: false,
      error: err instanceof Error ? err.message : 'Database check failed',
    };
  }
}

export async function fetchStudentsFromDb(): Promise<Student[]> {
  const res = await fetch('/api/students', { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to load students: ${res.statusText}`);
  const data = await res.json();
  return data.students || [];
}

export async function saveStudentToDb(student: Student): Promise<Student> {
  const res = await fetch('/api/students', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(student),
  });
  if (!res.ok) throw new Error(`Failed to save student: ${res.statusText}`);
  const data = await res.json();
  return data.student || student;
}

export async function saveMultipleStudentsToDb(students: Student[]): Promise<void> {
  const res = await fetch('/api/students', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(students),
  });
  if (!res.ok) throw new Error(`Failed to sync students: ${res.statusText}`);
}

export async function deleteStudentFromDb(id: string): Promise<void> {
  const res = await fetch(`/api/students/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error(`Failed to delete student: ${res.statusText}`);
}

export async function batchDeleteStudentsFromDb(ids: string[]): Promise<void> {
  const res = await fetch('/api/students', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
  });
  if (!res.ok) throw new Error(`Failed to batch delete students: ${res.statusText}`);
}

export async function fetchSettingsFromDb(): Promise<SchoolSettings> {
  const res = await fetch('/api/settings', { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to load settings: ${res.statusText}`);
  const data = await res.json();
  return data.settings;
}

export async function saveSettingsToDb(settings: SchoolSettings): Promise<SchoolSettings> {
  const res = await fetch('/api/settings', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  });
  if (!res.ok) throw new Error(`Failed to save settings: ${res.statusText}`);
  const data = await res.json();
  return data.settings || settings;
}

export interface CloudinaryStatusResponse {
  success: boolean;
  service: string;
  cloudName?: string;
  connected: boolean;
  status?: string;
  error?: string;
}

export interface UploadPhotoResponse {
  success: boolean;
  url: string;
  secure_url: string;
  public_id: string;
  format?: string;
  width?: number;
  height?: number;
  bytes?: number;
}

export async function getCloudinaryStatus(): Promise<CloudinaryStatusResponse> {
  try {
    const res = await fetch('/api/upload', { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err: unknown) {
    return {
      success: false,
      service: 'Cloudinary',
      connected: false,
      error: err instanceof Error ? err.message : 'Cloudinary check failed',
    };
  }
}

export async function uploadPhotoToCloudinary(
  fileOrBase64: File | string,
  folder = 'student_id_cards/photos',
  studentId?: string
): Promise<UploadPhotoResponse> {
  if (typeof fileOrBase64 === 'string') {
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image: fileOrBase64,
        folder,
        studentId,
      }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Upload failed with status ${res.status}`);
    }
    return await res.json();
  } else {
    const formData = new FormData();
    formData.append('file', fileOrBase64);
    formData.append('folder', folder);
    if (studentId) formData.append('studentId', studentId);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Upload failed with status ${res.status}`);
    }
    return await res.json();
  }
}
