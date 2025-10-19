# Dot Sorter Game

An interactive game demonstrating the principles of **swarm behavior** and autonomous agents. Use your mouse to gather colored dots into groups!

## 🎮 How to Play

1.  **Move your mouse** — the dots will flee from the cursor.
2.  **Group by color** — guide the dots so that each color forms a cohesive group.
3.  **Be fast** — the quicker you sort them, the better your score!

## 🧠 Game Concepts

### Swarm Behavior

The game illustrates how complex coordination can emerge from simple local rules—similar to a flock of birds or a school of fish.

### Autonomous Agents

Each dot is an independent agent that reacts to its environment and other nearby agents, creating natural, dynamic group behavior.

### Steering Behaviors

The game uses the following steering behaviors (inspired by [The Nature of Code](https://natureofcode.com/autonomous-agents/)):

- **Flee** — escape from the cursor.
- **Cohesion** — move toward the center of its own group (same color).
- **Separation** — avoid colliding with other dots.
- **Align** — align movement direction with neighbors.

## 🛠️ Tech Stack

- **React** + **TypeScript** + **Vite**
- **Canvas API** for rendering (no external libraries)
- Custom **Vector2D** class for vector math
- Custom physics based on steering behaviors

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run the dev server
npm run dev

# Build for production
npm run build
```

## 📁 Project Structure

```
src/
├── components/         # React components for different game screens
│   ├── Game/           # Main game screen
│   ├── SetupScreen/    # Initial setup screen
│   └── ResultScreen/   # Screen to show results
├── hooks/              # Custom React hooks for game logic
│   ├── useGame.ts      # Core game loop and logic
│   ├── useGameTimer.ts # Timer management
│   ├── useMouseTracking.ts # Tracks mouse position on the canvas
│   └── useCanvasResize.ts  # Resizes canvas to fit the window
├── lib/                # Core classes
│   ├── Particle.ts     # Autonomous agent class
│   └── Vector2D.ts     # Vector math library
├── constants/          # Game constants
│   ├── game.ts         # General game constants
│   └── settings.ts     # Behavior and difficulty settings
├── utils/              # Utility functions
└── App.tsx             # Main component for state management
```

## 🎯 Implementation Features

- **Vector Math** — All position and force calculations are vector-based.
- **Game Loop** — Uses `requestAnimationFrame` for smooth animation.
- **Steering Forces** — Each agent calculates forces based on its surroundings.
- **Automatic Win Condition** — The game detects when all groups are successfully formed.

## 📚 Resources

- [The Nature of Code - Autonomous Agents](https://natureofcode.com/autonomous-agents/)

## ⚙️ Configuration

You can tweak the game's behavior by modifying the constants in `src/constants/settings.ts`:

- `FLEE_RADIUS` — cursor's influence radius.
- `COHESION_RADIUS` — radius for attracting same-colored dots.
- `SEPARATION_RADIUS` — radius for repelling other dots.
- `GROUP_RADIUS` — radius for determining if a group is formed.

---

Created with 💙 as a test assignment.
