
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Icon from '@/components/ui/icon';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=2944&auto=format&fit=crop" 
            alt="Premium cars" 
            className="object-cover w-full h-full opacity-40"
          />
        </div>
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
            Аренда премиальных автомобилей
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl animate-fade-in">
            Широкий выбор автомобилей премиум-класса для вашего комфорта и удовольствия от вождения
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
            <Button asChild size="lg" className="text-lg px-8">
              <Link to="/catalog">Выбрать автомобиль</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-white/10">
              <Link to="/about">Узнать больше</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Почему выбирают нас</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg hover-scale">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                <Icon name="Car" className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Большой выбор автомобилей</h3>
              <p className="text-gray-600">
                В нашем автопарке более 100 современных автомобилей различных марок и комплектаций
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg hover-scale">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                <Icon name="ShieldCheck" className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Полная страховка</h3>
              <p className="text-gray-600">
                Все наши автомобили застрахованы по КАСКО и ОСАГО, что обеспечивает вашу безопасность
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-lg hover-scale">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                <Icon name="Clock" className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Быстрое оформление</h3>
              <p className="text-gray-600">
                Оформление аренды занимает не более 20 минут, также доступна предварительная бронь онлайн
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Popular Cars Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Популярные автомобили</h2>
            <Link to="/catalog" className="text-primary font-medium flex items-center">
              Смотреть все
              <Icon name="ChevronRight" className="w-5 h-5 ml-1" />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Car Cards will be here - they're already defined in CarCard component */}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Готовы забронировать автомобиль?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Зарегистрируйтесь сейчас и получите 10% скидку на первую аренду
          </p>
          <Button asChild size="lg" variant="secondary" className="text-primary font-bold px-8">
            <Link to="/register">Зарегистрироваться</Link>
          </Button>
        </div>
      </section>
      
      <footer className="py-6 bg-gray-800 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold mb-3">АвтоПрокат</h3>
              <p className="text-gray-300 max-w-xs">
                Аренда премиальных автомобилей для любых целей: бизнес, туризм, свадьбы и другие мероприятия
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              <div>
                <h4 className="text-lg font-semibold mb-3">Компания</h4>
                <ul className="space-y-2">
                  <li><Link to="/about" className="text-gray-300 hover:text-white">О нас</Link></li>
                  <li><Link to="/contacts" className="text-gray-300 hover:text-white">Контакты</Link></li>
                  <li><Link to="/blog" className="text-gray-300 hover:text-white">Блог</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-3">Услуги</h4>
                <ul className="space-y-2">
                  <li><Link to="/catalog" className="text-gray-300 hover:text-white">Каталог</Link></li>
                  <li><Link to="/conditions" className="text-gray-300 hover:text-white">Условия аренды</Link></li>
                  <li><Link to="/faq" className="text-gray-300 hover:text-white">FAQ</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-3">Контакты</h4>
                <ul className="space-y-2">
                  <li className="flex items-center text-gray-300">
                    <Icon name="MapPin" className="w-4 h-4 mr-2" />
                    Москва, ул. Авто, 123
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Icon name="Phone" className="w-4 h-4 mr-2" />
                    +7 (495) 123-45-67
                  </li>
                  <li className="flex items-center text-gray-300">
                    <Icon name="Mail" className="w-4 h-4 mr-2" />
                    info@autoprokat.ru
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-700 text-center text-gray-400">
            <p>© 2025 АвтоПрокат. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
