import { useRef } from "react";
import { useCanvasResize } from "../../hooks/useCanvasResize";
import { useGame } from "../../hooks/useGame";
import { useGameTimer } from "../../hooks/useGameTimer";
import { useMouseTracking } from "../../hooks/useMouseTracking";

type GameProps = {
  duckCount: number;
  colorCount: number;
  onFinish: (time: number) => void;
};

function Game({ duckCount, colorCount, onFinish }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { timer, getElapsedTime } = useGameTimer();
  const mouseRef = useMouseTracking(canvasRef);
  useCanvasResize(canvasRef);
  useGame({
    canvasRef,
    duckCount,
    colorCount,
    mouseRef,
    onFinish,
    getElapsedTime,
  });

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#1a1a2e]">
      <canvas ref={canvasRef} className="block cursor-none" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 font-mono text-[120px] font-bold text-white/10 select-none">
        {timer.toFixed(1)}
      </div>
      <div className="animate-fadeInHint pointer-events-none absolute top-8 left-1/2 z-20 -translate-x-1/2 rounded-xl border border-white/10 bg-black/20 p-4 text-lg text-white/80 backdrop-blur-md select-none">
        Рухай мишкою, щоб зібрати точки за кольорами
      </div>
    </div>
  );
}

export default Game;
