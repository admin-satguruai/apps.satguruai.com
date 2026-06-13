import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-3 font-bold text-navy">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-navy text-saffron">SA</span>
          <span>Satguru AI</span>
        </Link>

        <div className="flex gap-2">
          <Link href="/login" className="btn-secondary py-2">
            Login
          </Link>
          <Link href="/signup" className="btn-primary py-2">
            Self signup
          </Link>
        </div>
      </div>
    </header>
  );
}
