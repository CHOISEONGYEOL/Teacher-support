interface ScoreProps {
  score: number;
  combo: number;
}

export const Score = ({ score, combo }: ScoreProps) => {
  return (
    <div className="score-container">
      <div className="score">
        <span className="score-label">점수</span>
        <span className="score-value">{score}</span>
      </div>
      {combo > 1 && (
        <div className="combo">
          <span className="combo-value">{combo}</span>
          <span className="combo-label">COMBO!</span>
        </div>
      )}
    </div>
  );
};
