import { Link } from 'react-router-dom';
import { Button, Typography, Box } from '@mui/material';
import ShoppingBagOutlined from '@mui/icons-material/ShoppingBagOutlined';
export default function EmptyState({ title, description, action = 'Перейти до каталогу', to = '/catalog' }) {
  return <Box sx={{ textAlign: 'center', py: 8, px: 2, bgcolor: 'background.paper', borderRadius: 4 }}>
    <ShoppingBagOutlined sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
    <Typography variant="h5" fontWeight={700} mb={1}>{title}</Typography>
    <Typography color="text.secondary" mb={3}>{description}</Typography>
    <Button component={Link} to={to} variant="contained">{action}</Button>
  </Box>;
}
