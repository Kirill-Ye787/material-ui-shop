import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, List, Stack, TextField, Typography } from '@mui/material';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import { useCart } from '../../hooks/useCart.js';
import { useShop } from '../../context/ShopContext.jsx';
import { getTotals } from '../../utils/cart.js';
import { formatPrice } from '../../utils/priceFormatter.js';
import Breadcrumbs from '../../components/common/Breadcrumbs.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import CartItem from '../../components/Cart/CartItem.jsx';
import CartSummary from '../../components/Cart/CartSummary.jsx';
import styles from './Cart.module.scss';

export default function Cart() {
  const { cartItems, totalItems, clearCart } = useCart();
  const { promo, setPromo } = useShop();
  const [checkout, setCheckout] = useState(false);
  const [receipt, setReceipt] = useState(null);
  function submit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setReceipt({ name: data.get('name'), city: data.get('city'), id: `DEMO-${String(Date.now()).slice(-6)}`, total: getTotals(cartItems, promo).total, count: totalItems });
    setCheckout(false); clearCart(); setPromo('');
  }
  return <div className={styles.cartContainer}>
    <Breadcrumbs items={[{ label: 'Кошик' }]} /><h1>Кошик <span>({totalItems})</span></h1>
    {cartItems.length ? <div className={styles.cartLayout}><List component="div" role="list" aria-label="Товари в кошику" className={styles.cartItems} disablePadding>{cartItems.map(item => <CartItem key={item.key} item={item} />)}</List><CartSummary onCheckout={() => setCheckout(true)} /></div> : <EmptyState title="Ваш кошик поки порожній" description="Знайдіть у каталозі речі, які вам сподобаються." />}
    <Dialog open={checkout} onClose={() => setCheckout(false)} fullWidth maxWidth="sm" aria-labelledby="checkout-title">
      <form onSubmit={submit}><DialogTitle id="checkout-title">Демонстраційне замовлення</DialogTitle><DialogContent><Typography fontSize={13} color="text.secondary" mb={3}>Форма показує процес оформлення. Дані нікуди не надсилаються, оплата не списується.</Typography><Stack gap={2}><TextField autoFocus required name="name" label="Ім’я отримувача" slotProps={{ htmlInput: { maxLength: 80 } }} /><TextField required name="phone" type="tel" label="Телефон" slotProps={{ htmlInput: { pattern: '[+0-9 ()-]{7,20}', title: 'Введіть від 7 до 20 символів: цифри, +, дужки, пробіли або дефіс' } }} /><TextField required name="city" label="Місто доставки" slotProps={{ htmlInput: { maxLength: 80 } }} /><Typography fontWeight={800}>До сплати: {formatPrice(getTotals(cartItems, promo).total)}</Typography></Stack></DialogContent><DialogActions sx={{ p: 3 }}><Button onClick={() => setCheckout(false)}>Скасувати</Button><Button type="submit" variant="contained">Підтвердити демо-замовлення</Button></DialogActions></form>
    </Dialog>
    <Dialog open={Boolean(receipt)} onClose={() => setReceipt(null)} maxWidth="xs" fullWidth aria-labelledby="receipt-title"><DialogTitle id="receipt-title">Демо-замовлення готове</DialogTitle><DialogContent>{receipt && <Box sx={{ textAlign: 'center' }}><CheckCircleOutline color="success" sx={{ fontSize: 56, mb: 2 }} /><Typography fontWeight={700}>{receipt.name}, дякуємо!</Typography><Typography mt={1} color="text.secondary">{receipt.id} · {receipt.city}</Typography><Typography mt={1}>{receipt.count} шт. · {formatPrice(receipt.total)}</Typography><Typography fontSize={12} mt={2} color="text.secondary">Це локальна демонстрація оформлення.</Typography></Box>}</DialogContent><DialogActions><Button component={Link} to="/catalog" onClick={() => setReceipt(null)}>Продовжити покупки</Button></DialogActions></Dialog>
  </div>;
}
