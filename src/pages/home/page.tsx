import { useState } from 'react';
import Hero from './components/Hero';
import ProgramCards from './components/ProgramCards';
import RegistrationForm from './components/RegistrationForm';
import RegisteredUsers from './components/RegisteredUsers';
import ReviewSlider from './components/ReviewSlider';
import ReviewForm from './components/ReviewForm';

export default function HomePage() {
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);

  const refreshRegistrations = () => {
    // 등록자 목록 새로고침 로직이 필요한 경우 추가
    window.location.reload();
  };

  const refreshReviews = () => {
    // 후기 목록 새로고침
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Marketing Academy
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.location.href = '/admin'}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 whitespace-nowrap cursor-pointer"
              >
                <i className="ri-settings-line mr-2"></i>
                관리자
              </button>
              
              {/* Mobile menu button */}
              <div className="md:hidden">
                <button className="text-gray-700 hover:text-blue-600 cursor-pointer">
                  <i className="ri-menu-line text-2xl"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <Hero />

      {/* Program Cards */}
      <ProgramCards 
        selectedProgram={selectedProgram} 
        onSelectProgram={setSelectedProgram} 
      />

      {/* Registration Form */}
      <RegistrationForm 
        selectedProgram={selectedProgram} 
        onRegistration={refreshRegistrations} 
      />

      {/* Registered Users */}
      <RegisteredUsers />

      {/* Reviews */}
      <ReviewSlider />

      {/* Review Form */}
      <ReviewForm onReviewSubmitted={refreshReviews} />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">AI Marketing Academy</h3>
              <p className="text-gray-300 mb-4">
                AI 기술을 활용한 마케팅 전문가 양성을 위한 체계적인 교육 프로그램을 제공합니다.
              </p>
              <div className="flex space-x-4">
                <a href="http://blog.naver.com/hyangok9" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-green-700 transition-colors">
                  <i className="ri-blogger-line text-white"></i>
                </a>
                <a href="https://www.youtube.com/watch?v=jyrYqUxnM_g" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-700 transition-colors">
                  <i className="ri-youtube-fill text-white"></i>
                </a>
                <a href="http://pf.kakao.com/_xfSkaK" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-yellow-600 transition-colors">
                  <i className="ri-kakao-talk-fill text-white"></i>
                </a>
              </div>
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <h4 className="text-lg font-semibold mb-4">문의하기</h4>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center">
                  <i className="ri-phone-line mr-2"></i>
                  010-2655-8532
                </li>
                <li className="flex items-center">
                  <i className="ri-mail-line mr-2"></i>
                  hyangok9@gmail.com
                </li>
                <li className="flex items-center">
                  <i className="ri-map-pin-line mr-2"></i>
                  대전광역시 서구 괴정로21
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 AI Marketing Academy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
