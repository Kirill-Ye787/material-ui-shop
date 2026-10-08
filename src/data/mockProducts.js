import { categories } from './mockCategories.js';

// All prices, stock, specifications and reviews are reproducible demo data.
// Twenty products per category, with different names, brands, prices and options.
const catalog = {
  electronics: {
    names: ['Бездротові навушники Studio', 'Смартфон Vision', 'Ноутбук Air', 'Планшет Note'],
    kinds: ['headphones', 'phone', 'laptop', 'tablet'],
    brands: ['Sony', 'Samsung', 'Apple', 'Xiaomi', 'Asus', 'Lenovo', 'LG'],
    features: ['Бездротове підключення', 'Енергоощадний режим', 'Гарантія 12 місяців'],
    specs: { 'Підключення': 'Bluetooth / USB-C', 'Комплектація': 'Пристрій, кабель, інструкція', 'Гарантія': '12 місяців' },
  },
  clothing: {
    names: ['Худі Everyday', 'Футболка Essential', 'Світшот Soft', 'Футболка Relax'],
    kinds: ['hoodie', 'shirt', 'hoodie', 'shirt'],
    brands: ['Zara', 'H&M', 'Mango', 'Uniqlo'],
    features: ['М’яка тканина', 'Зручний крій', 'Для щоденного використання'],
    specs: { 'Матеріал': 'Бавовна 80%, поліестер 20%', 'Догляд': 'Прання при 30°C', 'Сезон': 'Демісезон' },
  },
  shoes: {
    names: ['Кросівки Urban', 'Кеди Daily', 'Кросівки Runner', 'Кросівки Move'],
    kinds: ['shoe', 'shoe', 'shoe', 'shoe'],
    brands: ['Nike', 'Adidas', 'Puma', 'Reebok'],
    features: ['Легка підошва', 'Дихаючий верх', 'М’яка устілка'],
    specs: { 'Верх': 'Текстиль', 'Підошва': 'Гума / EVA', 'Застібка': 'Шнурівка' },
  },
  accessories: {
    names: ['Годинник Classic', 'Рюкзак Daypack', 'Годинник Minimal', 'Сумка Weekend'],
    kinds: ['watch', 'bag', 'watch', 'bag'],
    brands: ['Casio', 'Fossil', 'Mango', 'Nike'],
    features: ['Лаконічний дизайн', 'Стійкі матеріали', 'Продумані деталі'],
    specs: { 'Стиль': 'Повсякденний', 'Колекція': 'Essential', 'Гарантія': '12 місяців' },
  },
  home: {
    names: ['Крісло Lounge', 'Настільна лампа Light', 'Крісло Nordic', 'Лампа Cozy'],
    kinds: ['chair', 'lamp', 'chair', 'lamp'],
    brands: ['IKEA', 'Philips', 'Bosch'],
    features: ['Для домашнього простору', 'Мінімалістичний дизайн', 'Простий догляд'],
    specs: { 'Призначення': 'Для приміщення', 'Стиль': 'Скандинавський', 'Догляд': 'Протирати м’якою тканиною' },
  },
  sports: {
    names: ['М’яч Match', 'Гантель Fit', 'М’яч Training', 'Гантель Active'],
    kinds: ['ball', 'dumbbell', 'ball', 'dumbbell'],
    brands: ['Adidas', 'Reebok', 'Nike', 'Puma'],
    features: ['Для активних тренувань', 'Міцна конструкція', 'Зручне використання'],
    specs: { 'Призначення': 'Тренування', 'Рівень': 'Початковий / середній', 'Гарантія': '6 місяців' },
  },
};
const series = ['01', '02', '03', '04', '05'];
const colors = [
  { value: 'graphite', label: 'Графітовий', hex: '#454b48' },
  { value: 'cream', label: 'Кремовий', hex: '#e2d6bd' },
  { value: 'green', label: 'Зелений', hex: '#719080' },
];

export const products = Array.from({ length: 120 }, (_, index) => {
  const category = categories[index % categories.length];
  const localIndex = Math.floor(index / categories.length);
  const source = catalog[category.id];
  const modelIndex = localIndex % 4;
  const kind = source.kinds[modelIndex];
  const brand = source.brands[localIndex % source.brands.length];
  const name = `${brand} ${source.names[modelIndex]} ${series[Math.floor(localIndex / 4)]}`;
  const price = index < 6 ? [8990, 2199, 3299, 1599, 2690, 799][index] : 500 + (index * 379 % 49501);
  const sale = index % 4 === 0;
  const oldPrice = sale ? Math.min(50000, Math.round(price / .7)) : null;
  const discount = oldPrice ? Math.round((1 - price / oldPrice) * 100) : 0;
  const variants = [{ type: 'color', name: 'Колір', options: colors }];
  if (category.id === 'clothing' || category.id === 'shoes') {
    const sizes = category.id === 'shoes' ? ['38', '39', '40', '41', '42', '43', '44'] : ['XS', 'S', 'M', 'L', 'XL'];
    variants.push({ type: 'size', name: 'Розмір', options: sizes.map(value => ({ value, label: value })) });
  }
  if (kind === 'phone' || kind === 'tablet') {
    variants.push({ type: 'storage', name: 'Пам’ять', options: [
      { value: '128', label: '128 GB', priceModifier: 0 },
      { value: '256', label: '256 GB', priceModifier: 2000 },
    ] });
  }
  const inStock = index % 7 !== 6;
  return {
    id: index + 1,
    name,
    slug: `product-${index + 1}-${category.id}`,
    description: `${name} — продуманий вибір для щоденного життя. ${source.features.join('. ')}. Поєднання комфорту, функціональності та сучасного дизайну. Усі характеристики та ціни в цьому навчальному каталозі є демонстраційними.`,
    shortDescription: `${source.features.join('. ')}. Зручний вибір для вашого щоденного ритму.`,
    category: category.id,
    categoryName: category.name,
    subcategory: kind,
    brand,
    sku: `FRM-${category.id.toUpperCase().slice(0, 3)}-${String(index + 1).padStart(4, '0')}`,
    price,
    oldPrice,
    discount,
    images: Array.from({ length: 4 }, (_, imageIndex) => `/images/${kind}-${(localIndex + imageIndex) % 4 + 1}.svg`),
    rating: index < 6 ? [4.8, 4.6, 4.9, 4.2, 4.7, 4.5][index] : Number((3 + index % 21 / 10).toFixed(1)),
    reviewsCount: 12 + index * 11 % 300,
    inStock,
    stockQuantity: inStock ? 5 + index % 16 : 0,
    badges: [...(index % 3 === 0 ? ['NEW'] : []), ...(sale ? ['SALE'] : []), ...(index % 5 === 0 ? ['TOP'] : [])],
    variants,
    specifications: { ...source.specs, 'Бренд': brand, 'Артикул': `FRM-${String(index + 1).padStart(4, '0')}` },
    features: source.features,
    popularity: 1000 - index * 3,
    createdAt: new Date(Date.UTC(2026, 0, 1 + index)).toISOString(),
  };
});

export const productById = new Map(products.map(product => [product.id, product]));
export const productBySlug = new Map(products.map(product => [product.slug, product]));
