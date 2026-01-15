/**
 * 홈페이지 - 메인 랜딩 페이지
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './HomePage.css';

export default function HomePage() {
  return (
    <div className="home-page">
      <div className="hero-section">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>🗳️ 투명한 IRV 투표</h1>
          <p className="hero-subtitle">
            IRV(Instant-Runoff Voting) 시스템으로<br />
            공정하고 투명한 의사결정을 진행하세요
          </p>

          <div className="hero-buttons">
            <Link to="/create" className="btn btn-primary btn-large">
              📝 투표 만들기
            </Link>
            <Link to="/join" className="btn btn-outline btn-large">
              📱 투표 참가하기
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="features-section container">
        <h2 className="text-center">왜 IRV 투표인가요?</h2>

        <div className="features-grid">
          <motion.div
            className="feature-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="feature-icon">🎯</div>
            <h3>과반수 원칙</h3>
            <p>
              단순 다수결과 달리, 과반수 득표자가 나올 때까지
              집계를 반복합니다. 더 많은 유권자의 의사가 반영됩니다.
            </p>
          </motion.div>

          <motion.div
            className="feature-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="feature-icon">🔄</div>
            <h3>사표 방지</h3>
            <p>
              1순위 선택이 탈락해도 2순위, 3순위 선택이
              살아있습니다. 당신의 표는 절대 버려지지 않습니다.
            </p>
          </motion.div>

          <motion.div
            className="feature-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="feature-icon">🔍</div>
            <h3>완전한 투명성</h3>
            <p>
              모든 투표 내역이 동물 닉네임으로 공개됩니다.
              자신의 표가 조작되지 않았음을 직접 검증하세요.
            </p>
          </motion.div>

          <motion.div
            className="feature-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="feature-icon">📱</div>
            <h3>간편한 참여</h3>
            <p>
              QR코드 스캔만으로 즉시 참여! 회원가입 없이
              바로 투표에 참여할 수 있습니다.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="how-it-works container">
        <h2 className="text-center">어떻게 진행되나요?</h2>

        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h4>투표방 생성</h4>
              <p>관리자가 투표 주제와 선택지를 설정합니다</p>
            </div>
          </div>

          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h4>QR 코드로 참가</h4>
              <p>참가자들이 스마트폰으로 QR을 스캔하여 참가합니다</p>
            </div>
          </div>

          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h4>순위 투표</h4>
              <p>드래그 앤 드롭으로 선택지 순위를 정합니다</p>
            </div>
          </div>

          <div className="step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h4>결과 확인</h4>
              <p>IRV 알고리즘으로 공정하게 집계됩니다</p>
            </div>
          </div>
        </div>
      </div>

      <footer className="home-footer">
        <p>교육용 IRV 투표 시스템 | 민주적 의사결정을 배우는 투명한 도구</p>
      </footer>
    </div>
  );
}
