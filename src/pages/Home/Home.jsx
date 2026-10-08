import { Link } from 'react-router-dom';
import ArrowForward from '@mui/icons-material/ArrowForward';
import LocalShippingOutlined from '@mui/icons-material/LocalShippingOutlined';
import VerifiedUserOutlined from '@mui/icons-material/VerifiedUserOutlined';
import ReplayOutlined from '@mui/icons-material/ReplayOutlined';
import { products } from '../../data/mockProducts.js';
import { categories } from '../../data/mockCategories.js';
import ProductGrid from '../../components/ProductGrid/ProductGrid.jsx';
import styles from './Home.module.scss';

export default function Home() {
  return <div className={styles.container}>
    <section className={styles.hero}>
      <div className={styles.heroCopy}><span className={styles.eyebrow}>Колекція для вашого щодня</span><h1>Менше зайвого.<br />Більше вашого.</h1><p>Технології, стиль і затишок —<br />речі, які знаходять своє місце у вашому житті.</p><Link className={styles.heroButton} to="/catalog">Переглянути каталог <ArrowForward fontSize="small" /></Link><div className={styles.heroNote}>120 товарів · 20 брендів · 6 категорій</div></div>
      <div className={styles.heroVisual}><span className={styles.heroCircle} /><img src="/images/headphones-1.svg" alt="Бездротові навушники із колекції Forma" width="600" height="500" /><div className={styles.heroLabel}><span>Вибір тижня</span><strong>Звук у вашому ритмі</strong><Link to={`/product/${products[0].slug}`}>Відкрити товар ↗</Link></div></div>
    </section>
    <div className={styles.benefits}>{[[LocalShippingOutlined, 'Доставка по Україні', 'Безкоштовно від 3 000 ₴'], [VerifiedUserOutlined, 'Продуманий вибір', '6 категорій для життя'], [ReplayOutlined, 'Зручно обирати', 'Порівнюйте та зберігайте']].map(([Icon, title, note]) => <div key={title}><Icon /><span><strong>{title}</strong><small>{note}</small></span></div>)}</div>
    <section className={styles.categorySection}><div className={styles.sectionTitle}><h2>Що вам до вподоби?</h2><Link to="/catalog">Усі категорії <ArrowForward fontSize="small" /></Link></div><div className={styles.categories}>{categories.map(category => <Link key={category.id} to={`/catalog?category=${category.id}`}><img src={`/images/${category.icon === 'devices' ? 'phone' : category.icon}-1.svg`} alt="" loading="lazy" width="600" height="500" /><strong>{category.name}</strong><small>{category.note}</small></Link>)}</div></section>
    <section><div className={styles.sectionTitle}><div><span className={styles.eyebrow}>Варто придивитись</span><h2>Ваші нові улюбленці</h2></div><Link to="/catalog">Увесь каталог <ArrowForward fontSize="small" /></Link></div><ProductGrid products={products.slice(0, 8)} /></section>
    <div className={styles.promo}><div><span className={styles.eyebrow}>Приємний початок</span><h2>Знижка 10% на ваше замовлення</h2><p>Введіть промокод <strong>FORMA10</strong> у кошику.</p></div><Link to="/catalog">Знайти своє <ArrowForward fontSize="small" /></Link></div>
  </div>;
}
