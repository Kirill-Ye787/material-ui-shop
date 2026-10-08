import { Link } from 'react-router-dom';
export default function Breadcrumbs({ items = [] }) {
  return <nav aria-label="Хлібні крихти" className="mb-5 flex flex-wrap items-center gap-2 text-sm text-muted">
    <Link to="/" className="transition-colors hover:text-primary-500">Головна</Link>
    {items.map((item, index) => <span key={`${item.label}-${index}`} className="flex items-center gap-2">
      <span aria-hidden="true">/</span>
      {item.to ? <Link to={item.to} className="transition-colors hover:text-primary-500">{item.label}</Link> : <span aria-current="page" className="text-copy">{item.label}</span>}
    </span>)}
  </nav>;
}
