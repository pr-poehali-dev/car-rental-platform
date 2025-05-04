
// Типы для административной панели

// Тип автомобиля
export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  transmission: string;
  fuelType: string;
  pricePerDay: number;
  status: 'available' | 'unavailable' | 'maintenance';
  imageUrl: string;
  licensePlate: string;
  description?: string;
  features: string[];
  rating: number;
  createdAt: string;
  updatedAt: string;
}

// Тип пользователя
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'manager' | 'user';
  createdAt: string;
  avatarUrl?: string;
}

// Тип бронирования
export interface Booking {
  id: string;
  car: Car | string; // Может быть как полным объектом, так и ID
  customer: User | string; // Может быть как полным объектом, так и ID
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'pending' | 'active' | 'completed' | 'canceled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Статистика по автомобилям
export interface CarStats {
  total: number; // Общее количество
  available: number; // Доступные сейчас
  maintenance: number; // На техобслуживании
  change: number; // Изменение с прошлого периода
}

// Статистика по бронированиям
export interface BookingStats {
  total: number; // Общее количество
  active: number; // Активные сейчас
  pending: number; // Ожидающие
  completed: number; // Завершенные за период
  canceled: number; // Отмененные за период
  change: number; // Изменение с прошлого периода
}

// Статистика по доходам
export interface RevenueStats {
  current: number; // Текущий период (месяц)
  previous: number; // Предыдущий период (месяц)
  change: number; // Изменение в процентах
  currency: string; // Валюта (по умолчанию "₽")
}

// Тип ответа апи с пагинацией
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}
