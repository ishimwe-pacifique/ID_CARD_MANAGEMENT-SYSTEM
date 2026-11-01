'use client';

import { useState, useMemo } from 'react';
import { Student, SchoolSettings, CLASS_OPTIONS } from '../types';
import { Button } from '@/components/ui/button';
import { Printer, Filter, Layers, CheckSquare, Square, Grid, Scissors } from 'lucide-react';
import { QRCodeDisplay } from './QRCodeDisplay';
import { BarcodeDisplay } from './BarcodeDisplay';
import { FRONT_PHOTO_URL, getClassTrack } from '../utils';

interface BulkPrintViewProps {
  students: Student[];
  schoolSettings: SchoolSettings;
  onPrintBatch: () => void;
}

export function BulkPrintView({ students, schoolSettings, onPrintBatch }: BulkPrintViewProps) {
  const [classFilter, setClassFilter] = useState<string>('All classes');
  const [printSide, setPrintSide] = useState<'front' | 'back' | 'both'>('front');
  const [selectedIds, setSelectedIds] = useState<string[]>(students.map((s) => s.id));
  const [showCropMarks, setShowCropMarks] = useState(true);

  const filteredStudents = useMemo(() => {
    return students.filter(
      (s) => classFilter === 'All classes' || s.className === classFilter
    );
  }, [students, classFilter]);

  const printableStudents = useMemo(() => {
    return filteredStudents.filter((s) => selectedIds.includes(s.id));
  }, [filteredStudents, selectedIds]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredStudents.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredStudents.map((s) => s.id));
    }
  };

  const toggleSelectStudent = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleTriggerPrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Controls Header - hidden during print */}
      <div
        className="no-print"
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, margin: '0 0 4px', fontWeight: 700 }}>
              Batch Card Printing Suite
            </h1>
            <p style={{ margin: 0, fontSize: 12, color: 'var(--muted-foreground)' }}>
              Print multi-card sheets on standard A4 / Letter paper or PVC card trays with cut guides.
            </p>
          </div>

          <Button
            size="sm"
            onClick={handleTriggerPrint}
            disabled={printableStudents.length === 0}
            style={{
              background: '#166534',
              color: '#ffffff',
              padding: '8px 18px',
              fontWeight: 600,
            }}
          >
            <Printer size={15} style={{ marginRight: 6 }} />
            Print Batch ({printableStudents.length} Cards)
          </Button>
        </div>

        {/* Filter & Layout options */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 14,
            paddingTop: 12,
            borderTop: '1px solid var(--border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 600 }}>Filter by Class:</span>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              style={{
                height: 32,
                borderRadius: 6,
                border: '1px solid var(--border)',
                background: 'var(--card)',
                fontSize: 12,
                padding: '0 8px',
              }}
            >
              {CLASS_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 600 }}>Print Side:</span>
            <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden' }}>
              <button
                type="button"
                onClick={() => setPrintSide('front')}
                style={{
                  padding: '5px 12px',
                  fontSize: 11,
                  background: printSide === 'front' ? '#166534' : 'transparent',
                  color: printSide === 'front' ? '#fff' : 'inherit',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Front Only
              </button>
              <button
                type="button"
                onClick={() => setPrintSide('back')}
                style={{
                  padding: '5px 12px',
                  fontSize: 11,
                  background: printSide === 'back' ? '#166534' : 'transparent',
                  color: printSide === 'back' ? '#fff' : 'inherit',
                  border: 'none',
                  borderLeft: '1px solid var(--border)',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Back Only
              </button>
              <button
                type="button"
                onClick={() => setPrintSide('both')}
                style={{
                  padding: '5px 12px',
                  fontSize: 11,
                  background: printSide === 'both' ? '#166534' : 'transparent',
                  color: printSide === 'both' ? '#fff' : 'inherit',
                  border: 'none',
                  borderLeft: '1px solid var(--border)',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Front & Back
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={showCropMarks}
                onChange={(e) => setShowCropMarks(e.target.checked)}
              />
              <Scissors size={13} style={{ color: '#166534' }} />
              Show scissor cut guides
            </label>
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Button variant="outline" size="sm" onClick={toggleSelectAll} style={{ fontSize: 11, height: 30 }}>
              {selectedIds.length === filteredStudents.length ? 'Deselect All' : 'Select All'}
            </Button>
          </div>
        </div>
      </div>

      {/* Printable Sheet Viewport */}
      <div
        id="bulk-print-container"
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: 24,
        }}
      >
        <div
          className="no-print"
          style={{
            marginBottom: 16,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 12,
            color: 'var(--muted-foreground)',
          }}
        >
          <span>
            Print Preview: <b>{printableStudents.length}</b> cards ready for layout. (Standard CR80 85.6mm × 54mm)
          </span>
          <span>8 cards per A4 page</span>
        </div>

        {printableStudents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted-foreground)' }}>
            No students selected for printing. Check the filters or select students above.
          </div>
        ) : (
          <div
            className="bulk-sheet-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
              gap: 20,
            }}
          >
            {printableStudents.map((student) => {
              const academicYears = getClassTrack(student.className);
              const qrData = JSON.stringify({
                id: student.id,
                name: student.name,
                class: student.className,
                school: schoolSettings.schoolName,
              });

              return (
                <div
                  key={student.id}
                  className={`bulk-card-item ${showCropMarks ? 'with-crop' : ''}`}
                  style={{
                    position: 'relative',
                    border: showCropMarks ? '1px dashed #94a3b8' : 'none',
                    padding: 8,
                    borderRadius: 8,
                    background: '#ffffff',
                  }}
                >
                  {/* Selection checkbox - hidden during print */}
                  <div
                    className="no-print"
                    style={{
                      position: 'absolute',
                      top: 14,
                      right: 14,
                      zIndex: 10,
                      background: 'rgba(255,255,255,0.9)',
                      borderRadius: 4,
                      padding: 2,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(student.id)}
                      onChange={() => toggleSelectStudent(student.id)}
                    />
                  </div>

                  {(printSide === 'front' || printSide === 'both') && (
                    <div className="id-card front" style={{ marginBottom: printSide === 'both' ? 12 : 0 }}>
                      <div
                        className="card-header"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '4px 4px 2px',
                          height: '24%',
                          gap: 4,
                          borderBottom: `1.5px solid ${schoolSettings.themeColor || '#1b4d34'}22`,
                        }}
                      >
                        {/* RTB Logo — Left */}
                        <div
                          style={{
                            width: 34, height: 34, flexShrink: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            borderRadius: 4, overflow: 'hidden',
                            border: `1px solid ${schoolSettings.themeColor || '#1b4d34'}33`,
                            background: '#fff', padding: 1,
                          }}
                        >
                          <img src="/logoon%20card/rtblogo.png" alt="RTB Logo"
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            crossOrigin="anonymous" />
                        </div>

                        {/* School Info — Center */}
                        <div
                          style={{
                            flex: 1, display: 'flex', flexDirection: 'column',
                            alignItems: 'center', gap: 1, padding: '0 3px', textAlign: 'center',
                          }}
                        >
                          <strong style={{ fontSize: 7.5, fontWeight: 900, color: schoolSettings.themeColor || '#1b4d34', letterSpacing: 0.3, lineHeight: 1.2, textTransform: 'uppercase' }}>
                            {schoolSettings.schoolName}
                          </strong>
                          <span style={{ fontSize: 6, color: '#555', fontWeight: 600 }}>{schoolSettings.district}</span>
                          <em style={{ fontStyle: 'normal', fontSize: 5.5, color: '#777', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
                            {schoolSettings.email}
                          </em>
                        </div>

                        {/* CYAHA Logo — Right */}
                        <div
                          style={{
                            width: 34, height: 34, flexShrink: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            borderRadius: 4, overflow: 'hidden',
                            border: `1px solid ${schoolSettings.themeColor || '#1b4d34'}33`,
                            background: '#fff', padding: 1,
                          }}
                        >
                          <img src="/logoon%20card/logocyaha.png" alt="CYAHA Logo"
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            crossOrigin="anonymous" />
                        </div>
                      </div>

                      <div
                        className="green-band"
                        style={{
                          background: `linear-gradient(90deg, ${schoolSettings.themeColor || '#1b4d34'} 0%, ${schoolSettings.accentColor || '#285d3d'} 100%)`,
                          letterSpacing: 2, fontWeight: 900, fontSize: 7.5,
                        }}
                      >
                        STUDENT IDENTITY CARD
                      </div>

                      <div className="card-body">
                        <div className="portrait">
                          <img
                            src={student.photoUrl || FRONT_PHOTO_URL}
                            alt=""
                            crossOrigin="anonymous"
                          />
                        </div>
                        <div className="details">
                          <p>
                            <b>Name</b>
                            <strong>{student.name}</strong>
                          </p>
                          <p>
                            <b>ID No.</b>
                            <strong>{student.id}</strong>
                          </p>
                          <p>
                            <b>Class</b>
                            <strong>{student.className}</strong>
                          </p>
                          <p>
                            <b>Gender</b>
                            <strong>{student.gender.toUpperCase()}</strong>
                          </p>
                          <p>
                            <b>Contact</b>
                            <strong>{student.contact}</strong>
                          </p>
                        </div>
                      </div>

                      <div className="card-footer">
                        <div>
                          <b>Place of Residence</b>
                          <strong>{student.residence}</strong>
                        </div>
                        <div className="signature">
                          <i>{schoolSettings.headTeacherSignatureText}:</i>
                          <span style={{ fontSize: 7, color: '#166534' }}>
                            {schoolSettings.headTeacherName}
                          </span>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <span style={{ fontSize: 5.5, color: schoolSettings.themeColor || '#1b4d34', fontWeight: 700 }}>www.gscyahafi.ac.rw</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {(printSide === 'back' || printSide === 'both') && (
                    <div className="id-card back">
                      <div className="notice">
                        This Card is the property of <b>{schoolSettings.schoolName}</b>.<br />
                        If found return to {schoolSettings.schoolName} or call {schoolSettings.phone}
                      </div>

                      <div className="years">
                        {academicYears.map((level, index) => (
                          <div key={level}>
                            <b>A.Y.: {2025 + index}-{2026 + index}</b>
                            <strong>{level}</strong>
                            <small>{level === student.className ? 'Current' : 'Next'}</small>
                          </div>
                        ))}
                      </div>

                      <div
                        style={{
                          marginTop: 'auto',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '6px 4px 0',
                        }}
                      >
                        <div>
                          <BarcodeDisplay value={student.id} width={110} height={20} showText={true} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <QRCodeDisplay data={qrData} size={42} />
                          <small style={{ fontSize: 5, color: '#68766d' }}>Verify</small>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
