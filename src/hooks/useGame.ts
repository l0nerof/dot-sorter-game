import { useEffect, useRef } from "react";
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
  WIN_CHECK_INTERVAL_FRAMES,
} from "../constants/game";
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
} from "../constants/settings";
import { Particle } from "../lib/Particle";
import { Vector2D } from "../lib/Vector2D";

type UseGameProps = {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  duckCount: number;
  colorCount: number;
  mouseRef: React.RefObject<Vector2D>;
  onFinish: (time: number) => void;
  getElapsedTime: () => number;
};

export const useGame = ({
  canvasRef,
  duckCount,
  colorCount,
  mouseRef,
  onFinish,
  getElapsedTime,
}: UseGameProps) => {
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);

  // Initialize particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.width;
    const height = canvas.height;

    const particlesPerColor = Math.floor(duckCount / colorCount);
    const particles: Particle[] = [];

    for (let colorIndex = 0; colorIndex < colorCount; colorIndex++) {
      const color = COLORS[colorIndex];
      for (let i = 0; i < particlesPerColor; i++) {
        let x, y;
        let attempts = 0;
        let validPosition = false;

        while (!validPosition && attempts < MAX_SPAWN_ATTEMPTS) {
          x = Math.random() * (width - CANVAS_MARGIN) + SPAWN_MARGIN;
          y = Math.random() * (height - CANVAS_MARGIN) + SPAWN_MARGIN;
          validPosition = true;

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

        if (!validPosition) {
          x = Math.random() * (width - CANVAS_MARGIN) + SPAWN_MARGIN;
          y = Math.random() * (height - CANVAS_MARGIN) + SPAWN_MARGIN;
        }

        particles.push(new Particle(x!, y!, color));
      }
    }

    particlesRef.current = particles;
  }, [duckCount, colorCount, canvasRef]);

  // Check for victory condition
  const checkWin = (): boolean => {
    const particles = particlesRef.current;
    const groups = new Map<string, Particle[]>();
    particles.forEach((particle) => {
      if (!groups.has(particle.color)) {
        groups.set(particle.color, []);
      }
      groups.get(particle.color)!.push(particle);
    });

    for (const [, group] of groups) {
      const center = new Vector2D(0, 0);
      for (const particle of group) {
        center.add(particle.position);
      }
      center.div(group.length);

      for (const particle of group) {
        const distance = particle.position.dist(center);
        if (distance > GROUP_RADIUS) {
          return false;
        }
      }
    }

    return true;
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
      ctx.fillStyle = CANVAS_BACKGROUND_COLOR;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (const particle of particles) {
        const fleeForce = particle.flee(mouseRef.current!, FLEE_RADIUS);
        const cohesionForce = particle.cohesion(particles, COHESION_RADIUS);
        const separationForce = particle.separation(
          particles,
          SEPARATION_RADIUS,
        );
        const alignForce = particle.align(particles, ALIGN_RADIUS);

        fleeForce.mult(FLEE_WEIGHT);
        cohesionForce.mult(COHESION_WEIGHT);
        separationForce.mult(SEPARATION_WEIGHT);
        alignForce.mult(ALIGN_WEIGHT);

        particle.applyForce(fleeForce);
        particle.applyForce(cohesionForce);
        particle.applyForce(separationForce);
        particle.applyForce(alignForce);

        particle.update(PHYSICS_FRICTION);
        particle.edges(canvas.width, canvas.height);
        particle.draw(ctx);
      }

      const mouseX = mouseRef.current!.x;
      const mouseY = mouseRef.current!.y;

      ctx.strokeStyle = `rgba(255, 255, 255, ${CURSOR_OPACITY_RING})`;
      ctx.lineWidth = CURSOR_LINE_WIDTH;
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, CURSOR_INFLUENCE_RADIUS, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = `rgba(255, 255, 255, ${CURSOR_OPACITY_CROSS})`;
      ctx.lineWidth = CURSOR_LINE_WIDTH;
      ctx.lineCap = "round";

      ctx.beginPath();
      ctx.moveTo(mouseX, mouseY - CURSOR_CROSS_SIZE);
      ctx.lineTo(mouseX, mouseY + CURSOR_CROSS_SIZE);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(mouseX - CURSOR_CROSS_SIZE, mouseY);
      ctx.lineTo(mouseX + CURSOR_CROSS_SIZE, mouseY);
      ctx.stroke();

      frameCount++;
      if (frameCount % WIN_CHECK_INTERVAL_FRAMES === 0) {
        const elapsed = getElapsedTime();
        if (elapsed > MIN_GAME_TIME_SECONDS && checkWin()) {
          cancelAnimationFrame(animationRef.current!);
          onFinish(elapsed);
          return;
        }
      }

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [onFinish, canvasRef, getElapsedTime, mouseRef]);
};
