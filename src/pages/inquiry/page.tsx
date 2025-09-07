
import { useState } from 'react';

export default function InquiryPage() {
  const [searchData, setSearchData] = useState({
    name: '',
    phone: ''
  });
  const [registration, setRegistration] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchData.name.trim() || !searchData.phone.trim()) {
      alert('이름과 전화번호를 모두 입력해주세요.');
      return;
    }

    setLoading(true);
    setNotFound(false);
    setRegistration(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/search-registration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          name: searchData.name.trim(),
          phone: searchData.phone.trim()
        }),
      });

      const data = await response.json();

      if (response.ok && data.registration) {
        setRegistration(data.registration);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              교육문의 답변 확인
            </h1>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 whitespace-nowrap cursor-pointer"
            >
              <i className="ri-home-line mr-2"></i>
              홈페이지로
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-search-line text-blue-600 text-2xl"></i>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              문의 답변 조회
            </h2>
            <p className="text-lg text-gray-600">
              등록하신 정보로 문의 답변을 확인하실 수 있습니다
            </p>
          </div>

          <form onSubmit={handleSearch} className="space-y-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="search-name" className="block text-sm font-semibold text-gray-700 mb-2">
                  성명
                </label>
                <input
                  type="text"
                  id="search-name"
                  value={searchData.name}
                  onChange={(e) => setSearchData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                  placeholder="등록하신 성명을 입력하세요"
                  required
                />
              </div>

              <div>
                <label htmlFor="search-phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  전화번호
                </label>
                <input
                  type="tel"
                  id="search-phone"
                  value={searchData.phone}
                  onChange={(e) => setSearchData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                  placeholder="010-1234-5678"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none whitespace-nowrap cursor-pointer"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  조회 중...
                </div>
              ) : (
                <>
                  <i className="ri-search-line mr-2"></i>
                  답변 조회하기
                </>
              )}
            </button>
          </form>

          {/* 조회 결과 */}
          {registration && (
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                  <i className="ri-check-line text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">등록 정보 확인</h3>
                  <p className="text-gray-600">등록하신 교육 프로그램 정보입니다</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">등록자 정보</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">성명:</span>
                      <span className="font-medium text-gray-900">{registration.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">전화번호:</span>
                      <span className="font-medium text-gray-900">{registration.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">이메일:</span>
                      <span className="font-medium text-gray-900">{registration.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">등록일:</span>
                      <span className="font-medium text-gray-900">
                        {new Date(registration.created_at).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">프로그램 정보</h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-600 block mb-1">선택 프로그램:</span>
                      <span className="font-medium text-blue-600">{registration.program}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 문의사항 */}
              {registration.additional_requests && (
                <div className="bg-white rounded-xl p-6 mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    <i className="ri-question-line mr-2 text-blue-500"></i>
                    문의사항
                  </h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {registration.additional_requests}
                  </p>
                </div>
              )}

              {/* 관리자 답변 */}
              <div className="bg-white rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-3">
                  <i className="ri-customer-service-2-line mr-2 text-green-500"></i>
                  관리자 답변
                </h4>
                {registration.admin_reply ? (
                  <div>
                    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg mb-3">
                      <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
                        {registration.admin_reply}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-500">
                        답변일: {new Date(registration.reply_date).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                    <div className="flex items-center">
                      <i className="ri-time-line text-yellow-600 mr-2"></i>
                      <p className="text-yellow-800 text-sm">
                        관리자 답변을 준비 중입니다. 빠른 시일 내에 답변 드리겠습니다.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 조회 결과 없음 */}
          {notFound && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-error-warning-line text-red-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-red-800 mb-2">조회 결과가 없습니다</h3>
              <p className="text-red-600 mb-4">
                입력하신 정보와 일치하는 등록 내역을 찾을 수 없습니다.
              </p>
              <div className="text-sm text-red-700 bg-red-100 rounded-lg p-4">
                <p className="mb-2"><strong>확인사항:</strong></p>
                <ul className="list-disc list-inside space-y-1 text-left">
                  <li>성명과 전화번호를 정확히 입력하셨는지 확인해주세요</li>
                  <li>등록 시 사용한 정보와 동일한지 확인해주세요</li>
                  <li>문제가 지속되면 관리자에게 문의해주세요</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
