'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  Filter,
  ChevronDown,
  MoreHorizontal,
  FileSpreadsheet,
  Download,
  Trash2,
  Printer,
  Edit2,
  Check,
  X,
  UserCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Student, CLASS_OPTIONS } from '../types';
import { filterStudents, exportStudentsToExcel } from '../utils';

interface StudentTableProps {
  students: Student[];
  selectedId: string;
  query: string;
  classFilter: string;
  genderFilter?: string;
  statusFilter?: string;
  onQueryChange: (query: string) => void;
  onClassFilterChange: (filter: string) => void;
  onGenderFilterChange?: (filter: string) => void;
  onStatusFilterChange?: (filter: string) => void;
  onSelectStudent: (student: Student) => void;
  onImportClick: () => void;
  onEditStudent?: (student: Student) => void;
  onDeleteStudent?: (id: string) => void;
  onBatchDelete?: (ids: string[]) => void;
  onBatchPrint?: (students: Student[]) => void;
  onBatchStatusChange?: (ids: string[], status: 'Active' | 'Inactive') => void;
}

export function StudentTable({
  students,
  selectedId,
  query,
  classFilter,
  genderFilter = 'All',
  statusFilter = 'All',
  onQueryChange,
  onClassFilterChange,
  onGenderFilterChange,
  onStatusFilterChange,
  onSelectStudent,
  onImportClick,
  onEditStudent,
  onDeleteStudent,
  onBatchDelete,
  onBatchPrint,
  onBatchStatusChange,
}: StudentTableProps) {
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const menuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenuId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = useMemo(
    () => filterStudents(students, query, classFilter, genderFilter, statusFilter),
    [students, query, classFilter, genderFilter, statusFilter]
  );

  // Reset page when filter or query changes
  useEffect(() => {
    setPage(1);
  }, [query, classFilter, genderFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedStudents = filtered.slice(startIndex, startIndex + pageSize);

  const isAllSelected =
    paginatedStudents.length > 0 &&
    paginatedStudents.every((s) => selectedStudentIds.includes(s.id));

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      const pageIds = new Set(paginatedStudents.map((s) => s.id));
      setSelectedStudentIds((prev) => prev.filter((id) => !pageIds.has(id)));
    } else {
      const newSelected = new Set([...selectedStudentIds, ...paginatedStudents.map((s) => s.id)]);
      setSelectedStudentIds(Array.from(newSelected));
    }
  };

  const handleToggleRowSelect = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleExportRoster = async () => {
    await exportStudentsToExcel(filtered);
  };

  const selectedStudentsObjects = useMemo(
    () => students.filter((s) => selectedStudentIds.includes(s.id)),
    [students, selectedStudentIds]
  );

  return (
    <section className="students-panel" style={{ position: 'relative' }}>
      <div className="section-heading">
        <div>
          <h2>Students roster</h2>
          <p>Manage enrolled student records, ID generation, and exports.</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              data-icon="inline-start"
            >
              <Filter aria-hidden="true" size={13} />
              Filter
              <ChevronDown aria-hidden="true" size={13} />
            </Button>

            {showFilterDropdown && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: 6,
                  width: 220,
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
                  padding: 14,
                  zIndex: 20,
                }}
              >
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>
                    Gender
                  </label>
                  <select
                    value={genderFilter}
                    onChange={(e) => onGenderFilterChange?.(e.target.value)}
                    style={{
                      width: '100%',
                      height: 30,
                      borderRadius: 6,
                      fontSize: 11,
                      border: '1px solid var(--border)',
                      background: 'transparent',
                    }}
                  >
                    <option value="All">All Genders</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, display: 'block', marginBottom: 4 }}>
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => onStatusFilterChange?.(e.target.value)}
                    style={{
                      width: '100%',
                      height: 30,
                      borderRadius: 6,
                      fontSize: 11,
                      border: '1px solid var(--border)',
                      background: 'transparent',
                    }}
                  >
                    <option value="All">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportRoster}
            data-icon="inline-start"
            title="Download full roster as Excel"
          >
            <Download aria-hidden="true" size={13} />
            Export Excel
          </Button>
        </div>
      </div>

      <div className="toolbar">
        <div className="search">
          <Search aria-hidden="true" />
          <input
            type="search"
            placeholder="Search by name, ID, class, residence..."
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            aria-label="Search students"
          />
        </div>

        <select
          value={classFilter}
          onChange={(e) => onClassFilterChange(e.target.value)}
          aria-label="Filter by class"
        >
          {CLASS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <Button variant="outline" size="sm" onClick={onImportClick} data-icon="inline-start">
          <FileSpreadsheet aria-hidden="true" />
          Import Excel
        </Button>
      </div>

      {/* Floating Bulk Action Bar */}
      {selectedStudentIds.length > 0 && (
        <div
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            padding: '8px 14px',
            borderRadius: 8,
            marginBottom: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
            boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
            fontSize: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 600, color: '#166534' }}>
              {selectedStudentIds.length} student{selectedStudentIds.length > 1 ? 's' : ''} selected
            </span>
            <button
              onClick={() => setSelectedStudentIds([])}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--muted-foreground)',
                cursor: 'pointer',
                fontSize: 11,
                textDecoration: 'underline',
              }}
            >
              Clear
            </button>
          </div>

          <div style={{ display: 'flex', gap: 6 }}>
            {onBatchPrint && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onBatchPrint(selectedStudentsObjects)}
                style={{ fontSize: 11, height: 28 }}
              >
                <Printer size={12} style={{ marginRight: 4 }} />
                Print Selected
              </Button>
            )}

            {onBatchStatusChange && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onBatchStatusChange(selectedStudentIds, 'Active')}
                style={{ fontSize: 11, height: 28 }}
              >
                <UserCheck size={12} style={{ marginRight: 4 }} />
                Set Active
              </Button>
            )}

            {onBatchDelete && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (
                    confirm(
                      `Are you sure you want to remove ${selectedStudentIds.length} student(s)?`
                    )
                  ) {
                    onBatchDelete(selectedStudentIds);
                    setSelectedStudentIds([]);
                  }
                }}
                style={{ fontSize: 11, height: 28, color: '#dc2626' }}
              >
                <Trash2 size={12} style={{ marginRight: 4 }} />
                Delete
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleToggleSelectAll}
                  aria-label="Select all students on page"
                />
              </th>
              <th>Student</th>
              <th>Student ID</th>
              <th>Class</th>
              <th>Gender</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {paginatedStudents.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '36px 12px', color: 'var(--muted-foreground)' }}>
                  No students found matching your criteria. Try adjusting the search or filters.
                </td>
              </tr>
            ) : (
              paginatedStudents.map((student) => {
                const isSelected = selectedStudentIds.includes(student.id);
                const isCurrent = selectedId === student.id;

                return (
                  <tr
                    key={student.id}
                    onClick={() => onSelectStudent(student)}
                    className={isCurrent ? 'selected-row' : ''}
                    style={{ position: 'relative' }}
                  >
                    <td onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleToggleRowSelect(e as any, student.id)}
                        aria-label={`Select ${student.name}`}
                      />
                    </td>
                    <td>
                      <div className="student-cell">
                        <div
                          className="mini-avatar"
                          style={{
                            overflow: 'hidden',
                            position: 'relative',
                          }}
                        >
                          {student.photoUrl ? (
                            <img
                              src={student.photoUrl}
                              alt=""
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            student.initials
                          )}
                        </div>
                        <div>
                          <b>{student.name}</b>
                          {student.residence && (
                            <small
                              style={{
                                display: 'block',
                                fontSize: 9,
                                color: 'var(--muted-foreground)',
                              }}
                            >
                              {student.residence}
                            </small>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="id-code">{student.id}</td>
                    <td>
                      <span className="class-pill">{student.className}</span>
                    </td>
                    <td>{student.gender}</td>
                    <td>
                      <span className={`status ${student.status.toLowerCase()}`}>
                        <i aria-hidden="true" />
                        {student.status}
                      </span>
                    </td>
                    <td onClick={(e) => e.stopPropagation()} style={{ position: 'relative' }}>
                      <button
                        className="dots"
                        aria-label="More options"
                        onClick={() =>
                          setActiveMenuId(activeMenuId === student.id ? null : student.id)
                        }
                      >
                        <MoreHorizontal aria-hidden="true" />
                      </button>

                      {activeMenuId === student.id && (
                        <div
                          ref={menuRef}
                          style={{
                            position: 'absolute',
                            right: 10,
                            top: 30,
                            background: 'var(--card)',
                            border: '1px solid var(--border)',
                            borderRadius: 8,
                            boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
                            padding: 4,
                            zIndex: 50,
                            minWidth: 140,
                            display: 'flex',
                            flexDirection: 'column',
                          }}
                        >
                          <button
                            onClick={() => {
                              onSelectStudent(student);
                              setActiveMenuId(null);
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              textAlign: 'left',
                              padding: '7px 10px',
                              fontSize: 11,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                              color: 'inherit',
                              borderRadius: 4,
                            }}
                          >
                            <Printer size={13} />
                            View Card
                          </button>

                          {onEditStudent && (
                            <button
                              onClick={() => {
                                onEditStudent(student);
                                setActiveMenuId(null);
                              }}
                              style={{
                                background: 'none',
                                border: 'none',
                                textAlign: 'left',
                                padding: '7px 10px',
                                fontSize: 11,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                color: 'inherit',
                                borderRadius: 4,
                              }}
                            >
                              <Edit2 size={13} />
                              Edit Student
                            </button>
                          )}

                          {onDeleteStudent && (
                            <button
                              onClick={() => {
                                if (confirm(`Remove ${student.name} from records?`)) {
                                  onDeleteStudent(student.id);
                                }
                                setActiveMenuId(null);
                              }}
                              style={{
                                background: 'none',
                                border: 'none',
                                textAlign: 'left',
                                padding: '7px 10px',
                                fontSize: 11,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                color: '#dc2626',
                                borderRadius: 4,
                              }}
                            >
                              <Trash2 size={13} />
                              Delete
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <span>
          Showing <b>{paginatedStudents.length}</b> of <b>{filtered.length}</b> students
          {filtered.length !== students.length && ` (filtered from ${students.length})`}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
          >
            Previous
          </Button>
          <span style={{ fontSize: 11, padding: '0 4px', color: 'var(--muted-foreground)' }}>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </section>
  );
}