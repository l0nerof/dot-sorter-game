/**
 * Class Vector2D for working with vectors in 2D space
 * Used for position, velocity and acceleration
 */
export class Vector2D {
  x: number;
  y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  /**
   * Add another vector to the current one (mutates the current vector)
   */
  add(v: Vector2D): Vector2D {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  /**
   * Subtract another vector from the current one (mutates the current vector)
   */
  sub(v: Vector2D): Vector2D {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  /**
   * Multiply the vector by a scalar (mutates the current vector)
   */
  mult(n: number): Vector2D {
    this.x *= n;
    this.y *= n;
    return this;
  }

  /**
   * Divide the vector by a scalar (mutates the current vector)
   */
  div(n: number): Vector2D {
    if (n !== 0) {
      this.x /= n;
      this.y /= n;
    }
    return this;
  }

  /**
   * Calculate the length (magnitude) of the vector
   */
  mag(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * Calculate the square of the length (faster than mag(), for comparisons)
   */
  magSq(): number {
    return this.x * this.x + this.y * this.y;
  }

  /**
   * Normalize the vector (make it unit length, length = 1)
   */
  normalize(): Vector2D {
    const m = this.mag();
    if (m !== 0) {
      this.div(m);
    }
    return this;
  }

  /**
   * Limit the length of the vector to the maximum value
   */
  limit(max: number): Vector2D {
    const mSq = this.magSq();
    if (mSq > max * max) {
      this.div(Math.sqrt(mSq));
      this.mult(max);
    }
    return this;
  }

  /**
   * Set the length of the vector
   */
  setMag(len: number): Vector2D {
    this.normalize();
    this.mult(len);
    return this;
  }

  /**
   * Calculate the distance to another vector
   */
  dist(v: Vector2D): number {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Create a copy of the vector
   */
  copy(): Vector2D {
    return new Vector2D(this.x, this.y);
  }

  /**
   * Set the value of the vector
   */
  set(x: number, y: number): Vector2D {
    this.x = x;
    this.y = y;
    return this;
  }

  // ============ Static methods ============

  /**
   * Create a new vector as the difference of two vectors (does not mutate)
   */
  static sub(v1: Vector2D, v2: Vector2D): Vector2D {
    return new Vector2D(v1.x - v2.x, v1.y - v2.y);
  }

  /**
   * Create a new vector as the sum of two vectors (does not mutate)
   */
  static add(v1: Vector2D, v2: Vector2D): Vector2D {
    return new Vector2D(v1.x + v2.x, v1.y + v2.y);
  }

  /**
   * Create a new vector with a random direction
   */
  static random2D(): Vector2D {
    const angle = Math.random() * Math.PI * 2;
    return new Vector2D(Math.cos(angle), Math.sin(angle));
  }

  /**
   * Create a vector with zero coordinates
   */
  static zero(): Vector2D {
    return new Vector2D(0, 0);
  }
}
