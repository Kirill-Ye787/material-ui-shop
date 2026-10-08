import { useEffect, useId, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Chip, FormControl, IconButton, InputLabel, MenuItem, Rating, Select, Stack, Tab, Tabs, Table, TableBody, TableCell, TableRow, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import Add from '@mui/icons-material/Add';
import Remove from '@mui/icons-material/Remove';
import FavoriteBorderOutlined from '@mui/icons-material/FavoriteBorderOutlined';
import Favorite from '@mui/icons-material/Favorite';
import CompareArrows from '@mui/icons-material/CompareArrows';
import ShoppingBagOutlined from '@mui/icons-material/ShoppingBagOutlined';
import LocalShippingOutlined from '@mui/icons-material/LocalShippingOutlined';
import { products, productById, productBySlug } from '../../data/mockProducts.js';
import { useCart } from '../../hooks/useCart.js';
import { useWishlist } from '../../hooks/useWishlist.js';
import { useShop } from '../../context/ShopContext.jsx';
import { getUnitPrice, getQuantityLimit, resolveOptions } from '../../utils/cart.js';
import { formatPrice } from '../../utils/priceFormatter.js';
import Breadcrumbs from '../../components/common/Breadcrumbs.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import ImageGallery from '../../components/ImageGallery/ImageGallery.jsx';
import ProductCard from '../../components/ProductCard/ProductCard.jsx';
import ProductGrid from '../../components/ProductGrid/ProductGrid.jsx';
import styles from './ProductDetail.module.scss';

function ProductContent({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { recent, recordView, comparison, toggleComparison } = useShop();
  const [options, setOptions] = useState(() => resolveOptions(product));
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState(0);
  const uid = useId();
  const navigate = useNavigate();
  useEffect(() => { recordView(product.id); }, [product.id, recordView]);
  const unitPrice = getUnitPrice(product, options);
  const limit = getQuantityLimit(product);
  const selectedLabel = type => product.variants.find(variant => variant.type === type)?.options.find(option => option.value === options[type])?.label;
  const similar = products.filter(item => item.category === product.category && item.id !== product.id).slice(0, 6);
  const viewed = [...new Set([...recent, ...products.slice(0, 8).map(item => item.id)])].filter(id => id !== product.id).slice(0, 4).map(id => productById.get(id));
  const labels = ['Опис', 'Характеристики', 'Відгуки', 'Доставка та оплата'];
  return <div className={styles.container}>
    <Breadcrumbs items={[{ label: 'Каталог', to: '/catalog' }, { label: product.categoryName, to: `/catalog?category=${product.category}` }, { label: product.name }]} />
    <div className={styles.topSection}>
      <ImageGallery images={product.images} name={product.name} />
      <section className={styles.info}><div className={styles.brand}>{product.brand} / {product.categoryName}</div><h1>{product.name}</h1><div className={styles.sku}>Артикул: {product.sku}</div>
        <Stack direction="row" gap={1} alignItems="center" my={2}><Rating value={product.rating} precision={.1} readOnly size="small" /><Typography fontSize={13}>{product.rating} <span className={styles.muted}>· {product.reviewsCount} відгуків</span></Typography></Stack>
        <Stack direction="row" flexWrap="wrap" gap={1} mb={2}>{product.badges.map(badge => <Chip key={badge} label={badge === 'SALE' ? `SALE −${product.discount}%` : badge === 'TOP' ? 'ТОП' : badge} color={badge === 'SALE' ? 'warning' : 'primary'} size="small" variant="outlined" />)}<Chip label={product.inStock ? `В наявності: ${product.stockQuantity} шт.` : 'Під замовлення'} size="small" color={product.inStock ? 'success' : 'default'} /></Stack>
        <div className={styles.price}>{product.oldPrice && <del>{formatPrice(product.oldPrice + unitPrice - product.price)}</del>}<strong>{formatPrice(unitPrice)}</strong></div>
        <p className={styles.description}>{product.shortDescription}</p>
        <Stack gap={2} mt={3}>{product.variants.map(variant => variant.type === 'color' ? <Box key={variant.type}><Typography fontSize={13} fontWeight={650} mb={1}>Колір: {selectedLabel('color')}</Typography><ToggleButtonGroup sx={{ flexWrap: 'wrap' }} exclusive size="small" value={options.color} onChange={(_, value) => { if (value) setOptions(current => ({ ...current, color: value })); }} aria-label="Вибір кольору">{variant.options.map(option => <ToggleButton key={option.value} value={option.value} aria-label={option.label} sx={{ px: 1.5, gap: 1 }}><Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: option.hex, border: '1px solid', borderColor: 'divider' }} /><Typography fontSize={11}>{option.label}</Typography></ToggleButton>)}</ToggleButtonGroup></Box> : <FormControl key={variant.type} size="small" sx={{ maxWidth: 260 }}><InputLabel id={`${uid}-${variant.type}`}>{variant.name}</InputLabel><Select labelId={`${uid}-${variant.type}`} label={variant.name} value={options[variant.type]} onChange={event => setOptions(current => ({ ...current, [variant.type]: event.target.value }))}>{variant.options.map(option => <MenuItem key={option.value} value={option.value}>{option.label}{option.priceModifier ? ` (+${formatPrice(option.priceModifier)})` : ''}</MenuItem>)}</Select></FormControl>)}</Stack>
        <Stack direction="row" alignItems="center" gap={1} mt={3}><Typography fontSize={13} mr={1}>Кількість</Typography><IconButton disabled={quantity <= 1} aria-label="Зменшити кількість" onClick={() => setQuantity(value => Math.max(1, value - 1))}><Remove fontSize="small" /></IconButton><TextField size="small" type="number" value={quantity} onChange={event => setQuantity(Math.max(1, Math.min(limit, Math.floor(Number(event.target.value) || 1))))} slotProps={{ htmlInput: { 'aria-label': 'Кількість товару', min: 1, max: limit, style: { textAlign: 'center' } } }} sx={{ width: 76 }} /><IconButton disabled={quantity >= limit} aria-label="Збільшити кількість" onClick={() => setQuantity(value => Math.min(limit, value + 1))}><Add fontSize="small" /></IconButton></Stack>
        <Stack direction="row" flexWrap="wrap" gap={1.5} mt={3}><Button size="large" variant="contained" startIcon={<ShoppingBagOutlined />} onClick={() => addToCart(product, quantity, options)}>Додати в кошик</Button><Button size="large" variant="outlined" onClick={() => { addToCart(product, quantity, options); navigate('/cart'); }}>Купити зараз</Button><IconButton aria-label={isInWishlist(product.id) ? 'Видалити з обраного' : 'В обране'} aria-pressed={isInWishlist(product.id)} onClick={() => toggleWishlist(product)} color={isInWishlist(product.id) ? 'error' : 'default'}>{isInWishlist(product.id) ? <Favorite /> : <FavoriteBorderOutlined />}</IconButton><IconButton aria-label="Порівняти товар" aria-pressed={comparison.includes(product.id)} onClick={() => toggleComparison(product)} color={comparison.includes(product.id) ? 'primary' : 'default'}><CompareArrows /></IconButton></Stack>
        <div className={styles.delivery}><LocalShippingOutlined fontSize="small" />Безкоштовна доставка від 3 000 ₴</div>
      </section>
    </div>
    <Box sx={{ mt: 5, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', borderRadius: 3, overflow: 'hidden' }}>
      <Tabs value={tab} onChange={(_, value) => setTab(value)} variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile aria-label="Інформація про товар" sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>{labels.map((label, index) => <Tab key={label} label={label} id={`${uid}-tab-${index}`} aria-controls={`${uid}-panel-${index}`} />)}</Tabs>
      {labels.map((_, index) => <Box key={index} role="tabpanel" hidden={tab !== index} id={`${uid}-panel-${index}`} aria-labelledby={`${uid}-tab-${index}`} sx={{ p: { xs: 2, sm: 3 } }}>
        {index === 0 && <><Typography sx={{ lineHeight: 1.9, mb: 2 }}>{product.description}</Typography><ul className={styles.features}>{product.features.map(feature => <li key={feature}>{feature}</li>)}</ul></>}
        {index === 1 && <Table size="small" aria-label="Характеристики товару"><TableBody>{Object.entries(product.specifications).map(([key, value]) => <TableRow key={key}><TableCell component="th" scope="row" sx={{ fontWeight: 650 }}>{key}</TableCell><TableCell>{value}</TableCell></TableRow>)}</TableBody></Table>}
        {index === 2 && <><Typography color="text.secondary" fontSize={13} mb={2}>Приклади відгуків (демо). Загальний рейтинг: {product.rating} / 5.</Typography>{[['Олена', 5, 'Зручний і продуманий товар. Приємний дизайн.'], ['Андрій', 4, 'Хороший вибір для щоденного використання.'], ['Марія', 5, 'Сподобалися матеріали та увага до деталей.']].map(([name, score, text]) => <Box key={name} sx={{ py: 2, borderBottom: '1px solid', borderColor: 'divider' }}><Stack direction="row" gap={2}><Typography fontWeight={700}>{name}</Typography><Rating size="small" value={score} readOnly /></Stack><Typography fontSize={14} mt={1}>{text}</Typography></Box>)}</>}
        {index === 3 && <Stack gap={2}><Typography>Доставка по Україні: 99 ₴. Від 3 000 ₴ вартості товарів — безкоштовно.</Typography><Typography>Товари в наявності: орієнтовно 1–3 робочі дні. Під замовлення: орієнтовно 7–14 днів.</Typography><Typography color="text.secondary">Це навчальна демонстрація. Оформлення показує підсумок замовлення без реального платежу.</Typography><Button component={Link} to="/contacts" sx={{ alignSelf: 'flex-start' }}>Контакти</Button></Stack>}
      </Box>)}
    </Box>
    <section className="mt-12"><h2 className="mb-5 text-2xl font-bold text-copy">Схожі товари</h2><div className="flex gap-5 overflow-x-auto pb-5" tabIndex={0} aria-label="Схожі товари, горизонтальна прокрутка">{similar.map(item => <div key={item.id} className="w-64 shrink-0"><ProductCard product={item} /></div>)}</div></section>
    <section className="mt-7"><h2 className="mb-5 text-2xl font-bold text-copy">Переглядали також</h2><ProductGrid products={viewed} /></section>
  </div>;
}

export default function ProductDetail() {
  const { slug } = useParams();
  const product = productBySlug.get(slug);
  return product ? <ProductContent key={product.id} product={product} /> : <div className="page-shell"><EmptyState title="Товар не знайдено" description="Виберіть інший товар у каталозі." /></div>;
}
