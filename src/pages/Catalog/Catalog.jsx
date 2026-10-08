import { useState } from 'react';
import { Drawer, IconButton, Box } from '@mui/material';
import TuneOutlined from '@mui/icons-material/TuneOutlined';
import GridViewOutlined from '@mui/icons-material/GridViewOutlined';
import FormatListBulleted from '@mui/icons-material/FormatListBulleted';
import CloseOutlined from '@mui/icons-material/CloseOutlined';
import ArrowBack from '@mui/icons-material/ArrowBack';
import ArrowForward from '@mui/icons-material/ArrowForward';
import { useFilters } from '../../hooks/useFilters.js';
import { categories } from '../../data/mockCategories.js';
import FilterSidebar from '../../components/Sidebar/FilterSidebar.jsx';
import ProductGrid from '../../components/ProductGrid/ProductGrid.jsx';
import Breadcrumbs from '../../components/common/Breadcrumbs.jsx';

export default function Catalog() {
  const state = useFilters();
  const { filters, activeCount, setFilter, resetFilters, sortBy, view, filteredProducts, visibleProducts, page, pageCount } = state;
  const [drawer, setDrawer] = useState(false);
  const singleCategory = filters.categories.length === 1 ? categories.find(category => category.id === filters.categories[0]) : null;
  const crumbs = singleCategory ? [{ label: 'Каталог', to: '/catalog' }, { label: singleCategory.name }] : [{ label: 'Каталог' }];
  return <div className="mx-auto max-w-[1480px] px-4 pb-16 pt-7 sm:px-8 xl:px-10">
    <Breadcrumbs items={crumbs} />
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div><div className="mb-2 text-[10px] font-bold uppercase tracking-[.2em] text-muted">Знайдіть своє</div><h1 className="m-0 text-3xl font-bold tracking-tight text-copy sm:text-4xl">{singleCategory?.name || 'Каталог товарів'}</h1><p className="mb-0 mt-3 text-sm text-muted">Корисні речі. Продуманий вибір. Щодня.</p></div>
      <div className="flex items-center gap-2 rounded-full border border-solid border-line bg-surface px-4 py-2 text-xs text-muted"><span className="h-2 w-2 rounded-full bg-primary-500" />120 товарів у колекції</div>
    </div>
    <div className="mb-7 flex flex-wrap gap-2" aria-label="Швидкі категорії">
      <button onClick={() => setFilter('categories', [])} className={`rounded-full border border-solid px-4 py-2 text-xs font-semibold transition-colors ${!filters.categories.length ? 'border-primary-700 bg-primary-700 text-white' : 'border-line bg-surface text-copy hover:border-primary-500'}`}>Усі товари</button>
      {categories.map(category => <button key={category.id} onClick={() => setFilter('categories', filters.categories.length === 1 && filters.categories[0] === category.id ? [] : [category.id])} aria-pressed={filters.categories.includes(category.id)} className={`rounded-full border border-solid px-4 py-2 text-xs font-semibold transition-colors ${filters.categories.includes(category.id) ? 'border-primary-700 bg-primary-700 text-white' : 'border-line bg-surface text-copy hover:border-primary-500'}`}>{category.name}</button>)}
    </div>
    <div className="flex items-start gap-7">
      <aside className="hidden w-[256px] shrink-0 md:block" aria-label="Фільтри каталогу"><FilterSidebar {...state} /></aside>
      <section className="min-w-0 flex-1" aria-label="Товари">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-solid border-line pb-5">
          <div className="flex items-center gap-3"><button onClick={() => setDrawer(true)} className="flex min-h-11 items-center gap-2 rounded-xl border border-solid border-line bg-surface px-3 text-sm text-copy md:hidden"><TuneOutlined fontSize="small" />Фільтри {activeCount ? `(${activeCount})` : ''}</button><p aria-live="polite" className="m-0 text-sm text-muted">Знайдено <strong className="text-copy">{filteredProducts.length}</strong> товарів</p></div>
          <div className="flex flex-wrap items-center gap-3">
            <select aria-label="Сортування товарів" value={sortBy} onChange={event => setFilter('sort', event.target.value)} className="min-h-11 max-w-full rounded-xl border border-solid border-line bg-surface px-3 text-xs text-copy">
              <option value="popular">За популярністю</option><option value="priceAsc">Ціна: від низької до високої</option><option value="priceDesc">Ціна: від високої до низької</option><option value="rating">За рейтингом</option><option value="newest">Новинки</option>
            </select>
            <div className="flex rounded-xl border border-solid border-line bg-surface p-1">
              {[[GridViewOutlined, 'grid', 'Сітка'], [FormatListBulleted, 'list', 'Список']].map(([Icon, value, label]) => <button key={value} onClick={() => setFilter('view', value)} aria-label={label} aria-pressed={view === value} className={`grid h-9 w-10 place-items-center rounded-lg border-0 transition-colors ${view === value ? 'bg-primary-700 text-white' : 'bg-transparent text-muted hover:bg-canvas'}`}><Icon fontSize="small" /></button>)}
            </div>
          </div>
        </div>
        {filters.query && <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-muted">Пошук: <strong className="text-copy">{filters.query}</strong><button className="rounded-lg border border-solid border-line bg-surface px-3 py-2 text-xs text-copy" onClick={() => setFilter('query', '')}>Очистити пошук</button></div>}
        {visibleProducts.length ? <ProductGrid products={visibleProducts} view={view} /> : <div className="rounded-2xl border border-solid border-line bg-surface p-10 text-center"><h2 className="text-xl font-semibold text-copy">Товарів не знайдено</h2><p className="text-sm text-muted">Спробуйте інший запит або змініть фільтри.</p><button onClick={resetFilters} className="mt-2 rounded-xl border-0 bg-primary-700 px-5 py-3 text-sm font-semibold text-white hover:bg-primary-900">Скинути фільтри</button></div>}
        {visibleProducts.length > 0 && <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <p className="m-0 text-xs text-muted">Показано {(page - 1) * 12 + 1}–{Math.min(page * 12, filteredProducts.length)} з {filteredProducts.length}</p>
          <nav aria-label="Пагінація" className="flex items-center gap-1">
            <button disabled={page === 1} onClick={() => setFilter('page', page - 1)} aria-label="Попередня сторінка" className="grid h-10 w-10 place-items-center rounded-lg border border-solid border-line bg-surface text-copy disabled:opacity-30"><ArrowBack fontSize="small" /></button>
            {Array.from({ length: pageCount }, (_, index) => index + 1).filter(value => value === 1 || value === pageCount || Math.abs(value - page) <= 1).map((value, index, items) => <span key={value} className={Math.abs(value - page) > 1 ? 'hidden items-center sm:flex' : 'flex items-center'}>{index > 0 && value - items[index - 1] > 1 && <span className="hidden px-1 text-muted sm:inline">…</span>}<button onClick={() => setFilter('page', value)} aria-label={`Сторінка ${value}`} aria-current={page === value ? 'page' : undefined} className={`h-10 min-w-10 rounded-lg border border-solid text-sm transition-colors ${page === value ? 'border-primary-700 bg-primary-700 text-white' : 'border-line bg-surface text-copy hover:border-primary-500'}`}>{value}</button></span>)}
            <button disabled={page === pageCount} onClick={() => setFilter('page', page + 1)} aria-label="Наступна сторінка" className="grid h-10 w-10 place-items-center rounded-lg border border-solid border-line bg-surface text-copy disabled:opacity-30"><ArrowForward fontSize="small" /></button>
          </nav>
        </div>}
      </section>
    </div>
    <Drawer open={drawer} onClose={() => setDrawer(false)} anchor="left" slotProps={{ paper: { sx: { width: 310, maxWidth: '100vw' } } }}><Box sx={{ p: 2 }}><Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}><IconButton aria-label="Закрити фільтри" onClick={() => setDrawer(false)}><CloseOutlined /></IconButton></Box><FilterSidebar {...state} /><button onClick={() => setDrawer(false)} className="mt-4 w-full rounded-xl border-0 bg-primary-700 px-4 py-3 font-semibold text-white">Показати {filteredProducts.length} товарів</button></Box></Drawer>
  </div>;
}
