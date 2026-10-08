import { useState } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import LockOutlined from '@mui/icons-material/LockOutlined';
import { useCart } from '../../hooks/useCart.js';
import { useShop } from '../../context/ShopContext.jsx';
import { getTotals } from '../../utils/cart.js';
import { formatPrice } from '../../utils/priceFormatter.js';
import styles from '../../pages/Cart/Cart.module.scss';

export default function CartSummary({ onCheckout }) {
  const { cartItems, totalItems } = useCart();
  const { promo, setPromo, notify } = useShop();
  const [code, setCode] = useState(promo);
  const [error, setError] = useState('');
  const totals = getTotals(cartItems, promo);
  function applyPromo(event) {
    event.preventDefault();
    if (code.trim().toUpperCase() === 'FORMA10') { setPromo('FORMA10'); setError(''); notify('Промокод застосовано: знижка 10%'); }
    else setError('Невідомий промокод. Спробуйте FORMA10.');
  }
  return <aside className={styles.cartSummary}>
    <h2>Ваше замовлення</h2>
    <div className={styles.summaryLine}><span>Товари ({totalItems})</span><strong>{formatPrice(totals.subtotal)}</strong></div>
    <div className={styles.summaryLine}><span>Знижка за промокодом</span><strong className={styles.discount}>−{formatPrice(totals.discount)}</strong></div>
    <div className={styles.summaryLine}><span>Доставка</span><strong>{totals.delivery === 0 ? 'Безкоштовно' : formatPrice(totals.delivery)}</strong></div>
    <Typography fontSize={11} color="text.secondary" mt={1}>Від 3 000 ₴ вартості товарів — безкоштовна доставка.</Typography>
    <form onSubmit={applyPromo} className={styles.promoForm}><TextField size="small" label="Промокод" value={code} onChange={event => { setCode(event.target.value); setError(''); }} error={Boolean(error)} slotProps={{ htmlInput: { maxLength: 30 } }} sx={{ flex: 1, minWidth: 0 }} /><Button type="submit" variant="outlined" size="small">OK</Button></form>
    {error && <Typography role="alert" fontSize={11} color="error" mt={1}>{error}</Typography>}
    {promo && <div className={styles.appliedPromo}>✓ FORMA10 застосовано <button onClick={() => { setPromo(''); setCode(''); }}>Скасувати</button></div>}
    <div className={styles.totalLine}><span>Загалом</span><strong>{formatPrice(totals.total)}</strong></div>
    <Button fullWidth size="large" variant="contained" onClick={onCheckout}>Оформити замовлення</Button>
    <div className={styles.checkoutNote}><LockOutlined fontSize="small" />Демонстрація без реальної оплати</div>
  </aside>;
}
