import type { StudyTopic } from '../types';

interface TopicInfo {
  id: StudyTopic;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  available: boolean;
}

const topics: TopicInfo[] = [
  {
    id: 'periodic-table',
    icon: '⚛️',
    title: '주기율표',
    subtitle: '원소 기호 · 이름 · 원자 번호 · 원자가',
    description: '원소의 기본 정보를 학습하고 테스트해보세요',
    available: true,
  },
  {
    id: 'molecule',
    icon: '🧪',
    title: '화학 반응식 분자 맞추기',
    subtitle: '반응물 · 생성물 분자 이름',
    description: '화학 반응식에서 분자를 맞춰보세요',
    available: true,
  },
  {
    id: 'coefficient',
    icon: '🔢',
    title: '화학 반응식 계수 맞추기',
    subtitle: '반응식 균형 맞추기',
    description: '화학 반응식의 계수를 맞춰 균형을 잡아보세요',
    available: true,
  },
  {
    id: 'formula-reading',
    icon: '📖',
    title: '화학식 읽기',
    subtitle: '화학식 ↔ 이름 변환',
    description: '화학식을 읽고 이름을 맞춰보세요',
    available: true,
  },
];

interface LandingPageProps {
  onSelectTopic: (topic: StudyTopic) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const LandingPage = ({ onSelectTopic, isDarkMode, onToggleTheme }: LandingPageProps) => {
  return (
    <div className="landing-page">
      <button className="theme-toggle" onClick={onToggleTheme} title={isDarkMode ? '라이트 모드' : '다크 모드'}>
        {isDarkMode ? '☀️' : '🌙'}
      </button>

      <div className="landing-header">
        <h1>화학 학습 퀴즈</h1>
        <p className="landing-subtitle">재미있게 화학을 공부해보세요!</p>
      </div>

      <div className="topic-selection">
        {topics.map(topic => (
          <div
            key={topic.id}
            className={`topic-card ${!topic.available ? 'topic-disabled' : ''}`}
            onClick={() => topic.available && onSelectTopic(topic.id)}
          >
            <div className="topic-icon">{topic.icon}</div>
            <div className="topic-content">
              <h2>{topic.title}</h2>
              <p className="topic-subtitle">{topic.subtitle}</p>
              <p className="topic-description">{topic.description}</p>
            </div>
            {!topic.available && (
              <div className="coming-soon-badge">준비 중</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
