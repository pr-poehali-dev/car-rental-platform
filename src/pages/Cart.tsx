
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/Header';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

const Cart: React.FC = () => {
  const { items, removeFromCart, updateCartItem, clearCart, totalPrice } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [loading, setLoading] = useState<boolean>(false);
  
  const handleUpdateDays = (carId: string, days: number) => {
    const item = items.find(item => item.car.id === carId);
    if (item) {
      updateCartItem(carId, days, item.startDate);
    }
  };
  
  const handleDateChange = (carId: string, date: string) => {
    const item = items.find(item => item.car.id === carId);
    if (item) {
      updateCartItem(carId, item.days, date);
    }
  };
  
  const handleCheckout = () => {
    setLoading(true);
    
    // Имитация процесса бронирования
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Бронирование успешно!",
        description: "Ваш заказ был успешно оформлен. Детали отправлены на вашу почту.",
      });
      clearCart();
      navigate('/booking-success');
    }, 1500);
  };
  
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-6">Корзина</h1>
          <div className="bg-white rounded-lg border p-12 text-center">
            <Icon name="ShoppingCartX" className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Ваша корзина пуста</h2>
            <p className="text-gray-600 mb-6">Добавьте автомобили в корзину, чтобы оформить бронирование</p>
            <Button asChild>
              <Link to="/catalog">Перейти в каталог</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Корзина</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Список автомобилей в корзине */}
          <div className="lg:w-2/3">
            <div className="space-y-4">
              {items.map((item) => (
                <Card key={item.car.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="w-full md:w-1/3 h-48">
                        <img 
                          src={item.car.imageUrl} 
                          alt={`${item.car.brand} ${item.car.model}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-6 w-full md:w-2/3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-bold">
                              {item.car.brand} {item.car.model}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline">{item.car.fuelType}</Badge>
                              <Badge variant="outline">{item.car.transmission}</Badge>
                            </div>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.car.id)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <Icon name="Trash2" className="w-5 h-5" />
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                          <div>
                            <label className="block text-sm font-medium mb-1">Дата начала аренды</label>
                            <Input 
                              type="date" 
                              value={item.startDate}
                              min={formatDate(new Date())}
                              onChange={(e) => handleDateChange(item.car.id, e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Количество дней</label>
                            <div className="flex">
                              <Button 
                                variant="outline" 
                                size="icon"
                                disabled={item.days <= 1}
                                onClick={() => handleUpdateDays(item.car.id, item.days - 1)}
                                className="rounded-r-none"
                              >
                                <Icon name="Minus" className="w-4 h-4" />
                              </Button>
                              <Input 
                                type="number" 
                                value={item.days}
                                onChange={(e) => handleUpdateDays(item.car.id, parseInt(e.target.value))}
                                min={1}
                                max={30}
                                className="rounded-none text-center w-16 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              />
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => handleUpdateDays(item.car.id, item.days + 1)}
                                className="rounded-l-none"
                              >
                                <Icon name="Plus" className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center mt-6">
                          <div className="text-sm text-gray-600">
                            {item.car.pricePerDay} ₽ × {item.days} дн.
                          </div>
                          <div className="text-xl font-bold text-primary">
                            {item.totalPrice} ₽
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="flex justify-between mt-4">
              <Button variant="outline" asChild>
                <Link to="/catalog">
                  <Icon name="ArrowLeft" className="w-4 h-4 mr-2" />
                  Продолжить выбор
                </Link>
              </Button>
              <Button 
                variant="outline" 
                className="text-red-500 hover:text-red-700"
                onClick={clearCart}
              >
                <Icon name="Trash2" className="w-4 h-4 mr-2" />
                Очистить корзину
              </Button>
            </div>
          </div>
          
          {/* Блок оформления заказа */}
          <div className="lg:w-1/3">
            <Card>
              <CardHeader>
                <CardTitle>Оформление заказа</CardTitle>
                <CardDescription>Завершите бронирование автомобилей</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Способ оплаты</h4>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex-1 cursor-pointer">
                        <div className="flex items-center">
                          <Icon name="CreditCard" className="w-5 h-5 mr-2" />
                          Банковская карта
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-gray-50 mt-2">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash" className="flex-1 cursor-pointer">
                        <div className="flex items-center">
                          <Icon name="Wallet" className="w-5 h-5 mr-2" />
                          Наличными при получении
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Количество автомобилей:</span>
                    <span className="font-medium">{items.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Общее количество дней:</span>
                    <span className="font-medium">{items.reduce((sum, item) => sum + item.days, 0)}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between pt-2">
                    <span className="text-lg font-semibold">Итого:</span>
                    <span className="text-xl font-bold text-primary">{totalPrice} ₽</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={handleCheckout}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                      Обработка...
                    </>
                  ) : (
                    'Забронировать'
                  )}
                </Button>
              </CardFooter>
            </Card>
            
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <Icon name="Info" className="w-5 h-5 text-blue-500 mt-0.5 mr-2" />
                <div>
                  <h4 className="font-medium text-blue-700">Важная информация</h4>
                  <ul className="text-sm text-blue-800 mt-1 space-y-1">
                    <li>• Возврат залога производится в течение 3-х дней</li>
                    <li>• Бронирование можно отменить за 24 часа до начала аренды</li>
                    <li>• При получении автомобиля необходимо предъявить документы</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="py-6 mt-12 text-center bg-white border-t">
        <p className="text-sm text-gray-500">© 2025 АвтоПрокат. Все права защищены.</p>
      </footer>
    </div>
  );
};

export default Cart;
