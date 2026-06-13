import Link from 'next/link';

export default function Home() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-145px)] max-w-5xl items-center px-4 py-16">
      <div className="mx-auto max-w-3xl text-center">
        <p className="font-semibold text-saffron">app.satguruai.com</p>
        <h1 className="mt-4 text-4xl font-black text-navy md:text-6xl">
          Satguru AI Central Portal
        </h1>
        <p className="mt-6 text-lg text-slate-600">
          Secure employee entry point for Satguru internal applications. Portal tools, documentation,
          support details, dashboard and admin areas are visible only after login.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link className="btn-primary" href="/login">
            Login
          </Link>
          <Link className="btn-secondary" href="/signup">
            Self signup with @satgurutravel.com
          </Link>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 text-left text-sm text-slate-600 shadow-sm">
          <p className="font-semibold text-navy">Access policy</p>
          <p className="mt-2">
            Only users with an official <strong>@satgurutravel.com</strong> email ID can self-signup.
            Email OTP verification is required before the user can enter the portal.
          </p>
        </div>
      </div>
    </section>
  );
}
