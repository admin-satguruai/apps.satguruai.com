'use client';

import { usePathname } from 'next/navigation';

const authPages = ['/', '/login', '/signup', '/verify-otp', '/set-password', '/forgot-password', '/reset-password'];

export function Footer() {
  const pathname = usePathname();

  if (authPages.includes(pathname)) {
    return null;
  }

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-slate-600">
        © 2026 Satguru AI Central Portal. Database-backed application hub for Satguru internal tools.
      </div>
    </footer>
  );
}
