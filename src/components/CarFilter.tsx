import React, { useState, useEffect, useMemo } from 'react';
import { FilterOptions } from '@/types/car';
import { getBrands, getFuelTypes, getTransmissionTypes } from '@/data/cars';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface CarFilterProps {
  onFilterChange: (filters: FilterOptions) => void;
  initialFilters?: FilterOptions;
  className?: string;
}

const CarFilter: React.FC<CarFilterProps> = ({ 
  onFilterChange, 
  initialFilters = {}, 
  className 
}) => {
  // Кешируем данные
  const brands = useMemo(() => getBrands(), []);
  const transmissionTypes = useMemo(() => getTransmissionTypes(), []);
  const fuelTypes = useMemo(() => getFuelTypes(), []);
  const isMobile = useIsMobile();
  
  // Получаем текущий год для установки максимального значения
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    initialFilters.minPrice as number || 500, 
    initialFilters.maxPrice as number || 5000
  ]);
  const [yearRange, setYearRange] = useState<[number, number]>([
    initialFilters.minYear as number || 2010, 
    initialFilters.maxYear as number || currentYear + 1
  ]);
  const [activeFiltersCount, setActiveFiltersCount] = useState<number>(0);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(["brand", "price"]);

  // Настраиваемые опции автомобилей
  const carFeatures = useMemo(() => [
    'Кондиционер', 
    'Навигация', 
    'Парктроник', 
    'Кожаный салон', 
    'Подогрев сидений',
    'Круиз-контроль',
    'Bluetooth',
    'Камера заднего вида',
    'Люк',
    'Электропривод сидений'
  ], []);

  // Подсчет количества активных фильтров
  useEffect(() => {
    let count = 0;
    
    // Считаем каждый фильтр отдельно
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (value.length > 0) count++;
      } else if (value !== undefined && value !== '') {
        // Проверяем пары минимальных и максимальных значений
        if (key === 'minPrice' && filters.maxPrice !== undefined) {
          // Считаем только один раз для пары
        } else if (key === 'maxPrice' && filters.minPrice !== undefined) {
          count++;
        } else if (key === 'minYear' && filters.maxYear !== undefined) {
          // Считаем только один раз для пары
        } else if (key === 'maxYear' && filters.minYear !== undefined) {
          count++;
        } else {
          count++;
        }
      }
    });
    
    setActiveFiltersCount(count);
  }, [filters]);
  
  // Обработчик изменения фильтров
  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    
    // Если значение пусто, удаляем фильтр
    if (value === '' || value === undefined) {
      delete newFilters[key];
    }
    
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  // Обработчик изменения диапазона цен
  const handlePriceRangeChange = (value: number[]) => {
    const [min, max] = value as [number, number];
    setPriceRange([min, max]);
    handleFilterChange('minPrice', min);
    handleFilterChange('maxPrice', max);
  };
  
  // Обработчик изменения диапазона годов
  const handleYearRangeChange = (value: number[]) => {
    const [min, max] = value as [number, number];
    setYearRange([min, max]);
    handleFilterChange('minYear', min);
    handleFilterChange('maxYear', max);
  };
  
  // Обработчик множественного выбора
  const handleMultiSelectChange = (key: keyof FilterOptions, value: string, isChecked: boolean) => {
    const currentValues = filters[key] as string[] || [];
    
    let newValues: string[];
    if (isChecked) {
      newValues = [...currentValues, value];
    } else {
      newValues = currentValues.filter(v => v !== value);
    }
    
    if (newValues.length === 0) {
      const newFilters = { ...filters };
      delete newFilters[key];
      setFilters(newFilters);
      onFilterChange(newFilters);
    } else {
      handleFilterChange(key, newValues);
    }
  };
  
  // Проверка выбора в множественном выборе
  const isMultiSelected = (key: keyof FilterOptions, value: string): boolean => {
    const values = filters[key] as string[] || [];
    return values.includes(value);
  };
  
  // Сброс всех фильтров
  const resetFilters = () => {
    setFilters({});
    setPriceRange([500, 5000]);
    setYearRange([2010, currentYear + 1]);
    onFilterChange({});
  };

  // Обработчик аккордеона
  const handleAccordionChange = (value: string[]) => {
    setExpandedSections(value);
  };

  // Применение фильтров (для мобильного вида)
  const applyFilters = () => {
    onFilterChange(filters);
    setIsFilterOpen(false);
  };
  
  // Содержимое фильтра
  const renderFilterContent = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Фильтры</h3>
        {activeFiltersCount > 0 && (
          <Badge 
            variant="secondary" 
            className="ml-2 flex items-center py-1 px-2 gap-1"
          >
            <span>{activeFiltersCount}</span>
            <span className="hidden sm:inline">активных</span>
          </Badge>
        )}
      </div>
      
      {activeFiltersCount > 0 && (
        <div className="pt-1 pb-3">
          <Button 
            variant="outline" 
            onClick={resetFilters} 
            className="w-full flex items-center justify-center gap-2 border-dashed"
            size="sm"
          >
            <Icon name="RefreshCw" className="h-3.5 w-3.5" />
            Сбросить все фильтры
          </Button>
        </div>
      )}
      
      <Accordion 
        type="multiple" 
        value={expandedSections}
        onValueChange={handleAccordionChange}
        className="space-y-2"
      >
        <AccordionItem value="brand" className="border rounded-md">
          <AccordionTrigger className="px-4 py-3 hover:no-underline data-[state=open]:bg-slate-50 rounded-t-md">
            <div className="flex justify-between w-full">
              <span className="flex items-center gap-2">
                <Icon name="CarFront" className="h-4 w-4 text-slate-500" />
                <span>Марка</span>
              </span>
              {filters.brand && (
                <Badge variant="secondary" className="ml-auto mr-2">
                  {typeof filters.brand === 'string' ? filters.brand : 'Выбрано'}
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2 px-4 pb-4">
            <Select
              value={filters.brand as string || ''}
              onValueChange={(value) => handleFilterChange('brand', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Все марки" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Все марки</SelectItem>
                {brands.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="transmission" className="border rounded-md">
          <AccordionTrigger className="px-4 py-3 hover:no-underline data-[state=open]:bg-slate-50 rounded-t-md">
            <div className="flex justify-between w-full">
              <span className="flex items-center gap-2">
                <Icon name="Cog" className="h-4 w-4 text-slate-500" />
                <span>Коробка передач</span>
              </span>
              {filters.transmissionTypes && (filters.transmissionTypes as string[]).length > 0 && (
                <Badge variant="secondary" className="ml-auto mr-2">
                  {(filters.transmissionTypes as string[]).length}
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2 px-4 pb-4">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {transmissionTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`transmission-${type}`}
                    checked={isMultiSelected('transmissionTypes', type)}
                    onCheckedChange={(checked) => 
                      handleMultiSelectChange('transmissionTypes', type, checked === true)
                    }
                  />
                  <Label htmlFor={`transmission-${type}`}>{type}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="fuel" className="border rounded-md">
          <AccordionTrigger className="px-4 py-3 hover:no-underline data-[state=open]:bg-slate-50 rounded-t-md">
            <div className="flex justify-between w-full">
              <span className="flex items-center gap-2">
                <Icon name="Droplets" className="h-4 w-4 text-slate-500" />
                <span>Тип топлива</span>
              </span>
              {filters.fuelTypes && (filters.fuelTypes as string[]).length > 0 && (
                <Badge variant="secondary" className="ml-auto mr-2">
                  {(filters.fuelTypes as string[]).length}
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2 px-4 pb-4">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {fuelTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`fuel-${type}`}
                    checked={isMultiSelected('fuelTypes', type)}
                    onCheckedChange={(checked) => 
                      handleMultiSelectChange('fuelTypes', type, checked === true)
                    }
                  />
                  <Label htmlFor={`fuel-${type}`}>{type}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="price" className="border rounded-md">
          <AccordionTrigger className="px-4 py-3 hover:no-underline data-[state=open]:bg-slate-50 rounded-t-md">
            <div className="flex justify-between w-full">
              <span className="flex items-center gap-2">
                <Icon name="CircleDollarSign" className="h-4 w-4 text-slate-500" />
                <span>Цена (₽/день)</span>
              </span>
              {(filters.minPrice || filters.maxPrice) && (
                <Badge variant="secondary" className="ml-auto mr-2">
                  {priceRange[0].toLocaleString()} — {priceRange[1].toLocaleString()} ₽
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2 px-4 pb-4">
            <div className="space-y-4 px-1">
              <Slider
                defaultValue={[500, 5000]}
                min={500}
                max={10000}
                step={100}
                value={priceRange}
                onValueChange={handlePriceRangeChange}
                className="pt-6"
              />
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <Label htmlFor="min-price" className="text-xs text-slate-500 mb-1">От</Label>
                  <Input
                    id="min-price"
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => handlePriceRangeChange([
                      Math.max(500, Math.min(parseInt(e.target.value) || 500, priceRange[1] - 100)), 
                      priceRange[1]
                    ])}
                    className="w-24"
                  />
                </div>
                <span className="text-slate-400 mt-4">—</span>
                <div className="flex flex-col">
                  <Label htmlFor="max-price" className="text-xs text-slate-500 mb-1">До</Label>
                  <Input
                    id="max-price"
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => handlePriceRangeChange([
                      priceRange[0], 
                      Math.max(priceRange[0] + 100, parseInt(e.target.value) || 5000)
                    ])}
                    className="w-24"
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="year" className="border rounded-md">
          <AccordionTrigger className="px-4 py-3 hover:no-underline data-[state=open]:bg-slate-50 rounded-t-md">
            <div className="flex justify-between w-full">
              <span className="flex items-center gap-2">
                <Icon name="Calendar" className="h-4 w-4 text-slate-500" />
                <span>Год выпуска</span>
              </span>
              {(filters.minYear || filters.maxYear) && (
                <Badge variant="secondary" className="ml-auto mr-2">
                  {yearRange[0]} — {yearRange[1]}
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2 px-4 pb-4">
            <div className="space-y-4 px-1">
              <Slider
                defaultValue={[2010, currentYear + 1]}
                min={2000}
                max={currentYear + 1}
                step={1}
                value={yearRange}
                onValueChange={handleYearRangeChange}
                className="pt-6"
              />
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <Label htmlFor="min-year" className="text-xs text-slate-500 mb-1">От</Label>
                  <Input
                    id="min-year"
                    type="number"
                    value={yearRange[0]}
                    onChange={(e) => handleYearRangeChange([
                      Math.max(2000, Math.min(parseInt(e.target.value) || 2000, yearRange[1] - 1)), 
                      yearRange[1]
                    ])}
                    className="w-24"
                  />
                </div>
                <span className="text-slate-400 mt-4">—</span>
                <div className="flex flex-col">
                  <Label htmlFor="max-year" className="text-xs text-slate-500 mb-1">До</Label>
                  <Input
                    id="max-year"
                    type="number"
                    value={yearRange[1]}
                    onChange={(e) => handleYearRangeChange([
                      yearRange[0], 
                      Math.max(yearRange[0] + 1, parseInt(e.target.value) || currentYear + 1)
                    ])}
                    className="w-24"
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="features" className="border rounded-md">
          <AccordionTrigger className="px-4 py-3 hover:no-underline data-[state=open]:bg-slate-50 rounded-t-md">
            <div className="flex justify-between w-full">
              <span className="flex items-center gap-2">
                <Icon name="ListChecks" className="h-4 w-4 text-slate-500" />
                <span>Дополнительные опции</span>
              </span>
              {filters.features && (filters.features as string[])?.length > 0 && (
                <Badge variant="secondary" className="ml-auto mr-2">
                  {(filters.features as string[])?.length}
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2 px-4 pb-4">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {carFeatures.map((feature) => (
                <div key={feature} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`feature-${feature}`}
                    checked={isMultiSelected('features', feature)}
                    onCheckedChange={(checked) => 
                      handleMultiSelectChange('features', feature, checked === true)
                    }
                  />
                  <Label htmlFor={`feature-${feature}`}>{feature}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      {isMobile && (
        <>
          <Separator className="my-4" />
          <SheetFooter>
            <div className="grid grid-cols-2 gap-3 w-full">
              <Button 
                variant="outline" 
                onClick={resetFilters} 
                disabled={activeFiltersCount === 0}
              >
                Сбросить
              </Button>
              <SheetClose asChild>
                <Button onClick={applyFilters}>
                  Применить
                </Button>
              </SheetClose>
            </div>
          </SheetFooter>
        </>
      )}
    </div>
  );
  
  // Для мобильных устройств - выводим кнопку и фильтры в drawer
  if (isMobile) {
    return (
      <div className={cn("mb-4", className)}>
        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetTrigger asChild>
            <Button 
              variant={activeFiltersCount > 0 ? "default" : "outline"}
              className="w-full flex items-center justify-center gap-2"
              onClick={() => setIsFilterOpen(true)}
            >
              <Icon name="SlidersHorizontal" className="h-4 w-4" />
              Фильтры
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh] overflow-y-auto">
            <SheetHeader className="text-left pb-1">
              <SheetTitle>Фильтры</SheetTitle>
              <SheetDescription>
                Настройте параметры поиска автомобилей
              </SheetDescription>
            </SheetHeader>
            {renderFilterContent()}
          </SheetContent>
        </Sheet>
      </div>
    );
  }
  
  // Для desktop - обычный вид
  return (
    <div className={cn("space-y-4 p-4 bg-white rounded-lg border sticky top-4", className)}>
      {renderFilterContent()}
    </div>
  );
};

export default CarFilter;