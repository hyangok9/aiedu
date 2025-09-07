import { useState } from 'react';

export default function Hero() {
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    phone: '',
    email: '',
    inquiry: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inquiryForm.name.trim() || !inquiryForm.phone.trim() || !inquiryForm.email.trim() || !inquiryForm.inquiry.trim()) {
      setSubmitStatus('error');
      return;
    }

    if (inquiryForm.inquiry.length > 500) {
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    // 이메일로 직접 연결 (mailto 사용)
    const subject = encodeURIComponent('맞춤형 단체 교육문의');
    const body = encodeURIComponent(`
이름: ${inquiryForm.name}
전화번호: ${inquiryForm.phone}
이메일: ${inquiryForm.email}

문의내용:
${inquiryForm.inquiry}
    `);
    
    const mailtoLink = `mailto:hyangok9@gmail.com?subject=${subject}&body=${body}`;
    window.open(mailtoLink);

    setSubmitStatus('success');
    setInquiryForm({ name: '', phone: '', email: '', inquiry: '' });
    
    setTimeout(() => {
      setShowInquiryForm(false);
      setSubmitStatus(null);
    }, 3000);

    setIsSubmitting(false);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://static.readdy.ai/image/3b89c218211ed30c0ec2cd246b0b8a78/2621fdf44902c5fb87869c72ffd3b7d0.jfif')`
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Main Title */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-loose">
              누구나 쉽게<br />
              배우고 써먹는<br />
              AI마케팅 교육
            </h1>

            {/* Features */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-12">
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
                <div className="w-8 h-8 flex items-center justify-center mr-3">
                  <i className="ri-trophy-line text-yellow-400 text-xl"></i>
                </div>
                <span className="text-white font-semibold">AI마케팅 교육원</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
                <div className="w-8 h-8 flex items-center justify-center mr-3">
                  <i className="ri-rocket-2-line text-blue-400 text-xl"></i>
                </div>
                <span className="text-white font-semibold">실무 중심 교육</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
                <div className="w-8 h-8 flex items-center justify-center mr-3">
                  <i className="ri-user-star-line text-green-400 text-xl"></i>
                </div>
                <span className="text-white font-semibold">전문가 양성</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
              <button 
                onClick={() => document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg whitespace-nowrap cursor-pointer"
              >
                교육 프로그램 보기
              </button>
              <button 
                onClick={() => setShowInquiryForm(true)}
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-2 border-white/50 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 whitespace-nowrap cursor-pointer"
              >
                맞춤형 단체 교육문의
              </button>
            </div>
          </div>

          {/* Right Content - Book */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl"></div>
              <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-white/20">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-white mb-2">교육 전문서</h3>
                  <p className="text-sm text-white/80">디지털 마케팅 트랜스포메이션</p>
                </div>
                <div className="relative w-64 h-80 mx-auto mb-4 group-hover:scale-105 transition-transform duration-300">
                  <img 
                    src="https://static.readdy.ai/image/3b89c218211ed30c0ec2cd246b0b8a78/8459953c9fb2331471ed1cb243800620.png"
                    alt="디지털 마케팅 전문서"
                    className="w-full h-full object-cover rounded-lg shadow-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
                </div>
                <button 
                  onClick={() => window.open('https://product.kyobobook.co.kr/detail/S000216842041', '_blank')}
                  className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white py-3 rounded-full font-semibold transition-all duration-300 whitespace-nowrap cursor-pointer text-sm"
                >
                  <i className="ri-shopping-bag-line mr-2"></i>
                  온라인서점
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-8 h-8 flex items-center justify-center">
            <i className="ri-arrow-down-line text-white text-2xl"></i>
          </div>
        </div>
      </div>

      {/* 교육 의뢰 문의 모달 */}
      {showInquiryForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">맞춤형 단체 교육문의</h3>
              <button 
                onClick={() => setShowInquiryForm(false)}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            <form 
              id="corporate-inquiry" 
              data-readdy-form
              onSubmit={handleInquirySubmit} 
              className="space-y-4"
            >
              <div>
                <label htmlFor="inquiry-name" className="block text-sm font-semibold text-gray-700 mb-2">
                  이름 *
                </label>
                <input
                  type="text"
                  id="inquiry-name"
                  name="name"
                  value={inquiryForm.name}
                  onChange={(e) => setInquiryForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                  placeholder="이름을 입력하세요"
                  required
                />
              </div>

              <div>
                <label htmlFor="inquiry-phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  전화번호 *
                </label>
                <input
                  type="tel"
                  id="inquiry-phone"
                  name="phone"
                  value={inquiryForm.phone}
                  onChange={(e) => setInquiryForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                  placeholder="010-1234-5678"
                  required
                />
              </div>

              <div>
                <label htmlFor="inquiry-email" className="block text-sm font-semibold text-gray-700 mb-2">
                  이메일 *
                </label>
                <input
                  type="email"
                  id="inquiry-email"
                  name="email"
                  value={inquiryForm.email}
                  onChange={(e) => setInquiryForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="inquiry-content" className="block text-sm font-semibold text-gray-700 mb-2">
                  문의내용 *
                </label>
                <textarea
                  id="inquiry-content"
                  name="inquiry"
                  value={inquiryForm.inquiry}
                  onChange={(e) => {
                    if (e.target.value.length <= 500) {
                      setInquiryForm(prev => ({ ...prev, inquiry: e.target.value }));
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm resize-none"
                  placeholder="교육 의뢰에 대한 문의사항을 자세히 입력해주세요"
                  rows={4}
                  maxLength={500}
                  required
                />
                <div className="text-right mt-1">
                  <span className={`text-xs ${inquiryForm.inquiry.length > 450 ? 'text-red-500' : 'text-gray-500'}`}>
                    {inquiryForm.inquiry.length}/500자
                  </span>
                </div>
              </div>

              {submitStatus === 'success' && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <i className="ri-check-line text-white"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-800">이메일 프로그램이 열렸습니다!</h4>
                    <p className="text-sm text-green-600">hyangok9@gmail.com으로 문의내용이 전달됩니다.</p>
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
                    <i className="ri-close-line text-white"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-800">문의 접수에 실패했습니다</h4>
                    <p className="text-sm text-red-600">모든 항목을 올바르게 입력해주세요.</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    문의 접수 중...
                  </div>
                ) : (
                  '문의하기'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
