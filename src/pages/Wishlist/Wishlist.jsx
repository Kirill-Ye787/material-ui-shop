import { Link, useSearchParams } from 'react-router-dom';
import ShoppingBagOutlined from '@mui/icons-material/ShoppingBagOutlined';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import ShareOutlined from '@mui/icons-material/ShareOutlined';
import { useWishlist } from '../../hooks/useWishlist.js';
import { useCart } from '../../hooks/useCart.js';
import { useShop } from '../../context/ShopContext.jsx';
import { products } from '../../data/mockProducts.js';
import { getQuantityLimit } from '../../utils/cart.js';
import { formatPrice } from '../../utils/priceFormatter.js';
import Breadcrumbs from '../../components/common/Breadcrumbs.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import './Wishlist.scss';

export default function Wishlist() {
  const { wishlistProducts, removeFromWishlist, addToWishlist } = useWishlist();
  const { cartItems, addToCart } = useCart();
  const { notify } = useShop();
  const [params] = useSearchParams();
  const sharedIds = (params.get('ids') || '').split(',').map(Number);
  const isShared = params.has('ids');
  const items = isShared ? products.filter(product => sharedIds.includes(product.id)) : wishlistProducts;
  function addAll() {
    const available = items.filter(product => cartItems.filter(line => line.productId === product.id).reduce((sum, line) => sum + line.quantity, 0) < getQuantityLimit(product));
    available.forEach(product => addToCart(product));
    notify(available.length ? `Додано ${available.length} товарів у кошик` : 'Для цих товарів уже досягнуто доступної кількості', available.length ? 'success' : 'info');
  }
  async function share() {
    const url = new URL('/wishlist', window.location.origin);
    url.searchParams.set('ids', items.map(product => product.id).join(','));
    try { await navigator.clipboard.writeText(url.href); notify('Посилання на список скопійовано'); }
    catch { window.prompt('Скопіюйте посилання на список:', url.href); }
  }
  return <div className="wishlist-container"><Breadcrumbs items={[{ label: isShared ? 'Спільний список' : 'Обране' }]} />
    <div className="wishlist-header"><div><span className="wishlist-eyebrow">Збережіть те, що сподобалось</span><h1>{isShared ? 'Спільний список' : 'Обране'} <span>({items.length})</span></h1></div>{items.length > 0 && <div className="wishlist-actions"><button className="wishlist-share" onClick={share}><ShareOutlined fontSize="small" />Поділитися</button><button className="wishlist-primary" onClick={addAll}><ShoppingBagOutlined fontSize="small" />Додати всі в кошик</button></div>}</div>
    {isShared && items.length > 0 && <div className="wishlist-shared-note">Цей список відкрито за посиланням. <button onClick={() => { items.forEach(addToWishlist); notify('Список додано до вашого обраного'); }}>Зберегти собі</button></div>}
    {items.length ? <div className="wishlist-grid">{items.map(product => <article key={product.id} className="wishlist-item"><div className="wishlist-image"><Link to={`/product/${product.slug}`}><img src={product.images[0]} alt={product.name} loading="lazy" width="600" height="500" /></Link>{!isShared && <button className="wishlist-remove" aria-label={`Видалити з обраного: ${product.name}`} onClick={() => removeFromWishlist(product.id)}><CloseOutlined fontSize="small" /></button>}</div><div className="wishlist-content"><span className="wishlist-brand">{product.brand}</span><h2><Link to={`/product/${product.slug}`}>{product.name}</Link></h2><div className="wishlist-rating">★ {product.rating} <span>({product.reviewsCount} відгуків)</span></div><div className="wishlist-price">{product.oldPrice && <del>{formatPrice(product.oldPrice)}</del>}<strong>{formatPrice(product.price)}</strong></div><button className="wishlist-primary" onClick={() => addToCart(product)}><ShoppingBagOutlined fontSize="small" />Додати в кошик</button></div></article>)}</div> : <EmptyState title={isShared ? 'У списку немає товарів' : 'Збережіть свої улюблені речі'} description="Натисніть на сердечко біля товару, щоб додати його в обране." />}
  </div>;
}
