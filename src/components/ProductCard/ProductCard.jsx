import { Link } from 'react-router-dom';
import FavoriteBorderOutlined from '@mui/icons-material/FavoriteBorderOutlined';
import Favorite from '@mui/icons-material/Favorite';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import AddShoppingCartOutlined from '@mui/icons-material/AddShoppingCartOutlined';
import CompareArrows from '@mui/icons-material/CompareArrows';
import { useCart } from '../../hooks/useCart.js';
import { useWishlist } from '../../hooks/useWishlist.js';
import { useShop } from '../../context/ShopContext.jsx';
import { formatPrice } from '../../utils/priceFormatter.js';
import Badge from '../common/Badge.jsx';

// The card and its two layouts use Tailwind utilities exclusively.
export default function ProductCard({ product, view = 'grid' }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { setQuickProduct, toggleComparison, comparison } = useShop();
  const saved = isInWishlist(product.id);
  const isList = view === 'list';
  return <article data-testid="product-card" className={`group relative overflow-hidden rounded-2xl border border-solid border-line bg-surface transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${isList ? 'sm:flex' : 'flex h-full flex-col'}`}>
    <div className={`relative shrink-0 overflow-hidden bg-[#edf0e8] ${isList ? 'aspect-[6/5] sm:aspect-square sm:w-56' : 'aspect-[6/5]'}`}>
      <Link to={`/product/${product.slug}`} aria-label={`Переглянути ${product.name}`} tabIndex={-1}>
        <img src={product.images[0]} alt={product.name} loading="lazy" width="600" height="500" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
      </Link>
      <div className="absolute left-3 top-3 flex flex-wrap gap-1">{product.badges.map(type => <Badge key={type} type={type} discount={product.discount} />)}</div>
      <button onClick={() => toggleWishlist(product)} aria-label={`${saved ? 'Видалити з обраного' : 'Додати в обране'}: ${product.name}`} aria-pressed={saved}
        className={`absolute right-2 top-2 grid h-10 w-10 place-items-center rounded-full border-0 bg-white/90 transition-colors hover:bg-white ${saved ? 'text-rose-600' : 'text-ink'}`}>{saved ? <Favorite fontSize="small" /> : <FavoriteBorderOutlined fontSize="small" />}</button>
      <div className="absolute bottom-3 left-0 flex w-full justify-center gap-2 opacity-100 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
        <button onClick={() => setQuickProduct(product)} aria-label={`Швидкий перегляд: ${product.name}`} className="grid h-10 w-10 place-items-center rounded-full border-0 bg-white text-ink shadow-sm transition-colors hover:bg-primary-100"><VisibilityOutlined fontSize="small" /></button>
        <button onClick={() => toggleComparison(product)} aria-label={`Порівняти: ${product.name}`} aria-pressed={comparison.includes(product.id)} className="grid h-10 w-10 place-items-center rounded-full border-0 bg-white text-ink shadow-sm transition-colors hover:bg-primary-100"><CompareArrows fontSize="small" /></button>
      </div>
    </div>
    <div className={`flex flex-1 flex-col p-4 ${isList ? 'sm:px-6 sm:py-5' : ''}`}>
      <div className="mb-2 flex items-center justify-between gap-2 text-[10px] font-semibold uppercase tracking-[.12em] text-muted"><span>{product.brand}</span><span className={product.inStock ? 'text-primary-500 dark:text-green-300' : 'text-orange-600 dark:text-orange-300'}>{product.inStock ? 'В наявності' : 'Під замовлення'}</span></div>
      <h3 className={`mb-2 mt-0 font-semibold leading-6 text-copy ${isList ? 'text-lg' : 'min-h-12 text-sm'}`}><Link to={`/product/${product.slug}`} className="line-clamp-2 transition-colors hover:text-primary-500">{product.name}</Link></h3>
      {isList && <><p className="my-1 line-clamp-4 max-w-2xl text-sm leading-6 text-muted">{product.shortDescription}</p><ul className="my-2 flex list-none flex-wrap gap-x-5 gap-y-1 p-0 text-xs text-muted">{Object.entries(product.specifications).slice(0, 3).map(([key, value]) => <li key={key}>{key}: {value}</li>)}</ul></>}
      <div className="mb-4 flex items-center gap-2 text-xs"><span className="flex text-sm text-amber-500" aria-label={`Рейтинг ${product.rating} з 5`}>{Array.from({ length: 5 }, (_, index) => <span key={index} aria-hidden="true" className={index < Math.round(product.rating) ? '' : 'text-muted'}>★</span>)}</span><span className="font-semibold text-copy">{product.rating.toFixed(1)}</span><span className="text-muted">({product.reviewsCount})</span></div>
      <div className={`mt-auto ${isList ? 'flex flex-wrap items-end justify-between gap-4' : 'flex items-end justify-between gap-2'}`}>
        <div>{product.oldPrice ? <div className="mb-1 text-xs text-muted line-through">{formatPrice(product.oldPrice)}</div> : <div aria-hidden="true" className="mb-1 h-4" />}<div className="whitespace-nowrap text-lg font-bold tracking-tight text-copy">{formatPrice(product.price)}</div></div>
        <button onClick={() => addToCart(product)} aria-label={`Додати в кошик: ${product.name}`} className={`flex min-h-11 items-center justify-center gap-2 rounded-xl border-0 bg-primary-700 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-900 active:scale-95 ${isList ? 'px-5' : 'h-11 w-11 shrink-0'}`}><AddShoppingCartOutlined fontSize="small" />{isList && <span>Додати в кошик</span>}</button>
      </div>
    </div>
  </article>;
}
