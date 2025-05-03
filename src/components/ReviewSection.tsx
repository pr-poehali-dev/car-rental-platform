
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Review {
  id: string;
  userName: string;
  rating: number;
  text: string;
  date: string;
}

interface ReviewSectionProps {
  carId: string;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ carId }) => {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      userName: 'Александр К.',
      rating: 5,
      text: 'Отличный автомобиль! Брал на выходные, всё понравилось. Машина в идеальном состоянии, мощная и экономичная.',
      date: '15.04.2025'
    },
    {
      id: '2',
      userName: 'Елена М.',
      rating: 4,
      text: 'Хороший автомобиль, но при получении была небольшая царапина на двери, о которой не предупредили. В остальном всё отлично.',
      date: '02.04.2025'
    },
    {
      id: '3',
      userName: 'Дмитрий Р.',
      rating: 5,
      text: 'Сервис на высоте, автомобиль чистый и в идеальном техническом состоянии. Буду обращаться ещё!',
      date: '25.03.2025'
    }
  ]);

  const [newReview, setNewReview] = useState({
    name: '',
    rating: 5,
    text: ''
  });

  const handleRatingChange = (rating: number) => {
    setNewReview(prev => ({ ...prev, rating }));
  };

  const handleSubmitReview = () => {
    if (newReview.name && newReview.text) {
      const review: Review = {
        id: Date.now().toString(),
        userName: newReview.name,
        rating: newReview.rating,
        text: newReview.text,
        date: new Date().toLocaleDateString('ru-RU')
      };
      
      setReviews([review, ...reviews]);
      setNewReview({ name: '', rating: 5, text: '' });
    }
  };

  const StarRating = ({ rating, onChange }: { rating: number, onChange?: (r: number) => void }) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange && onChange(star)}
            className="focus:outline-none"
          >
            <Icon 
              name="Star" 
              className={`w-6 h-6 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`} 
              fill={star <= rating ? 'currentColor' : 'none'} 
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold">Отзывы</h3>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Icon name="PenLine" className="w-4 h-4 mr-2" />
              Оставить отзыв
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Оставить отзыв</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Ваше имя</label>
                <Input 
                  value={newReview.name}
                  onChange={(e) => setNewReview(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Введите ваше имя" 
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Оценка</label>
                <StarRating rating={newReview.rating} onChange={handleRatingChange} />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Текст отзыва</label>
                <Textarea 
                  value={newReview.text}
                  onChange={(e) => setNewReview(prev => ({ ...prev, text: e.target.value }))}
                  placeholder="Поделитесь вашими впечатлениями" 
                  rows={4}
                />
              </div>
              <Button onClick={handleSubmitReview} disabled={!newReview.name || !newReview.text}>
                Опубликовать отзыв
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="p-4 border rounded-lg bg-white">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-semibold">{review.userName}</div>
                  <div className="text-sm text-gray-500">{review.date}</div>
                </div>
                <StarRating rating={review.rating} />
              </div>
              <p className="text-gray-700">{review.text}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center border rounded-lg bg-gray-50">
          <Icon name="MessageSquare" className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500">Пока нет отзывов.</p>
          <p className="text-gray-500">Будьте первым, кто оставит отзыв об этом автомобиле!</p>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;