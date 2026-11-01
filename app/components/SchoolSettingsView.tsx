'use client';

import { useState, useRef } from 'react';
import { SchoolSettings, CardStyle } from '../types';
import { DEFAULT_SCHOOL_SETTINGS } from '../utils';
import { Button } from '@/components/ui/button';
import { School, Save, RotateCcw, Check, Sparkles, Shield, Palette, Database, CheckCircle2, Server, Cloud, Upload, Trash2, Loader2, Image as ImageIcon } from 'lucide-react';
import { uploadPhotoToCloudinary } from '@/lib/api';

interface SchoolSettingsViewProps {
  settings: SchoolSettings;
  onSave: (newSettings: SchoolSettings) => void;
}

export function SchoolSettingsView({ settings, onSave }: SchoolSettingsViewProps) {
  const [formData, setFormData] = useState<SchoolSettings>(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, SVG, WEBP).');
      return;
    }

    setIsUploadingLogo(true);
    try {
      const res = await uploadPhotoToCloudinary(file, 'student_id_cards/logos', 'school_logo');
      if (res?.secure_url) {
        setFormData((prev) => ({ ...prev, customLogoUrl: res.secure_url }));
      }
    } catch (err: unknown) {
      console.error('Failed to upload logo to Cloudinary:', err);
      alert('Failed to upload school logo to Cloudinary.');
    } finally {
      setIsUploadingLogo(false);
      if (logoInputRef.current) logoInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleReset = () => {
    if (confirm('Reset school settings back to system defaults?')) {
      setFormData(DEFAULT_SCHOOL_SETTINGS);
      onSave(DEFAULT_SCHOOL_SETTINGS);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: '24px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: '#e3f4e7',
                color: '#166534',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <School size={18} />
            </div>
            <h1 style={{ fontSize: 22, margin: 0, fontWeight: 700 }}>School Identity & Card Settings</h1>
          </div>
          <p style={{ margin: 0, fontSize: 12, color: 'var(--muted-foreground)' }}>
            Configure your institution credentials, official seal, header details, and signature styling.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="outline" size="sm" type="button" onClick={handleReset}>
            <RotateCcw size={14} style={{ marginRight: 6 }} />
            Reset Defaults
          </Button>
          <Button
            size="sm"
            type="submit"
            form="school-settings-form"
            style={{ background: '#166534', color: '#fff' }}
          >
            {savedSuccess ? (
              <>
                <Check size={14} style={{ marginRight: 6 }} />
                Saved Successfully!
              </>
            ) : (
              <>
                <Save size={14} style={{ marginRight: 6 }} />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </div>

      <form
        id="school-settings-form"
        onSubmit={handleSubmit}
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: 28,
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}
      >
        {/* Basic Institution Info */}
        <div>
          <h2 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 4px', color: 'var(--foreground)' }}>
            Institution Credentials
          </h2>
          <p style={{ margin: '0 0 16px', fontSize: 11, color: 'var(--muted-foreground)' }}>
            Appears at the top of every generated student identity badge.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 5 }}>
                School Full Name *
              </label>
              <input
                type="text"
                value={formData.schoolName}
                onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                required
                style={{
                  width: '100%',
                  height: 36,
                  padding: '0 10px',
                  borderRadius: 6,
                  border: '1px solid var(--border)',
                  background: 'transparent',
                  fontSize: 12,
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 5 }}>
                District / City / Province *
              </label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                required
                style={{
                  width: '100%',
                  height: 36,
                  padding: '0 10px',
                  borderRadius: 6,
                  border: '1px solid var(--border)',
                  background: 'transparent',
                  fontSize: 12,
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 5 }}>
                Official School Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{
                  width: '100%',
                  height: 36,
                  padding: '0 10px',
                  borderRadius: 6,
                  border: '1px solid var(--border)',
                  background: 'transparent',
                  fontSize: 12,
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 5 }}>
                Administration Phone
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                style={{
                  width: '100%',
                  height: 36,
                  padding: '0 10px',
                  borderRadius: 6,
                  border: '1px solid var(--border)',
                  background: 'transparent',
                  fontSize: 12,
                }}
              />
            </div>
          </div>
        </div>

        {/* Academic and Authority Info */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 4px', color: 'var(--foreground)' }}>
            Authority & Academic Period
          </h2>
          <p style={{ margin: '0 0 16px', fontSize: 11, color: 'var(--muted-foreground)' }}>
            Signatures and validity dates stamped on student ID cards.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 5 }}>
                Current Academic Year
              </label>
              <input
                type="text"
                value={formData.academicYear}
                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                style={{
                  width: '100%',
                  height: 36,
                  padding: '0 10px',
                  borderRadius: 6,
                  border: '1px solid var(--border)',
                  background: 'transparent',
                  fontSize: 12,
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 5 }}>
                Head Teacher / Principal Name
              </label>
              <input
                type="text"
                value={formData.headTeacherName}
                onChange={(e) => setFormData({ ...formData, headTeacherName: e.target.value })}
                style={{
                  width: '100%',
                  height: 36,
                  padding: '0 10px',
                  borderRadius: 6,
                  border: '1px solid var(--border)',
                  background: 'transparent',
                  fontSize: 12,
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 5 }}>
                Signature Title
              </label>
              <input
                type="text"
                value={formData.headTeacherSignatureText}
                onChange={(e) =>
                  setFormData({ ...formData, headTeacherSignatureText: e.target.value })
                }
                style={{
                  width: '100%',
                  height: 36,
                  padding: '0 10px',
                  borderRadius: 6,
                  border: '1px solid var(--border)',
                  background: 'transparent',
                  fontSize: 12,
                }}
              />
            </div>
          </div>
        </div>

        {/* Visual Branding */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 4px', color: 'var(--foreground)' }}>
            Badge Colors & Aesthetics
          </h2>
          <p style={{ margin: '0 0 16px', fontSize: 11, color: 'var(--muted-foreground)' }}>
            Brand colors used for header bands, typography, and card accents.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 5 }}>
                Primary Theme Color
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="color"
                  value={formData.themeColor}
                  onChange={(e) => setFormData({ ...formData, themeColor: e.target.value })}
                  style={{
                    width: 38,
                    height: 36,
                    border: '1px solid var(--border)',
                    borderRadius: 6,
                    padding: 2,
                    cursor: 'pointer',
                    background: 'none',
                  }}
                />
                <input
                  type="text"
                  value={formData.themeColor}
                  onChange={(e) => setFormData({ ...formData, themeColor: e.target.value })}
                  style={{
                    flex: 1,
                    height: 36,
                    padding: '0 10px',
                    borderRadius: 6,
                    border: '1px solid var(--border)',
                    background: 'transparent',
                    fontSize: 12,
                    fontFamily: 'monospace',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 5 }}>
                Accent Color
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="color"
                  value={formData.accentColor}
                  onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                  style={{
                    width: 38,
                    height: 36,
                    border: '1px solid var(--border)',
                    borderRadius: 6,
                    padding: 2,
                    cursor: 'pointer',
                    background: 'none',
                  }}
                />
                <input
                  type="text"
                  value={formData.accentColor}
                  onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                  style={{
                    flex: 1,
                    height: 36,
                    padding: '0 10px',
                    borderRadius: 6,
                    border: '1px solid var(--border)',
                    background: 'transparent',
                    fontSize: 12,
                    fontFamily: 'monospace',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 5 }}>
                Logo Crest Text
              </label>
              <input
                type="text"
                value={formData.logoText}
                onChange={(e) => setFormData({ ...formData, logoText: e.target.value })}
                placeholder="GS CYAHAFI"
                style={{
                  width: '100%',
                  height: 36,
                  padding: '0 10px',
                  borderRadius: 6,
                  border: '1px solid var(--border)',
                  background: 'transparent',
                  fontSize: 12,
                }}
              />
            </div>
          </div>

          {/* School Emblem / Custom Logo Upload */}
          <div
            style={{
              marginTop: 16,
              padding: 14,
              borderRadius: 8,
              background: 'var(--muted)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 14,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 8,
                  background: '#e0e7ff',
                  color: '#3730a3',
                  display: 'grid',
                  placeItems: 'center',
                  overflow: 'hidden',
                  border: '1px solid var(--border)',
                }}
              >
                {formData.customLogoUrl ? (
                  <img
                    src={formData.customLogoUrl}
                    alt="School Logo"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                ) : (
                  <ImageIcon size={22} />
                )}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>Official School Crest / Logo</span>
                  {formData.customLogoUrl?.includes('cloudinary') && (
                    <span
                      style={{
                        fontSize: 10,
                        background: '#dcfce7',
                        color: '#15803d',
                        padding: '1px 6px',
                        borderRadius: 10,
                        fontWeight: 700,
                      }}
                    >
                      Cloudinary CDN
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>
                  {formData.customLogoUrl
                    ? 'Uploaded and hosted on Cloudinary media cloud'
                    : 'Upload PNG or SVG official school crest to display on cards'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isUploadingLogo}
                onClick={() => logoInputRef.current?.click()}
                style={{ fontSize: 11, height: 30 }}
              >
                {isUploadingLogo ? (
                  <>
                    <Loader2 size={13} className="animate-spin" style={{ marginRight: 6 }} />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={13} style={{ marginRight: 6 }} />
                    Upload Emblem
                  </>
                )}
              </Button>
              {formData.customLogoUrl && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFormData((prev) => ({ ...prev, customLogoUrl: undefined }))}
                  style={{ fontSize: 11, height: 30, color: '#dc2626' }}
                >
                  <Trash2 size={13} style={{ marginRight: 4 }} />
                  Remove
                </Button>
              )}
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleLogoUpload}
              />
            </div>
          </div>
        </div>
      </form>

      {/* Cloud Integrations Grid: MongoDB Atlas & Cloudinary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* MongoDB Database Integration Card */}
        <div
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: '20px 22px',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  background: '#dcfce7',
                  color: '#15803d',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <Database size={18} />
              </div>
              <div>
                <h2 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>MongoDB Atlas</h2>
                <p style={{ margin: 0, fontSize: 11, color: 'var(--muted-foreground)' }}>
                  Database storage for records
                </p>
              </div>
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '3px 8px',
                borderRadius: 20,
                background: '#dcfce7',
                color: '#166534',
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              <CheckCircle2 size={13} />
              <span>Atlas Connected</span>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 8,
              background: 'var(--background)',
              borderRadius: 8,
              padding: 10,
              border: '1px solid var(--border)',
              fontSize: 11,
            }}
          >
            <div>
              <div style={{ color: 'var(--muted-foreground)', fontSize: 10 }}>Cluster Host</div>
              <div style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: 10, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                cluster0.s2hzqcu
              </div>
            </div>
            <div>
              <div style={{ color: 'var(--muted-foreground)', fontSize: 10 }}>Database</div>
              <div style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: 10, marginTop: 2 }}>
                student_id_db
              </div>
            </div>
          </div>
        </div>

        {/* Cloudinary Media Cloud Card */}
        <div
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: '20px 22px',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  background: '#dbeafe',
                  color: '#2563eb',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <Cloud size={18} />
              </div>
              <div>
                <h2 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>Cloudinary Media</h2>
                <p style={{ margin: 0, fontSize: 11, color: 'var(--muted-foreground)' }}>
                  Cloud photo upload & CDN delivery
                </p>
              </div>
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '3px 8px',
                borderRadius: 20,
                background: '#dbeafe',
                color: '#1d4ed8',
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              <CheckCircle2 size={13} />
              <span>Cloudinary Active</span>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 8,
              background: 'var(--background)',
              borderRadius: 8,
              padding: 10,
              border: '1px solid var(--border)',
              fontSize: 11,
            }}
          >
            <div>
              <div style={{ color: 'var(--muted-foreground)', fontSize: 10 }}>Cloud Name</div>
              <div style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: 10, marginTop: 2 }}>
                dprqevbvs
              </div>
            </div>
            <div>
              <div style={{ color: 'var(--muted-foreground)', fontSize: 10 }}>API Key</div>
              <div style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: 10, marginTop: 2 }}>
                751831559951954
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
