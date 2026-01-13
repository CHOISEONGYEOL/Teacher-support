interface TimerProps {
  timeLeft: number;
  totalTime: number;
}

export const Timer = ({ timeLeft, totalTime }: TimerProps) => {
  const percentage = (timeLeft / totalTime) * 100;
  const isLow = timeLeft <= 10;

  return (
    <div className={`timer ${isLow ? 'timer-low' : ''}`}>
      <div className="timer-bar">
        <div
          className="timer-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="timer-text">{timeLeft}초</span>
    </div>
  );
};
