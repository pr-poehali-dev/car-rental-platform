
export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  pricePerDay: number;
  transmission: 'Автомат' | 'Механика' | 'Робот';
  fuelType: 'Бензин' | 'Дизель' | 'Электро' | 'Гибрид';
  seats: number;
  imageUrl: string;
  additionalImages?: string[];
  features: string[];
  available: boolean;
  rating: number;
  description: string;
}

export interface FilterOptions {
  brand?: string;
  transmission?: string;
  fuelType?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
}
