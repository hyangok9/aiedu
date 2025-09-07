
import { useState, useEffect } from 'react';

interface Registration {
  id: string;
  name: string;
  phone: string;
  program: string;
  status: string;
  created_at: string;
}

export default function RegisteredUsers() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/get-registrations`, {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY}`,
        },
      });
      const data = await response.json();
      // 최대 12개까지 표시
      setRegistrations((data.registrations || []).slice(0, 12));
    } catch (error) {
      console.error('Failed to fetch registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  // 이름 마스킹 함수 (첫 글자는 그대로, 나머지는 *)
  const maskName = (name: string) => {
    if (name.length <= 1) return name;
    return name.charAt(0) + '*'.repeat(name.length - 1);
  };

  // 전화번호 마스킹 함수 (010-****-**00 형태)
  const maskPhone = (phone: string) => {
    // 숫자만 추출
    const numbers = phone.replace(/\\D/g, '');
    if (numbers.length >= 11) {
      return `010-****-**${numbers.slice(-2)}`;
    }
    return '010-****-**00';
  };

  const nextSlide = () => {
    const totalSlides = Math.ceil(registrations.length / 3);
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentSlide(slideIndex);
  };

  if (loading) {
    return (
      <section id="registered-users" className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-1/3 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (registrations.length === 0) {
    return null;
  }

  const totalSlides = Math.ceil(registrations.length / 3);
  const visibleRegistrations = registrations.slice(currentSlide * 3, (currentSlide + 1) * 3);

  return (
    <section id="registered-users" className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            최근 등록자
          </h2>
          <p className="text-lg text-gray-600">
            이미 AI 마케팅 학습을 시작한 분들과 함께하세요
          </p>
        </div>

        {/* 슬라이더 컨테이너 */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleRegistrations.map((registration) => (
              <div
                key={registration.id}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {registration.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {maskName(registration.name)}
                    </h3>
                    <p className="text-sm text-gray-600 flex items-center">
                      <i className="ri-phone-line mr-1"></i>
                      {maskPhone(registration.phone)}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                      {registration.program}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(registration.created_at).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className={`flex items-center ${
                    registration.status === 'completed' ? 'text-green-600' : 'text-blue-600'
                  }`}>
                    <div className={`w-2 h-2 rounded-full mr-2 animate-pulse ${
                      registration.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
                    }`}></div>
                    <span className="text-sm font-medium">
                      {registration.status === 'completed' ? '등록완료' : '접수완료'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 네비게이션 버튼 */}
          {totalSlides > 1 && (
            <>
              <button
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-6 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <i className="ri-arrow-left-s-line text-xl"></i>
              </button>

              <button
                onClick={nextSlide}
                disabled={currentSlide === totalSlides - 1}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-6 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <i className="ri-arrow-right-s-line text-xl"></i>
              </button>
            </>
          )}
        </div>

        {/* 슬라이드 인디케이터 */}
        {totalSlides > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
                  currentSlide === index ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
