import { Link } from 'react-router-dom';
import Instagram from '@mui/icons-material/Instagram';
import Facebook from '@mui/icons-material/Facebook';
import Telegram from '@mui/icons-material/Telegram';
import ArrowOutward from '@mui/icons-material/ArrowOutward';
import './Footer.css';

export default function Footer() {
  return <footer className="footer"><div className="footer-container">
    <div className="footer-columns">
      <div className="footer-brand"><Link to="/" className="footer-logo">forma.</Link><p>Для вашого ритму життя.<br />Добре підібрані речі, щодня.</p><div className="footer-socials"><a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram fontSize="small" /></a><a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook fontSize="small" /></a><a href="https://telegram.org/" target="_blank" rel="noreferrer" aria-label="Telegram"><Telegram fontSize="small" /></a></div></div>
      <div className="footer-column"><h3>Магазин</h3><Link to="/catalog">Каталог товарів</Link><Link to="/catalog?availability=sale">Розпродаж</Link><Link to="/catalog?sort=newest">Новинки</Link><Link to="/wishlist">Обране</Link></div>
      <div className="footer-column"><h3>Про Forma</h3><Link to="/about">Про нас</Link><Link to="/contacts">Контакти</Link><Link to="/about#delivery">Доставка та оплата</Link><Link to="/comparison">Порівняння товарів</Link></div>
      <div className="footer-column"><h3>Залишаймось на зв’язку</h3><a href="mailto:hello@forma.example">hello@forma.example <ArrowOutward fontSize="small" /></a><span>Пн–Пт · 09:00–18:00</span><span className="footer-demo">Навчальний магазин.<br />Товари й контакти — демо.</span></div>
    </div>
    <div className="footer-bottom"><p>© {new Date().getFullYear()} Forma. Навчальний проєкт.</p><span>Зроблено з увагою до деталей</span></div>
  </div></footer>;
}
