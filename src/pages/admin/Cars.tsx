
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Car } from '@/types/admin';
import { carsApi } from '@/lib/api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import Icon from '@/components/ui/icon';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const AdminCars: React.FC = () => {
  // Состояние для автомобилей и пагинации
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCars, setTotalCars] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10); // Количество автомобилей на странице
  
  // Состояние для поиска и фильтрации
  const [searchQuery, setSearchQuery] = useState('');
  const [brand, setBrand] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('');
  
  // Состояние для модальных окон
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  
  // Доступные бренды для фильтрации (можно получать с сервера)
  const availableBrands = ['BMW', 'Mercedes', 'Audi', 'Toyota', 'Kia', 'Hyundai'];
  const { toast } = useToast();
  
  // Получение списка автомобилей с учетом фильтров
  const fetchCars = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Формирование параметров запроса
      const params: Record<string, any> = {
        page: currentPage,
        limit,
      };
      
      // Добавление параметров фильтрации и сортировки
      if (searchQuery) params.search = searchQuery;
      if (brand) params.brand = brand;
      if (status) params.status = status;
      if (sortBy) params.sort = sortBy;
      
      // Запрос к API
      const response = await carsApi.getAll(params);
      
      // Обновление состояния
      setCars(response.data);
      setTotalCars(response.total);
      setTotalPages(response.totalPages);
    } catch (err) {
      console.error('Failed to fetch cars:', err);
      setError('Не удалось загрузить список автомобилей. Пожалуйста, попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };
  
  // Загрузка данных при изменении параметров
  useEffect(() => {
    fetchCars();
  }, [currentPage, limit, sortBy]);
  
  // Функция для применения фильтров
  const applyFilters = () => {
    setCurrentPage(1); // Сброс на первую страницу
    fetchCars();
  };
  
  // Сброс всех фильтров
  const resetFilters = () => {
    setSearchQuery('');
    setBrand('');
    setStatus('');
    setSortBy('');
    setCurrentPage(1);
  };
  
  // Изменение статуса автомобиля
  const toggleStatus = async (car: Car) => {
    try {
      const newStatus = car.status === 'available' ? 'unavailable' : 'available';
      await carsApi.update(car.id, { status: newStatus });
      
      // Обновление локального состояния
      setCars(cars.map(c => 
        c.id === car.id ? { ...c, status: newStatus } : c
      ));
      
      toast({
        title: newStatus === 'available' ? "Автомобиль опубликован" : "Автомобиль снят с публикации",
        description: `${car.brand} ${car.model} ${newStatus === 'available' ? 'теперь доступен для бронирования' : 'снят с публикации'}`,
      });
    } catch (err) {
      console.error('Failed to update car status:', err);
      toast({
        title: "Ошибка",
        description: "Не удалось изменить статус автомобиля",
        variant: "destructive",
      });
    }
  };
  
  // Открытие диалога подтверждения удаления
  const openDeleteDialog = (car: Car) => {
    setSelectedCar(car);
    setIsDeleteDialogOpen(true);
  };
  
  // Удаление автомобиля
  const handleDeleteCar = async () => {
    if (selectedCar) {
      try {
        await carsApi.delete(selectedCar.id);
        
        // Обновление локального состояния
        setCars(cars.filter(car => car.id !== selectedCar.id));
        setTotalCars(prev => prev - 1);
        
        toast({
          title: "Автомобиль удален",
          description: `${selectedCar.brand} ${selectedCar.model} был успешно удален.`,
        });
      } catch (err) {
        console.error('Failed to delete car:', err);
        toast({
          title: "Ошибка",
          description: "Не удалось удалить автомобиль",
          variant: "destructive",
        });
      } finally {
        setIsDeleteDialogOpen(false);
      }
    }
  };
  
  // Получение цвета для бейджа статуса
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge variant="success">Активен</Badge>;
      case 'unavailable':
        return <Badge variant="secondary">Скрыт</Badge>;
      case 'maintenance':
        return <Badge variant="warning">Техобслуживание</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
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
      <Button onClick={fetchCars}>Попробовать снова</Button>
    </div>
  );
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Управление автомобилями</h1>
        <Button asChild>
          <Link to="/admin/cars/new">
            <Icon name="Plus" className="h-4 w-4 mr-2" />
            Добавить автомобиль
          </Link>
        </Button>
      </div>
      
      <Card className="p-4 mb-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Поиск */}
          <div className="relative">
            <Input
              placeholder="Поиск по марке, модели..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          
          {/* Фильтр по бренду */}
          <div>
            <Select value={brand} onValueChange={setBrand}>
              <SelectTrigger>
                <SelectValue placeholder="Все марки" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Все марки</SelectItem>
                {availableBrands.map(brand => (
                  <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Фильтр по статусу */}
          <div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Любой статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Любой статус</SelectItem>
                <SelectItem value="available">Активные</SelectItem>
                <SelectItem value="unavailable">Скрытые</SelectItem>
                <SelectItem value="maintenance">На техобслуживании</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Сортировка */}
          <div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Сортировка" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">По умолчанию</SelectItem>
                <SelectItem value="pricePerDay">По цене (возр.)</SelectItem>
                <SelectItem value="-pricePerDay">По цене (убыв.)</SelectItem>
                <SelectItem value="-year">По году (новее)</SelectItem>
                <SelectItem value="year">По году (старше)</SelectItem>
                <SelectItem value="-rating">По рейтингу</SelectItem>
              </SelectContent>
            </Select>
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
      
      {/* Статус загрузки */}
      {loading ? (
        renderLoading()
      ) : error ? (
        renderError()
      ) : (
        <>
          <div className="bg-white rounded-md border">
            <div className="p-4 border-b">
              <div className="text-sm text-gray-600 flex items-center">
                Найдено автомобилей: {totalCars}
              </div>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Автомобиль</TableHead>
                  <TableHead>Год</TableHead>
                  <TableHead>Цена/день</TableHead>
                  <TableHead>Трансмиссия</TableHead>
                  <TableHead>Топливо</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cars.map((car) => (
                  <TableRow key={car.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded overflow-hidden mr-3 bg-gray-100 flex items-center justify-center">
                          {car.imageUrl ? (
                            <img 
                              src={car.imageUrl} 
                              alt={`${car.brand} ${car.model}`} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Icon name="Car" className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{car.brand} {car.model}</div>
                          <div className="text-xs text-gray-500">{car.licensePlate || 'Нет ГРЗ'}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{car.year}</TableCell>
                    <TableCell>{car.pricePerDay.toLocaleString()} ₽</TableCell>
                    <TableCell>{car.transmission}</TableCell>
                    <TableCell>{car.fuelType}</TableCell>
                    <TableCell>
                      {getStatusBadge(car.status)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Icon name="MoreVertical" className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/car/${car.id}`} target="_blank" className="flex items-center">
                              <Icon name="ExternalLink" className="h-4 w-4 mr-2" />
                              Просмотр на сайте
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/admin/cars/edit/${car.id}`} className="flex items-center">
                              <Icon name="Edit" className="h-4 w-4 mr-2" />
                              Редактировать
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toggleStatus(car)} className="flex items-center">
                            <Icon name={car.status === 'available' ? "EyeOff" : "Eye"} className="h-4 w-4 mr-2" />
                            {car.status === 'available' ? 'Снять с публикации' : 'Опубликовать'}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => openDeleteDialog(car)}
                            className="text-red-600 flex items-center"
                          >
                            <Icon name="Trash2" className="h-4 w-4 mr-2" />
                            Удалить
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                
                {cars.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center">
                        <Icon name="Car" className="w-12 h-12 mb-2 text-gray-300" />
                        <p className="text-gray-500">Автомобили не найдены</p>
                        <Button 
                          variant="outline" 
                          onClick={resetFilters} 
                          className="mt-2"
                        >
                          Сбросить фильтры
                        </Button>
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
      
      {/* Диалог подтверждения удаления */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить автомобиль?</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить {selectedCar?.brand} {selectedCar?.model}? Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Отмена
            </Button>
            <Button variant="destructive" onClick={handleDeleteCar}>
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCars;
