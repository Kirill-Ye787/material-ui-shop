import { Accordion, AccordionSummary, AccordionDetails, Autocomplete, Box, Button, Checkbox, Chip, Divider, FormControlLabel, Rating, Slider, Stack, TextField, Typography } from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import RestartAlt from '@mui/icons-material/RestartAlt';
import { categories } from '../../data/mockCategories.js';
import { brands } from '../../data/mockBrands.js';
import { products } from '../../data/mockProducts.js';
import { formatPrice } from '../../utils/priceFormatter.js';

function Section({ title, children }) {
  return <Accordion defaultExpanded><AccordionSummary expandIcon={<ExpandMore />}><Typography fontWeight={700} fontSize={14}>{title}</Typography></AccordionSummary><AccordionDetails sx={{ pt: 0, pb: 2 }}>{children}</AccordionDetails></Accordion>;
}
export default function FilterSidebar({ filters, activeCount, setFilter, resetFilters }) {
  function toggle(key, value) {
    setFilter(key, filters[key].includes(value) ? filters[key].filter(item => item !== value) : [...filters[key], value]);
  }
  return <Box sx={{ bgcolor: 'background.paper', p: 1.5, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
    <Stack direction="row" justifyContent="space-between" alignItems="center" px={2} py={1.5}>
      <Typography fontWeight={800} fontSize={18}>Фільтри</Typography><Chip size="small" color={activeCount ? 'primary' : 'default'} label={activeCount} aria-label={`Застосовано фільтрів: ${activeCount}`} />
    </Stack>
    <Divider sx={{ mb: 1 }} />
    <Section title="Категорії">
      <Stack>{categories.map(category => <FormControlLabel key={category.id}
        control={<Checkbox checked={filters.categories.includes(category.id)} onChange={() => toggle('categories', category.id)} />}
        label={<Box sx={{ display: 'flex', gap: 1, justifyContent: 'space-between', width: 172 }}><Typography fontSize={13}>{category.name}</Typography><Typography fontSize={12} color="text.secondary">{products.filter(product => product.category === category.id).length}</Typography></Box>} />)}</Stack>
    </Section>
    <Divider />
    <Section title="Ціна, ₴">
      <Stack direction="row" justifyContent="space-between" mb={1}><Typography fontSize={12}>{formatPrice(filters.priceRange[0])}</Typography><Typography fontSize={12}>{formatPrice(filters.priceRange[1])}</Typography></Stack>
      <Slider value={filters.priceRange} onChange={(_, value) => setFilter('priceRange', value)} min={0} max={50000} step={100} valueLabelDisplay="auto"
        getAriaLabel={index => index === 0 ? 'Мінімальна ціна' : 'Максимальна ціна'} getAriaValueText={formatPrice} disableSwap sx={{ width: 'calc(100% - 12px)', ml: .75 }} />
      <Stack direction="row" justifyContent="space-between"><Typography fontSize={11} color="text.secondary">0 ₴</Typography><Typography fontSize={11} color="text.secondary">50 000 ₴</Typography></Stack>
    </Section>
    <Divider />
    <Section title="Бренди">
      <Autocomplete multiple size="small" options={brands} value={filters.brands}
        onChange={(_, value) => setFilter('brands', value)} filterSelectedOptions
        renderInput={params => <TextField {...params} label="Оберіть бренди" placeholder="Пошук бренду" />}
        noOptionsText="Бренд не знайдено" />
    </Section>
    <Divider />
    <Section title="Рейтинг">
      <Stack gap={.3}>{[5, 4, 3].map(value => <FormControlLabel key={value}
        control={<Checkbox checked={filters.minRating === value} onChange={() => setFilter('minRating', filters.minRating === value ? 0 : value)} />}
        label={<Stack direction="row" alignItems="center" gap={.5}><Rating size="small" value={value} readOnly /><Typography fontSize={11}>і вище</Typography></Stack>} />)}</Stack>
    </Section>
    <Divider />
    <Section title="Доступність">
      <Stack>{[['stock', 'В наявності'], ['order', 'Під замовлення'], ['sale', 'Розпродаж']].map(([value, label]) => <FormControlLabel key={value}
        control={<Checkbox checked={filters.availability.includes(value)} onChange={() => toggle('availability', value)} />}
        label={<Typography fontSize={13}>{label}</Typography>} />)}</Stack>
    </Section>
    <Button fullWidth variant="outlined" startIcon={<RestartAlt />} onClick={resetFilters}>Скинути фільтри</Button>
  </Box>;
}
