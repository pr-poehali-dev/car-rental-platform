
import React, { useState, useEffect } from 'react';
import { cars } from '@/data/cars';
import { Car, FilterOptions } from '@/types/car';
import Header from '@/components/Header';
import CarCard from '@/components/CarCard';
import CarFilter from '@/components/CarFilter';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { useMobile } from '@/hooks/use-mobile';

const Catalog: React.FC = () => {
  const isMobile = useMobile();
  const [filteredCars, setFilteredCars] = useState<Car[]>(cars);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('default');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  
  // Количество элементов на странице в зависимости от режима отображения
  const carsPerPage = viewMode === 'grid' ? 6 : 4;
  
  // Подсчет количества активных фильтров
  useEffect(() => {
    setActiveFiltersCount(Object.keys(filters).length);
  }, [filters]);
  
  // Фильтрация автомобилей
  useEffect(() => {
    let result = cars;
    
    // Поиск по запросу
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(car => 
        car.brand.toLowerCase().includes(query) || 
        car.model.toLowerCase().includes(query)
      );
    }
    
    // Применение фильтров
    if (filters.brand) {
      result = result.filter(car => car.brand === filters.brand);
    }
    
    if (filters.transmission) {
      result = result.filter(car => car.transmission === filters.transmission);
    }
    
    if (filters.fuelType) {
      result = result.filter(car => car.fuelType === filters.fuelType);
    }
    
    // Проверка на множественные значения (для обновленного фильтра)
    if (filters.transmissionTypes && Array.isArray(filters.transmissionTypes)) {
      result = result.filter(car => 
        filters.transmissionTypes!.includes(car.transmission)
      );
    }
    
    if (filters.fuelTypes && Array.isArray(filters.fuelTypes)) {
      result = result.filter(car => 
        filters.fuelTypes!.includes(car.fuelType)
      );
    }
    
    if (filters.minPrice) {
      result = result.filter(car => car.pricePerDay >= filters.minPrice!);
    }
    
    if (filters.maxPrice) {
      result = result.filter(car => car.pricePerDay <= filters.maxPrice!);
    }
    
    if (filters.minYear) {
      result = result.filter(car => car.year >= filters.minYear!);
    }
    
    if (filters.maxYear) {
      result = result.filter(car => car.year <= filters.maxYear!);
    }
    
    // Сортировка
    switch (sortBy) {
      case 'price-asc':
        result = [...result].sort((a, b) => a.pricePerDay - b.pricePerDay);
        break;
      case 'price-desc':
        result = [...result].sort((a, b) => b.pricePerDay - a.pricePerDay);
        break;
      case 'year-desc':
        result = [...result].sort((a, b) => b.year - a.year);
        break;
      case 'year-asc':
        result = [...result].sort((a, b) => a.year - b.year);
        break;
      case 'rating-desc':
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
      case 'name-asc':
        result = [...result].sort((a, b) => 
          `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`)
        );
        break;
      default:
        break;
    }
    
    setFilteredCars(result);
    setCurrentPage(1);
  }, [searchQuery, filters, sortBy]);
  
  // Пагинация
  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar);
  const totalPages = Math.ceil(filteredCars.length / carsPerPage);
  
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Функция для создания массива страниц с эллипсисом
  const getPaginationItems = () => {
    const items = [];
    const maxVisiblePages = isMobile ? 3 : 5;
    
    if (totalPages <= maxVisiblePages) {
      // Показываем все страницы, если их меньше максимального количества
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      // Всегда показываем первую страницу
      items.push(1);
      
      // Для текущей страницы вблизи начала
      if (currentPage <= 3) {
        items.push(2, 3);
        items.push('ellipsis');
        items.push(totalPages);
      } 
      // Для текущей страницы вблизи конца
      else if (currentPage >= totalPages - 2) {
        items.push('ellipsis');
        items.push(totalPages - 2, totalPages - 1, totalPages);
      } 
      // Для текущей страницы в середине
      else {
        items.push('ellipsis');
        items.push(currentPage - 1, currentPage, currentPage + 1);
        items.push('ellipsis');
        items.push(totalPages);
      }
    }
    
    return items;
  };
  
  // Рендер элемента карточки в зависимости от режима отображения
  const renderCar = (car: Car) => {
    if (viewMode === 'list') {
      return (
        <div key={car.id} className="flex flex-col md:flex-row overflow-hidden bg-white rounded-lg border shadow-sm transition-all hover:shadow-md">
          <div className="md:w-1/3 h-48 md:h-auto">
            <img 
              src={car.imageUrl} 
              alt={`${car.brand} ${car.model}`} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col flex-1 p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold">{car.brand} {car.model}</h3>
              <div className="flex items-center">
                <Icon name="Star" className="w-4 h-4 text-yellow-500" />
                <span className="ml-1 text-sm">{car.rating.toFixed(1)}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="outline" className="flex items-center">
                <Icon name="Calendar" className="w-3 h-3 mr-1" />
                {car.year}
              </Badge>
              <Badge variant="outline" className="flex items-center">
                <Icon name="Gauge" className="w-3 h-3 mr-1" />
                {car.transmission}
              </Badge>
              <Badge variant="outline" className="flex items-center">
                <Icon name="Fuel" className="w-3 h-3 mr-1" />
                {car.fuelType}
              </Badge>
            </div>
            
            <p className="text-sm text-gray-600 mb-4 flex-1">{car.description || `${car.brand} ${car.model} ${car.year} года в отличном состоянии.`}</p>
            
            <div className="flex justify-between items-center mt-auto">
              <div className="text-lg font-semibold">
                {car.pricePerDay} ₽<span className="text-xs text-gray-500">/день</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a href={`/car/${car.id}`}>Подробнее</a>
                </Button>
                <Button size="sm">Забронировать</Button>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    // По умолчанию рендерим в режиме сетки
    return <CarCard key={car.id} car={car} />;
  };
  
  // Рендер результатов поиска
  const renderSearchResults = () => {
    if (filteredCars.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg border">
          <Icon name="Search" className="w-12 h-12 mb-4 text-gray-300" />
          <h3 className="mb-2 text-xl font-medium">Ничего не найдено</h3>
          <p className="text-center text-gray-500">
            Попробуйте изменить параметры поиска или сбросить фильтры
          </p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchQuery('');
              setFilters({});
            }}
            className="mt-4"
          >
            Сбросить все фильтры
          </Button>
        </div>
      );
    }
    
    return (
      <>
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-500">
            Найдено автомобилей: {filteredCars.length}
          </div>
          
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                    className="h-8 w-8"
                  >
                    <Icon name="LayoutGrid" className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Плитка</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                    className="h-8 w-8"
                  >
                    <Icon name="List" className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Список</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        <div className={
          viewMode === 'grid'
            ? "grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 animate-fade-in"
            : "flex flex-col gap-4 animate-fade-in"
        }>
          {currentCars.map(renderCar)}
        </div>
        
        {/* Улучшенная пагинация */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {getPaginationItems().map((item, index) => 
                  item === 'ellipsis' ? (
                    <PaginationItem key={`ellipsis-${index}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={item}>
                      <PaginationLink
                        isActive={currentPage === item}
                        onClick={() => handlePageChange(item as number)}
                      >
                        {item}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </>
    );
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container px-4 py-8 mx-auto">
        <h1 className="mb-8 text-3xl font-bold">Каталог автомобилей</h1>
        
        <div className="flex gap-6">
          {/* Фильтры - боковая панель для десктопа */}
          <div className="hidden w-64 lg:block">
            <CarFilter onFilterChange={setFilters} />
          </div>
          
          {/* Основной контент */}
          <div className="flex-1">
            <div className="p-4 mb-6 bg-white rounded-lg border">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="relative w-full max-w-md">
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Поиск автомобилей"
                    className="pl-10"
                  />
                  <Icon name="Search" className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="hidden md:inline text-sm text-gray-500">Сортировка:</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="По умолчанию" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">По умолчанию</SelectItem>
                      <SelectItem value="price-asc">Сначала дешевле</SelectItem>
                      <SelectItem value="price-desc">Сначала дороже</SelectItem>
                      <SelectItem value="year-desc">Сначала новее</SelectItem>
                      <SelectItem value="year-asc">Сначала старше</SelectItem>
                      <SelectItem value="rating-desc">По рейтингу</SelectItem>
                      <SelectItem value="name-asc">По названию</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Кнопка фильтров для мобильных */}
                <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
                  <SheetTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="lg:hidden flex items-center"
                      onClick={() => setIsFilterSheetOpen(true)}
                    >
                      <Icon name="SlidersHorizontal" className="w-4 h-4 mr-2" />
                      Фильтры
                      {activeFiltersCount > 0 && (
                        <Badge variant="secondary" className="ml-2">
                          {activeFiltersCount}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] sm:w-[350px] overflow-y-auto">
                    <div className="py-4">
                      <CarFilter onFilterChange={setFilters} />
                    </div>
                    <div className="flex justify-end mt-4">
                      <SheetClose asChild>
                        <Button>
                          Применить фильтры
                        </Button>
                      </SheetClose>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
            
            {/* Результаты поиска */}
            {renderSearchResults()}
          </div>
        </div>
      </main>
      
      <footer className="py-6 mt-12 text-center bg-white border-t">
        <p className="text-sm text-gray-500">© 2025 АвтоПрокат. Все права защищены.</p>
      </footer>
    </div>
  );
};

export default Catalog;
