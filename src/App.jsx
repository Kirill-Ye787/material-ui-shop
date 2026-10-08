import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import Header from './components/Header/Header.jsx';
import Footer from './components/Footer/Footer.jsx';
import QuickViewModal from './components/QuickView/QuickViewModal.jsx';
import EmptyState from './components/common/EmptyState.jsx';
import { productBySlug } from './data/mockProducts.js';

const Home = lazy(() => import('./pages/Home/Home.jsx'));
const Catalog = lazy(() => import('./pages/Catalog/Catalog.jsx'));
const ProductDetail = lazy(() => import('./pages/ProductDetail/ProductDetail.jsx'));
const Cart = lazy(() => import('./pages/Cart/Cart.jsx'));
const Wishlist = lazy(() => import('./pages/Wishlist/Wishlist.jsx'));
const Comparison = lazy(() => import('./pages/Comparison/Comparison.jsx'));
const About = lazy(() => import('./pages/About/About.jsx'));
const Contacts = lazy(() => import('./pages/Contacts/Contacts.jsx'));

export default function App() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const titles = { '/': 'Для вашого щодня', '/catalog': 'Каталог товарів', '/cart': 'Кошик', '/wishlist': 'Обране', '/comparison': 'Порівняння', '/about': 'Про нас', '/contacts': 'Контакти' };
    document.title = `${titles[pathname] || productBySlug.get(pathname.split('/').pop())?.name || 'Сторінку не знайдено'} — Forma`;
  }, [pathname]);
  return <><a href="#main-content" className="skip-link">Перейти до вмісту</a><Header /><main id="main-content" className="app-main" tabIndex={-1}><Suspense fallback={<Box sx={{ display: 'grid', placeItems: 'center', minHeight: 400 }}><CircularProgress aria-label="Завантаження сторінки" /></Box>}><Routes><Route path="/" element={<Home />} /><Route path="/catalog" element={<Catalog />} /><Route path="/product/:slug" element={<ProductDetail />} /><Route path="/cart" element={<Cart />} /><Route path="/wishlist" element={<Wishlist />} /><Route path="/comparison" element={<Comparison />} /><Route path="/about" element={<About />} /><Route path="/contacts" element={<Contacts />} /><Route path="*" element={<div className="page-shell"><EmptyState title="Сторінку не знайдено" description="Поверніться до каталогу товарів." /></div>} /></Routes></Suspense></main><Footer /><QuickViewModal /></>;
}
