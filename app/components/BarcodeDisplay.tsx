'use client';

import { useMemo } from 'react';

interface BarcodeDisplayProps {
  value: string;
  height?: number;
  width?: number;
  className?: string;
  showText?: boolean;
}

export function BarcodeDisplay({
  value,
  height = 30,
  width = 140,
  className = '',
  showText = true,
}: BarcodeDisplayProps) {
  // Generate deterministic bar widths based on input string
  const bars = useMemo(() => {
    const clean = value.replace(/[^A-Za-z0-9-]/g, '').toUpperCase();
    const pattern: number[] = [2, 1, 1, 2]; // Start pattern
    for (let i = 0; i < clean.length; i++) {
      const code = clean.charCodeAt(i);
      pattern.push((code % 3) + 1, ((code >> 1) % 3) + 1, ((code >> 2) % 2) + 1, 1);
    }
    pattern.push(2, 1, 2, 2); // Stop pattern

    const totalUnits = pattern.reduce((acc, curr) => acc + curr, 0);
    const unitWidth = width / totalUnits;

    let currentX = 0;
    const rects: Array<{ x: number; width: number }> = [];

    pattern.forEach((pWidth, idx) => {
      const barW = pWidth * unitWidth;
      if (idx % 2 === 0) {
        rects.push({ x: currentX, width: barW });
      }
      currentX += barW;
    });

    return rects;
  }, [value, width]);

  return (
    <div
      className={`barcode-container ${className}`}
      style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ display: 'block' }}
      >
        <rect width={width} height={height} fill="#ffffff" />
        {bars.map((bar, i) => (
          <rect key={i} x={bar.x} y={0} width={bar.width} height={height} fill="#141f18" />
        ))}
      </svg>
      {showText && (
        <span
          style={{
            fontFamily: 'monospace',
            fontSize: 7,
            letterSpacing: 1.5,
            color: '#2a3a30',
            marginTop: 2,
            fontWeight: 700,
          }}
        >
          *{value}*
        </span>
      )}
    </div>
  );
}
