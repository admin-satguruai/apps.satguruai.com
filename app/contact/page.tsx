import { ContactForm } from '@/components/Forms';

export default function Contact() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-black text-navy">Contact platform support</h1>
      <p className="mt-4 text-slate-600">
        Send questions about registration, access, portal records, documentation, or technical issues.
      </p>
      <div className="mt-8">
        <ContactForm />
      </div>
    </section>
  );
}
