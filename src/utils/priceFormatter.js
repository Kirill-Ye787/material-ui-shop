export const formatPrice = value => new Intl.NumberFormat('uk-UA', {
  style: 'currency', currency: 'UAH', currencyDisplay: 'narrowSymbol', maximumFractionDigits: 0,
}).format(value);
