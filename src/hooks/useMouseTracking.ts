import { useEffect, useRef } from "react";
import { Vector2D } from "../lib/Vector2D";

/**
 * Hook for tracking mouse position on canvas
 * Returns ref to current mouse position
 */
export const useMouseTracking = (
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
) => {
  const mouseRef = useRef(new Vector2D(0, 0));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    return () => canvas.removeEventListener("mousemove", handleMouseMove);
  }, [canvasRef]);

  return mouseRef;
};
