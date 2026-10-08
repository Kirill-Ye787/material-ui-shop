import { useShop } from '../context/ShopContext.jsx';
export function useCart() {
  const { cartItems, totalItems, totalPrice, addToCart, removeFromCart, updateQuantity, clearCart, getTotalPrice, getTotalItems } = useShop();
  return { cartItems, totalItems, totalPrice, addToCart, removeFromCart, updateQuantity, clearCart, getTotalPrice, getTotalItems };
}
