import { portals } from '@/lib/data';

export function ContactForm({ support = false }: { support?: boolean }) {
  return (
    <form className="card grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <input className="input" placeholder="Full name" required />
        <input className="input" placeholder="Email address" type="email" required />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <select className="input">
          <option>Login issue</option>
          <option>Signup issue</option>
          <option>Access request</option>
          <option>Technical issue</option>
          <option>Documentation issue</option>
          <option>Enhancement request</option>
        </select>
        <select className="input">
          <option>No specific portal</option>
          {portals.map((portal) => (
            <option key={portal.id}>{portal.name}</option>
          ))}
        </select>
      </div>
      {support && (
        <select className="input">
          <option>Medium priority</option>
          <option>High priority</option>
          <option>Low priority</option>
        </select>
      )}
      <input className="input" placeholder="Subject" required />
      <textarea className="input min-h-36" placeholder="Message" required />
      <button className="btn-primary" type="submit">Submit request</button>
    </form>
  );
}
