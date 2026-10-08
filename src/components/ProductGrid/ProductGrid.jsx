import ProductCard from '../ProductCard/ProductCard.jsx';
export default function ProductGrid({ products, view = 'grid' }) {
  return <div className={`grid gap-5 ${view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
    {products.map(product => <ProductCard key={product.id} product={product} view={view} />)}
  </div>;
}
