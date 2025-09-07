import { useState } from 'react';

interface ReviewFormProps {
  onReviewSubmitted: () => void;
}

export default function ReviewForm({ onReviewSubmitted }: ReviewFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    rating: 5,
    review_text: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.phone.trim() || !formData.review_text.trim()) {
      setSubmitStatus('error');
      setErrorMessage('성명, 전화번호, 후기 내용을 입력해주세요.');
      return;
    }

    if (formData.review_text.length > 500) {
      setSubmitStatus('error');
      setErrorMessage('후기는 500자 이내로 작성해주세요.');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage('');

    try {
      const response = await fetch(`${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/submit-review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.review) {
        setSubmitStatus('success');
        onReviewSubmitted();
        
        // Reset form and close
        setTimeout(() => {
          setFormData({
            name: '',
            phone: '',
            email: '',
            rating: 5,
            review_text: ''
          });
          setIsOpen(false);
          setSubmitStatus(null);
        }, 2000);
      } else {
        throw new Error(result.error || '후기 작성에 실패했습니다.');
      }

    } catch (error) {
      console.error('Review submission error:', error);
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : '후기 작성에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        type="button"
        onClick={() => setFormData(prev => ({ ...prev, rating: i + 1 }))}
        className={`text-2xl transition-colors duration-200 cursor-pointer ${
          i < formData.rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
        }`}
      >
        <i className={`ri-star-${i < formData.rating ? 'fill' : 'line'}`}></i>
      </button>
    ));
  };

  if (!isOpen) {
    return (
      <div className="text-center py-8">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 cursor-pointer whitespace-nowrap"
        >
          <i className="ri-edit-line mr-2"></i>
          후기 작성하기
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">교육생 후기 작성</h3>
          <button
            onClick={() => {
              setIsOpen(false);
              setSubmitStatus(null);
              setErrorMessage('');
            }}
            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer"
          >
            <i className="ri-close-line text-gray-600"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center mb-2">
              <i className="ri-information-line text-blue-600 mr-2"></i>
              <span className="text-sm font-semibold text-blue-800">등록 확인</span>
            </div>
            <p className="text-sm text-blue-700">
              교육 등록 시 사용한 성명과 전화번호를 입력해주세요. 등록된 교육생만 후기를 작성할 수 있습니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="review-name" className="block text-sm font-semibold text-gray-700 mb-2">
                성명 *
              </label>
              <input
                type="text"
                id="review-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                placeholder="등록 시 사용한 성명"
                required
              />
            </div>

            <div>
              <label htmlFor="review-phone" className="block text-sm font-semibold text-gray-700 mb-2">
                전화번호 *
              </label>
              <input
                type="tel"
                id="review-phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                placeholder="등록 시 사용한 전화번호"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="review-email" className="block text-sm font-semibold text-gray-700 mb-2">
              이메일 주소
            </label>
            <input
              type="email"
              id="review-email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
              placeholder="이메일 주소 (선택사항)"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              평점 *
            </label>
            <div className="flex items-center space-x-1">
              {renderStars()}
              <span className="ml-3 text-sm text-gray-600">
                ({formData.rating}점)
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="review-text" className="block text-sm font-semibold text-gray-700 mb-2">
              후기 내용 *
            </label>
            <textarea
              id="review-text"
              value={formData.review_text}
              onChange={(e) => {
                if (e.target.value.length <= 500) {
                  setFormData(prev => ({ ...prev, review_text: e.target.value }));
                }
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm resize-none"
              placeholder="교육에 대한 솔직한 후기를 작성해주세요"
              rows={5}
              maxLength={500}
              required
            />
            <div className="text-right mt-1">
              <span className={`text-xs ${formData.review_text.length > 450 ? 'text-red-500' : 'text-gray-500'}`}>
                {formData.review_text.length}/500자
              </span>
            </div>
          </div>

          {submitStatus === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                <i className="ri-check-line text-white"></i>
              </div>
              <div>
                <h4 className="font-semibold text-green-800">후기가 작성되었습니다!</h4>
                <p className="text-sm text-green-600">소중한 후기 감사합니다. 검토 후 게시됩니다.</p>
              </div>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
                <i className="ri-close-line text-white"></i>
              </div>
              <div>
                <h4 className="font-semibold text-red-800">후기 작성에 실패했습니다</h4>
                <p className="text-sm text-red-600">{errorMessage}</p>
              </div>
            </div>
          )}

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setSubmitStatus(null);
                setErrorMessage('');
              }}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold transition-all duration-300 cursor-pointer whitespace-nowrap"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  작성 중...
                </div>
              ) : (
                '후기 작성하기'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
