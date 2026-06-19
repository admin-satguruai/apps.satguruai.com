import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'STG-Sales Intelligence',
  description: 'Branch-secured sales performance intelligence platform for Satguru Travel Group.',
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto flex min-h-[80vh] max-w-4xl flex-col items-center justify-center text-center">
        <div className="rounded-3xl bg-white p-10 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-950">STG-Sales Intelligence</h1>

          <p className="mt-4 text-sm text-slate-500">
            Branch-secured sales performance intelligence platform.
          </p>

          <Link
            href="/login"
            className="mt-8 inline-flex rounded-xl bg-black px-5 py-3 text-sm font-medium text-white hover:opacity-90"
          >
            Go to Login
          </Link>
        </div>
      </div>
    </main>
  );
}
