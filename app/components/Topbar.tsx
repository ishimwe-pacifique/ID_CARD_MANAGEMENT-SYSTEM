'use client';

import { useState } from 'react';
import { Moon, Sun, Bell, Menu, CheckCircle2, Database, RefreshCw, AlertCircle, ExternalLink } from 'lucide-react';
import { DbStatusResponse } from '@/lib/api';

interface TopbarProps {
  dark: boolean;
  currentPage: string;
  dbStatus?: DbStatusResponse | null;
  isSyncing?: boolean;
  onRefreshDb?: () => void;
  onToggleTheme: () => void;
  onOpenMobileMenu?: () => void;
}

const PAGE_TITLES: Record<string, string> = {
  overview: 'Overview',
  students: 'Students Directory',
  generate: 'Card Studio',
  print: 'Bulk Print Suite',
  settings: 'School Settings',
  help: 'Help Center',
};

export function Topbar({
  dark,
  currentPage,
  dbStatus,
  isSyncing,
  onRefreshDb,
  onToggleTheme,
  onOpenMobileMenu,
}: TopbarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDbDetails, setShowDbDetails] = useState(false);

  const currentTitle = PAGE_TITLES[currentPage] || 'Overview';
  const isConnected = dbStatus?.connected ?? false;

  return (
    <header className="topbar" style={{ position: 'relative' }}>
      <div
        className="mobile-title"
        onClick={onOpenMobileMenu}
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
      >
        <Menu aria-hidden="true" />
        <b>EDUPASS</b>
      </div>

      <div className="crumb">
        Workspace <span>/</span> <b>{currentTitle}</b>
      </div>

      <div className="top-actions" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* MongoDB Live Status Pill */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowDbDetails(!showDbDetails)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '5px 10px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 500,
              cursor: 'pointer',
              border: isConnected ? '1px solid rgba(22, 163, 74, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
              background: isConnected
                ? 'rgba(22, 163, 74, 0.1)'
                : 'rgba(239, 68, 68, 0.1)',
              color: isConnected ? '#16a34a' : '#ef4444',
              transition: 'all 0.2s ease',
            }}
            title="MongoDB Atlas Status"
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: isConnected ? '#16a34a' : '#ef4444',
                boxShadow: isConnected ? '0 0 8px #16a34a' : 'none',
                display: 'inline-block',
                animation: isConnected ? 'pulse 2s infinite' : 'none',
              }}
            />
            <Database size={13} />
            <span className="hidden sm:inline" style={{ fontSize: 11, fontWeight: 600 }}>
              {isSyncing ? 'Syncing...' : isConnected ? 'MongoDB Live' : 'DB Offline'}
            </span>
          </button>

          {showDbDetails && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: 8,
                width: 290,
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                boxShadow: '0 12px 30px rgba(0,0,0,0.18)',
                padding: 14,
                zIndex: 70,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                  borderBottom: '1px solid var(--border)',
                  paddingBottom: 8,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Database size={15} style={{ color: '#16a34a' }} />
                  <b style={{ fontSize: 12 }}>MongoDB Atlas Cluster</b>
                </div>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    padding: '2px 6px',
                    borderRadius: 4,
                    background: isConnected ? '#dcfce7' : '#fee2e2',
                    color: isConnected ? '#15803d' : '#b91c1c',
                  }}
                >
                  {isConnected ? 'ONLINE' : 'CONNECTING'}
                </span>
              </div>

              <div style={{ fontSize: 11, display: 'flex', flexDirection: 'column', gap: 6, color: 'var(--muted-foreground)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Host:</span>
                  <span style={{ fontWeight: 600, color: 'var(--foreground)' }}>cluster0.s2hzqcu.mongodb.net</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Database:</span>
                  <span style={{ fontWeight: 600, color: 'var(--foreground)' }}>{dbStatus?.database || 'student_id_db'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Synced Students:</span>
                  <span style={{ fontWeight: 600, color: 'var(--foreground)' }}>{dbStatus?.studentCount ?? '—'} records</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Auth User:</span>
                  <span style={{ fontWeight: 600, color: 'var(--foreground)' }}>pacifique151</span>
                </div>
              </div>

              {dbStatus?.error && (
                <div
                  style={{
                    marginTop: 8,
                    padding: 8,
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: 6,
                    fontSize: 10,
                    color: '#991b1b',
                    display: 'flex',
                    gap: 6,
                  }}
                >
                  <AlertCircle size={14} style={{ flexShrink: 0 }} />
                  <span>{dbStatus.error}</span>
                </div>
              )}

              <div
                style={{
                  marginTop: 12,
                  display: 'flex',
                  gap: 8,
                  borderTop: '1px solid var(--border)',
                  paddingTop: 8,
                }}
              >
                {onRefreshDb && (
                  <button
                    onClick={() => {
                      onRefreshDb();
                    }}
                    disabled={isSyncing}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      fontSize: 11,
                      padding: '6px 10px',
                      borderRadius: 6,
                      background: 'var(--secondary)',
                      color: 'var(--foreground)',
                      border: '1px solid var(--border)',
                      cursor: isSyncing ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <RefreshCw size={12} className={isSyncing ? 'animate-spin' : ''} />
                    {isSyncing ? 'Refreshing...' : 'Sync Now'}
                  </button>
                )}
                <button
                  onClick={() => setShowDbDetails(false)}
                  style={{
                    fontSize: 11,
                    padding: '6px 10px',
                    borderRadius: 6,
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--muted-foreground)',
                    cursor: 'pointer',
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          className="icon-button"
          onClick={onToggleTheme}
          aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={dark ? 'Light mode' : 'Dark mode'}
        >
          {dark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
        </button>

        <div style={{ position: 'relative' }}>
          <button
            className="icon-button"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
            title="System notifications"
          >
            <Bell aria-hidden="true" />
            <i aria-hidden="true" />
          </button>

          {showNotifications && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: 8,
                width: 270,
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                padding: 12,
                zIndex: 60,
              }}
            >
              <b style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>Notifications</b>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'start',
                  gap: 8,
                  fontSize: 11,
                  color: 'var(--muted-foreground)',
                  padding: '6px 0',
                }}
              >
                <CheckCircle2 size={14} style={{ color: '#16a34a', flexShrink: 0, marginTop: 2 }} />
                <span>MongoDB Atlas database connected &amp; synced.</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'start',
                  gap: 8,
                  fontSize: 11,
                  color: 'var(--muted-foreground)',
                  padding: '6px 0',
                }}
              >
                <CheckCircle2 size={14} style={{ color: '#16a34a', flexShrink: 0, marginTop: 2 }} />
                <span>EduPass Identity Engine ready for card generation.</span>
              </div>
            </div>
          )}
        </div>

        <div className="top-avatar" aria-label="Admin Manager">
          AM
        </div>
      </div>
    </header>
  );
}