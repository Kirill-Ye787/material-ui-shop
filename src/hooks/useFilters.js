import { useSearchParams } from 'react-router-dom';
import { products } from '../data/mockProducts.js';
import { parseFilters, filterProducts, sortProducts, countFilters } from '../utils/filters.js';

export function useFilters() {
  const [params, setParams] = useSearchParams();
  const filters = parseFilters(params);
  const sortBy = ['popular', 'priceAsc', 'priceDesc', 'rating', 'newest'].includes(params.get('sort')) ? params.get('sort') : 'popular';
  const view = params.get('view') === 'list' ? 'list' : 'grid';
  const filteredProducts = sortProducts(filterProducts(products, filters), sortBy);
  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / 12));
  const requestedPage = Number(params.get('page'));
  const page = Number.isInteger(requestedPage) ? Math.max(1, Math.min(pageCount, requestedPage)) : 1;
  function setFilter(key, value) {
    const next = new URLSearchParams(params);
    if (key === 'priceRange') {
      next.delete('min'); next.delete('max');
      if (value[0] > 0) next.set('min', value[0]);
      if (value[1] < 50000) next.set('max', value[1]);
    } else {
      const paramKey = { categories: 'category', brands: 'brand', minRating: 'rating', query: 'q' }[key] || key;
      next.delete(paramKey);
      if (Array.isArray(value)) value.forEach(item => next.append(paramKey, item));
      else if (value !== '' && value !== 0 && value != null) next.set(paramKey, value);
    }
    if (key !== 'page' && key !== 'view') next.delete('page');
    setParams(next, { replace: key === 'priceRange' });
  }
  function resetFilters() {
    const next = new URLSearchParams();
    if (view !== 'grid') next.set('view', view);
    setParams(next);
  }
  return { filters, sortBy, view, filteredProducts, page, pageCount,
    visibleProducts: filteredProducts.slice((page - 1) * 12, page * 12),
    activeCount: countFilters(filters), setFilter, resetFilters };
}
