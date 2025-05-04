
import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { dashboardApi } from '@/lib/api';
import { Booking, Car, CarStats, BookingStats, RevenueStats } from '@/types/admin';
import { Skeleton } from '@/components/ui/skeleton';

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Состояния для данных
  const [carStats, setCarStats] = useState<CarStats | null>(null);
  const [bookingStats, setBookingStats] = useState<BookingStats | null>(null);
  const [userStats, setUserStats] = useState<{ total: number; change: number } | null>(null);
  const [revenueStats, setRevenueStats] = useState<RevenueStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [popularCars, setPopularCars] = useState<{ car: Car; occupancyRate: number }[]>([]);
  
  // Загрузка данных при монтировании компонента
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Параллельная загрузка данных
        const [stats, bookings, cars] = await Promise.all([
          dashboardApi.getStats(),
          dashboardApi.getRecentBookings(),
          dashboardApi.getPopularCars()
        ]);
        
        // Обновление состояний
        setCarStats(stats.cars);
        setBookingStats(stats.bookings);
        setUserStats(stats.users);
        setRevenueStats(stats.revenue);
        setRecentBookings(bookings);
        setPopularCars(cars);
        
        setError(null);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Не удалось загрузить данные. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  // Вспомогательные функции для отображения
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-gray-100 text-gray-700';
      case 'canceled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Активно';
      case 'pending': return 'Ожидание';
      case 'completed': return 'Завершено';
      case 'canceled': return 'Отменено';
      default: return status;
    }
  };
  
  // Заглушка для данных во время загрузки
  const renderSkeleton = () => (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded"></div>
      <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="h-40 bg-gray-200 rounded"></div>
        ))}
      </div>
      <div className="grid gap-6 mb-8 md:grid-cols-2">
        <div className="h-80 bg-gray-200 rounded"></div>
        <div className="h-80 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
  
  // Если загрузка - показываем скелет
  if (loading) {
    return renderSkeleton();
  }
  
  // Если ошибка - показываем сообщение
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <Icon name="AlertCircle" className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-xl font-medium mb-2">Ошибка загрузки данных</h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>
          Попробовать снова
        </Button>
      </div>
    );
  }
  
  // Строим статистические карточки из данных API
  const stats = [
    { 
      title: 'Автомобили', 
      value: carStats?.total.toString() || '0', 
      change: `+${carStats?.change || 0}`, 
      icon: 'Car', 
      color: 'bg-blue-100 text-blue-700',
      link: '/admin/cars'
    },
    { 
      title: 'Активные бронирования', 
      value: bookingStats?.active.toString() || '0', 
      change: `+${bookingStats?.change || 0}`, 
      icon: 'CalendarCheck', 
      color: 'bg-green-100 text-green-700',
      link: '/admin/bookings'
    },
    { 
      title: 'Пользователи', 
      value: userStats?.total.toString() || '0', 
      change: `+${userStats?.change || 0}`, 
      icon: 'Users', 
      color: 'bg-purple-100 text-purple-700',
      link: '/admin/users'
    },
    { 
      title: 'Доход за месяц', 
      value: `${revenueStats?.current.toLocaleString() || 0} ${revenueStats?.currency || '₽'}`, 
      change: `+${revenueStats?.change || 0}%`, 
      icon: 'BarChart', 
      color: 'bg-amber-100 text-amber-700',
      link: '/admin/reports'
    }
  ];
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Панель управления</h1>
        <p className="text-gray-500">Сегодня: {new Date().toLocaleDateString('ru-RU')}</p>
      </div>
      
      {/* Статистика */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-full ${stat.color}`}>
                <Icon name={stat.icon} className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <span className="text-green-600 flex items-center">
                  <Icon name="TrendingUp" className="h-3 w-3 mr-1" />
                  {stat.change}
                </span>
                <span className="ml-1">с прошлого месяца</span>
              </p>
              <Button variant="ghost" size="sm" asChild className="mt-2 p-0">
                <Link to={stat.link}>Подробнее</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid gap-6 mb-8 md:grid-cols-2">
        {/* Последние бронирования */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Последние бронирования</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin/bookings">Все бронирования</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBookings.length > 0 ? (
                recentBookings.map((booking, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center">
                      <div className="mr-4">
                        <span className="text-sm font-medium">#{typeof booking.id === 'string' ? booking.id : 'Н/Д'}</span>
                        <p className="text-xs text-gray-500">
                          {new Date(booking.createdAt).toLocaleDateString('ru-RU')}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium">
                          {typeof booking.customer === 'object' 
                            ? booking.customer.name 
                            : 'Клиент'}
                        </span>
                        <p className="text-xs text-gray-500">
                          {typeof booking.car === 'object' 
                            ? `${booking.car.brand} ${booking.car.model}` 
                            : 'Автомобиль'}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(booking.status)}`}>
                      {getStatusLabel(booking.status)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  Нет недавних бронирований
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Популярные автомобили */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Популярные автомобили</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin/cars">Все автомобили</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularCars.length > 0 ? (
                popularCars.map((item, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center mr-3">
                        {item.car.imageUrl ? (
                          <img 
                            src={item.car.imageUrl} 
                            alt={`${item.car.brand} ${item.car.model}`}
                            className="w-full h-full object-cover rounded-md"
                          />
                        ) : (
                          <Icon name="Car" className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <span className="text-sm font-medium">
                          {item.car.brand} {item.car.model}
                        </span>
                        <p className="text-xs text-gray-500">
                          Занят на {Math.round(item.occupancyRate * 100)}%
                        </p>
                      </div>
                    </div>
                    <div className="w-20 h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500" 
                        style={{ width: `${Math.round(item.occupancyRate * 100)}%` }} 
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  Нет данных о популярных автомобилях
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Краткая сводка */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Быстрые действия</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button asChild>
              <Link to="/admin/cars/new">
                <Icon name="PlusCircle" className="h-4 w-4 mr-2" />
                Добавить автомобиль
              </Link>
            </Button>
            <Button asChild>
              <Link to="/admin/bookings/new">
                <Icon name="Calendar" className="h-4 w-4 mr-2" />
                Новое бронирование
              </Link>
            </Button>
            <Button asChild>
              <Link to="/admin/reports">
                <Icon name="FileText" className="h-4 w-4 mr-2" />
                Отчеты
              </Link>
            </Button>
            <Button asChild>
              <Link to="/admin/settings">
                <Icon name="Settings" className="h-4 w-4 mr-2" />
                Настройки
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
