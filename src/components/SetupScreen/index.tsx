import { useState } from "react";
import Button from "../Button";
import BestScore from "./components/BestScore";
import GameSettings from "./components/GameSettings";
import Rules from "./components/Rules";

type SetupScreenProps = {
  onStart: (duckCount: number, colorCount: number) => void;
};

function SetupScreen({ onStart }: SetupScreenProps) {
  const [duckCount, setDuckCount] = useState(6); // 3 points per color by default
  const [colorCount, setColorCount] = useState(2);
  // Calculate the number of points per color
  const ducksPerColor = Math.floor(duckCount / colorCount);
  const totalDucks = ducksPerColor * colorCount;

  // Validation: ensure minimum challenge
  const isValidConfiguration = () => {
    // Ducks must be distributed evenly among colors
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
            Dot Sorter Game
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

        <BestScore />

        <Button onClick={handleStart} disabled={!isValidConfiguration()}>
          Почати гру
        </Button>
        <Rules />
      </div>
    </div>
  );
}

export default SetupScreen;
