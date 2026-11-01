'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QRCodeDisplayProps {
  data: string;
  size?: number;
  className?: string;
}

export function QRCodeDisplay({ data, size = 64, className = '' }: QRCodeDisplayProps) {
  const [dataUrl, setDataUrl] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(data, {
      width: size * 2,
      margin: 1,
      color: {
        dark: '#1b2d21',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => {
        if (isMounted) setDataUrl(url);
      })
      .catch((err) => {
        console.error('Error generating QR code:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [data, size]);

  if (!dataUrl) {
    return (
      <div
        className={`qr-placeholder ${className}`}
        style={{ width: size, height: size, background: '#eef2ee', borderRadius: 4 }}
      />
    );
  }

  return (
    <img
      src={dataUrl}
      alt="Student ID QR Code"
      width={size}
      height={size}
      className={`qr-image ${className}`}
      style={{ display: 'block', borderRadius: 4, objectFit: 'contain' }}
    />
  );
}
