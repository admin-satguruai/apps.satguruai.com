'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

const allowedDomains = ['satgurutravel.com', 'satguruai.com', 'satguruuniverse.com'];

function isAllowedEmail(email: string) {
  return allowedDomains.some((domain) => email.endsWith(`@${domain}`));
}

export default function Signup() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    setIsSubmitting(true);

    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') ?? '').trim().toLowerCase();

    if (!isAllowedEmail(email)) {
      setMessage('Self signup is allowed only with an approved official domain. Please contact administrator if your domain is not registered.');
      setIsSubmitting(false);
      return;
    }

    const requiredFields = ['fullName', 'email', 'department', 'branch', 'country'];
    const missing = requiredFields.some((field) => !String(form.get(field) ?? '').trim());
    if (missing) {
      setMessage('Full name, email, department, branch, and country are mandatory. Mobile number is optional.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: String(form.get('fullName') ?? '').trim(),
          email,
          mobile: String(form.get('mobile') ?? '').trim(),
          department: String(form.get('department') ?? '').trim(),
          branch: String(form.get('branch') ?? '').trim(),
          country: String(form.get('country') ?? '').trim()
        })
      });

      const data = await response.json().catch(() => ({ message: 'Unable to read server response.' }));
      if (!response.ok) {
        setMessage(data.message ?? 'Unable to send verification code. Please try again.');
        return;
      }

      sessionStorage.setItem('satguru_verification_token', data.verificationToken);
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch {
      setMessage('Unable to send verification code. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50 px-4 py-10">
      <section className="mx-auto max-w-4xl rounded-3xl border border-white/80 bg-white/95 p-6 shadow-2xl shadow-slate-900/10">
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-3xl font-black text-slate-950">Self signup</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Signup is restricted to approved official domains: <strong>satgurutravel.com</strong>, <strong>satguruai.com</strong>, and <strong>satguruuniverse.com</strong>. After submitting, a verification code will be sent to your email.
              </p>
            </div>
            <Link className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700 hover:border-emerald-300" href="mailto:admin@satguruai.com?subject=Satguru AI Signup Help">Need help?</Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <input className="input" name="fullName" placeholder="Full name *" required />
            <input className="input" name="email" type="email" placeholder="Official company email *" required />
            <input className="input" name="mobile" placeholder="Mobile number optional" />
            <input className="input" name="department" placeholder="Department *" required />
            <input className="input" name="branch" placeholder="Branch *" required />
            <input className="input" name="country" placeholder="Country *" required />
          </div>

          {message ? <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-700">{message}</p> : null}
          <button className="btn-primary disabled:cursor-wait disabled:opacity-70" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Sending code...' : 'Generate and send code'}
          </button>
          <p className="text-center text-sm text-slate-500">Already registered? <Link className="font-bold text-emerald-700" href="/login">Back to login</Link></p>
        </form>
      </section>
    </div>
  );
}
