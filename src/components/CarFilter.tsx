
import React, { useState, useEffect } from 'react';
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
import { useMobile } from '@/hooks/use-mobile';

interface CarFilterProps {
  onFilterChange: (filters: FilterOptions) => void;
}

const CarFilter: React.FC<CarFilterProps> = ({ onFilterChange }) => {
  const brands = getBrands();
  const transmissionTypes = getTransmissionTypes();
  const fuelTypes = getFuelTypes();
  const isMobile = useMobile();
  
  const [filters, setFilters] = useState<FilterOptions>({});
  const [priceRange, setPriceRange] = useState<[number, number]>([500, 5000]);
  const [yearRange, setYearRange] = useState<[number, number]>([2010, 2025]);
  const [activeFiltersCount, setActiveFiltersCount] = useState<number>(0);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  // Подсчет количества активных фильтров
  useEffect(() => {
    const count = Object.keys(filters).length;
    setActiveFiltersCount(count);
  }, [filters]);
  
  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    
    // Если значение пусто, удаляем фильтр
    if (value === '' || value === undefined) {
      delete newFilters[key];
    }
    
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  const handlePriceRangeChange = (value: number[]) => {
    const [min, max] = value as [number, number];
    setPriceRange([min, max]);
    handleFilterChange('minPrice', min);
    handleFilterChange('maxPrice', max);
  };
  
  const handleYearRangeChange = (value: number[]) => {
    const [min, max] = value as [number, number];
    setYearRange([min, max]);
    handleFilterChange('minYear', min);
    handleFilterChange('maxYear', max);
  };
  
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
  
  const isMultiSelected = (key: keyof FilterOptions, value: string): boolean => {
    const values = filters[key] as string[] || [];
    return values.includes(value);
  };
  
  const resetFilters = () => {
    setFilters({});
    setPriceRange([500, 5000]);
    setYearRange([2010, 2025]);
    onFilterChange({});
  };
  
  const renderFilterContent = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Фильтры</h3>
        {activeFiltersCount > 0 && (
          <Badge variant="outline" className="ml-2">
            {activeFiltersCount} активных
          </Badge>
        )}
      </div>
      
      <Accordion type="multiple" defaultValue={["brand", "price"]}>
        <AccordionItem value="brand">
          <AccordionTrigger className="py-3 hover:no-underline">
            <div className="flex justify-between w-full">
              <span>Марка</span>
              {filters.brand && (
                <Badge variant="secondary" className="ml-auto mr-2">
                  {typeof filters.brand === 'string' ? filters.brand : 'Выбрано'}
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
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
        
        <AccordionItem value="transmission">
          <AccordionTrigger className="py-3 hover:no-underline">
            <div className="flex justify-between w-full">
              <span>Коробка передач</span>
              {filters.transmission && (
                <Badge variant="secondary" className="ml-auto mr-2">
                  {typeof filters.transmission === 'string' ? filters.transmission : 'Выбрано'}
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
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
        
        <AccordionItem value="fuel">
          <AccordionTrigger className="py-3 hover:no-underline">
            <div className="flex justify-between w-full">
              <span>Тип топлива</span>
              {filters.fuelType && (
                <Badge variant="secondary" className="ml-auto mr-2">
                  {typeof filters.fuelType === 'string' ? filters.fuelType : 'Выбрано'}
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
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
        
        <AccordionItem value="price">
          <AccordionTrigger className="py-3 hover:no-underline">
            <div className="flex justify-between w-full">
              <span>Цена (₽/день)</span>
              {(filters.minPrice || filters.maxPrice) && (
                <Badge variant="secondary" className="ml-auto mr-2">
                  {priceRange[0]} — {priceRange[1]} ₽
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 px-1">
              <Slider
                defaultValue={[500, 5000]}
                min={500}
                max={10000}
                step={100}
                value={priceRange}
                onValueChange={handlePriceRangeChange}
                className="pt-2"
              />
              <div className="flex items-center justify-between">
                <Input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => handlePriceRangeChange([
                    Math.max(500, Math.min(parseInt(e.target.value) || 500, priceRange[1] - 100)), 
                    priceRange[1]
                  ])}
                  className="w-24"
                />
                <span>—</span>
                <Input
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
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="year">
          <AccordionTrigger className="py-3 hover:no-underline">
            <div className="flex justify-between w-full">
              <span>Год выпуска</span>
              {(filters.minYear || filters.maxYear) && (
                <Badge variant="secondary" className="ml-auto mr-2">
                  {yearRange[0]} — {yearRange[1]}
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 px-1">
              <Slider
                defaultValue={[2010, 2025]}
                min={2000}
                max={2025}
                step={1}
                value={yearRange}
                onValueChange={handleYearRangeChange}
                className="pt-2"
              />
              <div className="flex items-center justify-between">
                <Input
                  type="number"
                  value={yearRange[0]}
                  onChange={(e) => handleYearRangeChange([
                    Math.max(2000, Math.min(parseInt(e.target.value) || 2000, yearRange[1] - 1)), 
                    yearRange[1]
                  ])}
                  className="w-24"
                />
                <span>—</span>
                <Input
                  type="number"
                  value={yearRange[1]}
                  onChange={(e) => handleYearRangeChange([
                    yearRange[0], 
                    Math.max(yearRange[0] + 1, parseInt(e.target.value) || 2025)
                  ])}
                  className="w-24"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="features">
          <AccordionTrigger className="py-3 hover:no-underline">
            <div className="flex justify-between w-full">
              <span>Дополнительные опции</span>
              {filters.features && (
                <Badge variant="secondary" className="ml-auto mr-2">
                  {(filters.features as string[])?.length || 0} выбрано
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {['Кондиционер', 'Навигация', 'Парктроник', 'Кожаный салон', 'Подогрев сидений'].map((feature) => (
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
      
      <div className="pt-2">
        <Button 
          variant="outline" 
          onClick={resetFilters} 
          className="w-full flex items-center justify-center gap-2"
          disabled={activeFiltersCount === 0}
        >
          <Icon name="RefreshCw" className="h-4 w-4" />
          Сбросить фильтры
        </Button>
      </div>
      
      {isMobile && (
        <SheetFooter>
          <SheetClose asChild>
            <Button className="w-full" onClick={() => setIsFilterOpen(false)}>
              Применить фильтры
            </Button>
          </SheetClose>
        </SheetFooter>
      )}
    </div>
  );
  
  // Для мобильных устройств - выводим кнопку и фильтры в drawer
  if (isMobile) {
    return (
      <div className="mb-4">
        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
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
    <div className="space-y-4 p-4 bg-white rounded-lg border sticky top-4">
      {renderFilterContent()}
    </div>
  );
};

export default CarFilter;
