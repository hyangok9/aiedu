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
  status: string;
  recruitment_period: string;
  education_time: string;
  education_location: string;
  recruitment_start_date: string;
  recruitment_end_date: string;
  education_type: string;
}

interface Registration {
  id: string;
  name: string;
  phone: string;
  email: string;
  program: string;
  additional_requests: string;
  admin_reply: string;
  reply_date: string;
  status: string;
  created_at: string;
}

interface Review {
  id: string;
  student_name: string;
  program_title: string;
  rating: number;
  review_text: string;
  created_at: string;
}

export default function AdminPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'programs' | 'inquiries' | 'reviews'>('programs');
  const [editingReply, setEditingReply] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    fetchPrograms();
    fetchRegistrations();
    fetchReviews();
  }, []);

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
    } finally {
      setLoading(false);
    }
  };

  const fetchRegistrations = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/get-registrations`, {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY}`,
        },
      });
      const data = await response.json();
      setRegistrations(data.registrations || []);
    } catch (error) {
      console.error('Failed to fetch registrations:', error);
    }
  };

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
    }
  };

  const handleDeleteProgram = async (programId: string) => {
    if (!confirm('정말로 이 프로그램을 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/delete-program`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ program_id: programId }),
      });

      if (response.ok) {
        await fetchPrograms();
        alert('프로그램이 삭제되었습니다.');
      } else {
        alert('프로그램 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Delete failed:', error);
      alert('프로그램 삭제에 실패했습니다.');
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('정말로 이 후기를 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/delete-review`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ review_id: reviewId }),
      });

      if (response.ok) {
        await fetchReviews();
        alert('후기가 삭제되었습니다.');
      } else {
        alert('후기 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Delete review failed:', error);
      alert('후기 삭제에 실패했습니다.');
    }
  };

  const handleStatusUpdate = async (registrationId: string, newStatus: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/update-registration-status`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          registration_id: registrationId,
          status: newStatus
        }),
      });

      if (response.ok) {
        await fetchRegistrations();
        alert('상태가 업데이트되었습니다.');
      } else {
        alert('상태 업데이트에 실패했습니다.');
      }
    } catch (error) {
      console.error('Status update failed:', error);
      alert('상태 업데이트에 실패했습니다.');
    }
  };

  const handleSendSMS = async (registration: Registration) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/send-sms`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: registration.phone,
          name: registration.name,
          program: registration.program
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('등록완료 문자가 발송되었습니다.');
      } else {
        alert('문자 발송에 실패했습니다.');
      }
    } catch (error) {
      console.error('SMS failed:', error);
      alert('문자 발송에 실패했습니다.');
    }
  };

  const handleReplySubmit = async (registrationId: string) => {
    if (!replyText.trim()) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/update-registration-reply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          registration_id: registrationId,
          admin_reply: replyText.trim()
        }),
      });

      if (response.ok) {
        await fetchRegistrations();
        setEditingReply(null);
        setReplyText('');
        alert('답변이 저장되었습니다.');
      } else {
        alert('답변 저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('Reply failed:', error);
      alert('답변 저장에 실패했습니다.');
    }
  };

  const handleEdit = (program: Program) => {
    setEditingProgram({ ...program });
    setShowAddForm(false);
  };

  const handleAdd = () => {
    setEditingProgram({
      id: '',
      title: '',
      description: '',
      duration: '',
      price: '',
      max_students: 15,
      current_students: 0,
      curriculum: [''],
      highlights: [''],
      image_prompt: '',
      status: 'active',
      recruitment_period: '',
      education_time: '',
      education_location: '',
      recruitment_start_date: '',
      recruitment_end_date: '',
      education_type: '생성형 AI 기초과정'
    });
    setShowAddForm(true);
  };

  const handleSave = async () => {
    if (!editingProgram) return;

    try {
      const method = 'POST';
      const url = showAddForm 
        ? `${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/add-program`
        : `${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/update-program`;

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingProgram),
      });

      if (response.ok) {
        await fetchPrograms();
        setEditingProgram(null);
        setShowAddForm(false);
        alert('저장되었습니다.');
      } else {
        alert('저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('Save failed:', error);
      alert('저장에 실패했습니다.');
    }
  };

  const handleCancel = () => {
    setEditingProgram(null);
    setShowAddForm(false);
  };

  const addCurriculumItem = () => {
    if (!editingProgram) return;
    setEditingProgram({
      ...editingProgram,
      curriculum: [...editingProgram.curriculum, '']
    });
  };

  const removeCurriculumItem = (index: number) => {
    if (!editingProgram) return;
    const newCurriculum = editingProgram.curriculum.filter((_, i) => i !== index);
    setEditingProgram({
      ...editingProgram,
      curriculum: newCurriculum
    });
  };

  const updateCurriculumItem = (index: number, value: string) => {
    if (!editingProgram) return;
    const newCurriculum = [...editingProgram.curriculum];
    newCurriculum[index] = value;
    setEditingProgram({
      ...editingProgram,
      curriculum: newCurriculum
    });
  };

  const addHighlightItem = () => {
    if (!editingProgram) return;
    setEditingProgram({
      ...editingProgram,
      highlights: [...editingProgram.highlights, '']
    });
  };

  const removeHighlightItem = (index: number) => {
    if (!editingProgram) return;
    const newHighlights = editingProgram.highlights.filter((_, i) => i !== index);
    setEditingProgram({
      ...editingProgram,
      highlights: newHighlights
    });
  };

  const updateHighlightItem = (index: number, value: string) => {
    if (!editingProgram) return;
    const newHighlights = [...editingProgram.highlights];
    newHighlights[index] = value;
    setEditingProgram({
      ...editingProgram,
      highlights: newHighlights
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              AI 마케팅 교육원 관리자
            </h1>
            <div className="flex items-center space-x-4">
              {activeTab === 'programs' && (
                <button
                  onClick={handleAdd}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 whitespace-nowrap cursor-pointer"
                >
                  <i className="ri-add-line mr-2"></i>
                  새 프로그램 추가
                </button>
              )}
              <button
                onClick={() => window.location.href = '/'}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 whitespace-nowrap cursor-pointer"
              >
                <i className="ri-home-line mr-2"></i>
                홈페이지로
              </button>
            </div>
          </div>
          
          {/* 탭 메뉴 */}
          <div className="flex space-x-1 mt-6">
            <button
              onClick={() => setActiveTab('programs')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 whitespace-nowrap cursor-pointer ${
                activeTab === 'programs'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <i className="ri-graduation-cap-line mr-2"></i>
              프로그램 관리
            </button>
            <button
              onClick={() => setActiveTab('inquiries')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 whitespace-nowrap cursor-pointer ${
                activeTab === 'inquiries'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <i className="ri-question-answer-line mr-2"></i>
              교육문의 관리
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 whitespace-nowrap cursor-pointer ${
                activeTab === 'reviews'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <i className="ri-star-line mr-2"></i>
              후기 관리
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'programs' ? (
          editingProgram ? (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                {showAddForm ? '새 프로그램 추가' : '프로그램 수정'}
              </h2>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      프로그램 제목
                    </label>
                    <input
                      type="text"
                      value={editingProgram.title}
                      onChange={(e) => setEditingProgram({
                        ...editingProgram,
                        title: e.target.value
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      교육 유형
                    </label>
                    <div className="relative">
                      <div className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer flex items-center justify-between"
                           onClick={() => {
                             const select = document.getElementById('education-type-select') as HTMLSelectElement;
                             select?.focus();
                           }}>
                        <span>{editingProgram.education_type}</span>
                        <i className="ri-arrow-down-s-line text-gray-400"></i>
                      </div>
                      <select
                        id="education-type-select"
                        value={editingProgram.education_type}
                        onChange={(e) => setEditingProgram({
                          ...editingProgram,
                          education_type: e.target.value
                        })}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer pr-8"
                      >
                        <option value="생성형 AI 기초과정">생성형 AI 기초과정</option>
                        <option value="AI활용 마케팅 교육 과정">AI활용 마케팅 교육 과정</option>
                        <option value="AI활용 전문가 과정">AI활용 전문가 과정</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      기간
                    </label>
                    <input
                      type="text"
                      value={editingProgram.duration}
                      onChange={(e) => setEditingProgram({
                        ...editingProgram,
                        duration: e.target.value
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="예: 4주"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      가격
                    </label>
                    <input
                      type="text"
                      value={editingProgram.price}
                      onChange={(e) => setEditingProgram({
                        ...editingProgram,
                        price: e.target.value
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="예: 350,000원"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      최대 수강생 수
                    </label>
                    <input
                      type="number"
                      value={editingProgram.max_students}
                      onChange={(e) => setEditingProgram({
                        ...editingProgram,
                        max_students: parseInt(e.target.value) || 15
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                      max="50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      모집기간
                    </label>
                    <input
                      type="text"
                      value={editingProgram.recruitment_period}
                      onChange={(e) => setEditingProgram({
                        ...editingProgram,
                        recruitment_period: e.target.value
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="예: 2024.12.01 ~ 2024.12.31"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      교육시간
                    </label>
                    <input
                      type="text"
                      value={editingProgram.education_time}
                      onChange={(e) => setEditingProgram({
                        ...editingProgram,
                        education_time: e.target.value
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="예: 매주 토요일 14:00-18:00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      모집시작일
                    </label>
                    <input
                      type="date"
                      value={editingProgram.recruitment_start_date}
                      onChange={(e) => setEditingProgram({
                        ...editingProgram,
                        recruitment_start_date: e.target.value
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    모집종료일
                  </label>
                  <input
                    type="date"
                    value={editingProgram.recruitment_end_date}
                    onChange={(e) => setEditingProgram({
                      ...editingProgram,
                      recruitment_end_date: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    프로그램 설명
                  </label>
                  <textarea
                    value={editingProgram.description}
                    onChange={(e) => setEditingProgram({
                      ...editingProgram,
                      description: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이미지 프롬프트 (AI 이미지 생성용)
                  </label>
                  <textarea
                    value={editingProgram.image_prompt}
                    onChange={(e) => setEditingProgram({
                      ...editingProgram,
                      image_prompt: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                    placeholder="AI가 이미지를 생성할 때 사용할 영어 설명"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      커리큘럼
                    </label>
                    <button
                      onClick={addCurriculumItem}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer"
                    >
                      <i className="ri-add-line mr-1"></i>
                      항목 추가
                    </button>
                  </div>
                  <div className="space-y-2">
                    {editingProgram.curriculum.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => updateCurriculumItem(index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={`커리큘럼 ${index + 1}`}
                        />
                        {editingProgram.curriculum.length > 1 && (
                          <button
                            onClick={() => removeCurriculumItem(index)}
                            className="text-red-600 hover:text-red-700 cursor-pointer"
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      프로그램 특징
                    </label>
                    <button
                      onClick={addHighlightItem}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium cursor-pointer"
                    >
                      <i className="ri-add-line mr-1"></i>
                      항목 추가
                    </button>
                  </div>
                  <div className="space-y-2">
                    {editingProgram.highlights.map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => updateHighlightItem(index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={`특징 ${index + 1}`}
                        />
                        {editingProgram.highlights.length > 1 && (
                          <button
                            onClick={() => removeHighlightItem(index)}
                            className="text-red-600 hover:text-red-700 cursor-pointer"
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-4 pt-6">
                  <button
                    onClick={handleSave}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 whitespace-nowrap cursor-pointer"
                  >
                    <i className="ri-save-line mr-2"></i>
                    저장
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 whitespace-nowrap cursor-pointer"
                  >
                    <i className="ri-close-line mr-2"></i>
                    취소
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs.map((program) => (
                <div key={program.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="relative h-48">
                    <img
                      src={`https://readdy.ai/api/search-image?query=$%7Bprogram.image_prompt%7D&width=400&height=300&seq=${program.id}-admin&orientation=landscape`}
                      alt={program.title}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
                        {program.duration}
                      </span>
                      <div className="text-right">
                        <div className="text-sm font-bold text-blue-600 mb-1">
                          {program.price}
                        </div>
                        <span className="text-sm text-gray-500">
                          {program.current_students}/{program.max_students}명
                        </span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-2">{program.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{program.description}</p>

                    <div className="flex items-center justify-between space-x-2">
                      <button
                        onClick={() => handleEdit(program)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded font-medium text-sm transition-colors duration-200 whitespace-nowrap cursor-pointer"
                      >
                        <i className="ri-edit-line mr-1"></i>
                        수정
                      </button>
                      <button
                        onClick={() => handleDeleteProgram(program.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded font-medium text-sm transition-colors duration-200 whitespace-nowrap cursor-pointer"
                      >
                        <i className="ri-delete-bin-line mr-1"></i>
                        삭제
                      </button>
                      <div className={`text-sm font-medium ${
                        program.current_students >= program.max_students 
                          ? 'text-red-600' 
                          : 'text-green-600'
                      }`}>
                        {program.current_students >= program.max_students ? '마감' : '모집중'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : activeTab === 'inquiries' ? (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">교육문의 관리</h2>
              <p className="text-sm text-gray-600 mt-1">등록자들의 문의사항에 답변하고 상태를 관리해주세요</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      문의자 정보
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      프로그램
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      문의내용
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      등록상태
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      답변상태
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      관리
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {registrations.map((registration) => (
                    <tr key={registration.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{registration.name}</div>
                          <div className="text-sm text-gray-500">{registration.phone}</div>
                          <div className="text-sm text-gray-500">{registration.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{registration.program}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(registration.created_at).toLocaleDateString('ko-KR')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs">
                          {registration.additional_requests || '특별한 문의사항 없음'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {registration.status === 'completed' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            등록완료
                          </span>
                        ) : (
                          <div className="space-y-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              접수완료
                            </span>
                            <div>
                              <button
                                onClick={() => handleStatusUpdate(registration.id, 'completed')}
                                className="text-xs bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded cursor-pointer"
                              >
                                등록완료로 변경
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {registration.admin_reply ? (
                          <div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              답변완료
                            </span>
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(registration.reply_date).toLocaleDateString('ko-KR')}
                            </div>
                          </div>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            답변대기
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-y-2">
                        <div>
                          <button
                            onClick={() => {
                              setEditingReply(registration.id);
                              setReplyText(registration.admin_reply || '');
                            }}
                            className="text-blue-600 hover:text-blue-900 cursor-pointer block"
                          >
                            {registration.admin_reply ? '답변수정' : '답변하기'}
                          </button>
                        </div>
                        {registration.status === 'completed' && (
                          <div>
                            <button
                              onClick={() => handleSendSMS(registration)}
                              className="text-green-600 hover:text-green-900 cursor-pointer text-xs"
                            >
                              <i className="ri-message-2-line mr-1"></i>
                              문자발송
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {registrations.length === 0 && (
                <div className="text-center py-12">
                  <i className="ri-question-answer-line text-4xl text-gray-300 mb-4"></i>
                  <p className="text-gray-500">등록된 문의사항이 없습니다.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">교육생 후기 관리</h2>
              <p className="text-sm text-gray-600 mt-1">교육생들이 작성한 후기를 관리해주세요</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">{review.student_name}</h4>
                      <p className="text-sm text-gray-600">{review.program_title}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className="text-red-600 hover:text-red-800 cursor-pointer"
                    >
                      <i className="ri-delete-bin-line text-lg"></i>
                    </button>
                  </div>
                  
                  <div className="flex items-center mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <i
                        key={star}
                        className={`ri-star-${star <= review.rating ? 'fill' : 'line'} text-yellow-400 text-lg`}
                      ></i>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">({review.rating}/5)</span>
                  </div>
                  
                  <p className="text-gray-700 text-sm leading-relaxed mb-3">
                    {review.review_text}
                  </p>
                  
                  <div className="text-xs text-gray-500">
                    {new Date(review.created_at).toLocaleDateString('ko-KR')}
                  </div>
                </div>
              ))}
            </div>
            
            {reviews.length === 0 && (
              <div className="text-center py-12">
                <i className="ri-star-line text-4xl text-gray-300 mb-4"></i>
                <p className="text-gray-500">등록된 후기가 없습니다.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 답변 작성 모달 */}
      {editingReply && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">문의 답변 작성</h3>
              <button
                onClick={() => {
                  setEditingReply(null);
                  setReplyText('');
                }}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>
            
            <div className="mb-6">
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">문의 내용</h4>
                <p className="text-gray-700 text-sm">
                  {registrations.find(r => r.id === editingReply)?.additional_requests || '특별한 문의사항 없음'}
                </p>
              </div>
              
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                답변 내용
              </label>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-sm resize-none"
                rows={6}
                placeholder="문의자에게 전달할 답변을 작성해주세요..."
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleReplySubmit(editingReply)}
                disabled={!replyText.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 whitespace-nowrap cursor-pointer"
              >
                <i className="ri-send-plane-line mr-2"></i>
                답변 저장
              </button>
              <button
                onClick={() => {
                  setEditingReply(null);
                  setReplyText('');
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 whitespace-nowrap cursor-pointer"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
