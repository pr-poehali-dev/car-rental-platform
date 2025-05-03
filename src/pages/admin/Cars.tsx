
import React, { useState } from 'react';
import { cars } from '@/data/cars';
import { Car } from '@/types/car';
import { Link } from 'react-router-dom';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import Icon from '@/components/ui/icon';

const AdminCars: React.FC = () => {
  const [carsList, setCarsList] = useState<Car[]>(cars);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const { toast } = useToast();
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const filteredCars = carsList.filter(car => 
    car.brand.toLowerCase().includes(searchQuery.toLowerCase()) || 
    car.model.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const openDeleteDialog = (car: Car) => {
    setSelectedCar(car);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteCar = () => {
    if (selectedCar) {
      setCarsList(carsList.filter(car => car.id !== selectedCar.id));
      setIsDeleteDialogOpen(false);
      toast({
        title: "Автомобиль удален",
        description: `${selectedCar.brand} ${selectedCar.model} был успешно удален.`,
      });
    }
  };
  
  const toggleAvailability = (carId: string) => {
    setCarsList(carsList.map(car => {
      if (car.id === carId) {
        return { ...car, available: !car.available };
      }
      return car;
    }));
    
    const car = carsList.find(c => c.id === carId);
    if (car) {
      toast({
        title: car.available ? "Автомобиль снят с публикации" : "Автомобиль опубликован",
        description: `${car.brand} ${car.model} ${car.available ? 'снят с публикации' : 'доступен для бронирования'}`,
      });
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Управление автомобилями</h1>
        <Button asChild>
          <Link to="/admin/cars/new">
            <Icon name="Plus" className="h-4 w-4 mr-2" />
            Добавить автомобиль
          </Link>
        </Button>
      </div>
      
      <Card className="p-4 mb-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="relative">
            <Input
              placeholder="Поиск автомобилей..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10"
            />
            <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Icon name="Filter" className="h-4 w-4 mr-2" />
              Фильтр
            </Button>
            <Button variant="outline" size="sm">
              <Icon name="ArrowDownUp" className="h-4 w-4 mr-2" />
              Сортировка
            </Button>
          </div>
          
          <div className="text-sm text-gray-600 flex items-center justify-end">
            Всего автомобилей: {filteredCars.length}
          </div>
        </div>
      </Card>
      
      <div className="bg-white rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Автомобиль</TableHead>
              <TableHead>Год</TableHead>
              <TableHead>Цена/день</TableHead>
              <TableHead>Трансмиссия</TableHead>
              <TableHead>Топливо</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCars.map((car, index) => (
              <TableRow key={car.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded overflow-hidden mr-3">
                      <img 
                        src={car.imageUrl} 
                        alt={`${car.brand} ${car.model}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium">{car.brand} {car.model}</div>
                      <div className="text-xs text-gray-500">ID: {car.id}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{car.year}</TableCell>
                <TableCell>{car.pricePerDay} ₽</TableCell>
                <TableCell>{car.transmission}</TableCell>
                <TableCell>{car.fuelType}</TableCell>
                <TableCell>
                  <Badge variant={car.available ? "default" : "secondary"}>
                    {car.available ? 'Активен' : 'Неактивен'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Icon name="MoreVertical" className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to={`/car/${car.id}`} target="_blank" className="flex items-center">
                          <Icon name="ExternalLink" className="h-4 w-4 mr-2" />
                          Просмотр на сайте
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={`/admin/cars/edit/${car.id}`} className="flex items-center">
                          <Icon name="Edit" className="h-4 w-4 mr-2" />
                          Редактировать
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleAvailability(car.id)} className="flex items-center">
                        <Icon name={car.available ? "EyeOff" : "Eye"} className="h-4 w-4 mr-2" />
                        {car.available ? 'Снять с публикации' : 'Опубликовать'}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => openDeleteDialog(car)}
                        className="text-red-600 flex items-center"
                      >
                        <Icon name="Trash2" className="h-4 w-4 mr-2" />
                        Удалить
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Диалог подтверждения удаления */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить автомобиль?</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить {selectedCar?.brand} {selectedCar?.model}? Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Отмена
            </Button>
            <Button variant="destructive" onClick={handleDeleteCar}>
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCars;
