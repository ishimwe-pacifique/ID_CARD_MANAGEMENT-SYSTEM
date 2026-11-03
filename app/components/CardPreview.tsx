'use client';

import { useMemo, useRef, useState } from 'react';
import { Student, SchoolSettings, CardStyle } from '../types';
import { getClassTrack, DEFAULT_SCHOOL_SETTINGS, FRONT_PHOTO_URL } from '../utils';
import { Button } from '@/components/ui/button';
import { Printer, Download, RefreshCw, Palette, Sparkles } from 'lucide-react';
import { QRCodeDisplay } from './QRCodeDisplay';
import { toPng } from 'html-to-image';

interface CardPreviewProps {
  student: Student;
  side: 'front' | 'back';
  schoolSettings?: SchoolSettings;
  onSideChange: (side: 'front' | 'back') => void;
  onPrint: () => void;
  onEditDesign: () => void;
  onDownloadCard?: () => void;
}

export function CardPreview({
  student,
  side,
  schoolSettings = DEFAULT_SCHOOL_SETTINGS,
  onSideChange,
  onPrint,
  onEditDesign,
}: CardPreviewProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const academicYears = useMemo(() => getClassTrack(student.className), [student.className]);

  const handleDownloadPng = async () => {
    if (!cardRef.current) return;
    try {
      setIsExporting(true);
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        quality: 0.95,
        pixelRatio: 3, // High DPI print ready
      });
      const link = document.createElement('a');
      link.download = `${student.name.replace(/\s+/g, '_')}_${side}_card.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download card PNG:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const qrData = useMemo(() => {
    return JSON.stringify({
      id: student.id,
      name: student.name,
      class: student.className,
      school: schoolSettings.schoolName,
      status: student.status,
    });
  }, [student, schoolSettings]);

  const styleClass = `card-style-${schoolSettings.cardStyle || 'classic'}`;

  return (
    <section className="card-panel">
      <div className="section-heading">
        <div>
          <h2>Card preview</h2>
          <p>Live render for {student.name}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadPng}
            disabled={isExporting}
            data-icon="inline-start"
            title="Export high-resolution PNG image"
          >
            <Download aria-hidden="true" size={14} />
            {isExporting ? 'Saving...' : 'PNG'}
          </Button>
          <Button variant="outline" size="sm" onClick={onPrint} data-icon="inline-start">
            <Printer aria-hidden="true" size={14} />
            Print card
          </Button>
        </div>
      </div>

      <div className="preview-wrap">
        <div className="preview-tabs" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 16 }}>
            <button
              type="button"
              className={side === 'front' ? 'active' : ''}
              onClick={() => onSideChange('front')}
            >
              Front side
            </button>
            <button
              type="button"
              className={side === 'back' ? 'active' : ''}
              onClick={() => onSideChange('back')}
            >
              Back side
            </button>
          </div>

          <button
            type="button"
            onClick={() => onSideChange(side === 'front' ? 'back' : 'front')}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 11,
              color: '#166534',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontWeight: 600,
            }}
            title="Flip to other side"
          >
            <RefreshCw size={12} />
            Flip
          </button>
        </div>

        {/* Card Canvas Container */}
        <div
          ref={cardRef}
          id="printable-id-card"
          className={`id-card ${side} ${styleClass}`}
        >
          {side === 'front' ? (
            <CardFront
              student={student}
              schoolSettings={schoolSettings}
            />
          ) : (
            <CardBack
              student={student}
              academicYears={academicYears}
              schoolSettings={schoolSettings}
              qrData={qrData}
            />
          )}
        </div>
      </div>

      <div className="card-meta">
        <div>
          <span>Card status</span>
          <b>
            <i
              className="status-dot"
              style={{
                backgroundColor: student.status === 'Active' ? '#22c55e' : '#eab308',
              }}
              aria-hidden="true"
            />
            {student.status === 'Active' ? 'Active & Ready' : 'Inactive / Draft'}
          </b>
        </div>
        <Button size="sm" variant="outline" onClick={onEditDesign} data-icon="inline-start">
          <Palette size={13} style={{ marginRight: 4 }} />
          Card Studio
        </Button>
      </div>
    </section>
  );
}

function CardFront({
  student,
  schoolSettings,
}: {
  student: Student;
  schoolSettings: SchoolSettings;
}) {
  const photo = student.photoUrl || FRONT_PHOTO_URL;
  const themeColor = schoolSettings.themeColor || '#1b4d34';

  return (
    <div className="card-inner-front" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Dual-logo header: RTB left | school info center | CYAHA right */}
      <div
        className="card-header"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '4px 4px 2px',
          height: '24%',
          gap: 4,
          borderBottom: `1.5px solid ${themeColor}22`,
        }}
      >
        {/* RTB Logo — Left */}
        <div
          style={{
            width: 34,
            height: 34,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 4,
            overflow: 'hidden',
            border: `1px solid ${themeColor}33`,
            background: '#fff',
            padding: 1,
          }}
        >
          <img
            src="/logoon%20card/rtblogo.png"
            alt="RTB Logo"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            crossOrigin="anonymous"
          />
        </div>

        {/* School Info — Center */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
            padding: '0 3px',
            textAlign: 'center',
          }}
        >
          <strong
            style={{
              fontSize: 7.5,
              fontWeight: 900,
              color: themeColor,
              letterSpacing: 0.3,
              lineHeight: 1.2,
              textTransform: 'uppercase',
            }}
          >
            {schoolSettings.schoolName}
          </strong>
          <span style={{ fontSize: 6, color: '#555', fontWeight: 600 }}>
            {schoolSettings.district}
          </span>
          <em
            style={{
              fontStyle: 'normal',
              fontSize: 5.5,
              color: '#777',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '100%',
            }}
          >
            {schoolSettings.email}
          </em>
        </div>

        {/* CYAHA Logo — Right */}
        <div
          style={{
            width: 34,
            height: 34,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 4,
            overflow: 'hidden',
            border: `1px solid ${themeColor}33`,
            background: '#fff',
            padding: 1,
          }}
        >
          <img
            src="/logoon%20card/logocyaha.png"
            alt="CYAHA Logo"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            crossOrigin="anonymous"
          />
        </div>
      </div>

      <div
        className="green-band"
        style={{
          background: `linear-gradient(90deg, ${themeColor} 0%, ${schoolSettings.accentColor || '#285d3d'} 100%)`,
          color: '#ffffff',
          letterSpacing: 2,
          fontWeight: 900,
          fontSize: 7.5,
        }}
      >
        STUDENT IDENTITY CARD
      </div>

      <div className="card-body">
        <div
          className="portrait"
          style={{
            border: `2px solid ${themeColor}55`,
            borderRadius: 6,
            boxShadow: `0 2px 8px ${themeColor}22`,
          }}
        >
          <img
            src={photo}
            alt={`${student.name}'s portrait`}
            crossOrigin="anonymous"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>
        <div className="details">
          <p>
            <b style={{ color: themeColor }}>Name</b>
            <strong>{student.name}</strong>
          </p>
          <p>
            <b style={{ color: themeColor }}>ID No.</b>
            <strong style={{ fontFamily: 'monospace' }}>{student.id}</strong>
          </p>
          <p>
            <b style={{ color: themeColor }}>Class/Trade</b>
            <strong>{student.className}</strong>
          </p>
          <p>
            <b style={{ color: themeColor }}>Gender</b>
            <strong>{student.gender.toUpperCase()}</strong>
          </p>
          <p>
            <b style={{ color: themeColor }}>Mother&apos;s Name</b>
            <strong>{student.motherName || 'Parent / Guardian'}</strong>
          </p>
          <p>
            <b style={{ color: themeColor }}>Father&apos;s Name</b>
            <strong>{student.fatherName || 'Parent / Guardian'}</strong>
          </p>
          <p>
            <b style={{ color: themeColor }}>Contact</b>
            <strong>{student.contact || 'N/A'}</strong>
          </p>
        </div>
      </div>

      <div
        className="card-footer"
        style={{ borderTop: `1.5px solid ${themeColor}33`, alignItems: 'center' }}
      >
        {/* Left: Residence */}
        <div>
          <b style={{ color: themeColor, textDecoration: 'none' }}>Residence</b>
          <strong>{student.residence || 'Kigali City'}</strong>
        </div>

        {/* Center: Signature + Stamp */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1 }}>
          <i style={{ color: themeColor, fontSize: 5.5 }}>
            {schoolSettings.headTeacherSignatureText || "Head Teacher's Signature"}:
          </i>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <span style={{ fontFamily: 'cursive', fontSize: 7.5, color: themeColor }}>
              {schoolSettings.headTeacherName || 'M. Jean Paul'}
            </span>
            <img
              src="/Stamp/HT%20Stamp(1).png"
              alt="Official HT Stamp"
              crossOrigin="anonymous"
              style={{
                width: 42,
                height: 42,
                objectFit: 'contain',
                opacity: 0.95,
                filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.2))',
                flexShrink: 0,
              }}
            />
          </div>
        </div>

        {/* Right: Website */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <span style={{ fontSize: 5, color: themeColor, fontWeight: 700, letterSpacing: 0.3 }}>Visit us:</span>
          <span
            style={{
              fontSize: 5.5,
              color: themeColor,
              fontWeight: 800,
              letterSpacing: 0.2,
              borderBottom: `0.5px solid ${themeColor}88`,
              paddingBottom: 1,
            }}
          >
            www.gscyahafi.ac.rw
          </span>
        </div>
      </div>
    </div>
  );
}

function CardBack({
  student,
  academicYears,
  schoolSettings,
  qrData,
}: {
  student: Student;
  academicYears: string[];
  schoolSettings: SchoolSettings;
  qrData: string;
}) {
  return (
    <div className="card-inner-back" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="notice">
        This card is the official property of <b>{schoolSettings.schoolName}</b>.<br />
        If found, please return to school administration or call {schoolSettings.phone || 'given contact'}.
      </div>

      <div className="years">
        {academicYears.map((level, index) => {
          const startYr = 2025 + index;
          const endYr = 2026 + index;
          return (
            <div key={level}>
              <b>A.Y.: {startYr}-{endYr}</b>
              <strong>{level}</strong>
              <small>{level === student.className ? 'Current' : 'Next'}</small>
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '6px 6px 0',
          borderTop: '1px solid #dde7df',
        }}
      >
        {/* Website on the left */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
          <span style={{ fontSize: 5, color: '#68766d', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>Official Website</span>
          <span
            style={{
              fontSize: 6,
              color: schoolSettings.themeColor || '#1b4d34',
              fontWeight: 800,
              letterSpacing: 0.3,
              borderBottom: `0.5px solid ${schoolSettings.themeColor || '#1b4d34'}88`,
              paddingBottom: 1,
            }}
          >
            www.gscyahafi.ac.rw
          </span>
          <span style={{ fontSize: 5, color: '#68766d' }}>
            Valid: {student.issueDate || '2025'} — {student.expiryDate || '2026'}
          </span>
        </div>

        {/* QR code on the right */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <QRCodeDisplay data={qrData} size={48} />
          <span style={{ fontSize: 5.5, color: '#758279', fontWeight: 700, letterSpacing: 0.4 }}>Scan to Verify</span>
        </div>
      </div>
    </div>
  );
}