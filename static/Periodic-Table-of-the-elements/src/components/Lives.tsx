interface LivesProps {
  lives: number;
  maxLives?: number;
}

export const Lives = ({ lives, maxLives = 3 }: LivesProps) => {
  return (
    <div className="lives">
      {Array.from({ length: maxLives }).map((_, index) => (
        <span
          key={index}
          className={`heart ${index < lives ? 'heart-active' : 'heart-empty'}`}
        >
          {index < lives ? '❤️' : '🖤'}
        </span>
      ))}
    </div>
  );
};
