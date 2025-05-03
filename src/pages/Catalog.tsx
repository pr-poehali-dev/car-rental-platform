
import React, { useState, useEffect } from 'react';
import { cars } from '@/data/cars';
import { Car, FilterOptions } from '@/types/car';
import Header from '@/components/Header';
import CarCard from '@/components/CarCard';
import CarFilter from '@/components/CarFilter';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

const Catalog: React.FC = () => {
  const [filteredCars, setFilteredCars] = useState<Car[]>(cars);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('default');
  const carsPerPage = 6;
  
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
      case 'rating-desc':
        result = [...result].sort((a, b) => b.rating - a.rating);
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
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container px-4 py-8 mx-auto">
        <h1 className="mb-8 text-3xl font-bold">Каталог автомобилей</h1>
        
        <div className="flex gap-6">
          {/* Фильтры - боковая панель */}
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
                  <span className="text-sm text-gray-500">Сортировка:</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="По умолчанию" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">По умолчанию</SelectItem>
                      <SelectItem value="price-asc">Сначала дешевле</SelectItem>
                      <SelectItem value="price-desc">Сначала дороже</SelectItem>
                      <SelectItem value="year-desc">Сначала новее</SelectItem>
                      <SelectItem value="rating-desc">По рейтингу</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button variant="outline" className="lg:hidden" size="sm">
                  <Icon name="SlidersHorizontal" className="w-4 h-4 mr-2" />
                  Фильтры
                </Button>
              </div>
            </div>
            
            {/* Результаты поиска */}
            {filteredCars.length > 0 ? (
              <>
                <div className="mb-2 text-sm text-gray-500">
                  Найдено автомобилей: {filteredCars.length}
                </div>
                
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {currentCars.map((car) => (
                    <CarCard key={car.id} car={car} />
                  ))}
                </div>
                
                {/* Пагинация */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <Pagination>
                      <Button
                        variant="outline"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <Icon name="ChevronLeft" className="w-4 h-4" />
                      </Button>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </Button>
                      ))}
                      
                      <Button
                        variant="outline"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        <Icon name="ChevronRight" className="w-4 h-4" />
                      </Button>
                    </Pagination>
                  </div>
                )}
              </>
            ) : (
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
            )}
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
