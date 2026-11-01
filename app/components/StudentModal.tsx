'use client';

import { useState, useEffect, useRef } from 'react';
import { X, UserPlus, Upload, Trash2, Camera, Check, Cloud, Loader2, CheckCircle2, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Student, CLASS_OPTIONS } from '../types';
import { generateInitials, generateStudentId } from '../utils';
import { uploadPhotoToCloudinary } from '@/lib/api';

interface StudentModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  student?: Student | null;
  onClose: () => void;
  onSave: (student: Student) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
];

export function StudentModal({ isOpen, mode, student, onClose, onSave }: StudentModalProps) {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [className, setClassName] = useState('S1');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [contact, setContact] = useState('');
  const [residence, setResidence] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [dob, setDob] = useState('2008-01-01');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setIsUploading(false);
      setUploadSuccess(false);
      setShowUrlInput(false);
      setCustomUrlInput('');
      if (mode === 'edit' && student) {
        setName(student.name);
        setId(student.id);
        setClassName(student.className);
        setGender(student.gender);
        setContact(student.contact || '');
        setResidence(student.residence || '');
        setFatherName(student.fatherName || '');
        setMotherName(student.motherName || '');
        setDob(student.dob || '2008-01-01');
        setBloodGroup(student.bloodGroup || 'O+');
        setStatus(student.status || 'Active');
        setPhotoUrl(student.photoUrl);
      } else {
        setName('');
        setId(generateStudentId());
        setClassName('S1');
        setGender('Male');
        setContact('');
        setResidence('Nyarugenge');
        setFatherName('');
        setMotherName('');
        setDob('2009-01-01');
        setBloodGroup('O+');
        setStatus('Active');
        setPhotoUrl(undefined);
      }
    }
  }, [isOpen, mode, student]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPEG, PNG, WEBP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image file must be under 10MB.');
      return;
    }

    setError(null);
    setIsUploading(true);
    setUploadSuccess(false);

    // Create temporary local preview so UI updates instantly
    const localPreview = URL.createObjectURL(file);
    setPhotoUrl(localPreview);

    try {
      const uploadRes = await uploadPhotoToCloudinary(
        file,
        'student_id_cards/photos',
        id.trim() || 'student'
      );
      if (uploadRes?.secure_url) {
        setPhotoUrl(uploadRes.secure_url);
        setUploadSuccess(true);
      }
    } catch (err: unknown) {
      console.warn('Cloudinary upload warning:', err);
      // Retain the local preview so the user still has their picture
      setError(
        err instanceof Error
          ? `Cloudinary upload notice: ${err.message}. Image stored locally.`
          : 'Uploaded image stored locally.'
      );
    } finally {
      setIsUploading(false);
      // Clear input so selecting the same file again works
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleApplyCustomUrl = () => {
    if (!customUrlInput.trim()) return;
    setPhotoUrl(customUrlInput.trim());
    setShowUrlInput(false);
    setCustomUrlInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Full Name is required.');
      return;
    }
    if (!id.trim()) {
      setError('Student ID is required.');
      return;
    }

    const savedStudent: Student = {
      id: id.trim(),
      name: name.trim(),
      className: className.trim(),
      gender,
      contact: contact.trim(),
      residence: residence.trim() || 'Kigali City',
      status,
      initials: generateInitials(name),
      photoUrl,
      fatherName: fatherName.trim() || 'Parent / Guardian',
      motherName: motherName.trim() || 'Parent / Guardian',
      dob,
      bloodGroup,
      emergencyContact: contact.trim(),
      issueDate: student?.issueDate || '2025-01-10',
      expiryDate: student?.expiryDate || '2026-12-31',
    };

    onSave(savedStudent);
  };

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="student-modal-title"
    >
      <div
        className="student-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--card)',
          width: 'min(620px, 95vw)',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: 14,
          padding: 26,
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          position: 'relative',
        }}
      >
        <button
          className="close"
          onClick={onClose}
          aria-label="Close dialog"
          style={{ position: 'absolute', top: 18, right: 18 }}
        >
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 10,
              background: '#e3f4e7',
              color: '#2a9454',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <UserPlus size={22} />
          </div>
          <div>
            <h2 id="student-modal-title" style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
              {mode === 'add' ? 'Add New Student' : 'Edit Student Details'}
            </h2>
            <p style={{ margin: '3px 0 0', fontSize: 12, color: 'var(--muted-foreground)' }}>
              {mode === 'add'
                ? 'Create a new student identity card record'
                : `Update profile and credentials for ${student?.name}`}
            </p>
          </div>
        </div>

        {error && (
          <div
            style={{
              background: '#fef2f2',
              color: '#b91c1c',
              border: '1px solid #fecaca',
              padding: '10px 14px',
              borderRadius: 8,
              fontSize: 12,
              marginBottom: 16,
            }}
            role="alert"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Photo Section with Cloudinary */}
          <div
            style={{
              padding: 14,
              borderRadius: 10,
              background: 'var(--muted)',
              border: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 10,
                  overflow: 'hidden',
                  background: '#dbeafe',
                  display: 'grid',
                  placeItems: 'center',
                  flexShrink: 0,
                  border: '2px solid var(--border)',
                  position: 'relative',
                }}
              >
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt="Student portrait preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <Camera size={28} style={{ color: '#64748b' }} />
                )}

                {isUploading && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(0,0,0,0.6)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                    }}
                  >
                    <Loader2 size={20} className="animate-spin" />
                  </div>
                )}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Cloud size={16} style={{ color: '#2563eb' }} />
                    Student Photo (Cloudinary)
                  </span>
                  {photoUrl?.includes('cloudinary') && (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        fontSize: 10,
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: 12,
                        background: '#dcfce7',
                        color: '#15803d',
                      }}
                    >
                      <CheckCircle2 size={12} />
                      Cloudinary CDN
                    </span>
                  )}
                </div>

                <p style={{ fontSize: 11, color: 'var(--muted-foreground)', margin: '3px 0 10px' }}>
                  {isUploading
                    ? 'Uploading picture securely to Cloudinary cloud (dprqevbvs)...'
                    : 'Upload a picture to Cloudinary storage or choose a preset.'}
                </p>

                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                    style={{ fontSize: 11, height: 28, background: 'var(--card)' }}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 size={13} className="animate-spin" style={{ marginRight: 6 }} />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload size={13} style={{ marginRight: 6 }} />
                        Upload to Cloudinary
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    style={{ fontSize: 11, height: 28 }}
                  >
                    <LinkIcon size={12} style={{ marginRight: 4 }} />
                    {showUrlInput ? 'Hide URL' : 'Paste URL'}
                  </Button>

                  {photoUrl && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setPhotoUrl(undefined)}
                      style={{ fontSize: 11, height: 28, color: '#dc2626' }}
                    >
                      <Trash2 size={13} style={{ marginRight: 4 }} />
                      Remove
                    </Button>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleFileUpload}
                  />
                </div>
              </div>
            </div>

            {/* Custom URL Input dropdown */}
            {showUrlInput && (
              <div style={{ display: 'flex', gap: 6, paddingTop: 4 }}>
                <input
                  type="url"
                  placeholder="Paste direct Cloudinary or image URL (https://...)"
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  style={{
                    flex: 1,
                    height: 30,
                    padding: '0 8px',
                    borderRadius: 6,
                    border: '1px solid var(--border)',
                    background: 'var(--card)',
                    fontSize: 11,
                  }}
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleApplyCustomUrl}
                  style={{ fontSize: 11, height: 30 }}
                >
                  Apply
                </Button>
              </div>
            )}

            {/* Quick preset selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 4, borderTop: '1px solid var(--border)' }}>
              <span style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>Quick presets:</span>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {PRESET_AVATARS.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPhotoUrl(url)}
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 6,
                      border: photoUrl === url ? '2px solid #16a34a' : '1px solid var(--border)',
                      overflow: 'hidden',
                      padding: 0,
                      cursor: 'pointer',
                      background: 'none',
                    }}
                    title={`Select avatar ${i + 1}`}
                  >
                    <img src={url} alt={`Avatar ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Core Info Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 5 }}>
                Full Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. MUGISHA Eric"
                required
                style={{
                  width: '100%',
                  height: 36,
                  padding: '0 10px',
                  borderRadius: 6,
                  border: '1px solid var(--border)',
                  background: 'transparent',
                  color: 'inherit',
                  fontSize: 12,
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 5 }}>
                Student ID *
              </label>
              <input
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="e.g. GS-2025-001"
                required
                style={{
                  width: '100%',
                  height: 36,
                  padding: '0 10px',
                  borderRadius: 6,
                  border: '1px solid var(--border)',
                  background: 'transparent',
                  color: 'inherit',
                  fontSize: 12,
                  fontFamily: 'monospace',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 5 }}>
                Class / Level *
              </label>
              <select
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                style={{
                  width: '100%',
                  height: 36,
                  padding: '0 10px',
                  borderRadius: 6,
                  border: '1px solid var(--border)',
                  background: 'var(--card)',
                  color: 'inherit',
                  fontSize: 12,
                }}
              >
                {CLASS_OPTIONS.filter((c) => c !== 'All classes').map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
                <option value="L6">L6</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 5 }}>
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'Male' | 'Female')}
                style={{
                  width: '100%',
                  height: 36,
                  padding: '0 10px',
                  borderRadius: 6,
                  border: '1px solid var(--border)',
                  background: 'var(--card)',
                  color: 'inherit',
                  fontSize: 12,
                }}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 5 }}>
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'Active' | 'Inactive')}
                style={{
                  width: '100%',
                  height: 36,
                  padding: '0 10px',
                  borderRadius: 6,
                  border: '1px solid var(--border)',
                  background: 'var(--card)',
                  color: 'inherit',
                  fontSize: 12,
                }}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 5 }}>
                Phone / Contact
              </label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="0788000000"
                style={{
                  width: '100%',
                  height: 36,
                  padding: '0 10px',
                  borderRadius: 6,
                  border: '1px solid var(--border)',
                  background: 'transparent',
                  color: 'inherit',
                  fontSize: 12,
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 5 }}>
                Place of Residence
              </label>
              <input
                type="text"
                value={residence}
                onChange={(e) => setResidence(e.target.value)}
                placeholder="e.g. Nyarugenge - Nyamirambo"
                style={{
                  width: '100%',
                  height: 36,
                  padding: '0 10px',
                  borderRadius: 6,
                  border: '1px solid var(--border)',
                  background: 'transparent',
                  color: 'inherit',
                  fontSize: 12,
                }}
              />
            </div>
          </div>

          {/* Parents information */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 5 }}>
                Father&apos;s Name
              </label>
              <input
                type="text"
                value={fatherName}
                onChange={(e) => setFatherName(e.target.value)}
                placeholder="e.g. MUGIRANEZA Jean Claude"
                style={{
                  width: '100%',
                  height: 36,
                  padding: '0 10px',
                  borderRadius: 6,
                  border: '1px solid var(--border)',
                  background: 'transparent',
                  color: 'inherit',
                  fontSize: 12,
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 5 }}>
                Mother&apos;s Name
              </label>
              <input
                type="text"
                value={motherName}
                onChange={(e) => setMotherName(e.target.value)}
                placeholder="e.g. UWERA Joseline Hasina"
                style={{
                  width: '100%',
                  height: 36,
                  padding: '0 10px',
                  borderRadius: 6,
                  border: '1px solid var(--border)',
                  background: 'transparent',
                  color: 'inherit',
                  fontSize: 12,
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 5 }}>
                Date of Birth
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                style={{
                  width: '100%',
                  height: 36,
                  padding: '0 10px',
                  borderRadius: 6,
                  border: '1px solid var(--border)',
                  background: 'transparent',
                  color: 'inherit',
                  fontSize: 12,
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 5 }}>
                Blood Group
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                style={{
                  width: '100%',
                  height: 36,
                  padding: '0 10px',
                  borderRadius: 6,
                  border: '1px solid var(--border)',
                  background: 'var(--card)',
                  color: 'inherit',
                  fontSize: 12,
                }}
              >
                {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 10,
              marginTop: 12,
              paddingTop: 16,
              borderTop: '1px solid var(--border)',
            }}
          >
            <Button type="button" variant="outline" onClick={onClose} size="sm">
              Cancel
            </Button>
            <Button type="submit" size="sm" style={{ background: '#166534', color: '#fff' }}>
              <Check size={14} style={{ marginRight: 6 }} />
              {mode === 'add' ? 'Add Student' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
