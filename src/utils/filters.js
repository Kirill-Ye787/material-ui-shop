import { categories } from '../data/mockCategories.js';
import { brands } from '../data/mockBrands.js';

const allowedAvailability = ['stock', 'order', 'sale'];
const uniqueAllowed = (values, allowed) => [...new Set(values)].filter(value => allowed.includes(value));
export function parseFilters(params) {
  const rawMin = Number(params.get('min') ?? 0);
  const rawMax = Number(params.get('max') ?? 50000);
  const min = Number.isFinite(rawMin) ? Math.max(0, Math.min(50000, rawMin)) : 0;
  const max = Number.isFinite(rawMax) ? Math.max(min, Math.min(50000, rawMax)) : 50000;
  return {
    query: (params.get('q') || '').trim(),
    categories: uniqueAllowed(params.getAll('category'), categories.map(item => item.id)),
    brands: uniqueAllowed(params.getAll('brand'), brands),
    priceRange: [min, max],
    minRating: [3, 4, 5].includes(Number(params.get('rating'))) ? Number(params.get('rating')) : 0,
    availability: uniqueAllowed(params.getAll('availability'), allowedAvailability),
  };
}
export function filterProducts(products, filters) {
  const query = filters.query.toLocaleLowerCase('uk-UA');
  return products.filter(product =>
    (!query || `${product.name} ${product.brand} ${product.categoryName}`.toLocaleLowerCase('uk-UA').includes(query)) &&
    (!filters.categories.length || filters.categories.includes(product.category)) &&
    (!filters.brands.length || filters.brands.includes(product.brand)) &&
    product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1] &&
    product.rating >= filters.minRating &&
    (!filters.availability.length || filters.availability.some(status =>
      status === 'stock' ? product.inStock : status === 'order' ? !product.inStock : product.badges.includes('SALE'))),
  );
}
export function sortProducts(products, sortBy) {
  const comparators = {
    popular: (a, b) => b.popularity - a.popularity,
    priceAsc: (a, b) => a.price - b.price,
    priceDesc: (a, b) => b.price - a.price,
    rating: (a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount,
    newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  };
  return [...products].sort(comparators[sortBy] || comparators.popular);
}
export function countFilters(filters) {
  return filters.categories.length + filters.brands.length + filters.availability.length +
    Number(filters.minRating > 0) + Number(filters.priceRange[0] > 0 || filters.priceRange[1] < 50000);
}
