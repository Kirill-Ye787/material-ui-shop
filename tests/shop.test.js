import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { products } from '../src/data/mockProducts.js';
import { brands } from '../src/data/mockBrands.js';
import { parseFilters, filterProducts, sortProducts } from '../src/utils/filters.js';
import { createLine, cartReducer, getUnitPrice, getTotals, sanitizeCart } from '../src/utils/cart.js';

test('dataset satisfies the required categories, brands, prices, unique identifiers and local gallery assets', () => {
  assert.equal(products.length, 120);
  assert.equal(new Set(products.map(item => item.id)).size, 120);
  assert.equal(new Set(products.map(item => item.slug)).size, 120);
  assert.equal(new Set(products.map(item => item.brand)).size, 20);
  assert.equal(brands.length, 20);
  for (const category of ['electronics', 'clothing', 'shoes', 'accessories', 'home', 'sports']) assert.equal(products.filter(item => item.category === category).length, 20);
  for (const product of products) {
    assert.ok(product.price >= 500 && product.price <= 50000);
    assert.ok(product.rating >= 3 && product.rating <= 5);
    assert.equal(new Set(product.images).size, 4);
    for (const image of product.images) assert.ok(existsSync(new URL(`../public${image}`, import.meta.url)), image);
  }
});
test('combined filters use OR within categories and AND between different filter groups', () => {
  const filters = parseFilters(new URLSearchParams('category=clothing&category=shoes&brand=Nike&min=500&max=10000&rating=4&availability=stock'));
  const result = filterProducts(products, filters);
  assert.ok(result.length > 0);
  assert.ok(result.every(item => item.category === 'shoes' && item.brand === 'Nike' && item.price <= 10000 && item.rating >= 4 && item.inStock));
});
test('filter URL validation rejects unknown values and clamps invalid ranges', () => {
  const filters = parseFilters(new URLSearchParams('category=unknown&category=home&category=home&brand=fake&min=-9&max=bad&rating=99'));
  assert.deepEqual(filters.categories, ['home']);
  assert.deepEqual(filters.brands, []);
  assert.deepEqual(filters.priceRange, [0, 50000]);
  assert.equal(filters.minRating, 0);
});
test('search is case-insensitive and sorting never mutates the source dataset', () => {
  const ids = products.map(item => item.id);
  const result = filterProducts(products, parseFilters(new URLSearchParams('q=sony')));
  assert.ok(result.length > 0 && result.every(item => item.brand === 'Sony'));
  const sorted = sortProducts(products, 'priceAsc');
  assert.ok(sorted.every((item, i) => i === 0 || sorted[i - 1].price <= item.price));
  assert.deepEqual(products.map(item => item.id), ids);
});
test('cart merges matching options but preserves different sizes as separate lines and supports undo', () => {
  const product = products.find(item => item.category === 'clothing');
  const small = createLine(product, 1, { size: 'S' });
  const large = createLine(product, 1, { size: 'L' });
  let cart = cartReducer([], { type: 'add', line: small });
  cart = cartReducer(cart, { type: 'add', line: small });
  cart = cartReducer(cart, { type: 'add', line: large });
  assert.equal(cart.length, 2);
  assert.equal(cart[0].quantity, 2);
  const removed = cart[0];
  cart = cartReducer(cart, { type: 'remove', key: removed.key });
  cart = cartReducer(cart, { type: 'restore', line: removed });
  assert.equal(cart.find(item => item.key === removed.key).quantity, 2);
});
test('stock is capped across different options and corrupt persisted cart data is repaired', () => {
  const product = products[0];
  let cart = cartReducer([], { type: 'add', line: createLine(product, 999, { color: 'cream' }) });
  cart = cartReducer(cart, { type: 'add', line: createLine(product, 999, { color: 'green' }) });
  assert.equal(cart.reduce((sum, item) => sum + item.quantity, 0), product.stockQuantity);
  assert.deepEqual(sanitizeCart(null), []);
  const restored = sanitizeCart([{ productId: -1, quantity: 3 }, { productId: 1, quantity: -5, options: { color: 'fake' } }]);
  assert.equal(restored.length, 1);
  assert.equal(restored[0].quantity, 1);
  assert.equal(restored[0].options.color, 'graphite');
});
test('storage option price, promo discount and free shipping use the intended amounts', () => {
  const product = products.find(item => item.subcategory === 'phone');
  assert.equal(getUnitPrice(product, { storage: '256' }), product.price + 2000);
  assert.deepEqual(getTotals([{ unitPrice: 1000, quantity: 2 }], 'FORMA10'), { subtotal: 2000, discount: 200, delivery: 99, total: 1899 });
  assert.deepEqual(getTotals([{ unitPrice: 1500, quantity: 2 }], 'FORMA10'), { subtotal: 3000, discount: 300, delivery: 0, total: 2700 });
  assert.equal(getTotals([]).total, 0);
});
