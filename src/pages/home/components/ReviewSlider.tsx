
import { useState, useEffect } from 'react';

interface Review {
  id: string;
  student_name: string;
  program_title: string;
  rating: number;
  review_text: string;
  created_at: string;
}

export default function ReviewSlider() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/get-reviews`, {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY}`,
          },
        });
        const data = await response.json();
        setReviews(data.reviews || []);
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  useEffect(() => {
    if (reviews.length > 0) {
      const maxIndex = Math.ceil(reviews.length / 2) - 1;
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [reviews.length]);

  // 이름 마스킹 함수 (첫 글자는 그대로, 나머지는 *)
  const maskName = (name: string) => {
    if (name.length <= 1) return name;
    return name.charAt(0) + '*'.repeat(name.length - 1);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i
        key={i}
        className={`ri-star-${i < rating ? 'fill' : 'line'} text-yellow-400`}
      ></i>
    ));
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-1/3 mx-auto mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                  <div key={i} className="h-64 bg-gray-300 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return null;
  }

  // 2개씩 그룹으로 나누기
  const reviewGroups = [];
  for (let i = 0; i < reviews.length; i += 2) {
    reviewGroups.push(reviews.slice(i, i + 2));
  }

  const maxIndex = reviewGroups.length - 1;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            교육생 후기
          </h2>
          <p className="text-lg text-gray-600">
            실제 수강생들의 생생한 후기를 확인해보세요
          </p>
        </div>

        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {reviewGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="w-full flex-shrink-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  {group.map((review) => (
                    <div key={review.id} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                          {review.student_name.charAt(0).toUpperCase()}
                        </div>
                        
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {maskName(review.student_name)}
                        </h3>
                        
                        <div className="flex items-center justify-center mb-3">
                          {renderStars(review.rating)}
                        </div>
                        
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full mb-4">
                          {review.program_title}
                        </span>
                        
                        <blockquote className="text-sm text-gray-700 leading-relaxed mb-4 italic line-clamp-4">
                          "{review.review_text}"
                        </blockquote>
                        
                        <div className="text-xs text-gray-500">
                          {new Date(review.created_at).toLocaleDateString('ko-KR')}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* 빈 카드로 채우기 (2개 미만일 경우) */}
                  {group.length < 2 && (
                    <div className="invisible md:block">
                      <div className="bg-gray-100 rounded-2xl p-8 h-full opacity-50"></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Navigation dots */}
          {reviewGroups.length > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {reviewGroups.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
                    index === currentIndex 
                      ? 'bg-blue-500 scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Navigation arrows */}
          {reviewGroups.length > 1 && (
            <>
              <button
                onClick={() => setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-all duration-300 cursor-pointer"
              >
                <i className="ri-arrow-left-s-line text-gray-600 text-xl"></i>
              </button>
              
              <button
                onClick={() => setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-all duration-300 cursor-pointer"
              >
                <i className="ri-arrow-right-s-line text-gray-600 text-xl"></i>
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
