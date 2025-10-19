import { useCallback, useState } from "react";
import Game from "./components/Game";
import ResultScreen from "./components/ResultScreen";
import SetupScreen from "./components/SetupScreen";

type GameState = "setup" | "playing" | "finished";

function App() {
  const [gameState, setGameState] = useState<GameState>("setup");
  const [duckCount, setDuckCount] = useState(4);
  const [colorCount, setColorCount] = useState(2);
  const [finalTime, setFinalTime] = useState(0);

  const handleStart = (ducks: number, colors: number) => {
    setDuckCount(ducks);
    setColorCount(colors);
    setGameState("playing");
  };

  const handleFinish = useCallback((time: number) => {
    setFinalTime(time);
    setGameState("finished");
  }, []);

  const handleRestart = () => {
    setGameState("setup");
  };

  return (
    <>
      {gameState === "setup" && <SetupScreen onStart={handleStart} />}
      {gameState === "playing" && (
        <Game
          duckCount={duckCount}
          colorCount={colorCount}
          onFinish={handleFinish}
        />
      )}
      {gameState === "finished" && (
        <ResultScreen time={finalTime} onRestart={handleRestart} />
      )}
    </>
  );
}

export default App;
