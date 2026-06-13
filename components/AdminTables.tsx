import { allowedDomains, categories, portals, supportTickets, users } from '@/lib/data';

import { StatusBadge } from './PortalCard';

export function AdminStats() {
  const stats = [
    ['Users', users.length],
    ['Portals', portals.length],
    ['Domains', allowedDomains.length],
    ['Tickets', supportTickets.length],
  ] as const;

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {stats.map(([label, value]) => (
        <div className="card" key={label}>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-black text-navy">{value}</p>
        </div>
      ))}
    </div>
  );
}

export function UserTable() {
  return <Table heads={['Name', 'Email', 'Role', 'Status']} rows={users.map((user) => [user.name, user.email, user.role, user.status])} />;
}

export function PortalTable() {
  return (
    <div className="card overflow-x-auto">
      <div className="mb-4 flex gap-3">
        <input className="input" placeholder="Search portals" />
        <button className="btn-primary whitespace-nowrap">Add portal</button>
      </div>
      <table className="w-full text-left text-sm">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Department</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {portals.map((portal) => (
            <tr className="border-t" key={portal.id}>
              <td className="py-3 font-semibold">{portal.name}</td>
              <td>{portal.category}</td>
              <td>{portal.department}</td>
              <td>
                <StatusBadge status={portal.status} />
              </td>
              <td>Edit · Deactivate</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DomainTable() {
  return <Table heads={['Domain', 'Description', 'Status', 'Actions']} rows={allowedDomains.map((domain) => [domain.domain, domain.description, domain.status, 'Edit · Deactivate'])} />;
}

export function CategoryTable() {
  return <Table heads={['Category', 'Description', 'Status']} rows={categories.map((category) => [category.name, category.description, category.status])} />;
}

export function DocumentTable() {
  return <Table heads={['Portal', 'Document', 'Type', 'Visibility']} rows={portals.flatMap((portal) => portal.documents.map((document) => [portal.name, document.title, document.type, document.visibility]))} />;
}

export function SupportTable() {
  return <Table heads={['Ticket', 'Requester', 'Category', 'Subject', 'Status']} rows={supportTickets.map((ticket) => [ticket.ticketNumber, ticket.requester, ticket.category, ticket.subject, ticket.status])} />;
}

function Table({ heads, rows }: { heads: string[]; rows: string[][] }) {
  return (
    <div className="card overflow-x-auto">
      <div className="mb-4 flex gap-3">
        <input className="input" placeholder="Search and filter" />
        <button className="btn-primary whitespace-nowrap">Add / update</button>
      </div>
      <table className="w-full text-left text-sm">
        <thead>
          <tr>
            {heads.map((head) => (
              <th className="py-2" key={head}>
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr className="border-t" key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td className="py-3 pr-4" key={cellIndex}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
