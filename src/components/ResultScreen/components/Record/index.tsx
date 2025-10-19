import type { BestScoreType } from "../../../../types";

type RecordProps = {
  isNewRecord: boolean;
  previousBest: BestScoreType | null;
};

function Record({ isNewRecord, previousBest }: RecordProps) {
  return (
    <>
      {isNewRecord && (
        <div className="animate-bounce rounded-full border border-yellow-400/50 bg-yellow-400/20 px-4 py-2">
          <p className="text-lg font-bold text-yellow-400">
            🏆 Новий рекорд! 🏆
          </p>
        </div>
      )}

      {!isNewRecord && previousBest !== null && (
        <p className="text-sm text-white/50">
          Найкращий час: {previousBest.time.toFixed(1)}с
        </p>
      )}
    </>
  );
}

export default Record;
