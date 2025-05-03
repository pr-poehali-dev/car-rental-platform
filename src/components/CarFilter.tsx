
import React, { useState } from 'react';
import { FilterOptions } from '@/types/car';
import { getBrands, getFuelTypes, getTransmissionTypes } from '@/data/cars';
import { Button } from '@/components/ui/button';
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

interface CarFilterProps {
  onFilterChange: (filters: FilterOptions) => void;
}

const CarFilter: React.FC<CarFilterProps> = ({ onFilterChange }) => {
  const brands = getBrands();
  const transmissionTypes = getTransmissionTypes();
  const fuelTypes = getFuelTypes();
  
  const [filters, setFilters] = useState<FilterOptions>({});
  const [priceRange, setPriceRange] = useState<[number, number]>([500, 5000]);
  const [yearRange, setYearRange] = useState<[number, number]>([2010, 2023]);
  
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
  
  const resetFilters = () => {
    setFilters({});
    setPriceRange([500, 5000]);
    setYearRange([2010, 2023]);
    onFilterChange({});
  };
  
  return (
    <div className="space-y-4 p-4 bg-white rounded-lg border">
      <h3 className="text-lg font-semibold">Фильтры</h3>
      
      <Accordion type="single" collapsible defaultValue="brand">
        <AccordionItem value="brand">
          <AccordionTrigger>Марка</AccordionTrigger>
          <AccordionContent>
            <Select
              value={filters.brand || ''}
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
          <AccordionTrigger>Коробка передач</AccordionTrigger>
          <AccordionContent>
            <Select
              value={filters.transmission || ''}
              onValueChange={(value) => handleFilterChange('transmission', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Любая" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Любая</SelectItem>
                {transmissionTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="fuel">
          <AccordionTrigger>Тип топлива</AccordionTrigger>
          <AccordionContent>
            <Select
              value={filters.fuelType || ''}
              onValueChange={(value) => handleFilterChange('fuelType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Любой" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Любой</SelectItem>
                {fuelTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="price">
          <AccordionTrigger>Цена (₽/день)</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider
                defaultValue={[500, 5000]}
                min={500}
                max={5000}
                step={100}
                value={priceRange}
                onValueChange={handlePriceRangeChange}
              />
              <div className="flex items-center justify-between">
                <Input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => handlePriceRangeChange([parseInt(e.target.value), priceRange[1]])}
                  className="w-24"
                />
                <span>—</span>
                <Input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => handlePriceRangeChange([priceRange[0], parseInt(e.target.value)])}
                  className="w-24"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="year">
          <AccordionTrigger>Год выпуска</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider
                defaultValue={[2010, 2023]}
                min={2000}
                max={2023}
                step={1}
                value={yearRange}
                onValueChange={handleYearRangeChange}
              />
              <div className="flex items-center justify-between">
                <Input
                  type="number"
                  value={yearRange[0]}
                  onChange={(e) => handleYearRangeChange([parseInt(e.target.value), yearRange[1]])}
                  className="w-24"
                />
                <span>—</span>
                <Input
                  type="number"
                  value={yearRange[1]}
                  onChange={(e) => handleYearRangeChange([yearRange[0], parseInt(e.target.value)])}
                  className="w-24"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <Button variant="outline" onClick={resetFilters} className="w-full">
        Сбросить фильтры
      </Button>
    </div>
  );
};

export default CarFilter;
