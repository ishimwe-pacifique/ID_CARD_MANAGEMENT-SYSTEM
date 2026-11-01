'use client';

import { ShieldCheck } from 'lucide-react';

interface LogoProps {
  small?: boolean;
}

export function Logo({ small = false }: LogoProps) {
  return (
    <div className={small ? 'school-mark small' : 'school-mark'}>
      <ShieldCheck aria-hidden="true" />
      <span>{small ? 'RTB' : 'GS'}</span>
    </div>
  );
}