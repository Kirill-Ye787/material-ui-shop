import { productById } from '../data/mockProducts.js';

export function resolveOptions(product, options = {}) {
  return Object.fromEntries(product.variants.map(variant => {
    const value = variant.options.find(option => option.value === options?.[variant.type]) || variant.options[0];
    return [variant.type, value.value];
  }));
}
export function getUnitPrice(product, options = {}) {
  return product.price + product.variants.reduce((sum, variant) => {
    const selected = variant.options.find(option => option.value === options[variant.type]);
    return sum + (selected?.priceModifier || 0);
  }, 0);
}
export function getQuantityLimit(product) { return product.inStock ? product.stockQuantity : 20; }
export function createLine(product, quantity = 1, selected = {}) {
  const options = resolveOptions(product, selected);
  const key = `${product.id}:${JSON.stringify(Object.entries(options).sort())}`;
  return { key, productId: product.id, options, quantity: Math.max(1, Math.min(getQuantityLimit(product), Math.floor(Number(quantity) || 1))) };
}
export function availableForLine(state, line) {
  const product = productById.get(line.productId);
  const otherQuantity = state.filter(item => item.productId === line.productId && item.key !== line.key)
    .reduce((sum, item) => sum + item.quantity, 0);
  return Math.max(0, getQuantityLimit(product) - otherQuantity);
}
export function cartReducer(state, action) {
  switch (action.type) {
    case 'add': {
      const previous = state.find(line => line.key === action.line.key);
      const limit = availableForLine(state, action.line);
      if (!limit) return state;
      const line = { ...action.line, quantity: Math.min(limit, (previous?.quantity || 0) + action.line.quantity) };
      return previous ? state.map(item => item.key === line.key ? line : item) : [...state, line];
    }
    case 'update': {
      const line = state.find(item => item.key === action.key);
      if (!line) return state;
      const quantity = Math.max(1, Math.min(availableForLine(state, line), Math.floor(Number(action.quantity) || 1)));
      return state.map(item => item.key === action.key ? { ...item, quantity } : item);
    }
    case 'remove': return state.filter(item => item.key !== action.key);
    case 'restore': return cartReducer(state, { type: 'add', line: action.line });
    case 'clear': return [];
    default: return state;
  }
}
export function sanitizeCart(raw) {
  if (!Array.isArray(raw)) return [];
  return raw.reduce((state, line) => {
    const product = productById.get(Number(line?.productId));
    return product ? cartReducer(state, { type: 'add', line: createLine(product, line.quantity, line.options) }) : state;
  }, []);
}
export function getTotals(items, promo = '') {
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const discount = promo === 'FORMA10' ? Math.round(subtotal * .1) : 0;
  const delivery = subtotal === 0 || subtotal >= 3000 ? 0 : 99;
  return { subtotal, discount, delivery, total: subtotal - discount + delivery };
}
