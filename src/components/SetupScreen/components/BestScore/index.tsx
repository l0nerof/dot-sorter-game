import { useEffect, useState } from "react";
import type { BestScoreType } from "../../../../types";
import { getBestScore } from "../../../../utils/bestScore";

function BestScore() {
  const [bestScore, setBestScore] = useState<BestScoreType | null>(null);

  useEffect(() => {
    // Load best score on mount
    const score = getBestScore();
    setBestScore(score);
  }, []);

  return (
    bestScore && (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-yellow-400/30 bg-yellow-400/10 p-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏆</span>
          <p className="text-lg font-bold text-yellow-400">
            Найкращий результат
          </p>
        </div>
        <p className="text-3xl font-bold text-white">
          {bestScore.time.toFixed(1)}
          <span className="text-xl text-white/70">с</span>
        </p>
        <p className="text-xs text-white/50">
          {new Date(bestScore.date).toLocaleDateString("uk-UA", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>
    )
  );
}

export default BestScore;
