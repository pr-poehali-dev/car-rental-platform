
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Car } from '@/types/admin';
import { carsApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

// Схема валидации формы
const carFormSchema = z.object({
  brand: z.string().min(1, 'Марка обязательна'),
  model: z.string().min(1, 'Модель обязательна'),
  year: z.coerce.number()
    .min(1950, 'Год должен быть не ранее 1950')
    .max(new Date().getFullYear() + 1, 'Год не может быть в будущем'),
  transmission: z.string().min(1, 'Тип трансмиссии обязателен'),
  fuelType: z.string().min(1, 'Тип топлива обязателен'),
  pricePerDay: z.coerce.number().min(1, 'Цена должна быть больше 0'),
  status: z.enum(['available', 'unavailable', 'maintenance']),
  licensePlate: z.string().min(1, 'Номер автомобиля обязателен'),
  description: z.string().optional(),
  features: z.array(z.string()).default([]),
  imageUrl: z.string().optional(),
});

type CarFormValues = z.infer<typeof carFormSchema>;

// Опции для селекторов
const transmissionOptions = ['Автомат', 'Механика', 'Робот', 'Вариатор'];
const fuelOptions = ['Бензин', 'Дизель', 'Электро', 'Гибрид'];
const statusOptions = [
  { value: 'available', label: 'Доступен' },
  { value: 'unavailable', label: 'Недоступен' },
  { value: 'maintenance', label: 'Техобслуживание' },
];

// Функция для преобразования данных из формы в формат API и наоборот
const mapCarToFormValues = (car: Car): CarFormValues => ({
  brand: car.brand,
  model: car.model,
  year: car.year,
  transmission: car.transmission,
  fuelType: car.fuelType,
  pricePerDay: car.pricePerDay,
  status: car.status,
  licensePlate: car.licensePlate,
  description: car.description || '',
  features: car.features,
  imageUrl: car.imageUrl,
});

interface CarFormProps {
  mode: 'create' | 'edit';
}

const CarForm: React.FC<CarFormProps> = ({ mode }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [featureInput, setFeatureInput] = useState<string>('');

  const defaultValues: Partial<CarFormValues> = {
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    transmission: '',
    fuelType: '',
    pricePerDay: 0,
    status: 'available',
    licensePlate: '',
    description: '',
    features: [],
    imageUrl: '',
  };

  // Инициализация формы
  const form = useForm<CarFormValues>({
    resolver: zodResolver(carFormSchema),
    defaultValues,
  });

  // Загрузка данных автомобиля при редактировании
  useEffect(() => {
    const fetchCar = async () => {
      if (mode === 'edit' && id) {
        try {
          setLoading(true);
          const car = await carsApi.getById(id);
          const formValues = mapCarToFormValues(car);
          
          // Установка значений формы
          Object.entries(formValues).forEach(([key, value]) => {
            form.setValue(key as keyof CarFormValues, value);
          });
          
          // Установка превью изображения
          if (car.imageUrl) {
            setImagePreview(car.imageUrl);
          }
        } catch (error) {
          console.error('Failed to fetch car details:', error);
          toast({
            title: 'Ошибка загрузки',
            description: 'Не удалось загрузить информацию об автомобиле',
            variant: 'destructive',
          });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCar();
  }, [id, mode, form]);

  // Обработка загрузки изображения
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      form.setValue('imageUrl', previewUrl); // Временно устанавливаем URL для превью
    }
  };

  // Добавление и удаление характеристик автомобиля
  const addFeature = () => {
    if (featureInput.trim()) {
      const currentFeatures = form.getValues('features');
      form.setValue('features', [...currentFeatures, featureInput.trim()]);
      setFeatureInput('');
    }
  };

  const removeFeature = (index: number) => {
    const currentFeatures = form.getValues('features');
    form.setValue('features', currentFeatures.filter((_, i) => i !== index));
  };

  // Отправка формы
  const onSubmit = async (data: CarFormValues) => {
    try {
      setLoading(true);
      
      // В реальном сценарии здесь был бы код для загрузки изображения
      // и получения URL от сервера. Сейчас мы просто используем imageUrl из формы
      const carData = {
        ...data,
        imageUrl: data.imageUrl || 'https://via.placeholder.com/400x225?text=Автомобиль',
      };
      
      let result;
      if (mode === 'create') {
        result = await carsApi.create(carData);
        toast({
          title: 'Автомобиль создан',
          description: `${result.brand} ${result.model} успешно добавлен`,
        });
      } else if (id) {
        result = await carsApi.update(id, carData);
        toast({
          title: 'Автомобиль обновлен',
          description: `${result.brand} ${result.model} успешно обновлен`,
        });
      }
      
      // Перенаправление на страницу со списком автомобилей
      navigate('/admin/cars');
    } catch (error) {
      console.error('Failed to save car:', error);
      toast({
        title: 'Ошибка',
        description: mode === 'create' 
          ? 'Не удалось создать автомобиль' 
          : 'Не удалось обновить информацию об автомобиле',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {mode === 'create' ? 'Добавление автомобиля' : 'Редактирование автомобиля'}
        </h1>
        <Button variant="outline" onClick={() => navigate('/admin/cars')}>
          <Icon name="ArrowLeft" className="h-4 w-4 mr-2" />
          Назад к списку
        </Button>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Основная информация</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 grid-cols-1 md:grid-cols-2">
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Марка</FormLabel>
                    <FormControl>
                      <Input placeholder="Mercedes-Benz" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Модель</FormLabel>
                    <FormControl>
                      <Input placeholder="E-класс" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Год выпуска</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="2023"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="licensePlate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Государственный номер</FormLabel>
                    <FormControl>
                      <Input placeholder="А123АА99" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="transmission"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Трансмиссия</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите тип трансмиссии" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {transmissionOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="fuelType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Тип топлива</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите тип топлива" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {fuelOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="pricePerDay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Цена в день (₽)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="5000"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Статус</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите статус" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Описание и характеристики</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Описание</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Подробное описание автомобиля..."
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Добавьте подробное описание автомобиля, его особенности и преимущества.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div>
                <FormLabel>Характеристики</FormLabel>
                <div className="flex mt-2 mb-4">
                  <Input
                    placeholder="Добавить характеристику..."
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    className="mr-2"
                  />
                  <Button type="button" onClick={addFeature}>
                    Добавить
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.watch('features').map((feature, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary"
                      className="flex items-center gap-1 py-1 px-3"
                    >
                      {feature}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 rounded-full p-0 ml-1"
                        onClick={() => removeFeature(index)}
                      >
                        <Icon name="X" className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                  {form.watch('features').length === 0 && (
                    <div className="text-gray-500 text-sm">
                      Добавьте характеристики автомобиля (кондиционер, кожаный салон и т.д.)
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Изображение</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                <div>
                  <FormLabel htmlFor="imageUpload">Загрузить изображение</FormLabel>
                  <div className="mt-2">
                    <Input
                      id="imageUpload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                  <FormDescription>
                    Рекомендуемый размер: 800x450px, JPG или PNG
                  </FormDescription>
                </div>
                
                <div>
                  <div className="h-40 border rounded-md bg-gray-50 flex items-center justify-center overflow-hidden">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Предпросмотр"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="text-gray-400 flex flex-col items-center">
                        <Icon name="Image" className="h-12 w-12 mb-2" />
                        <span>Предпросмотр изображения</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={() => navigate('/admin/cars')}>
              Отмена
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Icon name="Loader2" className="mr-2 h-4 w-4 animate-spin" />
                  Сохранение...
                </>
              ) : (
                <>
                  <Icon name="Save" className="mr-2 h-4 w-4" />
                  {mode === 'create' ? 'Создать автомобиль' : 'Сохранить изменения'}
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CarForm;
