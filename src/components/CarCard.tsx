
import React from 'react';
import { Link } from 'react-router-dom';
import { Car } from '@/types/car';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

interface CarCardProps {
  car: Car;
}

const CarCard: React.FC<CarCardProps> = ({ car }) => {
  return (
    <Card className="overflow-hidden hover-scale">
      <div className="relative h-48">
        <img 
          src={car.imageUrl} 
          alt={`${car.brand} ${car.model}`} 
          className="object-cover w-full h-full"
        />
        {!car.available && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <span className="px-3 py-1 text-sm font-medium text-white bg-red-500 rounded-md">
              Недоступен
            </span>
          </div>
        )}
        <Badge className="absolute top-2 right-2" variant="secondary">
          {car.year} год
        </Badge>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold truncate">{car.brand} {car.model}</h3>
          <div className="flex items-center">
            <Icon name="Star" className="w-4 h-4 text-yellow-400" />
            <span className="ml-1 text-sm font-medium">{car.rating}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="outline" className="flex items-center">
            <Icon name="Fuel" className="w-3 h-3 mr-1" />
            {car.fuelType}
          </Badge>
          <Badge variant="outline" className="flex items-center">
            <Icon name="GitFork" className="w-3 h-3 mr-1" />
            {car.transmission}
          </Badge>
          <Badge variant="outline" className="flex items-center">
            <Icon name="Users" className="w-3 h-3 mr-1" />
            {car.seats} мест
          </Badge>
        </div>
        
        <div className="text-2xl font-bold text-primary">
          {car.pricePerDay} ₽<span className="text-sm text-gray-500 font-normal"> / день</span>
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-2 p-4 pt-0">
        <Button asChild className="flex-1">
          <Link to={`/car/${car.id}`}>Подробнее</Link>
        </Button>
        <Button variant="outline" className="flex-1" disabled={!car.available}>
          В корзину
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CarCard;
