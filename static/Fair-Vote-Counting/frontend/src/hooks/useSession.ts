/**
 * 세션 관리 훅
 * - 브라우저 세션 ID 생성 및 관리
 * - 로컬 스토리지에 저장하여 새로고침에도 유지
 */
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const SESSION_KEY = 'irv_session_id';

export function useSession() {
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    // 기존 세션 확인 또는 새로 생성
    let stored = localStorage.getItem(SESSION_KEY);

    if (!stored) {
      stored = uuidv4();
      localStorage.setItem(SESSION_KEY, stored);
    }

    setSessionId(stored);
  }, []);

  const clearSession = () => {
    localStorage.removeItem(SESSION_KEY);
    const newId = uuidv4();
    localStorage.setItem(SESSION_KEY, newId);
    setSessionId(newId);
  };

  return { sessionId, clearSession };
}

// 관리자 토큰 저장/조회
const ADMIN_TOKEN_PREFIX = 'irv_admin_';

export function useAdminToken(roomCode: string) {
  const [adminToken, setAdminToken] = useState<string | null>(null);

  useEffect(() => {
    if (roomCode) {
      const stored = localStorage.getItem(`${ADMIN_TOKEN_PREFIX}${roomCode}`);
      setAdminToken(stored);
    }
  }, [roomCode]);

  const saveAdminToken = (token: string) => {
    localStorage.setItem(`${ADMIN_TOKEN_PREFIX}${roomCode}`, token);
    setAdminToken(token);
  };

  const clearAdminToken = () => {
    localStorage.removeItem(`${ADMIN_TOKEN_PREFIX}${roomCode}`);
    setAdminToken(null);
  };

  return { adminToken, saveAdminToken, clearAdminToken };
}
