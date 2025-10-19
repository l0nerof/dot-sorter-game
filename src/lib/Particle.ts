import {
  EDGE_BOUNCE_DAMPING,
  PARTICLE_INITIAL_VELOCITY_MULTIPLIER,
  PARTICLE_MAX_FORCE,
  PARTICLE_MAX_SPEED,
  PARTICLE_RADIUS,
} from "../constants/game";
import { Vector2D } from "./Vector2D";

/**
 * Class Particle - autonomous agent with steering behaviors
 * Each particle (point) independently decides how to move
 */
export class Particle {
  position: Vector2D;
  velocity: Vector2D;
  acceleration: Vector2D;
  color: string;
  radius: number;
  maxSpeed: number;
  maxForce: number;

  constructor(x: number, y: number, color: string) {
    this.position = new Vector2D(x, y);
    this.velocity = Vector2D.random2D();
    this.velocity.mult(Math.random() * PARTICLE_INITIAL_VELOCITY_MULTIPLIER);
    this.acceleration = new Vector2D(0, 0);
    this.color = color;
    this.radius = PARTICLE_RADIUS;
    this.maxSpeed = PARTICLE_MAX_SPEED;
    this.maxForce = PARTICLE_MAX_FORCE;
  }

  /**
   * Apply force to the particle (add to acceleration)
   */
  applyForce(force: Vector2D): void {
    this.acceleration.add(force);
  }

  /**
   * Update the particle's position (physics movement)
   */
  update(friction: number = 0.88): void {
    // Update velocity based on acceleration
    this.velocity.add(this.acceleration);
    // Apply friction (damping) to prevent infinite acceleration
    // Increased friction (0.88) to prevent jittering
    this.velocity.mult(friction);
    // Limit velocity
    this.velocity.limit(this.maxSpeed);
    // Update position based on velocity
    this.position.add(this.velocity);
    // Reset acceleration
    this.acceleration.mult(0);
  }

  /**
   * Flee behavior - flee from the target (cursor)
   * The closer the target, the stronger the flee force
   */
  flee(target: Vector2D, fleeRadius: number = 150): Vector2D {
    const desired = Vector2D.sub(this.position, target);
    const distance = desired.mag();

    // If the target is far away, don't react
    if (distance > fleeRadius) {
      return new Vector2D(0, 0);
    }

    // The closer, the stronger the force
    const strength = (fleeRadius - distance) / fleeRadius;

    desired.normalize();
    desired.mult(this.maxSpeed * strength);

    // Steering = desired - velocity (desired direction - current velocity)
    const steer = Vector2D.sub(desired, this.velocity);
    steer.limit(this.maxForce);

    return steer;
  }

  /**
   * Cohesion - pull towards the center of the group
   * Creates cohesion effect
   * Interacts with ALL particles, regardless of color
   */
  cohesion(particles: Particle[], cohesionRadius: number = 100): Vector2D {
    const sum = new Vector2D(0, 0);
    let count = 0;

    for (const other of particles) {
      const d = this.position.dist(other.position);
      // Consider ALL neighbors in the radius (regardless of color)
      if (d > 0 && d < cohesionRadius) {
        sum.add(other.position);
        count++;
      }
    }

    if (count > 0) {
      sum.div(count); // average position
      return this.seek(sum);
    }

    return new Vector2D(0, 0);
  }

  /**
   * Separation - repel from other particles
   * Prevents particles from merging
   */
  separation(particles: Particle[], separationRadius: number = 30): Vector2D {
    const sum = new Vector2D(0, 0);
    let count = 0;

    for (const other of particles) {
      const d = this.position.dist(other.position);
      // Repel from all nearby neighbors
      if (d > 0 && d < separationRadius) {
        const diff = Vector2D.sub(this.position, other.position);
        diff.normalize();
        diff.div(d); // the closer, the stronger
        sum.add(diff);
        count++;
      }
    }

    if (count > 0) {
      sum.div(count);
      sum.normalize();
      sum.mult(this.maxSpeed);
      const steer = Vector2D.sub(sum, this.velocity);
      steer.limit(this.maxForce);
      return steer;
    }

    return new Vector2D(0, 0);
  }

  /**
   * Align - align with the direction of neighbors
   * Creates coordinated movement of the group
   * Interacts with ALL particles, regardless of color
   */
  align(particles: Particle[], alignRadius: number = 50): Vector2D {
    const sum = new Vector2D(0, 0);
    let count = 0;

    for (const other of particles) {
      const d = this.position.dist(other.position);
      // Align with ALL neighbors (regardless of color)
      if (d > 0 && d < alignRadius) {
        sum.add(other.velocity);
        count++;
      }
    }

    if (count > 0) {
      sum.div(count);
      sum.normalize();
      sum.mult(this.maxSpeed);
      const steer = Vector2D.sub(sum, this.velocity);
      steer.limit(this.maxForce);
      return steer;
    }

    return new Vector2D(0, 0);
  }

  /**
   * Seek - move towards the target (helper method for cohesion)
   */
  private seek(target: Vector2D): Vector2D {
    const desired = Vector2D.sub(target, this.position);
    desired.normalize();
    desired.mult(this.maxSpeed);
    const steer = Vector2D.sub(desired, this.velocity);
    steer.limit(this.maxForce);
    return steer;
  }

  /**
   * Keep within canvas boundaries (bounce off edges)
   * Adds margin from edges to make particles easier to catch
   */
  edges(width: number, height: number): void {
    const margin = this.radius; // Keep particles at least radius away from edges

    // Bounce off right edge
    if (this.position.x > width - margin) {
      this.position.x = width - margin;
      this.velocity.x *= -EDGE_BOUNCE_DAMPING; // Reverse direction with damping
    }

    // Bounce off left edge
    if (this.position.x < margin) {
      this.position.x = margin;
      this.velocity.x *= -EDGE_BOUNCE_DAMPING;
    }

    // Bounce off bottom edge
    if (this.position.y > height - margin) {
      this.position.y = height - margin;
      this.velocity.y *= -EDGE_BOUNCE_DAMPING;
    }

    // Bounce off top edge
    if (this.position.y < margin) {
      this.position.y = margin;
      this.velocity.y *= -EDGE_BOUNCE_DAMPING;
    }
  }

  /**
   * Draw the particle on the canvas
   */
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}
