import { useCallback, useRef } from 'react';

type SoundType = 'correct' | 'wrong' | 'combo' | 'gameOver' | 'click';

// Web Audio API를 사용한 간단한 효과음 생성
const createAudioContext = () => {
  return new (window.AudioContext || (window as any).webkitAudioContext)();
};

export const useSound = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = createAudioContext();
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3) => {
    try {
      const ctx = getContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

      gainNode.gain.setValueAtTime(volume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn('Sound playback failed:', e);
    }
  }, [getContext]);

  const playSound = useCallback((sound: SoundType) => {
    switch (sound) {
      case 'correct':
        // 상승하는 두 음
        playTone(523.25, 0.1, 'sine', 0.3); // C5
        setTimeout(() => playTone(659.25, 0.15, 'sine', 0.3), 100); // E5
        break;

      case 'wrong':
        // 낮은 버저음
        playTone(200, 0.3, 'square', 0.2);
        break;

      case 'combo':
        // 상승하는 세 음 (콤보!)
        playTone(523.25, 0.08, 'sine', 0.25);
        setTimeout(() => playTone(659.25, 0.08, 'sine', 0.25), 80);
        setTimeout(() => playTone(783.99, 0.15, 'sine', 0.3), 160); // G5
        break;

      case 'gameOver':
        // 하강하는 음
        playTone(392, 0.2, 'sine', 0.3); // G4
        setTimeout(() => playTone(329.63, 0.2, 'sine', 0.3), 200); // E4
        setTimeout(() => playTone(261.63, 0.4, 'sine', 0.3), 400); // C4
        break;

      case 'click':
        playTone(800, 0.05, 'sine', 0.15);
        break;
    }
  }, [playTone]);

  return { playSound };
};
