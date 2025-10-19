/**
 * Constants for game configuration according to Nature of Code
 */

// Colors for points (ducks)
export const COLORS = [
  "#00FFFF", // Cyan
  "#FF00FF", // Magenta
  "#FFFF00", // Yellow
  "#00FF00", // Green
  "#FF6B00", // Orange
];

// Parameters for points
export const DUCK_RADIUS = 10;
export const MAX_SPEED = 4;
export const MAX_FORCE = 0.15;

// Radiuses for steering behaviors
export const FLEE_RADIUS = 150; // radius of influence of the cursor
export const COHESION_RADIUS = 80; // reduced cohesion radius
export const SEPARATION_RADIUS = 50; // increased separation radius
export const ALIGN_RADIUS = 50; // alignment radius

// Weights for different behaviors (for fine-tuning)
// According to Nature of Code, separation should be the dominant force for peaceful behavior
export const FLEE_WEIGHT = 1.5;
export const COHESION_WEIGHT = 0.1; // almost disabled
export const SEPARATION_WEIGHT = 2.5; // slightly reduced to prevent jittering
export const ALIGN_WEIGHT = 0.0; // completely disabled - points do not synchronize speeds

// Parameters for winning
export const GROUP_RADIUS = 80; // radius for determining the group
export const MIN_CHECK_TIME = 1000; // minimum time before checking for victory (ms)
