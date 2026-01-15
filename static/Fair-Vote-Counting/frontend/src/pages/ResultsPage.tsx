/**
 * 결과 페이지 (공개용)
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getResults, type IRVResult } from '../utils/api';
import ResultsVisualization from '../components/ResultsVisualization';
import './ResultsPage.css';

export default function ResultsPage() {
  const { roomCode } = useParams<{ roomCode: string }>();
  const navigate = useNavigate();

  const [result, setResult] = useState<IRVResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!roomCode) return;

    const loadResults = async () => {
      try {
        const data = await getResults(roomCode);
        setResult(data);
      } catch (err: any) {
        setError(err.response?.data?.detail || '결과를 불러올 수 없습니다');
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [roomCode]);

  if (loading) {
    return (
      <div className="results-page">
        <div className="loading-container">
          <div className="spinner" />
          <p>결과 로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="results-page">
        <div className="error-container">
          <h2>⚠️ 결과를 볼 수 없습니다</h2>
          <p>{error || '투표가 아직 종료되지 않았거나 존재하지 않는 투표입니다.'}</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="results-page">
      <div className="page-header">
        <h1>📊 투표 결과</h1>
        <p>{result.room_title}</p>
      </div>

      <div className="container">
        <ResultsVisualization result={result} />
      </div>
    </div>
  );
}
