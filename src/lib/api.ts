
import { Car, Booking, User, CarStats, BookingStats, RevenueStats } from '@/types/admin';

const API_URL = import.meta.env.VITE_API_URL || 'https://api.autorent.example.com';

/**
 * Базовая функция для выполнения API-запросов
 */
async function fetchApi<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('admin_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };
  
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `API error: ${response.status} ${response.statusText}`
      );
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

/**
 * API для работы с дашбордом
 */
export const dashboardApi = {
  // Получение статистики для дашборда
  getStats: async (): Promise<{
    cars: CarStats;
    bookings: BookingStats;
    users: { total: number; change: number };
    revenue: RevenueStats;
  }> => {
    return fetchApi('/admin/dashboard/stats');
  },
  
  // Получение последних бронирований
  getRecentBookings: async (limit = 5): Promise<Booking[]> => {
    return fetchApi(`/admin/bookings?limit=${limit}&sort=-createdAt`);
  },
  
  // Получение популярных автомобилей
  getPopularCars: async (limit = 4): Promise<{
    car: Car;
    occupancyRate: number;
  }[]> => {
    return fetchApi(`/admin/cars/popular?limit=${limit}`);
  },
};

/**
 * API для работы с автомобилями
 */
export const carsApi = {
  // Получение списка автомобилей
  getAll: async (params?: {
    page?: number;
    limit?: number;
    sort?: string;
    brand?: string;
    status?: string;
  }): Promise<{ data: Car[]; total: number; page: number; totalPages: number }> => {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return fetchApi(`/admin/cars?${queryParams.toString()}`);
  },
  
  // Получение одного автомобиля
  getById: async (id: string): Promise<Car> => {
    return fetchApi(`/admin/cars/${id}`);
  },
  
  // Создание автомобиля
  create: async (data: Omit<Car, 'id'>): Promise<Car> => {
    return fetchApi('/admin/cars', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  // Обновление автомобиля
  update: async (id: string, data: Partial<Car>): Promise<Car> => {
    return fetchApi(`/admin/cars/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
  
  // Удаление автомобиля
  delete: async (id: string): Promise<void> => {
    return fetchApi(`/admin/cars/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * API для работы с бронированиями
 */
export const bookingsApi = {
  // Получение списка бронирований
  getAll: async (params?: {
    page?: number;
    limit?: number;
    sort?: string;
    status?: string;
  }): Promise<{ data: Booking[]; total: number; page: number; totalPages: number }> => {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return fetchApi(`/admin/bookings?${queryParams.toString()}`);
  },
  
  // Получение одного бронирования
  getById: async (id: string): Promise<Booking> => {
    return fetchApi(`/admin/bookings/${id}`);
  },
  
  // Создание бронирования
  create: async (data: Omit<Booking, 'id'>): Promise<Booking> => {
    return fetchApi('/admin/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  // Обновление бронирования
  update: async (id: string, data: Partial<Booking>): Promise<Booking> => {
    return fetchApi(`/admin/bookings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
  
  // Удаление бронирования
  delete: async (id: string): Promise<void> => {
    return fetchApi(`/admin/bookings/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * API для авторизации
 */
export const authApi = {
  login: async (email: string, password: string): Promise<{ token: string; user: User }> => {
    return fetchApi('/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  
  logout: async (): Promise<void> => {
    localStorage.removeItem('admin_token');
    return Promise.resolve();
  },
  
  getCurrentUser: async (): Promise<User> => {
    return fetchApi('/admin/auth/me');
  },
};
