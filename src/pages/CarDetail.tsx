
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { cars } from '@/data/cars';
import { Car } from '@/types/car';
import Header from '@/components/Header';
import CarGallery from '@/components/CarGallery';
import ReviewSection from '@/components/ReviewSection';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useToast } from '@/components/ui/use-toast';

const CarDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<number>(1);
  const { toast } = useToast();

  useEffect(() => {
    // Имитация загрузки данных с сервера
    setLoading(true);
    setTimeout(() => {
      const foundCar = cars.find(c => c.id === id) || null;
      setCar(foundCar);
      setLoading(false);
    }, 500);
  }, [id]);

  const handleAddToCart = () => {
    if (car) {
      toast({
        title: "Добавлено в корзину",
        description: `${car.brand} ${car.model} на ${selectedPeriod} дн.`,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin h-12 w-12 rounded-full border-b-2 border-primary"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <Icon name="AlertCircle" className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-3xl font-bold mb-2">Автомобиль не найден</h2>
            <p className="text-gray-600 mb-6">Запрашиваемый автомобиль не существует или был удален.</p>
            <Button asChild>
              <Link to="/catalog">Вернуться в каталог</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const calculateTotal = () => {
    return car.pricePerDay * selectedPeriod;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center mb-6 text-sm">
          <Link to="/" className="text-gray-500 hover:text-primary">Главная</Link>
          <Icon name="ChevronRight" className="w-4 h-4 mx-2 text-gray-500" />
          <Link to="/catalog" className="text-gray-500 hover:text-primary">Каталог</Link>
          <Icon name="ChevronRight" className="w-4 h-4 mx-2 text-gray-500" />
          <span className="text-gray-900 font-medium">{car.brand} {car.model}</span>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Галерея автомобиля */}
          <div className="lg:col-span-2">
            <CarGallery car={car} />
          </div>
          
          {/* Информация о бронировании */}
          <div>
            <div className="bg-white border rounded-lg p-6 sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">{car.brand} {car.model}</h1>
                <Badge variant={car.available ? "default" : "destructive"}>
                  {car.available ? "Доступен" : "Недоступен"}
                </Badge>
              </div>
              
              <div className="flex items-center mb-6">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Icon 
                      key={star} 
                      name="Star" 
                      className={`w-5 h-5 ${star <= car.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill={star <= car.rating ? 'currentColor' : 'none'} 
                    />
                  ))}
                </div>
                <span className="ml-2 text-gray-600">{car.rating} из 5</span>
              </div>
              
              <div className="border-t border-b py-4 my-4">
                <div className="text-3xl font-bold text-primary mb-1">
                  {car.pricePerDay} ₽ <span className="text-sm text-gray-500 font-normal">/ день</span>
                </div>
                <p className="text-gray-600 text-sm">Без залога и скрытых платежей</p>
              </div>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Выберите срок аренды:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 3, 7].map((days) => (
                      <Button
                        key={days}
                        variant={selectedPeriod === days ? "default" : "outline"}
                        onClick={() => setSelectedPeriod(days)}
                        className="h-14"
                      >
                        {days} {days === 1 ? 'день' : days < 5 ? 'дня' : 'дней'}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between items-center py-2 border-t">
                  <span className="font-medium">Итого:</span>
                  <span className="text-xl font-bold">{calculateTotal()} ₽</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button onClick={handleAddToCart} className="w-full" disabled={!car.available}>
                  <Icon name="ShoppingCart" className="w-4 h-4 mr-2" />
                  В корзину
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/catalog">
                    <Icon name="ArrowLeft" className="w-4 h-4 mr-2" />
                    Вернуться в каталог
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="details">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="details">Характеристики</TabsTrigger>
                <TabsTrigger value="description">Описание</TabsTrigger>
                <TabsTrigger value="reviews">Отзывы</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="mt-6">
                <div className="bg-white border rounded-lg p-6">
                  <h2 className="text-xl font-bold mb-4">Технические характеристики</h2>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center py-2 border-b">
                      <Icon name="Calendar" className="w-5 h-5 mr-3 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Год выпуска</p>
                        <p className="font-medium">{car.year}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center py-2 border-b">
                      <Icon name="Fuel" className="w-5 h-5 mr-3 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Тип топлива</p>
                        <p className="font-medium">{car.fuelType}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center py-2 border-b">
                      <Icon name="GitFork" className="w-5 h-5 mr-3 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Трансмиссия</p>
                        <p className="font-medium">{car.transmission}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center py-2 border-b">
                      <Icon name="Users" className="w-5 h-5 mr-3 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Количество мест</p>
                        <p className="font-medium">{car.seats}</p>
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold mt-6 mb-3">Особенности</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {car.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <Icon name="Check" className="w-4 h-4 mr-2 text-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="description" className="mt-6">
                <div className="bg-white border rounded-lg p-6">
                  <h2 className="text-xl font-bold mb-4">Описание</h2>
                  <p className="text-gray-700 whitespace-pre-line">{car.description}</p>
                  
                  <Accordion type="single" collapsible className="mt-6">
                    <AccordionItem value="conditions">
                      <AccordionTrigger>Условия аренды</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                          <li>Минимальный возраст водителя: 21 год</li>
                          <li>Водительский стаж: не менее 2 лет</li>
                          <li>Необходимые документы: паспорт, водительское удостоверение</li>
                          <li>Лимит пробега: без ограничений</li>
                          <li>Страховка: полная (КАСКО + ОСАГО)</li>
                          <li>Территория использования: Россия</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="rules">
                      <AccordionTrigger>Правила использования</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc list-inside space-y-2 text-gray-700">
                          <li>Запрещено курение в салоне</li>
                          <li>Запрещено употребление пищи в салоне</li>
                          <li>Запрещено перевозить животных без специального контейнера</li>
                          <li>Автомобиль должен быть возвращен в чистом виде</li>
                          <li>Запрещен выезд за пределы РФ без согласования</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-6">
                <div className="bg-white border rounded-lg p-6">
                  <ReviewSection carId={car.id} />
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="lg:block">
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Почему выбирают нас</h3>
              
              <div className="space-y-4">
                <div className="flex">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon name="Shield" className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium">Полная страховка</h4>
                    <p className="text-sm text-gray-600">Все автомобили застрахованы по КАСКО и ОСАГО</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon name="Clock" className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium">Быстрая выдача</h4>
                    <p className="text-sm text-gray-600">Оформление занимает не более 20 минут</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon name="HeartHandshake" className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium">Без залога</h4>
                    <p className="text-sm text-gray-600">Мы не требуем залог при аренде автомобиля</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t">
                <h4 className="font-medium mb-2">Остались вопросы?</h4>
                <Button variant="outline" className="w-full flex items-center justify-center">
                  <Icon name="Phone" className="w-4 h-4 mr-2" />
                  Связаться с нами
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="py-6 bg-gray-800 text-white mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-300">© 2025 АвтоПрокат. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

export default CarDetail;