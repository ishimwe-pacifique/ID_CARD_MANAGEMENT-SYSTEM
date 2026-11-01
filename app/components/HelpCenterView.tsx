'use client';

import { useState } from 'react';
import {
  HelpCircle,
  FileSpreadsheet,
  Printer,
  ShieldCheck,
  Download,
  ChevronDown,
  ChevronUp,
  FileText,
  Lightbulb,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { downloadExcelTemplate } from '../utils';

export function HelpCenterView() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      await downloadExcelTemplate();
    } finally {
      setDownloading(false);
    }
  };

  const faqs = [
    {
      q: 'What is the standard format for importing students from Excel or CSV?',
      a: 'Your spreadsheet should include columns such as: "Full Name", "Student ID", "Class", "Gender", "Father\'s Name", "Mother\'s Name", "Contact", and "Residence". Columns are auto-detected regardless of exact capitalization.',
    },
    {
      q: 'What are the exact physical dimensions of the ID cards?',
      a: 'The system renders cards to the worldwide standard ISO/IEC 7810 ID-1 (CR80) format: 85.60 mm × 53.98 mm (3.370 in × 2.125 in) with rounded corners. When printed at 100% scale, they fit standard PVC card pouches, lanyards, and wallet sleeves.',
    },
    {
      q: 'How does the Bulk Printing feature work?',
      a: 'In the Bulk Print section, you can select which students or classes to print, choose front or back sides, and select whether to include dashed cut guides. Standard A4 sheets accommodate 8 badges per page (2 columns × 4 rows).',
    },
    {
      q: 'How does QR Code & Barcode verification work?',
      a: 'Every card automatically generates a high-definition Code128 barcode and scannable QR code. The QR code contains JSON payload with the student\'s verified identity, ID number, class, and school credentials for rapid gate security verification.',
    },
    {
      q: 'Can I upload custom photos for students?',
      a: 'Yes! When adding or editing any student, click "Upload Photo" to select a photo from your computer. You can also pick from high-definition preset avatars.',
    },
  ];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: '24px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: '#e3f4e7',
                color: '#166534',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <HelpCircle size={18} />
            </div>
            <h1 style={{ fontSize: 22, margin: 0, fontWeight: 700 }}>Documentation & Help Center</h1>
          </div>
          <p style={{ margin: 0, fontSize: 12, color: 'var(--muted-foreground)' }}>
            Guides, spreadsheet specifications, printing standards, and answers to common questions.
          </p>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={handleDownload}
          disabled={downloading}
          style={{ height: 34 }}
        >
          <Download size={14} style={{ marginRight: 6 }} />
          {downloading ? 'Downloading...' : 'Download Sample Excel Template'}
        </Button>
      </div>

      {/* Feature Guide Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        <div
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            padding: 20,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: '#e1f4e6',
              color: '#166534',
              display: 'grid',
              placeItems: 'center',
              marginBottom: 12,
            }}
          >
            <FileSpreadsheet size={18} />
          </div>
          <h3 style={{ fontSize: 14, margin: '0 0 6px', fontWeight: 600 }}>1. Spreadsheet Import</h3>
          <p style={{ fontSize: 11, color: 'var(--muted-foreground)', lineHeight: 1.6, margin: 0 }}>
            Upload class rosters in bulk. The system automatically maps fields and matches student IDs.
          </p>
        </div>

        <div
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            padding: 20,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: '#e5f0fc',
              color: '#2563eb',
              display: 'grid',
              placeItems: 'center',
              marginBottom: 12,
            }}
          >
            <Printer size={18} />
          </div>
          <h3 style={{ fontSize: 14, margin: '0 0 6px', fontWeight: 600 }}>2. High-DPI Printing</h3>
          <p style={{ fontSize: 11, color: 'var(--muted-foreground)', lineHeight: 1.6, margin: 0 }}>
            Print single cards instantly or generate 8-card A4 sheets with dashed scissor cut guides.
          </p>
        </div>

        <div
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            padding: 20,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: '#fef3c7',
              color: '#d97706',
              display: 'grid',
              placeItems: 'center',
              marginBottom: 12,
            }}
          >
            <ShieldCheck size={18} />
          </div>
          <h3 style={{ fontSize: 14, margin: '0 0 6px', fontWeight: 600 }}>3. Security & Barcodes</h3>
          <p style={{ fontSize: 11, color: 'var(--muted-foreground)', lineHeight: 1.6, margin: 0 }}>
            Dynamic QR verification codes and Code128 barcodes prevent counterfeiting and allow gate scanning.
          </p>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: 24,
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Lightbulb size={18} style={{ color: '#eab308' }} />
          Frequently Asked Questions
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  overflow: 'hidden',
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: isOpen ? 'var(--muted)' : 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    color: 'inherit',
                  }}
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {isOpen && (
                  <div
                    style={{
                      padding: '12px 16px',
                      fontSize: 12,
                      lineHeight: 1.6,
                      color: 'var(--muted-foreground)',
                      borderTop: '1px solid var(--border)',
                    }}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
