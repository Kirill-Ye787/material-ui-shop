import { useShop } from '../context/ShopContext.jsx';
export function useWishlist() {
  const { wishlist, wishlistProducts, addToWishlist, removeFromWishlist, toggleWishlist, isInWishlist, clearWishlist } = useShop();
  return { wishlist, wishlistProducts, addToWishlist, removeFromWishlist, toggleWishlist, isInWishlist, clearWishlist };
}
