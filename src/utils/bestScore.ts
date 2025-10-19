import type { BestScoreType } from "../types";

const BEST_SCORE_KEY = "duck-sorter-best-score";

export const getBestScore = (): BestScoreType | null => {
  try {
    const stored = localStorage.getItem(BEST_SCORE_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

export const saveBestScore = (time: number): boolean => {
  try {
    const currentBest = getBestScore();

    // Save if no best score exists or if new time is better (lower)
    if (!currentBest || time < currentBest.time) {
      const newBest: BestScoreType = {
        time,
        date: new Date().toISOString(),
      };
      localStorage.setItem(BEST_SCORE_KEY, JSON.stringify(newBest));
      return true; // New record!
    }

    return false; // Not a new record
  } catch {
    return false;
  }
};
