import { useEffect, useState } from "react";
import { getBestScore, saveBestScore } from "../../utils/bestScore";
import Button from "../Button";
import Hint from "./components/Hint";

type ResultScreenProps = {
  time: number;
  onRestart: () => void;
};

function ResultScreen({ time, onRestart }: ResultScreenProps) {
  // Format the time (seconds with one decimal place)
  const formattedTime = time.toFixed(1);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [previousBest, setPreviousBest] = useState<number | null>(null);

  useEffect(() => {
    // Get previous best before saving
    const oldBest = getBestScore();
    if (oldBest) {
      setPreviousBest(oldBest.time);
    }

    // Save the score and check if it's a new record
    const newRecord = saveBestScore(time);
    setIsNewRecord(newRecord);
  }, [time]);

  return (
    <div className="animate-fadeIn flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#16213e] text-white">
      <div className="animate-slideUp flex max-w-3xl flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 px-12 py-12 shadow-2xl backdrop-blur-xl">
        <h1 className="animate-pulse bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-yellow-400 bg-clip-text text-center text-6xl font-bold text-transparent">
          🎉 Перемога! 🎉
        </h1>

        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-cyan-400/30 bg-black/30 p-8">
          <p className="text-lg tracking-widest text-white/70 uppercase">
            Твій час:
          </p>

          <p className="bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-8xl leading-none font-bold text-transparent">
            {formattedTime}
            <span className="text-5xl">с</span>
          </p>

          {isNewRecord && (
            <div className="animate-bounce rounded-full border border-yellow-400/50 bg-yellow-400/20 px-4 py-2">
              <p className="text-lg font-bold text-yellow-400">
                🏆 Новий рекорд! 🏆
              </p>
            </div>
          )}

          {!isNewRecord && previousBest !== null && (
            <p className="text-sm text-white/50">
              Найкращий час: {previousBest.toFixed(1)}с
            </p>
          )}
        </div>

        <p className="text-2xl leading-relaxed text-white/80">
          {isNewRecord
            ? `Неймовірно! Ти встановив новий рекорд за ${formattedTime} секунд!`
            : `Чудова робота! Ти зібрав усі точки за ${formattedTime} секунд!`}
        </p>

        <Button onClick={onRestart}>Грати ще раз</Button>
        <Hint />
      </div>
    </div>
  );
}

export default ResultScreen;
