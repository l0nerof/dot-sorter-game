import { useEffect, useRef, useState } from "react";
import {
  CANVAS_BACKGROUND_COLOR,
  CANVAS_MARGIN,
  CURSOR_CROSS_SIZE,
  CURSOR_INFLUENCE_RADIUS,
  CURSOR_LINE_WIDTH,
  CURSOR_OPACITY_CROSS,
  CURSOR_OPACITY_RING,
  MAX_SPAWN_ATTEMPTS,
  MIN_GAME_TIME_SECONDS,
  MIN_SPAWN_DISTANCE,
  PHYSICS_FRICTION,
  SPAWN_MARGIN,
  TIMER_UPDATE_INTERVAL_MS,
  WIN_CHECK_INTERVAL_FRAMES,
} from "../../constants/game";
import {
  ALIGN_RADIUS,
  ALIGN_WEIGHT,
  COHESION_RADIUS,
  COHESION_WEIGHT,
  COLORS,
  FLEE_RADIUS,
  FLEE_WEIGHT,
  GROUP_RADIUS,
  SEPARATION_RADIUS,
  SEPARATION_WEIGHT,
} from "../../constants/settings";
import { Particle } from "../../lib/Particle";
import { Vector2D } from "../../lib/Vector2D";

type GameProps = {
  duckCount: number;
  colorCount: number;
  onFinish: (time: number) => void;
};

function Game({ duckCount, colorCount, onFinish }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef(new Vector2D(0, 0));
  const animationRef = useRef<number>(0);
  const startTimeRef = useRef<number>(Date.now());
  const [timer, setTimer] = useState(0);

  // Initialize particles (points)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.width;
    const height = canvas.height;

    // Calculate how many points per color
    const particlesPerColor = Math.floor(duckCount / colorCount);
    const particles: Particle[] = [];

    // Create points for each color with better distribution
    for (let colorIndex = 0; colorIndex < colorCount; colorIndex++) {
      const color = COLORS[colorIndex];

      for (let i = 0; i < particlesPerColor; i++) {
        let x, y;
        let attempts = 0;
        let validPosition = false;

        // Try to find a position that's not too close to existing points
        while (!validPosition && attempts < MAX_SPAWN_ATTEMPTS) {
          x = Math.random() * (width - CANVAS_MARGIN) + SPAWN_MARGIN;
          y = Math.random() * (height - CANVAS_MARGIN) + SPAWN_MARGIN;

          validPosition = true;

          // Check distance from existing points
          for (const existingParticle of particles) {
            const distance = Math.sqrt(
              Math.pow(x - existingParticle.position.x, 2) +
                Math.pow(y - existingParticle.position.y, 2),
            );

            if (distance < MIN_SPAWN_DISTANCE) {
              validPosition = false;
              break;
            }
          }

          attempts++;
        }

        // If we couldn't find a good position, use random (fallback)
        if (!validPosition) {
          x = Math.random() * (width - CANVAS_MARGIN) + SPAWN_MARGIN;
          y = Math.random() * (height - CANVAS_MARGIN) + SPAWN_MARGIN;
        }

        particles.push(new Particle(x!, y!, color));
      }
    }

    particlesRef.current = particles;
    startTimeRef.current = Date.now();
  }, [duckCount, colorCount]);

  // Update the timer
  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      setTimer(elapsed);
    }, TIMER_UPDATE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  // Tracking the mouse position
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
  }, []);

  // Check for victory condition
  const checkWin = (): boolean => {
    const particles = particlesRef.current;

    // Group points by color
    const groups = new Map<string, Particle[]>();
    particles.forEach((particle) => {
      if (!groups.has(particle.color)) {
        groups.set(particle.color, []);
      }
      groups.get(particle.color)!.push(particle);
    });

    // Check each group
    for (const [, group] of groups) {
      // Calculate the center of the group
      const center = new Vector2D(0, 0);
      for (const particle of group) {
        center.add(particle.position);
      }
      center.div(group.length);

      // Check if all points in the group are close to the center
      for (const particle of group) {
        const distance = particle.position.dist(center);
        if (distance > GROUP_RADIUS) {
          return false; // at least one point is far away
        }
      }
    }

    return true; // all groups are collected!
  };

  // Main game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const particles = particlesRef.current;
    let frameCount = 0;

    const gameLoop = () => {
      // Clear the canvas
      ctx.fillStyle = CANVAS_BACKGROUND_COLOR;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw each particle
      for (const particle of particles) {
        // Apply steering behaviors
        const fleeForce = particle.flee(mouseRef.current, FLEE_RADIUS);
        const cohesionForce = particle.cohesion(particles, COHESION_RADIUS);
        const separationForce = particle.separation(
          particles,
          SEPARATION_RADIUS,
        );
        const alignForce = particle.align(particles, ALIGN_RADIUS);

        // Apply weights to forces
        fleeForce.mult(FLEE_WEIGHT);
        cohesionForce.mult(COHESION_WEIGHT);
        separationForce.mult(SEPARATION_WEIGHT);
        alignForce.mult(ALIGN_WEIGHT);

        // Add all forces
        particle.applyForce(fleeForce);
        particle.applyForce(cohesionForce);
        particle.applyForce(separationForce);
        particle.applyForce(alignForce);

        // Update the position with physics friction
        // This prevents "jagged" behavior of groups and jittering
        particle.update(PHYSICS_FRICTION);
        particle.edges(canvas.width, canvas.height);

        // Draw the particle
        particle.draw(ctx);
      }

      // Draw the custom cursor
      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;

      // Circle around the cursor (radius of influence)
      ctx.strokeStyle = `rgba(255, 255, 255, ${CURSOR_OPACITY_RING})`;
      ctx.lineWidth = CURSOR_LINE_WIDTH;
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, CURSOR_INFLUENCE_RADIUS, 0, Math.PI * 2);
      ctx.stroke();

      // Plus cursor
      ctx.strokeStyle = `rgba(255, 255, 255, ${CURSOR_OPACITY_CROSS})`;
      ctx.lineWidth = CURSOR_LINE_WIDTH;
      ctx.lineCap = "round";

      // Vertical line of the plus
      ctx.beginPath();
      ctx.moveTo(mouseX, mouseY - CURSOR_CROSS_SIZE);
      ctx.lineTo(mouseX, mouseY + CURSOR_CROSS_SIZE);
      ctx.stroke();

      // Horizontal line of the plus
      ctx.beginPath();
      ctx.moveTo(mouseX - CURSOR_CROSS_SIZE, mouseY);
      ctx.lineTo(mouseX + CURSOR_CROSS_SIZE, mouseY);
      ctx.stroke();

      // Check for victory (not every frame, but periodically)
      frameCount++;
      if (frameCount % WIN_CHECK_INTERVAL_FRAMES === 0) {
        // Check only after minimum game time
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        if (elapsed > MIN_GAME_TIME_SECONDS && checkWin()) {
          // Victory!
          cancelAnimationFrame(animationRef.current!);
          onFinish(elapsed);
          return;
        }
      }

      // Next frame
      animationRef.current = requestAnimationFrame(gameLoop);
    };

    // Start the game loop
    gameLoop();

    // Cleaning
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [onFinish]);

  // Set the size of the canvas
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
  }, []);

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
