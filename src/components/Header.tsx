
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useCart } from '@/contexts/CartContext';

const Header: React.FC = () => {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <Link to="/" className="flex items-center">
          <Icon name="Car" className="w-8 h-8 mr-2 text-primary" />
          <span className="text-xl font-bold">АвтоПрокат</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/catalog" className="font-medium text-gray-700 hover:text-primary transition">
            Каталог
          </Link>
          <Link to="/about" className="font-medium text-gray-700 hover:text-primary transition">
            О нас
          </Link>
          <Link to="/contacts" className="font-medium text-gray-700 hover:text-primary transition">
            Контакты
          </Link>
        </nav>
        
        <div className="flex items-center space-x-3">
          <Link to="/cart">
            <Button variant="outline" size="icon" className="relative">
              <Icon name="ShoppingCart" className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary rounded-full">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>
          <Link to="/login">
            <Button className="hidden sm:flex">
              <Icon name="LogIn" className="w-4 h-4 mr-2" />
              Войти
            </Button>
          </Link>
          <Button variant="outline" size="icon" className="md:hidden">
            <Icon name="Menu" className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
