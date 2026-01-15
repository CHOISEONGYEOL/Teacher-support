/**
 * 홈페이지 - 메인 랜딩 페이지
 */
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './HomePage.css';

export default function HomePage() {
  return (
    <div className="home-page">
      {/* 헤더 + 버튼 */}
      <div className="hero-section">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1>🗳️ 투명한 IRV 투표</h1>
          <p className="hero-subtitle">
            공정하고 투명한 의사결정을 위한 순위선택 투표 시스템
          </p>

          <div className="hero-buttons">
            <Link to="/create" className="btn btn-primary">
              📝 투표 만들기
            </Link>
            <Link to="/join" className="btn btn-outline">
              📱 투표 참가하기
            </Link>
          </div>
        </motion.div>
      </div>

      {/* 메인 콘텐츠: 특징 + 진행방법 나란히 */}
      <div className="main-content">
        {/* 왼쪽: IRV 특징 */}
        <div className="features-section">
          <h2>왜 IRV 투표인가요?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <span className="feature-icon">🎯</span>
              <div>
                <h3>과반수 원칙</h3>
                <p>과반수 득표자가 나올 때까지 집계 반복</p>
              </div>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🔄</span>
              <div>
                <h3>사표 방지</h3>
                <p>1순위 탈락해도 2, 3순위가 살아있음</p>
              </div>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🔍</span>
              <div>
                <h3>완전한 투명성</h3>
                <p>동물 닉네임으로 내 표 검증 가능</p>
              </div>
            </div>
            <div className="feature-card">
              <span className="feature-icon">📱</span>
              <div>
                <h3>간편한 참여</h3>
                <p>QR코드 스캔만으로 회원가입 없이 참여</p>
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽: 진행 방법 */}
        <div className="how-it-works">
          <h2>어떻게 진행되나요?</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>투표방 생성</h4>
                <p>주제와 선택지 설정</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>QR 코드로 참가</h4>
                <p>스마트폰으로 스캔</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>순위 투표</h4>
                <p>드래그로 순위 지정</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h4>결과 확인</h4>
                <p>IRV로 공정 집계</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="home-footer">
        교육용 IRV 투표 시스템
      </footer>
    </div>
  );
}
