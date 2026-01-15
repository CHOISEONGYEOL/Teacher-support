/**
 * 투표방 생성 페이지 (관리자용)
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { createRoom } from '../utils/api';
import './CreateRoomPage.css';

interface ChoiceInput {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
}

export default function CreateRoomPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [choices, setChoices] = useState<ChoiceInput[]>([
    { id: 1, name: '', description: '', imageUrl: '' },
    { id: 2, name: '', description: '', imageUrl: '' },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const addChoice = () => {
    setChoices([
      ...choices,
      { id: Date.now(), name: '', description: '', imageUrl: '' },
    ]);
  };

  const removeChoice = (id: number) => {
    if (choices.length <= 2) {
      setError('최소 2개의 선택지가 필요합니다');
      return;
    }
    setChoices(choices.filter((c) => c.id !== id));
  };

  const updateChoice = (id: number, field: 'name' | 'description' | 'imageUrl', value: string) => {
    setChoices(
      choices.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const handleImageUpload = (id: number, file: File) => {
    // 파일 크기 제한 (2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('이미지 크기는 2MB 이하여야 합니다');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      updateChoice(id, 'imageUrl', result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (id: number) => {
    updateChoice(id, 'imageUrl', '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 유효성 검사
    if (!title.trim()) {
      setError('투표 제목을 입력해주세요');
      return;
    }

    const validChoices = choices.filter((c) => c.name.trim());
    if (validChoices.length < 2) {
      setError('최소 2개의 선택지를 입력해주세요');
      return;
    }

    setIsSubmitting(true);

    try {
      const room = await createRoom({
        title: title.trim(),
        description: description.trim() || undefined,
        candidates: validChoices.map((c) => ({
          name: c.name.trim(),
          description: c.description.trim() || undefined,
          image_url: c.imageUrl || undefined,
        })),
      });

      // 관리자 토큰 저장
      localStorage.setItem(`irv_admin_${room.room_code}`, room.admin_token);

      // 관리자 대시보드로 이동
      navigate(`/admin/${room.room_code}`);
    } catch (err: any) {
      setError(err.message || '투표방 생성에 실패했습니다');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-room-page">
      <div className="page-header">
        <Link to="/" className="back-button">← 홈으로</Link>
        <h1>📝 새 투표 만들기</h1>
        <p>투표 주제와 선택지를 설정하세요</p>
      </div>

      <div className="container-sm">
        <form onSubmit={handleSubmit} className="create-form card">
          {error && (
            <motion.div
              className="error-message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              ⚠️ {error}
            </motion.div>
          )}

          <div className="input-group">
            <label htmlFor="title">투표 제목 *</label>
            <input
              type="text"
              id="title"
              className="input"
              placeholder="예: 체육대회 종목 선정"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
            />
          </div>

          <div className="input-group">
            <label htmlFor="description">투표 설명 (선택)</label>
            <textarea
              id="description"
              className="input textarea"
              placeholder="투표에 대한 추가 설명을 입력하세요"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={1000}
            />
          </div>

          <div className="candidates-section">
            <div className="section-header">
              <h3>📋 선택지 목록</h3>
              <button
                type="button"
                className="btn btn-outline"
                onClick={addChoice}
              >
                + 선택지 추가
              </button>
            </div>

            <AnimatePresence>
              {choices.map((choice, index) => (
                <motion.div
                  key={choice.id}
                  className="candidate-input"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  layout
                >
                  <div className="candidate-number">{index + 1}</div>
                  <div className="candidate-fields">
                    <input
                      type="text"
                      className="input"
                      placeholder="선택지 이름"
                      value={choice.name}
                      onChange={(e) =>
                        updateChoice(choice.id, 'name', e.target.value)
                      }
                      maxLength={100}
                    />
                    <input
                      type="text"
                      className="input input-small"
                      placeholder="설명 (선택)"
                      value={choice.description}
                      onChange={(e) =>
                        updateChoice(choice.id, 'description', e.target.value)
                      }
                      maxLength={500}
                    />

                    {/* 이미지 업로드 */}
                    <div className="image-upload-section">
                      {choice.imageUrl ? (
                        <div className="image-preview">
                          <img src={choice.imageUrl} alt="미리보기" />
                          <button
                            type="button"
                            className="remove-image-btn"
                            onClick={() => removeImage(choice.id)}
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <label className="image-upload-label">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(choice.id, file);
                            }}
                            hidden
                          />
                          <span className="upload-icon">📷</span>
                          <span>이미지 추가 (선택)</span>
                        </label>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeChoice(choice.id)}
                    title="선택지 삭제"
                  >
                    ✕
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <motion.button
            type="submit"
            className="btn btn-primary btn-large btn-block"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? (
              <>
                <div className="spinner" style={{ width: 20, height: 20 }} />
                생성 중...
              </>
            ) : (
              '🚀 투표방 생성하기'
            )}
          </motion.button>
        </form>
      </div>
    </div>
  );
}
