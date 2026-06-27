# 🚀 Rocket League 3D - AI Challenge

A browser-based 3D Rocket League game with intelligent AI players.

## Features

✅ **3D Graphics** - Built with Three.js
✅ **Physics Engine** - Cannon.js for realistic collisions
✅ **AI Players** - Intelligent opponents with different roles (goalkeeper, midfielder, forward)
✅ **Player Controls** - WASD for movement, Space to jump, Shift for boost
✅ **Competitive Gameplay** - Blue vs Red team match
✅ **Scoring System** - Goal detection and score tracking
✅ **Real-time Multiplayer** - Player vs 5 AI opponents

## Controls

- **W/A/S/D** - Move the car
- **SPACE** - Jump
- **SHIFT** - Boost (limited energy)
- **MOUSE** - Look around (camera)
- **R** - Reset ball position

## Game Mechanics

### Physics
- Realistic car and ball physics
- Gravity and friction simulation
- Collision detection between players, ball, and arena walls
- Boost mechanic with energy management

### AI System
- **Goalkeeper** - Defensive positioning, intercepts shots
- **Midfielder** - Balanced play, supports both attack and defense
- **Forward** - Aggressive play, focuses on scoring

### Game Rules
- 5-minute matches
- Teams score by hitting the ball into opponent goals
- Blue team (player-controlled goalkeeper) vs Red team
- Match ends when timer runs out

## Technologies

- **Three.js** - 3D rendering
- **Cannon.js** - Physics engine
- **Vanilla JavaScript** - Game logic and AI

## How to Play

1. Open `index.html` in a modern browser (Chrome, Firefox, Edge)
2. Control your car with WASD keys
3. Use SPACE to jump and SHIFT to boost
4. Try to score goals against the AI team
5. Watch the AI teammates for strategic play

## File Structure

```
├── index.html          # Main HTML file
├── src/
│   ├── game.js        # Game manager and main loop
│   ├── renderer.js    # Three.js rendering
│   ├── physics.js     # Cannon.js physics world
│   ├── player.js      # Player class and controls
│   ├── ai.js          # AI player with decision making
│   └── ball.js        # Ball physics and logic
└── README.md          # This file
```

## AI Strategy

The AI system uses:
- **Role-based decision making** - Each player has a specific role
- **Distance-based behaviors** - Different actions based on distance to ball
- **Positioning** - Intelligent positioning based on role and game state
- **Coordination** - Simple team tactics

## Future Enhancements

- [ ] Custom team creation
- [ ] Better AI pathfinding
- [ ] Ball trails and effects
- [ ] Sound effects
- [ ] Multiple difficulty levels
- [ ] Replay system
- [ ] Leaderboards

## Performance

- Optimized for 60 FPS
- Efficient physics simulation
- LOD (Level of Detail) for distant objects

---

**Made for the AI challenge - Let's see what IAs can do! 🎮**
