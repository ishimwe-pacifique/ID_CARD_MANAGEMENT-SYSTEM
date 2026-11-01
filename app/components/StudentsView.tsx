'use client';

import { useState } from 'react';
import { Student } from '../types';
import { StudentTable } from './StudentTable';
import { Button } from '@/components/ui/button';
import { UserPlus, Upload, Download, Users, CheckCircle2, AlertCircle, LayoutGrid, List } from 'lucide-react';
import { exportStudentsToExcel } from '../utils';

interface StudentsViewProps {
  students: Student[];
  selectedStudent: Student;
  query: string;
  classFilter: string;
  onQueryChange: (query: string) => void;
  onClassFilterChange: (filter: string) => void;
  onSelectStudent: (student: Student) => void;
  onAddStudent: () => void;
  onImportClick: () => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onBatchDelete: (ids: string[]) => void;
  onBatchPrint: (students: Student[]) => void;
  onBatchStatusChange: (ids: string[], status: 'Active' | 'Inactive') => void;
}

export function StudentsView({
  students,
  selectedStudent,
  query,
  classFilter,
  onQueryChange,
  onClassFilterChange,
  onSelectStudent,
  onAddStudent,
  onImportClick,
  onEditStudent,
  onDeleteStudent,
  onBatchDelete,
  onBatchPrint,
  onBatchStatusChange,
}: StudentsViewProps) {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [genderFilter, setGenderFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const activeCount = students.filter((s) => s.status === 'Active').length;
  const inactiveCount = students.filter((s) => s.status === 'Inactive').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Top Banner */}
      <div
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h1 style={{ fontSize: 22, margin: 0, fontWeight: 700 }}>Student Directory & Records</h1>
            <div style={{ display: 'flex', gap: 6 }}>
              <span
                style={{
                  fontSize: 11,
                  background: '#e6f7ec',
                  color: '#166534',
                  padding: '2px 8px',
                  borderRadius: 20,
                  fontWeight: 600,
                }}
              >
                {activeCount} Active
              </span>
              {inactiveCount > 0 && (
                <span
                  style={{
                    fontSize: 11,
                    background: '#fef3c7',
                    color: '#b45309',
                    padding: '2px 8px',
                    borderRadius: 20,
                    fontWeight: 600,
                  }}
                >
                  {inactiveCount} Inactive
                </span>
              )}
            </div>
          </div>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--muted-foreground)' }}>
            Total of {students.length} students enrolled in the identity registry.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Button variant="outline" size="sm" onClick={onImportClick} data-icon="inline-start">
            <Upload size={14} />
            Import Roster
          </Button>

          <Button
            size="sm"
            onClick={onAddStudent}
            style={{ background: '#166534', color: '#fff' }}
            data-icon="inline-start"
          >
            <UserPlus size={14} />
            Add Student
          </Button>
        </div>
      </div>

      {/* Main Table */}
      <StudentTable
        students={students}
        selectedId={selectedStudent.id}
        query={query}
        classFilter={classFilter}
        genderFilter={genderFilter}
        statusFilter={statusFilter}
        onQueryChange={onQueryChange}
        onClassFilterChange={onClassFilterChange}
        onGenderFilterChange={setGenderFilter}
        onStatusFilterChange={setStatusFilter}
        onSelectStudent={onSelectStudent}
        onImportClick={onImportClick}
        onEditStudent={onEditStudent}
        onDeleteStudent={onDeleteStudent}
        onBatchDelete={onBatchDelete}
        onBatchPrint={onBatchPrint}
        onBatchStatusChange={onBatchStatusChange}
      />
    </div>
  );
}
