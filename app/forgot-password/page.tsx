export default function Forgot() {
  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <form className="card grid gap-4">
        <h1 className="text-3xl font-black text-navy">Account recovery</h1>
        <input className="input" type="email" placeholder="Official email" />
        <button className="btn-primary">Send recovery link</button>
      </form>
    </section>
  );
}
