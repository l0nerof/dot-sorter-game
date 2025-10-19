import { useEffect, useState } from "react";
import { type BestScore, getBestScore } from "../../utils/bestScore";
import Button from "../Button";
import GameSettings from "./components/GameSettings";
import Rules from "./components/Rules";

type SetupScreenProps = {
  onStart: (duckCount: number, colorCount: number) => void;
};

function SetupScreen({ onStart }: SetupScreenProps) {
  const [duckCount, setDuckCount] = useState(6); // 3 points per color by default
  const [colorCount, setColorCount] = useState(2);
  const [bestScore, setBestScore] = useState<BestScore | null>(null);

  useEffect(() => {
    // Load best score on mount
    const score = getBestScore();
    setBestScore(score);
  }, []);

  // Calculate the number of points per color
  const ducksPerColor = Math.floor(duckCount / colorCount);
  const totalDucks = ducksPerColor * colorCount;

  // Validation: ensure minimum challenge
  const isValidConfiguration = () => {
    // Точки мають ділитися рівномірно на кольори
    if (duckCount !== totalDucks) return false;

    // Minimum 3 points per color to create a challenge
    if (ducksPerColor < 3) return false;

    // Minimum 6 points overall
    if (totalDucks < 6) return false;

    // Maximum 8 points per color (to avoid it being too easy)
    if (ducksPerColor > 8) return false;

    return true;
  };

  const handleStart = () => {
    if (isValidConfiguration()) {
      onStart(totalDucks, colorCount);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white">
      <div className="flex max-w-2xl flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 px-12 py-12 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="animate-pulse bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-cyan-400 bg-clip-text text-center text-5xl font-bold text-transparent">
            Duck Sorter Game
          </h1>
          <p className="text-center text-xl text-white/80">
            Керуй мишкою, щоб зібрати точки в групи за кольорами!
          </p>
        </div>

        <GameSettings
          duckCount={duckCount}
          colorCount={colorCount}
          setDuckCount={setDuckCount}
          setColorCount={setColorCount}
          ducksPerColor={ducksPerColor}
          totalDucks={totalDucks}
          isValid={isValidConfiguration()}
        />

        {bestScore && (
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
        )}

        <Button onClick={handleStart} disabled={!isValidConfiguration()}>
          Почати гру
        </Button>
        <Rules />
      </div>
    </div>
  );
}

export default SetupScreen;
