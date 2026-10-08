import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Drawer, Menu, MenuItem, TextField, Typography } from '@mui/material';
import MenuOutlined from '@mui/icons-material/MenuOutlined';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import FavoriteBorderOutlined from '@mui/icons-material/FavoriteBorderOutlined';
import ShoppingBagOutlined from '@mui/icons-material/ShoppingBagOutlined';
import NotificationsNoneOutlined from '@mui/icons-material/NotificationsNoneOutlined';
import PersonOutline from '@mui/icons-material/PersonOutline';
import DarkModeOutlined from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlined from '@mui/icons-material/LightModeOutlined';
import LocalShippingOutlined from '@mui/icons-material/LocalShippingOutlined';
import CompareArrows from '@mui/icons-material/CompareArrows';
import { useShop } from '../../context/ShopContext.jsx';
import { useAppTheme } from '../../context/ThemeContext.jsx';
import { usePersistentState } from '../../hooks/usePersistentState.js';
import { formatPrice } from '../../utils/priceFormatter.js';
import SearchBar from '../common/SearchBar.jsx';
import styles from './Header.module.scss';
import navStyles from './Navigation.module.scss';

const links = [['/', 'Головна'], ['/catalog', 'Каталог'], ['/about', 'Про нас'], ['/contacts', 'Контакти']];
function Count({ value }) { return value > 0 ? <span key={value} className={styles.badge}>{value}</span> : null; }
export default function Header() {
  const { totalItems, totalPrice, wishlist, comparison, notify } = useShop();
  const { mode, toggleTheme } = useAppTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const [unread, setUnread] = useState(3);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profile, setProfile] = usePersistentState('profile', null, value => value && typeof value.name === 'string' ? { name: value.name.slice(0, 60) } : null);
  const [name, setName] = useState(profile?.name || '');
  const navigation = (mobile = false) => <nav aria-label={mobile ? 'Мобільна навігація' : 'Основна навігація'} className={mobile ? navStyles.mobile : navStyles.navigation}>
    {links.map(([to, label]) => <NavLink key={to} end={to === '/'} to={to}
      onClick={() => setMenuOpen(false)} className={({ isActive }) => isActive ? navStyles.active : undefined}>{label}</NavLink>)}
  </nav>;
  return <header className={styles.header}>
    <div className={styles.announcement}>Речі, які роблять кожен день кращим <span>Безкоштовна доставка від 3 000 ₴</span></div>
    <div className={styles.container}>
      <div className={styles.mainRow}>
        <button className={`${styles.iconButton} ${styles.burger}`} onClick={() => setMenuOpen(true)} aria-label="Відкрити меню"><MenuOutlined /></button>
        <Link to="/" className={styles.logo} aria-label="Forma — головна"><span className={styles.logoMark}>f</span>forma<span className={styles.logoDot}>.</span></Link>
        <div className={styles.search}><SearchBar /></div>
        <div className={styles.actions}>
          <button className={`${styles.iconButton} ${styles.extra}`} onClick={event => setNotificationAnchor(event.currentTarget)} aria-label={`Сповіщення: ${unread}`}><NotificationsNoneOutlined /><Count value={unread} /></button>
          <Link className={styles.iconButton} to="/wishlist" aria-label={`Обране: ${wishlist.length}`}><FavoriteBorderOutlined /><Count value={wishlist.length} /></Link>
          <Link className={`${styles.iconButton} ${styles.extra}`} to="/comparison" aria-label={`Порівняння: ${comparison.length}`}><CompareArrows /><Count value={comparison.length} /></Link>
          <Link className={styles.cartLink} to="/cart" aria-label={`Кошик: ${totalItems} товарів`}><span className={styles.iconButton}><ShoppingBagOutlined /><Count value={totalItems} /></span><span className={styles.cartTotal}><small>Кошик</small>{formatPrice(totalPrice)}</span></Link>
          <button className={`${styles.iconButton} ${styles.extra}`} onClick={toggleTheme} aria-label={mode === 'light' ? 'Увімкнути темну тему' : 'Увімкнути світлу тему'}>{mode === 'light' ? <DarkModeOutlined /> : <LightModeOutlined />}</button>
          <button className={`${styles.iconButton} ${styles.extra}`} onClick={() => setProfileOpen(true)} aria-label={profile ? `Профіль: ${profile.name}` : 'Увійти'}><PersonOutline /></button>
        </div>
      </div>
      <div className={styles.navRow}>{navigation()}<span className={styles.delivery}><LocalShippingOutlined fontSize="small" />Доставка по Україні</span></div>
    </div>
    <Drawer open={menuOpen} onClose={() => setMenuOpen(false)}>
      <Box sx={{ width: 280, p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}><Typography variant="h5" fontWeight={800}>forma.</Typography><button className={styles.iconButton} onClick={() => setMenuOpen(false)} aria-label="Закрити меню"><CloseOutlined /></button></Box>
        {navigation(true)}
        <Button fullWidth startIcon={<CompareArrows />} component={Link} to="/comparison" onClick={() => setMenuOpen(false)}>Порівняння ({comparison.length})</Button>
        <Button fullWidth startIcon={<NotificationsNoneOutlined />} onClick={event => setNotificationAnchor(event.currentTarget)}>Сповіщення ({unread})</Button>
        <Button fullWidth startIcon={<DarkModeOutlined />} onClick={toggleTheme}>Змінити тему</Button>
        <Button fullWidth startIcon={<PersonOutline />} onClick={() => { setMenuOpen(false); setProfileOpen(true); }}>{profile?.name || 'Увійти'}</Button>
      </Box>
    </Drawer>
    <Menu anchorEl={notificationAnchor} open={Boolean(notificationAnchor)} onClose={() => setNotificationAnchor(null)}>
      <MenuItem disabled>Новинки вже в каталозі</MenuItem><MenuItem disabled>Промокод FORMA10: −10%</MenuItem><MenuItem disabled>Безкоштовна доставка від 3 000 ₴</MenuItem>
      <MenuItem onClick={() => { setUnread(0); setNotificationAnchor(null); }}>Позначити всі прочитаними</MenuItem>
    </Menu>
    <Dialog open={profileOpen} onClose={() => setProfileOpen(false)} maxWidth="xs" fullWidth>
      <form onSubmit={event => { event.preventDefault(); if (!name.trim()) return; setProfile({ name: name.trim() }); setProfileOpen(false); notify('Локальний профіль збережено'); }}>
        <DialogTitle>{profile ? 'Мій профіль' : 'Вітаємо у Forma'}</DialogTitle>
        <DialogContent><Typography color="text.secondary" mb={2}>Навчальний локальний профіль. Для збереження імені введіть його нижче.</Typography><TextField autoFocus fullWidth required label="Ваше ім’я" value={name} onChange={event => setName(event.target.value)} slotProps={{ htmlInput: { maxLength: 60 } }} /></DialogContent>
        <DialogActions>{profile && <Button onClick={() => { setProfile(null); setName(''); setProfileOpen(false); }}>Вийти</Button>}<Button onClick={() => setProfileOpen(false)}>Скасувати</Button><Button type="submit" variant="contained">Зберегти</Button></DialogActions>
      </form>
    </Dialog>
  </header>;
}
