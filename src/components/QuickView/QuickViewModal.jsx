import { Link } from 'react-router-dom';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Rating, Typography } from '@mui/material';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import AddShoppingCartOutlined from '@mui/icons-material/AddShoppingCartOutlined';
import { useShop } from '../../context/ShopContext.jsx';
import { useCart } from '../../hooks/useCart.js';
import { formatPrice } from '../../utils/priceFormatter.js';

export default function QuickViewModal() {
  const { quickProduct: product, setQuickProduct } = useShop();
  const { addToCart } = useCart();
  return <Dialog open={Boolean(product)} onClose={() => setQuickProduct(null)} fullWidth maxWidth="sm" aria-labelledby="quick-title">
    {product && <><DialogTitle id="quick-title" sx={{ pr: 7 }}>Швидкий перегляд<IconButton aria-label="Закрити швидкий перегляд" onClick={() => setQuickProduct(null)} sx={{ position: 'absolute', right: 10, top: 10 }}><CloseOutlined /></IconButton></DialogTitle>
      <DialogContent><Box component="img" src={product.images[0]} alt={product.name} sx={{ width: '100%', maxHeight: 270, objectFit: 'contain', borderRadius: 3, mb: 2, bgcolor: '#edf0e8' }} /><Typography variant="h6" fontWeight={700}>{product.name}</Typography><Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}><Rating value={product.rating} precision={.1} size="small" readOnly /><Typography fontSize={12} color="text.secondary">{product.rating} · {product.reviewsCount} відгуків</Typography></Box><Typography color="text.secondary" mt={2} fontSize={14}>{product.shortDescription}</Typography><Typography variant="h5" fontWeight={800} mt={2}>{formatPrice(product.price)}</Typography><Typography fontSize={12} color="text.secondary" mt={1}>Для вибору кольору та інших опцій відкрийте деталі товару.</Typography></DialogContent>
      <DialogActions sx={{ p: 3, pt: 0, flexWrap: 'wrap', gap: 1 }}><Button component={Link} to={`/product/${product.slug}`} onClick={() => setQuickProduct(null)} variant="outlined">Детальніше</Button><Button variant="contained" startIcon={<AddShoppingCartOutlined />} onClick={() => addToCart(product)}>Додати в кошик</Button></DialogActions>
    </>}
  </Dialog>;
}
