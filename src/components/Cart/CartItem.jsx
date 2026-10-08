import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Collapse, IconButton, ListItem, Typography } from '@mui/material';
import Add from '@mui/icons-material/Add';
import Remove from '@mui/icons-material/Remove';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import { useCart } from '../../hooks/useCart.js';
import { useShop } from '../../context/ShopContext.jsx';
import { availableForLine } from '../../utils/cart.js';
import { formatPrice } from '../../utils/priceFormatter.js';

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();
  const { cart } = useShop();
  const [removing, setRemoving] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const options = item.product.variants.map(variant => `${variant.name}: ${variant.options.find(option => option.value === item.options[variant.type])?.label}`).join(' · ');
  return <Collapse in={!removing} timeout={200}>
    <ListItem component="div" role="listitem" sx={{ alignItems: 'flex-start', gap: 2, p: { xs: 2, sm: 3 }, borderBottom: '1px solid', borderColor: 'divider', flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
      <Box component={Link} to={`/product/${item.product.slug}`} sx={{ width: { xs: 76, sm: 110 }, flexShrink: 0 }}><Box component="img" src={item.product.images[0]} alt={item.product.name} sx={{ width: '100%', borderRadius: 2 }} /></Box>
      <Box sx={{ flex: 1, minWidth: 145 }}><Typography component={Link} to={`/product/${item.product.slug}`} fontWeight={700} fontSize={14}>{item.product.name}</Typography><Typography fontSize={11} color="text.secondary" mt={.5}>{options}</Typography><Typography fontSize={12} color="text.secondary" mt={1}>{formatPrice(item.unitPrice)} / шт.</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: .5, mt: 1 }}><IconButton size="small" disabled={item.quantity === 1 || removing} aria-label={`Зменшити кількість: ${item.product.name}`} onClick={() => updateQuantity(item.key, item.quantity - 1)}><Remove fontSize="small" /></IconButton><Typography sx={{ width: 24, textAlign: 'center' }}>{item.quantity}</Typography><IconButton size="small" disabled={item.quantity >= availableForLine(cart, item) || removing} aria-label={`Збільшити кількість: ${item.product.name}`} onClick={() => updateQuantity(item.key, item.quantity + 1)}><Add fontSize="small" /></IconButton></Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: { xs: 'center', sm: 'flex-end' }, flexDirection: { xs: 'row', sm: 'column' }, justifyContent: 'space-between', width: { xs: '100%', sm: 'auto' }, gap: 1 }}><Typography fontWeight={800} fontSize={16} whiteSpace="nowrap">{formatPrice(item.unitPrice * item.quantity)}</Typography><IconButton disabled={removing} aria-label={`Видалити з кошика: ${item.product.name}`} onClick={() => { setRemoving(true); timer.current = setTimeout(() => removeFromCart(item.key), 200); }}><DeleteOutline /></IconButton></Box>
    </ListItem>
  </Collapse>;
}
