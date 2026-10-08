import { useState } from 'react';
import { Link } from 'react-router-dom';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import { useShop } from '../../context/ShopContext.jsx';
import { useCart } from '../../hooks/useCart.js';
import { formatPrice } from '../../utils/priceFormatter.js';
import Breadcrumbs from '../../components/common/Breadcrumbs.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import styles from './Comparison.module.scss';

export default function Comparison() {
  const { comparisonProducts: items, toggleComparison } = useShop();
  const { addToCart } = useCart();
  const [onlyDifferent, setOnlyDifferent] = useState(false);
  const rows = [
    ['Бренд', product => product.brand], ['Категорія', product => product.categoryName],
    ['Ціна', product => formatPrice(product.price)], ['Рейтинг', product => `${product.rating} / 5`],
    ['Доступність', product => product.inStock ? 'В наявності' : 'Під замовлення'],
    ...[...new Set(items.flatMap(product => Object.keys(product.specifications)))].filter(key => key !== 'Бренд' && key !== 'Артикул').map(key => [key, product => product.specifications[key] || '—']),
  ];
  return <div className={styles.container}><Breadcrumbs items={[{ label: 'Порівняння' }]} /><div className={styles.heading}><h1>Порівняння товарів <span>({items.length}/4)</span></h1><label><input type="checkbox" checked={onlyDifferent} onChange={event => setOnlyDifferent(event.target.checked)} />Лише відмінності</label></div>
    {items.length ? <div className={styles.scroll}><div role="table" aria-label="Порівняння товарів" style={{ '--columns': items.length }}><div className={styles.row} role="row"><div className={styles.cell} role="columnheader">Товари</div>{items.map(product => <div className={`${styles.cell} ${styles.product}`} key={product.id} role="columnheader"><button className={styles.remove} aria-label={`Прибрати з порівняння: ${product.name}`} onClick={() => toggleComparison(product)}><CloseOutlined fontSize="small" /></button><img src={product.images[0]} alt={product.name} width="600" height="500" /><Link to={`/product/${product.slug}`}>{product.name}</Link><button className={styles.add} onClick={() => addToCart(product)}>Додати в кошик</button></div>)}</div>
      {rows.map(([label, getValue]) => { const values = items.map(getValue); const different = new Set(values).size > 1; return onlyDifferent && !different ? null : <div key={label} role="row" className={`${styles.row} ${different ? styles.different : ''}`}><div className={styles.cell} role="rowheader">{label}</div>{values.map((value, index) => <div key={items[index].id} className={styles.cell} role="cell">{value}</div>)}</div>; })}
    </div></div> : <EmptyState title="Оберіть товари для порівняння" description="Натисніть на іконку порівняння біля товару. Можна додати до 4 товарів." />}
  </div>;
}
