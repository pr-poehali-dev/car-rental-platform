
import { Car } from '@/types/car';

export const cars: Car[] = [
  {
    id: '1',
    brand: 'Toyota',
    model: 'Camry',
    year: 2023,
    price: 35000,
    pricePerDay: 1500,
    transmission: 'Автомат',
    fuelType: 'Бензин',
    seats: 5,
    imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=2940&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1614200179396-2bdb77ebf81b?q=80&w=2832&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=2940&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=2940&auto=format&fit=crop'
    ],
    features: ['Климат-контроль', 'Кожаный салон', 'Навигация', 'Парктроник'],
    available: true,
    rating: 4.8,
    description: 'Надежный и комфортный седан для бизнеса и отдыха. Экономичный расход топлива и просторный салон.'
  },
  {
    id: '2',
    brand: 'BMW',
    model: 'X5',
    year: 2022,
    price: 65000,
    pricePerDay: 3200,
    transmission: 'Автомат',
    fuelType: 'Дизель',
    seats: 5,
    imageUrl: 'https://images.unsplash.com/photo-1556189250-72ba954cfc2b?q=80&w=2940&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1556189258-0d8b1e0a2c97?q=80&w=2940&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1635241610248-ef944c0e9fe3?q=80&w=2940&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=2834&auto=format&fit=crop'
    ],
    features: ['Панорамная крыша', 'Подогрев сидений', 'Адаптивный круиз-контроль', 'Премиум аудиосистема'],
    available: true,
    rating: 4.9,
    description: 'Спортивный и престижный кроссовер с мощным двигателем и элегантным интерьером.'
  },
  {
    id: '3',
    brand: 'Volkswagen',
    model: 'Golf',
    year: 2021,
    price: 25000,
    pricePerDay: 1200,
    transmission: 'Механика',
    fuelType: 'Бензин',
    seats: 5,
    imageUrl: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=2940&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1596563950733-e7ecb5dfce4a?q=80&w=2940&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556155092-490a1ba16284?q=80&w=2940&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1635409921234-a0e70e39f2bb?q=80&w=2940&auto=format&fit=crop'
    ],
    features: ['Кондиционер', 'Bluetooth', 'LED фары', 'Задние парктроники'],
    available: true,
    rating: 4.5,
    description: 'Компактный и маневренный хэтчбек с отличной управляемостью и экономичным расходом топлива.'
  },
  {
    id: '4',
    brand: 'Tesla',
    model: 'Model 3',
    year: 2023,
    price: 55000,
    pricePerDay: 2800,
    transmission: 'Автомат',
    fuelType: 'Электро',
    seats: 5,
    imageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=2971&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1554744512-d6c603f27c54?q=80&w=2940&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1594502184342-2e111aafd46f?q=80&w=2832&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1532974297617-c0f05fe48bff?q=80&w=2908&auto=format&fit=crop'
    ],
    features: ['Автопилот', 'Панорамная крыша', 'Сенсорный дисплей', 'Быстрая зарядка'],
    available: true,
    rating: 4.9,
    description: 'Инновационный электромобиль с передовыми технологиями и впечатляющим запасом хода.'
  },
  {
    id: '5',
    brand: 'Mercedes-Benz',
    model: 'E-Class',
    year: 2022,
    price: 60000,
    pricePerDay: 3000,
    transmission: 'Автомат',
    fuelType: 'Гибрид',
    seats: 5,
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=2942&auto=format&fit=crop',
    additionalImages: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=2940&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=2940&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=2940&auto=format&fit=crop'
    ],
    features: ['Массажные сиденья', 'Премиум аудиосистема', 'Адаптивная подвеска', 'Проекционный дисплей'],
    available: false,
    rating: 4.7,
    description: 'Представительский седан с роскошным интерьером и передовыми технологиями безопасности.'
  }
];

export const getBrands = (): string[] => {
  return [...new Set(cars.map(car => car.brand))];
};

export const getTransmissionTypes = (): string[] => {
  return [...new Set(cars.map(car => car.transmission))];
};

export const getFuelTypes = (): string[] => {
  return [...new Set(cars.map(car => car.fuelType))];
};
