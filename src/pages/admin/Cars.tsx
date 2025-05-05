}import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Car } from '@/types/admin';
import { carsApi } from '@/lib/api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Функция для экспорта данных в CSV
const exportToCSV = (cars: Car[]) => {
  // Определяем заголовки
  const headers = [
    'ID',
    'Марка',
    'Модель',
    'Год',
    'Трансмиссия',
    'Топливо',
    'Цена/день',
    'Статус',
    'Гос.номер',
    'Рейтинг',
    'Создан'
  ].join(',');
  
  // Формируем строки данных
  const rows = cars.map((car) => [
    car.id,
    `"${car.brand}"`,
    `"${car.model}"`,
    car.year,
    `"${car.transmission}"`,
    `"${car.fuelType}"`,
    car.pricePerDay,
    `"${car.status}"`,
    `"${car.licensePlate}"`,
    car.rating,
    car.createdAt
  ].join(','));
  
  // Объединяем в CSV текст
  const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows.join('\n')}`;
  
  // Создаем ссылку и скачиваем файл
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `cars_export_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Функция для экспоرта данных в JSON
const exportToJSON = (cars: Car[]) => {
  const jsonString = JSON.stringify(cars, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `cars_export_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Функция для преобразования CSV в массив объектов
const parseCSV = (csvText: string): any[] => {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',').map((header) => header.trim());
  
  return lines.slice(1).filter((line) => line.trim()).map((line) => {
    const values = line.split(',');
    return headers.reduce((obj, header, i) => {
      // Обработка кавычек и преобразование типов
      let value = values[i];
      if (value) {
        value = value.trim();
        if (value.startsWith('