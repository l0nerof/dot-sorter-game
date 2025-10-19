import { useEffect } from "react";

/**
 * Hook for handling canvas resize to match window size
 */
export const useCanvasResize = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
) => {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [canvasRef]);
};
