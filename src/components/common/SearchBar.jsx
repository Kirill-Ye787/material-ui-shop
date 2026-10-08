import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Autocomplete, TextField, InputAdornment } from '@mui/material';
import SearchOutlined from '@mui/icons-material/SearchOutlined';
import { products } from '../../data/mockProducts.js';
import { brands } from '../../data/mockBrands.js';
import { categories } from '../../data/mockCategories.js';

function Highlight({ text, query }) {
  const index = text.toLocaleLowerCase('uk-UA').indexOf(query.toLocaleLowerCase('uk-UA'));
  return !query || index < 0 ? text : <>{text.slice(0, index)}<strong>{text.slice(index, index + query.length)}</strong>{text.slice(index + query.length)}</>;
}
export default function SearchBar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const lower = query.trim().toLocaleLowerCase('uk-UA');
  const options = !lower ? [] : [
    ...products.filter(product => product.name.toLocaleLowerCase('uk-UA').includes(lower)).slice(0, 5).map(product => ({ type: 'Товари', label: product.name, to: `/product/${product.slug}` })),
    ...brands.filter(brand => brand.toLocaleLowerCase().includes(lower)).slice(0, 3).map(brand => ({ type: 'Бренди', label: brand, to: `/catalog?brand=${encodeURIComponent(brand)}` })),
    ...categories.filter(category => category.name.toLocaleLowerCase('uk-UA').includes(lower)).map(category => ({ type: 'Категорії', label: category.name, to: `/catalog?category=${category.id}` })),
  ];
  return <Autocomplete freeSolo size="small" value={null} inputValue={query} options={options}
    groupBy={option => option.type} filterOptions={items => items}
    getOptionLabel={option => typeof option === 'string' ? option : option.label}
    onInputChange={(_, value, reason) => { if (reason !== 'reset') setQuery(value); }}
    onChange={(_, value) => {
      if (!value) return;
      navigate(typeof value === 'string' ? `/catalog?q=${encodeURIComponent(value.trim())}` : value.to);
      setQuery('');
    }}
    renderOption={(props, option) => { const { key, ...rest } = props; return <li key={key} {...rest}><Highlight text={option.label} query={query} /></li>; }}
    renderInput={params => <TextField {...params} placeholder="Знайти щось особливе…"
      slotProps={{ input: { ...params.InputProps, startAdornment: <InputAdornment position="start"><SearchOutlined fontSize="small" /></InputAdornment> } }}
      inputProps={{ ...params.inputProps, 'aria-label': 'Пошук товарів' }} />}
    sx={{ width: '100%', '& .MuiOutlinedInput-root': { bgcolor: 'background.default', borderRadius: 3 }, '& fieldset': { borderColor: 'divider' } }} />;
}
