
import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [collapsed, setCollapsed] = useState(false);
  
  const navigationItems = [
    { path: '/admin', label: 'Дашборд', icon: 'LayoutDashboard' },
    { path: '/admin/cars', label: 'Автомобили', icon: 'Car' },
    { path: '/admin/bookings', label: 'Бронирования', icon: 'CalendarCheck' },
    { path: '/admin/users', label: 'Пользователи', icon: 'Users' },
    { path: '/admin/reports', label: 'Отчеты', icon: 'BarChart' },
    { path: '/admin/settings', label: 'Настройки', icon: 'Settings' },
  ];
  
  const handleLogout = () => {
    toast({
      title: "Выход из системы",
      description: "Вы успешно вышли из системы администратора.",
    });
    navigate('/');
  };
  
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Боковая навигация */}
      <aside 
        className={`bg-white border-r h-screen transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        } fixed left-0 top-0 z-10`}
      >
        <div className="h-16 border-b flex items-center justify-between px-4">
          <div className={`flex items-center ${collapsed ? 'justify-center w-full' : ''}`}>
            <Icon name="Car" className="h-8 w-8 text-primary" />
            {!collapsed && <span className="ml-2 font-bold text-xl">Админ</span>}
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setCollapsed(!collapsed)}
            className={collapsed ? 'hidden' : ''}
          >
            <Icon name="PanelLeftClose" className="h-5 w-5" />
          </Button>
        </div>
        
        <nav className="p-2">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-3 py-2.5 mb-1 rounded-md text-gray-700 ${
                location.pathname === item.path
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'hover:bg-gray-100'
              } ${collapsed ? 'justify-center' : ''}`}
            >
              <Icon name={item.icon} className="h-5 w-5" />
              {!collapsed && <span className="ml-3">{item.label}</span>}
            </Link>
          ))}
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <Separator className="mb-4" />
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className={`text-gray-700 hover:text-red-500 ${
              collapsed ? 'w-full justify-center' : 'w-full'
            }`}
          >
            <Icon name="LogOut" className="h-5 w-5" />
            {!collapsed && <span className="ml-2">Выйти</span>}
          </Button>
        </div>
      </aside>
      
      {/* Основное содержимое */}
      <div className={`flex-1 transition-all duration-300 ${
        collapsed ? 'ml-20' : 'ml-64'
      }`}>
        {/* Верхняя панель */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-6">
          <div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setCollapsed(!collapsed)}
              className={collapsed ? '' : 'hidden'}
            >
              <Icon name="PanelLeftOpen" className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" asChild>
              <Link to="/" target="_blank">
                <Icon name="ExternalLink" className="h-4 w-4 mr-2" />
                Перейти на сайт
              </Link>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700">
                    <Icon name="User" className="h-5 w-5" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Icon name="User" className="h-4 w-4 mr-2" />
                  <span>Профиль</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Icon name="Settings" className="h-4 w-4 mr-2" />
                  <span>Настройки</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <Icon name="LogOut" className="h-4 w-4 mr-2" />
                  <span>Выйти</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        
        {/* Содержимое страницы */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
