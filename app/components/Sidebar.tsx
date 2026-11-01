'use client';

import {
  LayoutDashboard,
  Users,
  FileText,
  Printer,
  Settings,
  HelpCircle,
  ShieldCheck,
  MoreHorizontal,
  X,
} from 'lucide-react';
import { Logo } from './Logo';

interface SidebarProps {
  currentPage: string;
  studentCount?: number;
  mobileOpen?: boolean;
  onNavigate: (page: string) => void;
  onCloseMobile?: () => void;
}

export function Sidebar({
  currentPage,
  studentCount = 5,
  mobileOpen = false,
  onNavigate,
  onCloseMobile,
}: SidebarProps) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, count: null },
    { id: 'students', label: 'Students', icon: Users, count: studentCount },
    { id: 'generate', label: 'Generate cards', icon: FileText, count: null },
    { id: 'print', label: 'Bulk print', icon: Printer, count: null },
  ] as const;

  const manageItems = [
    { id: 'settings', label: 'School settings', icon: Settings },
    { id: 'help', label: 'Help center', icon: HelpCircle },
  ] as const;

  const handleItemClick = (id: string) => {
    onNavigate(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="sidebar-backdrop"
          onClick={onCloseMobile}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            zIndex: 49,
          }}
        />
      )}

      <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="brand" style={{ position: 'relative' }}>
          <Logo />
          <div>
            <b>
              EDU<span>PASS</span>
            </b>
            <small>Student identity system</small>
          </div>

          {mobileOpen && (
            <button
              onClick={onCloseMobile}
              style={{
                position: 'absolute',
                right: 0,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--muted-foreground)',
              }}
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <nav>
          <p>Workspace</p>
          {navItems.map((item) => (
            <a
              key={item.id}
              className={currentPage === item.id ? 'current' : ''}
              onClick={() => handleItemClick(item.id)}
            >
              <item.icon aria-hidden="true" />
              {item.label}
              {item.count !== null && <span>{item.count}</span>}
            </a>
          ))}

          <p>Manage</p>
          {manageItems.map((item) => (
            <a
              key={item.id}
              className={currentPage === item.id ? 'current' : ''}
              onClick={() => handleItemClick(item.id)}
            >
              <item.icon aria-hidden="true" />
              {item.label}
            </a>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="secure">
            <ShieldCheck aria-hidden="true" />
            <div>
              <b>Data protected</b>
              <small>Local & encrypted</small>
            </div>
          </div>

          <div className="profile">
            <div className="avatar">AM</div>
            <div>
              <b>Admin Manager</b>
              <small>GS Cyahafi TSS</small>
            </div>
            <MoreHorizontal aria-hidden="true" />
          </div>
        </div>
      </aside>
    </>
  );
}