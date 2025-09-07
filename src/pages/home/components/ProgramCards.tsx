
import { useState, useEffect } from 'react';

interface Program {
  id: string;
  title: string;
  description: string;
  duration: string;
  price: string;
  max_students: number;
  current_students: number;
  curriculum: string[];
  highlights: string[];
  image_prompt: string;
  recruitment_period: string;
  education_time: string;
  education_location: string;
  recruitment_start_date: string;
  recruitment_end_date: string;
  education_type: string; // 추가된 필드
}

interface ProgramCardsProps {
  selectedProgram: string | null;
  onSelectProgram: (programId: string | null) => void;
}

export default function ProgramCards({ selectedProgram, onSelectProgram }: ProgramCardsProps) {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/get-programs`, {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY}`,
        },
      });
      const data = await response.json();
      
      // 여러 샘플 프로그램 생성
      const samplePrograms = [
        {
          id: '1',
          title: 'AI 마케팅 기초과정',
          description: 'AI를 활용한 디지털 마케팅의 기초부터 실무까지',
          duration: '4주',
          price: '320,000원',
          max_students: 20,
          current_students: 12,
          curriculum: ['AI 마케팅 개론', 'ChatGPT 활용법', '데이터 분석 기초', '캠페인 최적화'],
          highlights: ['실무 중심 교육', '1:1 멘토링', '수료증 발급'],
          image_prompt: '',
          recruitment_period: '2024.01.01 ~ 2024.01.31',
          education_time: '매주 화, 목 19:00-21:00',
          education_location: '강남 교육센터',
          recruitment_start_date: '2024-01-01',
          recruitment_end_date: '2024-01-31',
          education_type: 'AI 마케팅 기초과정'
        },
        {
          id: '2',
          title: 'AI 콘텐츠 제작 심화과정',
          description: 'AI 도구를 활용한 창의적 콘텐츠 제작 전문가 과정',
          duration: '6주',
          price: '480,000원',
          max_students: 15,
          current_students: 8,
          curriculum: ['AI 이미지 생성', '동영상 편집 AI', '카피라이팅 AI', '브랜딩 전략'],
          highlights: ['포트폴리오 제작', '업계 전문가 특강', '취업 연계 프로그램'],
          image_prompt: '',
          recruitment_period: '2024.02.01 ~ 2024.02.28',
          education_time: '매주 월, 수, 금 19:00-22:00',
          education_location: '홍대 크리에이티브 센터',
          recruitment_start_date: '2024-02-01',
          recruitment_end_date: '2024-02-28',
          education_type: 'AI 콘텐츠 제작 심화과정'
        },
        {
          id: '3',
          title: 'AI 데이터 분석 전문가과정',
          description: 'AI를 활용한 마케팅 데이터 분석 및 인사이트 도출',
          duration: '8주',
          price: '640,000원',
          max_students: 12,
          current_students: 5,
          curriculum: ['머신러닝 기초', '마케팅 데이터 분석', '예측 모델링', '시각화 도구'],
          highlights: ['실제 기업 데이터 활용', '개인 프로젝트', '취업 보장 프로그램'],
          image_prompt: '',
          recruitment_period: '2024.03.01 ~ 2024.03.31',
          education_time: '매주 토, 일 10:00-18:00',
          education_location: '판교 테크노밸리',
          recruitment_start_date: '2024-03-01',
          recruitment_end_date: '2024-03-31',
          education_type: 'AI 데이터 분석 전문가과정'
        },
        {
          id: '4',
          title: 'AI 챗봇 개발과정',
          description: '비즈니스용 AI 챗봇 기획부터 개발까지',
          duration: '5주',
          price: '400,000원',
          max_students: 18,
          current_students: 9,
          curriculum: ['챗봇 기획', 'NLP 기초', '대화형 AI 구축', '배포 및 운영'],
          highlights: ['실무 프로젝트', '기업 협업', '런칭 지원'],
          image_prompt: '',
          recruitment_period: '2024.04.01 ~ 2024.04.30',
          education_time: '매주 화, 목 18:30-21:30',
          education_location: '서초 IT센터',
          recruitment_start_date: '2024-04-01',
          recruitment_end_date: '2024-04-30',
          education_type: 'AI 챗봇 개발과정'
        },
        {
          id: '5',
          title: 'AI 마케팅 전략 CEO과정',
          description: '경영진을 위한 AI 마케팅 전략 수립 과정',
          duration: '3주',
          price: '800,000원',
          max_students: 10,
          current_students: 3,
          curriculum: ['AI 트렌드 분석', '전략 수립', 'ROI 측정', '조직 변화 관리'],
          highlights: ['VIP 과정', '1:1 컨설팅', '네트워킹'],
          image_prompt: '',
          recruitment_period: '2024.05.01 ~ 2024.05.31',
          education_time: '매주 금 14:00-18:00',
          education_location: '강남 비즈니스센터',
          recruitment_start_date: '2024-05-01',
          recruitment_end_date: '2024-05-31',
          education_type: 'AI 마케팅 전략 CEO과정'
        }
      ];
      
      setPrograms(data.programs && data.programs.length > 0 ? data.programs : samplePrograms);
    } catch (error) {
      console.error('Failed to fetch programs:', error);
      // 에러 시에도 샘플 데이터 표시
      const samplePrograms = [
        {
          id: '1',
          title: 'AI 마케팅 기초과정',
          description: 'AI를 활용한 디지털 마케팅의 기초부터 실무까지',
          duration: '4주',
          price: '320,000원',
          max_students: 20,
          current_students: 12,
          curriculum: ['AI 마케팅 개론', 'ChatGPT 활용법', '데이터 분석 기초', '캠페인 최적화'],
          highlights: ['실무 중심 교육', '1:1 멘토링', '수료증 발급'],
          image_prompt: '',
          recruitment_period: '2024.01.01 ~ 2024.01.31',
          education_time: '매주 화, 목 19:00-21:00',
          education_location: '강남 교육센터',
          recruitment_start_date: '2024-01-01',
          recruitment_end_date: '2024-01-31',
          education_type: 'AI 마케팅 기초과정'
        },
        {
          id: '2',
          title: 'AI 콘텐츠 제작 심화과정',
          description: 'AI 도구를 활용한 창의적 콘텐츠 제작 전문가 과정',
          duration: '6주',
          price: '480,000원',
          max_students: 15,
          current_students: 8,
          curriculum: ['AI 이미지 생성', '동영상 편집 AI', '카피라이팅 AI', '브랜딩 전략'],
          highlights: ['포트폴리오 제작', '업계 전문가 특강', '취업 연계 프로그램'],
          image_prompt: '',
          recruitment_period: '2024.02.01 ~ 2024.02.28',
          education_time: '매주 월, 수, 금 19:00-22:00',
          education_location: '홍대 크리에이티브 센터',
          recruitment_start_date: '2024-02-01',
          recruitment_end_date: '2024-02-28',
          education_type: 'AI 콘텐츠 제작 심화과정'
        },
        {
          id: '3',
          title: 'AI 데이터 분석 전문가과정',
          description: 'AI를 활용한 마케팅 데이터 분석 및 인사이트 도출',
          duration: '8주',
          price: '640,000원',
          max_students: 12,
          current_students: 5,
          curriculum: ['머신러닝 기초', '마케팅 데이터 분석', '예측 모델링', '시각화 도구'],
          highlights: ['실제 기업 데이터 활용', '개인 프로젝트', '취업 보장 프로그램'],
          image_prompt: '',
          recruitment_period: '2024.03.01 ~ 2024.03.31',
          education_time: '매주 토, 일 10:00-18:00',
          education_location: '판교 테크노밸리',
          recruitment_start_date: '2024-03-01',
          recruitment_end_date: '2024-03-31',
          education_type: 'AI 데이터 분석 전문가과정'
        }
      ];
      setPrograms(samplePrograms);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (programId: string) => {
    if (expandedCard === programId) {
      setExpandedCard(null);
    } else {
      setExpandedCard(programId);
      onSelectProgram(programId);
    }
  };

  const getRemainingSlots = (program: Program) => {
    return Math.max(0, program.max_students - program.current_students);
  };

  const getProgramStatus = () => {
    return { status: '모집중', color: 'bg-green-500', textColor: 'text-green-800', bgColor: 'bg-green-100' };
  };

  const nextSlide = () => {
    if (currentSlide < Math.ceil(programs.length / 3) - 1) {
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
      <section id="programs" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-300 rounded w-1/2 mx-auto mb-4"></div>
              <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const totalSlides = Math.ceil(programs.length / 3);
  const visiblePrograms = programs.slice(currentSlide * 3, (currentSlide + 1) * 3);

  return (
    <section id="programs" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            교육프로그램 명
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            실무 중심의 체계적인 커리큘럼으로 AI 마케팅 전문가로 성장하세요
          </p>
        </div>

        {/* 슬라이더 컨테이너 */}
        <div className="relative">
          {/* 프로그램 카드들 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visiblePrograms.map((program) => {
              const remainingSlots = getRemainingSlots(program);
              const programStatus = getProgramStatus();
              const canApply = true;
              
              return (
                <div
                  key={program.id}
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                    expandedCard === program.id ? 'ring-4 ring-blue-500 scale-105' : ''
                  }`}
                  onClick={() => handleCardClick(program.id)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <div className="w-full h-full bg-blue-600 flex items-center justify-center">
                      <h4 className="text-2xl font-bold text-white text-center px-4">
                        {program.education_type || program.title}
                      </h4>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className={`${programStatus.color} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
                        {programStatus.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
                        {program.duration}
                      </span>
                      <span className="text-sm font-bold text-blue-600">
                        {program.price}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">{program.title}</h3>
                    <p className="text-gray-600 mb-4">{program.description}</p>

                    {/* 교육 정보 */}
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <i className="ri-calendar-line w-4 h-4 mr-2 text-blue-500"></i>
                        <span className="font-medium">모집기간:</span>
                        <span className="ml-1">{program.recruitment_period}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <i className="ri-time-line w-4 h-4 mr-2 text-green-500"></i>
                        <span className="font-medium">교육시간:</span>
                        <span className="ml-1">{program.education_time}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <i className="ri-map-pin-line w-4 h-4 mr-2 text-red-500"></i>
                        <span className="font-medium">교육장소:</span>
                        <span className="ml-1">{program.education_location}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <i className="ri-user-line w-4 h-4 mr-2 text-purple-500"></i>
                        <span className="font-medium">수강생:</span>
                        <span className="ml-1">{program.current_students}/{program.max_students}명</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <button 
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap cursor-pointer"
                      >
                        자세히 보기
                      </button>
                      <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer">
                        <i className={`ri-arrow-${expandedCard === program.id ? 'up' : 'down'}-s-line text-gray-600`}></i>
                      </div>
                    </div>

                    {expandedCard === program.id && (
                      <div className="mt-6 pt-6 border-t border-gray-200 animate-in slide-in-from-top duration-300">
                        <h4 className="font-semibold text-gray-900 mb-3">커리큘럼:</h4>
                        <ul className="space-y-2 mb-4">
                          {program.curriculum.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              <span className="text-sm text-gray-700">{item}</span>
                            </li>
                          ))}
                        </ul>
                        
                        <h4 className="font-semibold text-gray-900 mb-3">프로그램 특징:</h4>
                        <div className="space-y-2 mb-6">
                          {program.highlights.map((highlight, index) => (
                            <div key={index} className="flex items-center">
                              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-2">
                                <i className="ri-check-line text-white text-xs"></i>
                              </div>
                              <span className="text-sm text-gray-700">{highlight}</span>
                            </div>
                          ))}
                        </div>

                        <button 
                          className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-full font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-300 whitespace-nowrap cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' });
                          }}
                        >
                          {program.title} 등록하기
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
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

        {/* 전체 프로그램 수 표시 */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            총 {programs.length}개의 교육프로그램 ({currentSlide * 3 + 1}-{Math.min((currentSlide + 1) * 3, programs.length)} 표시)
          </p>
        </div>
      </div>
    </section>
  );
}
