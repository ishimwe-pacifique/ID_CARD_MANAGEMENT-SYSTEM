'use client';

import { useState, useCallback, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { WelcomeSection } from './components/WelcomeSection';
import { StatCards } from './components/StatCards';
import { StudentTable } from './components/StudentTable';
import { CardPreview } from './components/CardPreview';
import { ImportModal } from './components/ImportModal';
import { StudentModal } from './components/StudentModal';
import { StudentsView } from './components/StudentsView';
import { CardStudioView } from './components/CardStudioView';
import { BulkPrintView } from './components/BulkPrintView';
import { SchoolSettingsView } from './components/SchoolSettingsView';
import { HelpCenterView } from './components/HelpCenterView';
import { ToastContainer } from './components/ToastContainer';
import {
  Student,
  SchoolSettings,
  ToastMessage,
} from './types';
import {
  SEED_STUDENTS,
  DEFAULT_SCHOOL_SETTINGS,
  loadSavedStudents,
  saveStudents,
  loadSavedSettings,
  saveSettings,
} from './utils';
import {
  getDbStatus,
  fetchStudentsFromDb,
  saveStudentToDb,
  saveMultipleStudentsToDb,
  deleteStudentFromDb,
  batchDeleteStudentsFromDb,
  fetchSettingsFromDb,
  saveSettingsToDb,
  DbStatusResponse,
} from '@/lib/api';

export default function Page() {
  const [students, setStudents] = useState<Student[]>(SEED_STUDENTS);
  const [schoolSettings, setSchoolSettings] = useState<SchoolSettings>(DEFAULT_SCHOOL_SETTINGS);
  const [query, setQuery] = useState('');
  const [classFilter, setClassFilter] = useState<'All classes' | string>('All classes');
  const [selectedStudent, setSelectedStudent] = useState<Student>(SEED_STUDENTS[0]);
  const [cardSide, setCardSide] = useState<'front' | 'back'>('front');
  const [dark, setDark] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [currentPage, setCurrentPage] = useState('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // MongoDB status & sync state
  const [dbStatus, setDbStatus] = useState<DbStatusResponse | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Student modal state (for Add or Edit)
  const [studentModal, setStudentModal] = useState<{
    isOpen: boolean;
    mode: 'add' | 'edit';
    student: Student | null;
  }>({
    isOpen: false,
    mode: 'add',
    student: null,
  });

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Sync data from MongoDB Atlas
  const syncWithDatabase = useCallback(async (isInitial = false) => {
    setIsSyncing(true);
    try {
      // 1. Check DB health & status
      const status = await getDbStatus();
      setDbStatus(status);

      if (status.connected) {
        // 2. Fetch students from MongoDB Atlas
        const remoteStudents = await fetchStudentsFromDb();
        if (remoteStudents && remoteStudents.length > 0) {
          setStudents(remoteStudents);
          saveStudents(remoteStudents);
          setSelectedStudent((prev) => {
            const found = remoteStudents.find((s) => s.id === prev?.id);
            return found || remoteStudents[0];
          });
        }

        // 3. Fetch school settings from MongoDB Atlas
        const remoteSettings = await fetchSettingsFromDb();
        if (remoteSettings) {
          setSchoolSettings(remoteSettings);
          saveSettings(remoteSettings);
        }

        if (!isInitial) {
          showToast('Synced seamlessly with MongoDB Atlas.', 'success');
        }
      }
    } catch (err: unknown) {
      console.warn('MongoDB sync notice:', err);
      if (!isInitial) {
        showToast('Operating with local offline cache.', 'info');
      }
    } finally {
      setIsSyncing(false);
    }
  }, [showToast]);

  // Load persisted state on mount and trigger DB sync
  useEffect(() => {
    // Immediate render from local cache
    const loadedStudents = loadSavedStudents();
    const loadedSettings = loadSavedSettings();
    setStudents(loadedStudents);
    setSchoolSettings(loadedSettings);
    if (loadedStudents.length > 0) {
      setSelectedStudent(loadedStudents[0]);
    }

    // Connect & sync with MongoDB Atlas
    syncWithDatabase(true);
  }, [syncWithDatabase]);

  // Update students helper (updates memory + local storage)
  const updateStudentsList = useCallback((updater: (prev: Student[]) => Student[]) => {
    setStudents((prev) => {
      const next = updater(prev);
      saveStudents(next);
      return next;
    });
  }, []);

  // Import handler (bulk insert to MongoDB)
  const handleImport = useCallback(
    async (newStudents: Student[]) => {
      updateStudentsList((prev) => [...newStudents, ...prev]);
      setShowImport(false);
      if (newStudents.length > 0) {
        setSelectedStudent(newStudents[0]);
      }
      showToast(`Imported ${newStudents.length} student(s). Syncing to MongoDB...`);

      try {
        await saveMultipleStudentsToDb(newStudents);
        const status = await getDbStatus();
        setDbStatus(status);
        showToast(`Successfully saved ${newStudents.length} student(s) to MongoDB Atlas.`);
      } catch (e: unknown) {
        console.error('Failed to sync imported students to MongoDB:', e);
        showToast('Saved locally. MongoDB sync will retry on next connection.', 'info');
      }
    },
    [updateStudentsList, showToast]
  );

  // Add student click handler
  const handleOpenAddStudent = useCallback(() => {
    setStudentModal({
      isOpen: true,
      mode: 'add',
      student: null,
    });
  }, []);

  // Edit student click handler
  const handleOpenEditStudent = useCallback((student: Student) => {
    setStudentModal({
      isOpen: true,
      mode: 'edit',
      student,
    });
  }, []);

  // Save student (from Add or Edit modal) -> Save to MongoDB Atlas
  const handleSaveStudent = useCallback(
    async (studentData: Student) => {
      const isAdd = studentModal.mode === 'add';
      if (isAdd) {
        updateStudentsList((prev) => [studentData, ...prev]);
        setSelectedStudent(studentData);
        showToast(`Student "${studentData.name}" enrolled. Syncing to MongoDB...`);
      } else {
        updateStudentsList((prev) =>
          prev.map((s) => (s.id === studentData.id ? studentData : s))
        );
        setSelectedStudent(studentData);
        showToast(`Updated details for "${studentData.name}". Syncing...`);
      }
      setStudentModal({ isOpen: false, mode: 'add', student: null });

      // Save to MongoDB
      try {
        await saveStudentToDb(studentData);
        const status = await getDbStatus();
        setDbStatus(status);
        showToast(`"${studentData.name}" saved to MongoDB Atlas.`);
      } catch (err: unknown) {
        console.error('MongoDB save error:', err);
        showToast('Saved locally (MongoDB sync deferred).', 'info');
      }
    },
    [studentModal.mode, updateStudentsList, showToast]
  );

  // Delete student handler -> Delete from MongoDB
  const handleDeleteStudent = useCallback(
    async (id: string) => {
      const target = students.find((s) => s.id === id);
      updateStudentsList((prev) => prev.filter((s) => s.id !== id));
      if (selectedStudent?.id === id) {
        const remaining = students.filter((s) => s.id !== id);
        if (remaining.length > 0) setSelectedStudent(remaining[0]);
      }
      showToast(`Removed student ${target?.name || id} from roster.`, 'info');

      try {
        await deleteStudentFromDb(id);
        const status = await getDbStatus();
        setDbStatus(status);
      } catch (err: unknown) {
        console.error('MongoDB delete error:', err);
      }
    },
    [students, selectedStudent, updateStudentsList, showToast]
  );

  // Batch delete -> Delete from MongoDB
  const handleBatchDelete = useCallback(
    async (ids: string[]) => {
      updateStudentsList((prev) => prev.filter((s) => !ids.includes(s.id)));
      if (ids.includes(selectedStudent?.id)) {
        const remaining = students.filter((s) => !ids.includes(s.id));
        if (remaining.length > 0) setSelectedStudent(remaining[0]);
      }
      showToast(`Removed ${ids.length} students from roster.`, 'info');

      try {
        await batchDeleteStudentsFromDb(ids);
        const status = await getDbStatus();
        setDbStatus(status);
      } catch (err: unknown) {
        console.error('MongoDB batch delete error:', err);
      }
    },
    [students, selectedStudent, updateStudentsList, showToast]
  );

  // Batch status change -> Update MongoDB
  const handleBatchStatusChange = useCallback(
    async (ids: string[], status: 'Active' | 'Inactive') => {
      const updatedList: Student[] = [];
      updateStudentsList((prev) =>
        prev.map((s) => {
          if (ids.includes(s.id)) {
            const updated = { ...s, status };
            updatedList.push(updated);
            return updated;
          }
          return s;
        })
      );
      showToast(`Marked ${ids.length} student(s) as ${status}.`);

      if (updatedList.length > 0) {
        try {
          await saveMultipleStudentsToDb(updatedList);
        } catch (err: unknown) {
          console.error('MongoDB status sync error:', err);
        }
      }
    },
    [updateStudentsList, showToast]
  );

  // Single card print
  const handlePrintCard = useCallback(() => {
    window.print();
  }, []);

  // Navigate to Card Studio
  const handleEditDesign = useCallback(() => {
    setCurrentPage('generate');
  }, []);

  // Update school settings -> Save to MongoDB
  const handleSaveSettings = useCallback(
    async (newSettings: SchoolSettings) => {
      setSchoolSettings(newSettings);
      saveSettings(newSettings);
      showToast('School settings updated. Syncing to MongoDB...');

      try {
        await saveSettingsToDb(newSettings);
        showToast('School settings saved to MongoDB Atlas.', 'success');
      } catch (err: unknown) {
        console.error('MongoDB settings save error:', err);
        showToast('Saved locally (MongoDB sync deferred).', 'info');
      }
    },
    [showToast]
  );

  return (
    <main className={dark ? 'app dark-mode' : 'app'}>
      <Sidebar
        currentPage={currentPage}
        studentCount={students.length}
        mobileOpen={mobileSidebarOpen}
        onNavigate={setCurrentPage}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      <section className="content">
        <Topbar
          dark={dark}
          currentPage={currentPage}
          dbStatus={dbStatus}
          isSyncing={isSyncing}
          onRefreshDb={() => syncWithDatabase(false)}
          onToggleTheme={() => setDark(!dark)}
          onOpenMobileMenu={() => setMobileSidebarOpen(true)}
        />

        <div className="page-content">
          {/* OVERVIEW VIEW */}
          {currentPage === 'overview' && (
            <>
              <WelcomeSection
                schoolSettings={schoolSettings}
                onImportClick={() => setShowImport(true)}
                onAddStudentClick={handleOpenAddStudent}
                onBulkPrintClick={() => setCurrentPage('print')}
              />
              <StatCards students={students} />
              <div className="main-grid">
                <StudentTable
                  students={students}
                  selectedId={selectedStudent.id}
                  query={query}
                  classFilter={classFilter}
                  onQueryChange={setQuery}
                  onClassFilterChange={setClassFilter}
                  onSelectStudent={setSelectedStudent}
                  onImportClick={() => setShowImport(true)}
                  onEditStudent={handleOpenEditStudent}
                  onDeleteStudent={handleDeleteStudent}
                  onBatchDelete={handleBatchDelete}
                  onBatchPrint={() => setCurrentPage('print')}
                  onBatchStatusChange={handleBatchStatusChange}
                />
                <CardPreview
                  student={selectedStudent}
                  side={cardSide}
                  schoolSettings={schoolSettings}
                  onSideChange={setCardSide}
                  onPrint={handlePrintCard}
                  onEditDesign={handleEditDesign}
                />
              </div>
            </>
          )}

          {/* STUDENTS VIEW */}
          {currentPage === 'students' && (
            <StudentsView
              students={students}
              selectedStudent={selectedStudent}
              query={query}
              classFilter={classFilter}
              onQueryChange={setQuery}
              onClassFilterChange={setClassFilter}
              onSelectStudent={setSelectedStudent}
              onAddStudent={handleOpenAddStudent}
              onImportClick={() => setShowImport(true)}
              onEditStudent={handleOpenEditStudent}
              onDeleteStudent={handleDeleteStudent}
              onBatchDelete={handleBatchDelete}
              onBatchPrint={() => setCurrentPage('print')}
              onBatchStatusChange={handleBatchStatusChange}
            />
          )}

          {/* GENERATE CARDS / CARD STUDIO VIEW */}
          {currentPage === 'generate' && (
            <CardStudioView
              students={students}
              currentStudent={selectedStudent}
              schoolSettings={schoolSettings}
              onSelectStudent={setSelectedStudent}
              onUpdateSettings={handleSaveSettings}
              onPrintCard={handlePrintCard}
            />
          )}

          {/* BULK PRINT VIEW */}
          {currentPage === 'print' && (
            <BulkPrintView
              students={students}
              schoolSettings={schoolSettings}
              onPrintBatch={handlePrintCard}
            />
          )}

          {/* SCHOOL SETTINGS VIEW */}
          {currentPage === 'settings' && (
            <SchoolSettingsView
              settings={schoolSettings}
              onSave={handleSaveSettings}
            />
          )}

          {/* HELP CENTER VIEW */}
          {currentPage === 'help' && <HelpCenterView />}
        </div>
      </section>

      {/* Modals & Popups */}
      <ImportModal
        isOpen={showImport}
        onClose={() => setShowImport(false)}
        onImport={handleImport}
      />

      <StudentModal
        isOpen={studentModal.isOpen}
        mode={studentModal.mode}
        student={studentModal.student}
        onClose={() => setStudentModal({ isOpen: false, mode: 'add', student: null })}
        onSave={handleSaveStudent}
      />

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </main>
  );
}