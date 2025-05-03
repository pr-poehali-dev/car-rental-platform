
import React from 'react';
import Icon from '@/components/ui/icon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  // Данные для дашборда (в реальном приложении здесь будут запросы к API)
  const stats = [
    { 
      title: 'Автомобили', 
      value: '24', 
      change: '+2', 
      icon: 'Car', 
      color: 'bg-blue-100 text-blue-700',
      link: '/admin/cars'
    },
    { 
      title: 'Активные бронирования', 
      value: '18', 
      change: '+5', 
      icon: 'CalendarCheck', 
      color: 'bg-green-100 text-green-700',
      link: '/admin/bookings'
    },
    { 
      title: 'Пользователи', 
      value: '156', 
      change: '+12', 
      icon: 'Users', 
      color: 'bg-purple-100 text-purple-700',
      link: '/admin/users'
    },
    { 
      title: 'Доход за месяц', 
      value: '324 500 ₽', 
      change: '+15%', 
      icon: 'BarChart', 
      color: 'bg-amber-100 text-amber-700',
      link: '/admin/reports'
    }
  ];
  
  const recentBookings = [
    { id: 'B-2505', customer: 'Иванов Александр', car: 'BMW X5', status: 'active', date: '04.05.2025' },
    { id: 'B-2504', customer: 'Петрова Елена', car: 'Toyota Camry', status: 'pending', date: '04.05.2025' },
    { id: 'B-2503', customer: 'Сидоров Дмитрий', car: 'Mercedes E-Class', status: 'completed', date: '03.05.2025' },
    { id: 'B-2502', customer: 'Козлова Мария', car: 'Audi A6', status: 'canceled', date: '02.05.2025' },
    { id: 'B-2501', customer: 'Новиков Игорь', car: 'KIA Sportage', status: 'completed', date: '01.05.2025' },
  ];
  
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
              {recentBookings.map((booking, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center">
                    <div className="mr-4">
                      <span className="text-sm font-medium">#{booking.id}</span>
                      <p className="text-xs text-gray-500">{booking.date}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium">{booking.customer}</span>
                      <p className="text-xs text-gray-500">{booking.car}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(booking.status)}`}>
                    {getStatusLabel(booking.status)}
                  </span>
                </div>
              ))}
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
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center mr-3">
                    <Icon name="Car" className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-sm font-medium">BMW X5</span>
                    <p className="text-xs text-gray-500">Занят на 85%</p>
                  </div>
                </div>
                <div className="w-20 h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[85%]" />
                </div>
              </div>
              
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center mr-3">
                    <Icon name="Car" className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-sm font-medium">Mercedes E-Class</span>
                    <p className="text-xs text-gray-500">Занят на 72%</p>
                  </div>
                </div>
                <div className="w-20 h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[72%]" />
                </div>
              </div>
              
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center mr-3">
                    <Icon name="Car" className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-sm font-medium">Toyota Camry</span>
                    <p className="text-xs text-gray-500">Занят на 68%</p>
                  </div>
                </div>
                <div className="w-20 h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[68%]" />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center mr-3">
                    <Icon name="Car" className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-sm font-medium">Audi A6</span>
                    <p className="text-xs text-gray-500">Занят на 63%</p>
                  </div>
                </div>
                <div className="w-20 h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[63%]" />
                </div>
              </div>
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
