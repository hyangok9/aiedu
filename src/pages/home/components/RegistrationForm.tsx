import { useState, useEffect } from 'react';

interface Program {
  id: string;
  title: string;
  current_students: number;
  max_students: number;
}

interface RegistrationFormProps {
  selectedProgram: string | null;
  onRegistration: () => void;
}

export default function RegistrationForm({ selectedProgram, onRegistration }: RegistrationFormProps) {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    program_id: selectedProgram || '',
    additional_requests: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    fetchPrograms();
  }, []);

  useEffect(() => {
    if (selectedProgram) {
      setFormData(prev => ({ ...prev, program_id: selectedProgram }));
    }
  }, [selectedProgram]);

  const fetchPrograms = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/get-programs`, {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY}`,
        },
      });
      const data = await response.json();
      setPrograms(data.programs || []);
    } catch (error) {
      console.error('Failed to fetch programs:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.phone.trim() || !formData.email.trim() || !formData.program_id) {
      setSubmitStatus('error');
      setErrorMessage('모든 필수 항목을 입력해주세요.');
      return;
    }

    const selectedProgramData = programs.find(p => p.id === formData.program_id);
    if (selectedProgramData && selectedProgramData.current_students >= selectedProgramData.max_students) {
      setSubmitStatus('error');
      setErrorMessage('선택하신 프로그램이 마감되었습니다.');
      return;
    }

    if (formData.additional_requests.length > 500) {
      setSubmitStatus('error');
      setErrorMessage('기타 요청사항은 500자 이내로 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage('');

    try {
      // Supabase를 통한 등록
      const response = await fetch(`${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/register-student`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '등록에 실패했습니다.');
      }

      // 폼 데이터를 이용한 외부 서비스 등록
      const formDataForSubmit = new FormData();
      formDataForSubmit.append('name', formData.name.trim());
      formDataForSubmit.append('phone', formData.phone.trim());
      formDataForSubmit.append('email', formData.email.trim());
      formDataForSubmit.append('program', programs.find(p => p.id === formData.program_id)?.title || '');
      if (formData.additional_requests.trim()) {
        formDataForSubmit.append('additional_requests', formData.additional_requests.trim());
      }

      await fetch('https://readdy.ai/api/form/d2rofo676ihulu0mpi30', {
        method: 'POST',
        body: formDataForSubmit,
      });

      setSubmitStatus('success');
      onRegistration();
      
      // 결제 안내 모달 표시
      setShowPaymentModal(true);
      
      // Reset form
      setFormData({
        name: '',
        phone: '',
        email: '',
        program_id: selectedProgram || '',
        additional_requests: ''
      });

    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : '등록에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const availablePrograms = programs.filter(p => p.current_students < p.max_students);

  return (
    <section id="registration-form" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            AI 마케팅 전문가 과정 등록
          </h2>
          <p className="text-xl text-gray-600">
            지금 등록하고 AI로 마케팅 혁신을 시작하세요
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 shadow-xl">
          <form 
            id="ai-education-registration" 
            data-readdy-form
            onSubmit={handleSubmit} 
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  성명 *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                  placeholder="성명을 입력하세요"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  전화번호 *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                  placeholder="010-1234-5678"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                이메일 주소 *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="program" className="block text-sm font-semibold text-gray-700 mb-2">
                프로그램 선택 *
              </label>
              <div className="relative">
                <div 
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm bg-white cursor-pointer flex items-center justify-between"
                  onClick={() => {
                    const select = document.getElementById('program-select') as HTMLSelectElement;
                    select?.focus();
                  }}
                >
                  <span className={formData.program_id ? 'text-gray-900' : 'text-gray-500'}>
                    {formData.program_id ? programs.find(p => p.id === formData.program_id)?.title : '프로그램을 선택하세요'}
                  </span>
                  <i className="ri-arrow-down-s-line text-gray-400"></i>
                </div>
                <select
                  id="program-select"
                  name="program"
                  value={formData.program_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, program_id: e.target.value }))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer pr-8"
                  required
                >
                  <option value="">프로그램을 선택하세요</option>
                  {availablePrograms.map((program) => (
                    <option key={program.id} value={program.id}>
                      {program.title} ({program.max_students - program.current_students}자리 남음)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="additional_requests" className="block text-sm font-semibold text-gray-700 mb-2">
                교육 요청사항
              </label>
              <textarea
                id="additional_requests"
                name="additional_requests"
                value={formData.additional_requests}
                onChange={(e) => {
                  if (e.target.value.length <= 500) {
                    setFormData(prev => ({ ...prev, additional_requests: e.target.value }));
                  }
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm resize-none"
                placeholder="특별한 요청사항이나 궁금한 점을 자유롭게 입력해주세요"
                rows={4}
                maxLength={500}
              />
              <div className="text-right mt-1">
                <span className={`text-xs ${formData.additional_requests.length > 450 ? 'text-red-500' : 'text-gray-500'}`}>
                  {formData.additional_requests.length}/500자
                </span>
              </div>
            </div>

            {submitStatus === 'success' && !showPaymentModal && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                  <i className="ri-check-line text-white"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-green-800">등록이 완료되었습니다!</h4>
                  <p className="text-sm text-green-600">AI 마케팅 교육에 오신 것을 환영합니다. 확인 이메일을 발송해드렸습니다.</p>
                </div>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
                  <i className="ri-close-line text-white"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-red-800">등록에 실패했습니다</h4>
                  <p className="text-sm text-red-600">{errorMessage}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none whitespace-nowrap cursor-pointer"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  등록 처리 중...
                </div>
              ) : (
                '지금 등록하기'
              )}
            </button>

            <p className="text-xs text-gray-500 text-center">
              등록하시면 이용약관 및 개인정보보호정책에 동의하는 것으로 간주됩니다. 
              교육 자료와 업데이트를 이메일로 받으실 수 있습니다.
            </p>
          </form>
        </div>
      </div>

      {/* 결제 안내 모달 */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-check-line text-green-600 text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">교육이 접수되었습니다!</h3>
              <div className="bg-blue-50 rounded-xl p-6 mb-6">
                <h4 className="font-semibold text-blue-900 mb-3">입금 안내</h4>
                <div className="space-y-2 text-sm text-blue-800">
                  <div className="flex justify-between">
                    <span>은행:</span>
                    <span className="font-semibold">농협</span>
                  </div>
                  <div className="flex justify-between">
                    <span>계좌번호:</span>
                    <span className="font-semibold">453100-56-046097</span>
                  </div>
                  <div className="flex justify-between">
                    <span>예금주:</span>
                    <span className="font-semibold">전향옥</span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-xs text-yellow-800">
                    <i className="ri-information-line mr-1"></i>
                    입금 완료 후 등록이 최종 완료됩니다.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  document.getElementById('registered-users')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap cursor-pointer"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}