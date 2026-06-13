export default function Verify() {
  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <form className="card grid gap-4">
        <h1 className="text-3xl font-black text-navy">Verify email</h1>
        <p className="text-sm text-slate-600">
          Enter the time-limited verification code sent to your official email.
        </p>
        <input className="input" placeholder="6-digit OTP" />
        <button className="btn-primary">Verify account</button>
      </form>
    </section>
  );
}
