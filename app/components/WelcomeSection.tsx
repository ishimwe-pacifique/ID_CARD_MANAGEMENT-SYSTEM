'use client';

import { useState, useEffect } from 'react';
import { Upload, Plus, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SchoolSettings } from '../types';

interface WelcomeSectionProps {
  schoolSettings?: SchoolSettings;
  onImportClick: () => void;
  onAddStudentClick: () => void;
  onBulkPrintClick?: () => void;
}

export function WelcomeSection({
  schoolSettings,
  onImportClick,
  onAddStudentClick,
  onBulkPrintClick,
}: WelcomeSectionProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formattedDate = mounted
    ? new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).toUpperCase()
    : 'STUDENT IDENTITY WORKSPACE';

  return (
    <div className="welcome">
      <div>
        <p className="eyebrow" suppressHydrationWarning>
          {formattedDate}
        </p>
        <h1>Good morning, Admin</h1>
        <p className="muted">
          Here&apos;s what&apos;s happening at{' '}
          {schoolSettings?.schoolName || 'GS Cyahafi / TSS'} today.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <Button onClick={onImportClick} variant="outline" data-icon="inline-start">
          <Upload aria-hidden="true" size={15} />
          Import students
        </Button>

        {onBulkPrintClick && (
          <Button onClick={onBulkPrintClick} variant="outline" data-icon="inline-start">
            <Printer aria-hidden="true" size={15} />
            Bulk Print
          </Button>
        )}

        <Button
          onClick={onAddStudentClick}
          data-icon="inline-start"
          style={{ background: '#166534', color: '#fff' }}
        >
          <Plus aria-hidden="true" size={15} />
          Add student
        </Button>
      </div>
    </div>
  );
}