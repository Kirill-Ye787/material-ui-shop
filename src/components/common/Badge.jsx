export default function Badge({ type, discount }) {
  const classes = { NEW: 'bg-white text-ink', SALE: 'bg-orange-100 text-orange-800', TOP: 'bg-primary-700 text-white' };
  return <span className={`rounded-md px-2 py-1 text-[10px] font-bold tracking-wider ${classes[type] || classes.NEW}`}>
    {type === 'SALE' ? `−${discount}%` : type === 'TOP' ? 'ТОП' : 'NEW'}
  </span>;
}
