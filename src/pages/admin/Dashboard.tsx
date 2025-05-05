import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Icon from '@/components/ui/icon';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'react-router-dom';
import { dashboardApi } from '@/lib/api';
import { Booking, Car, CarStats, BookingStats, RevenueStats } from '@/types/admin';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, ArrowRight, Bell, Calendar, Check, ChevronsUpDown, Trash } from 'lucide-react';

// Цвета для графиков
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A4A4A4'];
const FORECAST_COLOR = 'rgba(138, 43, 226, 0.7)';

// Периоды для фильтрации
const timePeriods = [
  { value: 'day', label: 'Сегодня' },
  { value: 'week', label: 'Эта неделя' },
  { value: 'month', label: 'Этот месяц' },
  { value: 'quarter', label: 'Этот кваرтал' },
  { value: 'year', label: 'Этот год' },
];

// Доступные виджеты дашборда
const availableWidgets = [
  { id: 'stats', name: 'Основная статистика', icon: 'BarChart', default: true },
  { id: 'revenue', name: 'Динамира доходов', icon: 'LineChart', default: true },
  { id: 'forecasting', name: 'Прогнозирование доходов', icon: 'TrendingUp', default: false },
  { id: 'bookings', name: 'Бронирования', icon: 'Calendar', default: true },
  { id: 'booking-stats', name: 'Статистика бронирований', icon: 'PieChart', default: true },
  { id: 'popular-cars', name: 'Популярные автомобили', icon: 'Car', default: true },
  { id: 'user-activity', name: 'Активность пользователей', icon: 'Activity', default: false },
  { id: 'recent-notifications', name: 'Последние уведомления', icon: 'Bell', default: false },
  { id: 'quick-actions', name: 'Быстрые действия', icon: 'Zap', default: true },
];

// Интерфейсы для уведомлений и пользовательских настроек
interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  date: string;
  read: boolean;
}

interface UserDashboardSettings {
  widgets: string[];
  layout: string;
  theme: 'light' | 'dark' | 'system';
  autoRefresh: boolean;
  refreshInterval: number;
}

// Функция для создания прогнозных данных на основе исторических
const generateForecastData = (historicalData: any[]) => {
  if (!historicalData || historicalData.length === 0) return [];
  
  // Простой линейный прогноз на основе последних точек данных
  const lastFewPoints = historicalData.slice(-3);
  const avgChange = lastFewPoints.reduce((acc, curr, idx, arr) => {
    if (idx === 0) return acc;
    return acc + (curr.value - arr[idx - 1].value);
  }, 0) / (lastFewPoints.length - 1);
  
  // Создаем прогнозные точки
  const forecastPoints = [];
  const lastPoint = historicalData[historicalData.length - 1];
  
  for (let i = 1; i <= 3; i++) {
    const forecastValue = Math.max(0, lastPoint.value + avgChange * i);
    forecastPoints.push({
      name: `Прогноз ${i}`,
      value: Math.round(forecastValue),
      forecast: true
    });
  }
  
  return [...historicalData, ...forecastPoints];
};

// Основной компонент Dashboard
const AdminDashboard: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timePeriod, setTimePeriod] = useState('month');
  const [refreshTimer, setRefreshTimer] = useState<NodeJS.Timeout | null>(null);
  
  // Состояния для данных
  const [carStats, setCarStats] = useState<CarStats | null>(null);
  const [bookingStats, setBookingStats] = useState<BookingStats | null>(null);
  const [userStats, setUserStats] = useState<{ total: number; change: number } | null>(null);
  const [revenueStats, setRevenueStats] = useState<RevenueStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [popularCars, setPopularCars] = useState<{ car: Car; occupancyRate: number }[]>([]);
  const [userActivity, setUserActivity] = useState<any[]>();
  
  // Вспомогательные данные для графиков
  const [revenueGraphData, setRevenueGraphData] = useState<any[]>();
  const [forecastData, setForecastData] = useState<any[]>();
  const [bookingChartData, setBookingChartData] = useState<any[]>();
  
  // Состояния для настройки дашборда
  const [activeWidgets, setActiveWidgets] = useState<string[]>(
    availableWidgets.filter(w => w.default).map(w => w.id)
  );
  const [isCustomizeDialogOpen, setIsCustomizeDialogOpen] = useState(false);
  const [isSendReportDialogOpen, setIsSendReportDialogOpen] = useState(false);
  const [emailRecipient, setEmailRecipient] = useState('');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const [dashboardSettings, setDashboardSettings] = useState<UserDashboardSettings>({
    widgets: activeWidgets,
    layout: 'grid',
    theme: 'light',
    autoRefresh: false,
    refreshInterval: 300000, // 5 минут
  });
  
  // Функция для проверки наличия уведомлений
  const checkNotifications = useCallback(() => {
    // Имитация получения новых уведомлений
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'Новое бронирование',
        message: 'Поступило новое бронирование #123',
        type: 'success',
        date: new Date().toISOString(),
        read: false,
      },
      {
        id: '2',
        title: 'Отмена бронирования',
        message: 'Бронирование #456 было отменено',
        type: 'warning',
        date: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        read: false,
      },
      {
        id: '3',
        title: 'Низкий запас автомобилей',
        message: 'Доступность автомобилей класса Premium снизилась до 15%',
        type: 'error',
        date: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        read: true,
      },
    ];
    
    setNotifications(mockNotifications);
    setUnreadNotifications(mockNotifications.filter(n => !n.read).length);
  }, []);
  
  // Настройка автоматического обновления
  useEffect(() => {
    if (dashboardSettings.autoRefresh && dashboardSettings.refreshInterval > 0) {
      if (refreshTimer) clearInterval(refreshTimer);
      
      const timer = setInterval(() => {
        fetchDashboardData();
        checkNotifications();
      }, dashboardSettings.refreshInterval);
      
      setRefreshTimer(timer);
      
      return () => clearInterval(timer);
    } else if (refreshTimer) {
      clearInterval(refreshTimer);
    }
  }, [dashboardSettings.autoRefresh, dashboardSettings.refreshInterval]);
  
  // Загрузка данных при монтировании компонента и изменении периода
  useEffect(() => {
    fetchDashboardData();
    checkNotifications();
    
    return () => {
      if (refreshTimer) clearInterval(refreshTimer);
    };
  }, [timePeriod]);
  
  // Функция загрузки данных дашборда
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Параллельная загрузка данных
      const [stats, bookings, cars, chartData, activity] = await Promise.all([
        dashboardApi.getStats(timePeriod),
        dashboardApi.getRecentBookings(),
        dashboardApi.getPopularCars(),
        dashboardApi.getChartData(timePeriod),
        dashboardApi.getUserActivity(timePeriod),
      ]);
      
      // Обновление состояний
      setCarStats(stats.cars);
      setBookingStats(stats.bookings);
      setUserStats(stats.users);
      setRevenueStats(stats.revenue);
      setRecentBookings(bookings);
      setPopularCars(cars);
      setUserActivity(activity);
      
      // Подготовка данных для графиков
      if (chartData.revenue) {
        setRevenueGraphData(chartData.revenue);
        setForecastData(generateForecastData(chartData.revenue));
      }
      
      // Подготовка данных для круговой диаграммы бронирований
      if (stats.bookings) {
        setBookingChartData([
          { name: 'Активные', value: stats.bookings.active },
          { name: 'Ожидающие', value: stats.bookings.pending },
          { name: 'Завершенные', value: stats.bookings.completed },
          { name: 'Отмененные', value: stats.bookings.canceled }
        ]);
      }
      
      setError(null);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError('Не удалось загрузить данные. Пожалуйста, попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };
  
  // Обработчик изменения настроек дашборда
  const saveSettings = () => {
    setDashboardSettings(prev => ({
      ...prev,
      widgets: activeWidgets,
    }));
    
    setIsCustomizeDialogOpen(false);
    
    toast({
      title: 'Настройки сохранены',
      description: 'Изменения в дашборде успешно применены.',
    });
  };
  
  // Обработчик отправки отчета
  const handleSendReport = () => {
    if (!emailRecipient) {
      toast({
        title: 'Ошибка',
        description: 'Укажите адрес электронной почты',
        variant: 'destructive',
      });
      return;
    }
    
    toast({
      title: 'Отчет отправлен',
      description: `Отчет успешно отправлен на адрес ${emailRecipient}`,
    });
    
    setIsSendReportDialogOpen(false);
  };
  
  // Обработчик изменения периода
  const handlePeriodChange = (value: string) => {
    setTimePeriod(value);
  };
  
  // Обработчик открытия панели настройки
  const handleOpenCustomize = () => {
    setActiveWidgets(dashboardSettings.widgets);
    setIsCustomizeDialogOpen(true);
  };
  
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
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <Icon name=