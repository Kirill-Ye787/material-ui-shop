import { createContext, useCallback, useContext, useEffect, useReducer, useState } from 'react';
import { Button, Snackbar, Alert } from '@mui/material';
import { productById } from '../data/mockProducts.js';
import { cartReducer, createLine, getUnitPrice, getQuantityLimit, sanitizeCart } from '../utils/cart.js';
import { readStorage, writeStorage } from '../utils/localStorage.js';
import { usePersistentState } from '../hooks/usePersistentState.js';

const ShopContext = createContext(null);
const validIds = value => Array.isArray(value) ? [...new Set(value.map(Number))].filter(id => productById.has(id)) : [];

export function ShopProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, undefined, () => sanitizeCart(readStorage('cart', [])));
  const [wishlist, setWishlist] = usePersistentState('wishlist', [], validIds);
  const [comparison, setComparison] = usePersistentState('comparison', [], value => validIds(value).slice(0, 4));
  const [recent, setRecent] = usePersistentState('recent', [], value => validIds(value).slice(0, 8));
  const [toast, setToast] = useState(null);
  const [quickProduct, setQuickProduct] = useState(null);
  const [promo, setPromo] = usePersistentState('promo', '', value => value === 'FORMA10' ? value : '');
  useEffect(() => { writeStorage('cart', cart); }, [cart]);
  const notify = useCallback((message, severity = 'success', action = null) => {
    setToast({ key: Date.now() + Math.random(), message, severity, action });
  }, []);
  const cartItems = cart.map(line => {
    const product = productById.get(line.productId);
    return { ...line, product, unitPrice: getUnitPrice(product, line.options) };
  });
  const totalItems = cart.reduce((sum, line) => sum + line.quantity, 0);
  const totalPrice = cartItems.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
  function addToCart(product, quantity = 1, options = {}) {
    const inCart = cart.filter(line => line.productId === product.id).reduce((sum, line) => sum + line.quantity, 0);
    const capacity = getQuantityLimit(product) - inCart;
    if (capacity <= 0) { notify('Досягнуто максимальної кількості товару', 'info'); return; }
    const desired = createLine(product, quantity, options);
    dispatch({ type: 'add', line: { ...desired, quantity: Math.min(desired.quantity, capacity) } });
    notify(desired.quantity > capacity ? `Додано ${capacity} шт. — доступний залишок` : 'Товар додано в кошик');
  }
  function removeFromCart(key) {
    const line = cart.find(item => item.key === key);
    if (!line) return;
    dispatch({ type: 'remove', key });
    notify('Товар видалено з кошика', 'info', { label: 'Відмінити', onClick: () => dispatch({ type: 'restore', line }) });
  }
  function toggleWishlist(product) {
    const exists = wishlist.includes(product.id);
    setWishlist(current => exists ? current.filter(id => id !== product.id) : [...current, product.id]);
    notify(exists ? 'Товар видалено з обраного' : 'Товар додано в обране', exists ? 'info' : 'success');
  }
  function toggleComparison(product) {
    if (comparison.includes(product.id)) { setComparison(current => current.filter(id => id !== product.id)); return; }
    if (comparison.length >= 4) { notify('Можна порівняти до 4 товарів', 'warning'); return; }
    setComparison(current => [...current, product.id]);
    notify('Товар додано до порівняння');
  }
  const recordView = useCallback(id => {
    setRecent(current => current[0] === id ? current : [id, ...current.filter(item => item !== id)].slice(0, 8));
  }, [setRecent]);
  return <ShopContext.Provider value={{
    cart, cartItems, totalItems, totalPrice, addToCart, removeFromCart,
    updateQuantity: (key, quantity) => dispatch({ type: 'update', key, quantity }),
    clearCart: () => dispatch({ type: 'clear' }), getTotalPrice: () => totalPrice, getTotalItems: () => totalItems,
    wishlist, wishlistProducts: wishlist.map(id => productById.get(id)),
    toggleWishlist, isInWishlist: id => wishlist.includes(id),
    addToWishlist: product => setWishlist(current => current.includes(product.id) ? current : [...current, product.id]),
    removeFromWishlist: id => setWishlist(current => current.filter(item => item !== id)),
    clearWishlist: () => setWishlist([]),
    comparison, comparisonProducts: comparison.map(id => productById.get(id)), toggleComparison,
    recent, recordView, notify, quickProduct, setQuickProduct, promo, setPromo,
  }}>
    {children}
    <Snackbar key={toast?.key} open={Boolean(toast)} autoHideDuration={6500}
      onClose={(_, reason) => { if (reason !== 'clickaway') setToast(null); }}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
      <Alert severity={toast?.severity || 'success'} variant="filled" onClose={() => setToast(null)}
        action={toast?.action ? <Button color="inherit" size="small" onClick={() => { toast.action.onClick(); setToast(null); }}>{toast.action.label}</Button> : undefined}>
        {toast?.message}
      </Alert>
    </Snackbar>
  </ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used inside ShopProvider');
  return context;
}
