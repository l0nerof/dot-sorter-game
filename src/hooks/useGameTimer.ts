import { useCallback, useEffect, useRef, useState } from "react";
import { TIMER_UPDATE_INTERVAL_MS } from "../constants/game";

/**
 * Hook for managing game timer
 * Returns elapsed time in seconds
 */
export const useGameTimer = () => {
  const startTimeRef = useRef<number>(Date.now());
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    // Reset start time on mount
    startTimeRef.current = Date.now();

    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      setTimer(elapsed);
    }, TIMER_UPDATE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  const resetTimer = () => {
    startTimeRef.current = Date.now();
    setTimer(0);
  };

  const getElapsedTime = useCallback(() => {
    return (Date.now() - startTimeRef.current) / 1000;
  }, []);

  return { timer, resetTimer, getElapsedTime };
};
