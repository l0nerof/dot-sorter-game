import { COLORS } from "../../../../constants/settings";

type ControlsProps = {
  duckCount: number;
  colorCount: number;
  ducksPerColor: number;
  totalDucks: number;
  setDuckCount: (count: number) => void;
  setColorCount: (count: number) => void;
  isValid: boolean;
};

function GameSettings({
  duckCount,
  colorCount,
  ducksPerColor,
  totalDucks,
  setDuckCount,
  setColorCount,
  isValid,
}: ControlsProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="duck-count" className="text-lg text-white/90">
          Кількість точок: <span className="font-bold">{duckCount}</span>
          <span className="ml-2 text-sm text-white/60">
            ({ducksPerColor} на кожен колір)
          </span>
        </label>
        <input
          id="duck-count"
          type="range"
          min="6"
          max="40"
          step="1"
          value={duckCount}
          onChange={(e) => setDuckCount(Number(e.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-white/10 accent-fuchsia-500"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="color-count" className="text-lg text-white/90">
          Кількість кольорів: <span className="font-bold">{colorCount}</span>
        </label>
        <input
          id="color-count"
          type="range"
          min="2"
          max={Math.min(5, COLORS.length)}
          step="1"
          value={colorCount}
          onChange={(e) => setColorCount(Number(e.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-white/10 accent-fuchsia-500"
        />
      </div>

      <div className="flex justify-center gap-4">
        {COLORS.slice(0, colorCount).map((color, index) => (
          <div
            key={index}
            className="size-8 rounded-full"
            style={{
              backgroundColor: color,
              boxShadow: `0 0 20px ${color}`,
            }}
          />
        ))}
      </div>

      {/* Validation feedback */}
      <div
        className={`rounded-lg p-3 text-sm ${
          isValid
            ? "border border-green-500/30 bg-green-500/20 text-green-300"
            : "border border-red-500/30 bg-red-500/20 text-red-300"
        }`}
      >
        {isValid ? (
          <div className="flex items-center gap-2">
            <span>✅</span>
            <span>Налаштування валідні! Гра буде цікавою.</span>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span>⚠️</span>
              <span>Налаштування потребують коригування:</span>
            </div>
            <ul className="list-disc text-xs">
              {duckCount !== totalDucks && (
                <li>
                  Точки мають ділитися рівномірно - оберіть {totalDucks} замість{" "}
                  {duckCount}
                </li>
              )}
              {ducksPerColor < 3 && (
                <li>Мінімум 3 точки на колір (зараз: {ducksPerColor})</li>
              )}
              {ducksPerColor > 8 && (
                <li>Максимум 8 точок на колір (зараз: {ducksPerColor})</li>
              )}
              {totalDucks < 6 && (
                <li>Мінімум 6 точок загалом (зараз: {totalDucks})</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default GameSettings;
