
import React, { useState } from 'react';
import { Car } from '@/types/car';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';

interface CarGalleryProps {
  car: Car;
}

const CarGallery: React.FC<CarGalleryProps> = ({ car }) => {
  const [activeImage, setActiveImage] = useState(0);
  const allImages = [car.imageUrl, ...(car.additionalImages || [])];

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-lg border bg-white aspect-[16/9]">
        <img 
          src={allImages[activeImage]} 
          alt={`${car.brand} ${car.model}`} 
          className="w-full h-full object-cover transition-transform duration-500"
        />
      </div>

      {allImages.length > 1 && (
        <Carousel className="w-full">
          <CarouselContent>
            {allImages.map((image, index) => (
              <CarouselItem key={index} className="basis-1/5 md:basis-1/5 lg:basis-1/5">
                <div 
                  className={cn(
                    "overflow-hidden rounded-md cursor-pointer border-2 h-24",
                    activeImage === index ? "border-primary" : "border-transparent"
                  )}
                  onClick={() => setActiveImage(index)}
                >
                  <img 
                    src={image} 
                    alt={`${car.brand} ${car.model} - фото ${index + 1}`} 
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0" />
          <CarouselNext className="right-0" />
        </Carousel>
      )}
    </div>
  );
};

export default CarGallery;