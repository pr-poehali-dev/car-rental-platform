
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Car } from '@/types/car';

export interface CartItem {
  car: Car;
  days: number;
  startDate: string;
  totalPrice: number;
}

interface CartContextProps {
  items: CartItem[];
  addToCart: (car: Car, days: number, startDate: string) => void;
  removeFromCart: (carId: string) => void;
  clearCart: () => void;
  updateCartItem: (carId: string, days: number, startDate: string) => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart должен использоваться внутри CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  
  // Загружаем корзину из localStorage при инициализации
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Ошибка загрузки корзины:', e);
      }
    }
  }, []);
  
  // Сохраняем корзину в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);
  
  const addToCart = (car: Car, days: number, startDate: string) => {
    // Проверяем, есть ли уже такой автомобиль в корзине
    const existingItemIndex = items.findIndex(item => item.car.id === car.id);
    
    if (existingItemIndex !== -1) {
      // Если уже есть, обновляем количество дней и дату
      const updatedItems = [...items];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        days,
        startDate,
        totalPrice: car.pricePerDay * days
      };
      setItems(updatedItems);
    } else {
      // Если нет, добавляем новый элемент
      setItems([
        ...items,
        {
          car,
          days,
          startDate,
          totalPrice: car.pricePerDay * days
        }
      ]);
    }
  };
  
  const removeFromCart = (carId: string) => {
    setItems(items.filter(item => item.car.id !== carId));
  };
  
  const clearCart = () => {
    setItems([]);
  };
  
  const updateCartItem = (carId: string, days: number, startDate: string) => {
    const updatedItems = items.map(item => {
      if (item.car.id === carId) {
        return {
          ...item,
          days,
          startDate,
          totalPrice: item.car.pricePerDay * days
        };
      }
      return item;
    });
    setItems(updatedItems);
  };
  
  const totalItems = items.length;
  
  const totalPrice = items.reduce((sum, item) => sum + item.totalPrice, 0);
  
  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        clearCart,
        updateCartItem,
        totalItems,
        totalPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
