'use client';

import { useState } from 'react';
import { Student, SchoolSettings, CardStyle } from '../types';
import { CardPreview } from './CardPreview';
import { Button } from '@/components/ui/button';
import {
  Palette,
  ChevronLeft,
  ChevronRight,
  Printer,
  Sparkles,
  Sliders,
  Check,
  User,
  School,
  QrCode,
  ShieldAlert,
} from 'lucide-react';

interface CardStudioViewProps {
  students: Student[];
  currentStudent: Student;
  schoolSettings: SchoolSettings;
  onSelectStudent: (student: Student) => void;
  onUpdateSettings: (settings: SchoolSettings) => void;
  onPrintCard: () => void;
}

const STYLE_OPTIONS: Array<{ id: CardStyle; label: string; desc: string; color: string }> = [
  {
    id: 'classic',
    label: 'Official Classic',
    desc: 'National curriculum standard with green band and official seal',
    color: '#1b4d34',
  },
  {
    id: 'modern',
    label: 'Modern Academy',
    desc: 'Sleek emerald gradient, rounded portrait, clean typography',
    color: '#0f766e',
  },
  {
    id: 'tech',
    label: 'Cyber High-Tech',
    desc: 'Dark slate with security watermark, biometric badge',
    color: '#1e293b',
  },
  {
    id: 'executive',
    label: 'Prestige Royal',
    desc: 'Deep navy blue with gold borders, university style',
    color: '#1e3a8a',
  },
  {
    id: 'minimalist',
    label: 'Minimalist Clean',
    desc: 'Crisp Swiss grid layout with high-legibility layout',
    color: '#334155',
  },
];

export function CardStudioView({
  students,
  currentStudent,
  schoolSettings,
  onSelectStudent,
  onUpdateSettings,
  onPrintCard,
}: CardStudioViewProps) {
  const [side, setSide] = useState<'front' | 'back'>('front');

  const currentIndex = students.findIndex((s) => s.id === currentStudent.id);
  const handlePrev = () => {
    if (currentIndex > 0) onSelectStudent(students[currentIndex - 1]);
    else onSelectStudent(students[students.length - 1]);
  };
  const handleNext = () => {
    if (currentIndex < students.length - 1) onSelectStudent(students[currentIndex + 1]);
    else onSelectStudent(students[0]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          background: 'var(--card)',
          padding: '18px 22px',
          borderRadius: 12,
          border: '1px solid var(--border)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                fontSize: 10,
                textTransform: 'uppercase',
                letterSpacing: 1,
                color: '#166534',
                fontWeight: 700,
                background: '#e6f7ec',
                padding: '2px 8px',
                borderRadius: 4,
              }}
            >
              Interactive Studio
            </span>
          </div>
          <h1 style={{ fontSize: 22, margin: '6px 0 3px', fontWeight: 700 }}>
            Card Design & Customization Studio
          </h1>
          <p style={{ margin: 0, fontSize: 12, color: 'var(--muted-foreground)' }}>
            Customize card styles, school branding, security features, and generate printable badges.
          </p>
        </div>

        {/* Student Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrev}
            aria-label="Previous student"
            title="Previous student"
          >
            <ChevronLeft size={16} />
          </Button>

          <select
            value={currentStudent.id}
            onChange={(e) => {
              const found = students.find((s) => s.id === e.target.value);
              if (found) onSelectStudent(found);
            }}
            style={{
              height: 34,
              borderRadius: 6,
              border: '1px solid var(--border)',
              background: 'var(--card)',
              fontSize: 12,
              fontWeight: 600,
              padding: '0 10px',
              maxWidth: 240,
            }}
          >
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.className})
              </option>
            ))}
          </select>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            aria-label="Next student"
            title="Next student"
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(380px, 1fr) minmax(420px, 1.2fr)',
          gap: 22,
          alignItems: 'start',
        }}
      >
        {/* Controls Column */}
        <div
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: 22,
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Palette size={16} style={{ color: '#166534' }} />
              Card Template Theme
            </h3>
            <p style={{ margin: 0, fontSize: 11, color: 'var(--muted-foreground)' }}>
              Select layout style and color scheme for the ID badges.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
              {STYLE_OPTIONS.map((opt) => {
                const isSelected = (schoolSettings.cardStyle || 'classic') === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => onUpdateSettings({ ...schoolSettings, cardStyle: opt.id, themeColor: opt.color })}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '10px 14px',
                      borderRadius: 8,
                      border: isSelected ? '2px solid #166534' : '1px solid var(--border)',
                      background: isSelected ? '#f2faf4' : 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: '50%',
                        background: opt.color,
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <b style={{ fontSize: 12, display: 'block', color: 'var(--foreground)' }}>
                        {opt.label}
                      </b>
                      <small style={{ fontSize: 10, color: 'var(--muted-foreground)' }}>
                        {opt.desc}
                      </small>
                    </div>
                    {isSelected && <Check size={16} style={{ color: '#166534' }} />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick School Overrides */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <School size={16} style={{ color: '#166534' }} />
              School Details Quick Edit
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>
                  Institution Name
                </label>
                <input
                  type="text"
                  value={schoolSettings.schoolName}
                  onChange={(e) =>
                    onUpdateSettings({ ...schoolSettings, schoolName: e.target.value })
                  }
                  style={{
                    width: '100%',
                    height: 32,
                    padding: '0 10px',
                    borderRadius: 6,
                    border: '1px solid var(--border)',
                    background: 'transparent',
                    fontSize: 11,
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>
                  District / Location
                </label>
                <input
                  type="text"
                  value={schoolSettings.district}
                  onChange={(e) =>
                    onUpdateSettings({ ...schoolSettings, district: e.target.value })
                  }
                  style={{
                    width: '100%',
                    height: 32,
                    padding: '0 10px',
                    borderRadius: 6,
                    border: '1px solid var(--border)',
                    background: 'transparent',
                    fontSize: 11,
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>
                  Head Teacher / Principal
                </label>
                <input
                  type="text"
                  value={schoolSettings.headTeacherName}
                  onChange={(e) =>
                    onUpdateSettings({ ...schoolSettings, headTeacherName: e.target.value })
                  }
                  style={{
                    width: '100%',
                    height: 32,
                    padding: '0 10px',
                    borderRadius: 6,
                    border: '1px solid var(--border)',
                    background: 'transparent',
                    fontSize: 11,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Card Preview Column */}
        <div>
          <CardPreview
            student={currentStudent}
            side={side}
            schoolSettings={schoolSettings}
            onSideChange={setSide}
            onPrint={onPrintCard}
            onEditDesign={() => {}}
          />
        </div>
      </div>
    </div>
  );
}
