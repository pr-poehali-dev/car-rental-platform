
import React, { useState, useEffect } from 'react';
import { bookingsApi } from '@/lib/api';
import { Booking, User, Car } from '@/types/admin';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { formatDate } from '@/lib/utils';
import Icon from '@/components/ui/icon';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

// Вспомогательные функции и константы
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return <Badge variant="success">Активно</Badge>;
    case 'pending':
      return <Badge variant="warning">Ожидание</Badge>;
    case 'completed':
      return <Badge variant="default">Завершено</Badge>;
    case 'canceled':
      return <Badge variant="destructive">Отменено</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

const getPaymentStatusBadge = (status: string) => {
  switch (status) {
    case 'paid':
      return <Badge variant="success">Оплачено</Badge>;
    case 'pending':
      return <Badge variant="warning">Ожидание</Badge>;
    case 'refunded':
      return <Badge variant="info">Возврат</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

const getCustomerName = (customer: User | string): string => {
  if (typeof customer === 'object') {
    return customer.name;
  }
  return 'Клиент';
};

const getCarName = (car: Car | string): string => {
  if (typeof car === 'object') {
    return `${car.brand} ${car.model}`;
  }
  return 'Автомобиль';
};

const formatPrice = (price: number): string => {
  return `${price.toLocaleString()} ₽`;
};

const AdminBookings: React.FC = () => {
  // Состояние для списка бронирований
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Состояние для пагинации
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBookings, setTotalBookings] = useState(0);
  const [limit] = useState(10);
  
  // Состояние для фильтрации
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<{start?: string; end?: string}>({});
  
  // Состояние для диалогов
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  
  const { toast } = useToast();
  
  // Загрузка данных
  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Формирование параметров запроса
      const params: Record<string, any> = {
        page: currentPage,
        limit,
      };
      
      // Добавление фильтров
      if (statusFilter) params.status = statusFilter;
      if (paymentStatusFilter) params.paymentStatus = paymentStatusFilter;
      if (searchQuery) params.search = searchQuery;
      if (dateRange.start) params.startFrom = dateRange.start;
      if (dateRange.end) params.startTo = dateRange.end;
      
      // Запрос к API
      const response = await bookingsApi.getAll(params);
      
      // Обновление состояния
      setBookings(response.data);
      setTotalBookings(response.total);
      setTotalPages(response.totalPages);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      setError('Не удалось загрузить список бронирований. Пожалуйста, попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };
  
  // Загрузка данных при изменении параметров
  useEffect(() => {
    fetchBookings();
  }, [currentPage, limit]);
  
  // Применение фильтров
  const applyFilters = () => {
    setCurrentPage(1);
    fetchBookings();
  };
  
  // Сброс фильтров
  const resetFilters = () => {
    setStatusFilter('');
    setPaymentStatusFilter('');
    setSearchQuery('');
    setDateRange({});
    setCurrentPage(1);
  };
  
  // Обработка отмены бронирования
  const handleCancelBooking = async () => {
    if (selectedBooking) {
      try {
        await bookingsApi.update(selectedBooking.id, { status: 'canceled' });
        
        // Обновление состояния
        setBookings(bookings.map(booking => 
          booking.id === selectedBooking.id ? { ...booking, status: 'canceled' } : booking
        ));
        
        toast({
          title: 'Бронирование отменено',
          description: `Бронирование #${selectedBooking.id} успешно отменено`,
        });
      } catch (err) {
        console.error('Failed to cancel booking:', err);
        toast({
          title: 'Ошибка',
          description: 'Не удалось отменить бронирование',
          variant: 'destructive',
        });
      } finally {
        setIsCancelDialogOpen(false);
      }
    }
  };
  
  // Обработка изменения статуса оплаты
  const handleUpdatePaymentStatus = async (bookingId: string, newStatus: string) => {
    try {
      await bookingsApi.update(bookingId, { paymentStatus: newStatus });
      
      // Обновление состояния
      setBookings(bookings.map(booking => 
        booking.id === bookingId ? { ...booking, paymentStatus: newStatus as any } : booking
      ));
      
      toast({
        title: 'Статус оплаты обновлен',
        description: `Статус оплаты бронирования #${bookingId} изменен на "${newStatus}"`,
      });
    } catch (err) {
      console.error('Failed to update payment status:', err);
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить статус оплаты',
        variant: 'destructive',
      });
    }
  };
  
  // Открытие диалога деталей
  const openDetailsDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDetailsDialogOpen(true);
  };
  
  // Открытие диалога отмены
  const openCancelDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsCancelDialogOpen(true);
  };
  
  // Рендер скелетона загрузки
  const renderLoading = () => (
    <div className="space-y-4">
      {Array(5).fill(0).map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  );
  
  // Рендер сообщения об ошибке
  const renderError = () => (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg border">
      <Icon name="AlertCircle" className="w-12 h-12 mb-4 text-red-500" />
      <h3 className="mb-2 text-xl font-medium">Ошибка загрузки данных</h3>
      <p className="text-center text-gray-500 mb-4">{error}</p>
      <Button onClick={fetchBookings}>Попробовать снова</Button>
    </div>
  );
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Управление бронированиями</h1>
        <Button asChild>
          <div className="flex items-center">
            <Icon name="Plus" className="h-4 w-4 mr-2" />
            Создать бронирование
          </div>
        </Button>
      </div>
      
      <Card className="p-4 mb-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Поиск */}
          <div className="relative">
            <Input
              placeholder="Поиск по ID, клиенту..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          
          {/* Фильтр по статусу */}
          <div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Все статусы" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Все статусы</SelectItem>
                <SelectItem value="active">Активные</SelectItem>
                <SelectItem value="pending">Ожидающие</SelectItem>
                <SelectItem value="completed">Завершенные</SelectItem>
                <SelectItem value="canceled">Отмененные</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Фильтр по статусу оплаты */}
          <div>
            <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Все статусы оплаты" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Все статусы оплаты</SelectItem>
                <SelectItem value="paid">Оплаченные</SelectItem>
                <SelectItem value="pending">Ожидающие оплаты</SelectItem>
                <SelectItem value="refunded">Возвраты</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Диапазон дат (можно было бы использовать календарь) */}
          <div>
            <Input
              type="date"
              value={dateRange.start || ''}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              placeholder="Дата начала"
            />
          </div>
        </div>
        
        <div className="flex justify-between mt-4">
          <Button variant="outline" onClick={resetFilters}>
            <Icon name="X" className="h-4 w-4 mr-2" />
            Сбросить
          </Button>
          <Button onClick={applyFilters}>
            <Icon name="Filter" className="h-4 w-4 mr-2" />
            Применить фильтры
          </Button>
        </div>
      </Card>
      
      {/* Данные бронирований */}
      {loading ? (
        renderLoading()
      ) : error ? (
        renderError()
      ) : (
        <>
          <div className="bg-white rounded-md border">
            <div className="p-4 border-b">
              <div className="text-sm text-gray-600 flex items-center">
                Найдено бронирований: {totalBookings}
              </div>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID бронирования</TableHead>
                  <TableHead>Клиент</TableHead>
                  <TableHead>Автомобиль</TableHead>
                  <TableHead>Даты</TableHead>
                  <TableHead>Сумма</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Оплата</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-medium">#{booking.id}</TableCell>
                      <TableCell>{getCustomerName(booking.customer)}</TableCell>
                      <TableCell>{getCarName(booking.car)}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{formatDate(booking.startDate)}</div>
                          <div className="text-gray-500">до {formatDate(booking.endDate)}</div>
                        </div>
                      </TableCell>
                      <TableCell>{formatPrice(booking.totalPrice)}</TableCell>
                      <TableCell>{getStatusBadge(booking.status)}</TableCell>
                      <TableCell>{getPaymentStatusBadge(booking.paymentStatus)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Icon name="MoreVertical" className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openDetailsDialog(booking)}>
                              <Icon name="FileSearch" className="h-4 w-4 mr-2" />
                              Просмотр деталей
                            </DropdownMenuItem>
                            
                            {booking.status !== 'canceled' && booking.status !== 'completed' && (
                              <>
                                <DropdownMenuSeparator />
                                
                                <DropdownMenuItem 
                                  onClick={() => openCancelDialog(booking)}
                                  className="text-red-600"
                                >
                                  <Icon name="XCircle" className="h-4 w-4 mr-2" />
                                  Отменить бронирование
                                </DropdownMenuItem>
                                
                                {booking.status === 'pending' && (
                                  <DropdownMenuItem 
                                    onClick={() => handleUpdatePaymentStatus(booking.id, 'paid')}
                                  >
                                    <Icon name="CheckCircle" className="h-4 w-4 mr-2" />
                                    Подтвердить оплату
                                  </DropdownMenuItem>
                                )}
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex flex-col items-center">
                        <Icon name="Calendar" className="w-12 h-12 mb-2 text-gray-300" />
                        <p className="text-gray-500">Бронирования не найдены</p>
                        {(statusFilter || paymentStatusFilter || searchQuery || dateRange.start) && (
                          <Button 
                            variant="outline" 
                            onClick={resetFilters} 
                            className="mt-2"
                          >
                            Сбросить фильтры
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            
            {/* Пагинация */}
            {totalPages > 1 && (
              <div className="py-4 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {[...Array(totalPages)].map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          isActive={currentPage === i + 1}
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </>
      )}
      
      {/* Диалог отмены бронирования */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Отмена бронирования</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите отменить бронирование #{selectedBooking?.id}?
              Это действие нельзя будет отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>
              Отмена
            </Button>
            <Button variant="destructive" onClick={handleCancelBooking}>
              Подтвердить отмену
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Диалог с деталями бронирования */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Детали бронирования #{selectedBooking?.id}</DialogTitle>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Информация о клиенте</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Имя:</span>
                        <span className="font-medium">{getCustomerName(selectedBooking.customer)}</span>
                      </div>
                      {typeof selectedBooking.customer === 'object' && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Email:</span>
                            <span>{selectedBooking.customer.email}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Телефон:</span>
                            <span>{selectedBooking.customer.phone}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Информация о автомобиле</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Автомобиль:</span>
                        <span className="font-medium">{getCarName(selectedBooking.car)}</span>
                      </div>
                      {typeof selectedBooking.car === 'object' && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Год:</span>
                            <span>{selectedBooking.car.year}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Номер:</span>
                            <span>{selectedBooking.car.licensePlate}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Детали бронирования</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Даты</h4>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Начало:</span>
                          <span>{formatDate(selectedBooking.startDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Окончание:</span>
                          <span>{formatDate(selectedBooking.endDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Создано:</span>
                          <span>{formatDate(selectedBooking.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Статус и оплата</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">Статус:</span>
                          {getStatusBadge(selectedBooking.status)}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">Оплата:</span>
                          {getPaymentStatusBadge(selectedBooking.paymentStatus)}
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Сумма:</span>
                          <span className="font-medium">{formatPrice(selectedBooking.totalPrice)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {selectedBooking.notes && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Дополнительная информация</h4>
                      <p className="text-gray-700 text-sm p-3 bg-gray-50 rounded-md">{selectedBooking.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {selectedBooking.status !== 'canceled' && selectedBooking.status !== 'completed' && (
                <div className="flex justify-between">
                  <Button 
                    variant="destructive" 
                    onClick={() => {
                      setIsDetailsDialogOpen(false);
                      setTimeout(() => openCancelDialog(selectedBooking), 100);
                    }}
                  >
                    <Icon name="XCircle" className="h-4 w-4 mr-2" />
                    Отменить бронирование
                  </Button>
                  
                  {selectedBooking.paymentStatus === 'pending' && (
                    <Button 
                      variant="default"
                      onClick={() => {
                        handleUpdatePaymentStatus(selectedBooking.id, 'paid');
                        setIsDetailsDialogOpen(false);
                      }}
                    >
                      <Icon name="CheckCircle" className="h-4 w-4 mr-2" />
                      Подтвердить оплату
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBookings;
