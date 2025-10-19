/**
 * Game constants - magic numbers extracted for better maintainability
 */

// Canvas and spawning
export const CANVAS_MARGIN = 40; // Margin from canvas edges for spawning
export const SPAWN_MARGIN = 20; // Actual spawn margin (CANVAS_MARGIN / 2)
export const MIN_SPAWN_DISTANCE = 60; // Minimum distance between particles at spawn
export const MAX_SPAWN_ATTEMPTS = 100; // Maximum attempts to find valid spawn position

// Cursor visualization
export const CURSOR_INFLUENCE_RADIUS = 30; // Visual radius around cursor
export const CURSOR_CROSS_SIZE = 12; // Size of the cursor crosshair
export const CURSOR_LINE_WIDTH = 2; // Width of cursor lines
export const CURSOR_OPACITY_RING = 0.3; // Opacity of cursor influence ring
export const CURSOR_OPACITY_CROSS = 0.9; // Opacity of cursor crosshair

// Game mechanics
export const WIN_CHECK_INTERVAL_FRAMES = 60; // Check win condition every N frames (~1 second at 60fps)
export const MIN_GAME_TIME_SECONDS = 1; // Minimum time before checking win condition
export const PHYSICS_FRICTION = 0.88; // Friction/damping for particle movement

// Timer
export const TIMER_UPDATE_INTERVAL_MS = 100; // Update timer every 100ms for smoothness

// Particle defaults (can be overridden in Particle class)
export const PARTICLE_RADIUS = 10;
export const PARTICLE_MAX_SPEED = 7.5;
export const PARTICLE_MAX_FORCE = 0.1;
export const PARTICLE_INITIAL_VELOCITY_MULTIPLIER = 1.5;

// Canvas rendering
export const CANVAS_BACKGROUND_COLOR = "#1a1a2e";
export const EDGE_BOUNCE_DAMPING = 0.8; // Velocity multiplier when bouncing off edges
