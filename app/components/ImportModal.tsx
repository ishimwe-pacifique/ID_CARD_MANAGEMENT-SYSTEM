'use client';

import { useRef, useState } from 'react';
import { X, FileSpreadsheet, Upload, BookOpen, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { importStudentsFromRows, downloadExcelTemplate } from '../utils';
import { Student } from '../types';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (students: Student[]) => void;
}

export function ImportModal({ isOpen, onClose, onImport }: ImportModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    setError(null);
    setSuccess(null);
    setIsProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const { read, utils } = await import('xlsx');
      const workbook = read(arrayBuffer, { cellDates: true });
      const firstSheetName = workbook.SheetNames[0];
      if (!firstSheetName) {
        throw new Error('The workbook contains no sheets.');
      }
      const sheet = workbook.Sheets[firstSheetName];
      const rows = utils.sheet_to_json<Record<string, unknown>>(sheet);

      if (rows.length === 0) {
        throw new Error('The uploaded file is empty. Please check the sheet.');
      }

      const { students, errors } = importStudentsFromRows(rows as any[]);

      if (errors.length > 0 && students.length === 0) {
        setError(`Import failed: ${errors.slice(0, 3).join('; ')}`);
        setIsProcessing(false);
        return;
      }

      if (students.length > 0) {
        setSuccess(`Successfully parsed ${students.length} student(s)!`);
        setTimeout(() => {
          onImport(students);
        }, 600);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import file. Please check the format.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      setIsDownloading(true);
      await downloadExcelTemplate();
    } catch (err) {
      setError('Failed to download template. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleClick = () => fileRef.current?.click();

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="import-title">
      <div
        className="import-modal"
        onClick={(e) => e.stopPropagation()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <button className="close" onClick={onClose} aria-label="Close import dialog">
          <X aria-hidden="true" />
        </button>

        <div className="import-icon">
          <FileSpreadsheet aria-hidden="true" />
        </div>

        <h2 id="import-title">Import student list</h2>
        <p>
          Upload an Excel (.xlsx, .xls) or CSV file. We&apos;ll automatically map columns and enroll the students.
        </p>

        <div
          className={`dropzone ${isDragging ? 'dragging' : ''}`}
          onClick={handleClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleClick()}
          aria-label="Dropzone for file upload"
        >
          <Upload aria-hidden="true" />
          <b>{isProcessing ? 'Processing spreadsheet...' : 'Drop your file here or browse'}</b>
          <span>Supports Excel (.xlsx, .xls) and CSV up to 10MB</span>
          <input
            ref={fileRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            hidden
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          />
        </div>

        {error && (
          <div className="import-error" role="alert" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertCircle size={15} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="import-success" role="status" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle2 size={15} style={{ flexShrink: 0 }} />
            <span>{success}</span>
          </div>
        )}

        <div className="import-help">
          <BookOpen aria-hidden="true" />
          <span>
            Expected columns: <b>Full Name, Student ID, Class, Gender, Father&apos;s Name, Mother&apos;s Name, Contact, Residence</b>
          </span>
        </div>

        <Button
          variant="outline"
          className="template"
          onClick={handleDownloadTemplate}
          disabled={isDownloading}
          data-icon="inline-start"
        >
          <FileText aria-hidden="true" />
          {isDownloading ? 'Generating template...' : 'Download sample Excel template'}
        </Button>
      </div>
    </div>
  );
}