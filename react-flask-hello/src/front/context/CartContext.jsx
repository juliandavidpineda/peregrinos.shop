import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

// ✅ FUNCIÓN PARA NORMALIZAR IMÁGENES - MISMAS REGLAS EN TODOS LADOS
const normalizeImageUrl = (imagePath) => {
  if (!imagePath) {
    return 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop';
  }
  
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // ✅ USAR LA MISMA URL BASE QUE EN ProductDetailPage
  const API_BASE_URL = 'http://localhost:3001';
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${API_BASE_URL}/api${cleanPath}`;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem('peregrinos_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('peregrinos_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, size, quantity = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => 
        item.productId === product.id && item.size === size
      );
      
      if (existingItem) {
        return prev.map(item =>
          item.productId === product.id && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      // ✅ SOLUCIÓN: Normalizar la URL de la imagen ANTES de guardar
      const normalizedImage = normalizeImageUrl(product.images?.[0]);
      
      return [...prev, {
        id: Date.now(),
        productId: product.id,
        name: product.name,
        price: product.price,
        image: normalizedImage, // ✅ URL ya normalizada
        size,
        quantity
      }];
    });
    
    setIsCartOpen(true);
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
      return;
    }
    
    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Calcular totales
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      isCartOpen,
      setIsCartOpen,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      getCartTotal,
      getCartItemsCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};