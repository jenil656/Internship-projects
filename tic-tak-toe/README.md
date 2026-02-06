#  Tic-Tac-Toe Game

A modern, feature-rich Tic-Tac-Toe game with advanced gameplay modes, visual themes, and full responsive design.

## Features

### Core Gameplay
- **Player vs Player (PvP)** - Classic two-player mode
- **Player vs AI** - Three difficulty levels:
  - Easy: Random moves
  - Medium: Strategic gameplay
  - Impossible: Minimax algorithm (unbeatable)
- **Tournament Mode** - Best of 5 competition with win tracking

### Visual Customization
- **5 Themes**: Neon Cyberpunk, Sunset Vaporwave, Deep Ocean, Mystic Forest, Cyber Light
- **6 Skin Options**: Classic X/O, Fire vs Ice, Sun vs Moon, Rocket vs UFO, Star vs Heart, Skull vs Ghost
- **Animated Background** with parallax effects
- **Smooth Animations** for all interactions

### Game Features
- Score tracking (Wins, Draws)
- Move history with replay capability
- Undo functionality
- Achievement system (8 unlockable achievements)
- Sound effects and background music
- Winning line animation
- Customizable player names

### User Interface
- Fully responsive design (320px to 4K screens)
- Touch-friendly controls
- Keyboard navigation support
- Accessibility features
- Print-friendly layout

## Technologies Used

- **HTML5** - Semantic structure
- **CSS3** - Modern styling with CSS Grid, Flexbox, and animations
- **Vanilla JavaScript** - No frameworks, pure ES6+
- **Web Audio API** - Sound effects and music
- **Local Storage** - Save game progress and settings

## Responsive Design

Optimized breakpoints for:
- Mobile phones (≤600px)
- Small phones (≤400px)
- Tablets (≤768px)
- Desktops (>768px)
- Landscape orientation support

## How to Play

1. Open `index.html` in a web browser
2. Choose game mode (PvP or vs AI)
3. Optionally enable Tournament mode for best of 5
4. Click cells to place your symbol
5. First to get 3 in a row wins!

### Controls
- **Click/Tap** - Place symbol
- **Undo Button** - Reverse last move
- **Restart Button** - New round
- **Theme Button** - Cycle through visual themes
- **Skins Button** - Change game symbols
- **Sound/Music Buttons** - Toggle audio
- **History Button** - View move log
- **Achievements Button** - Check progress

## Achievements

- **First Blood** - Win your first game
- **Machine Breaker** - Beat AI on Impossible
- **Speedester** - Win in under 10 seconds
- **Invincible** - Win 5 games in a row
- **Draw Master** - Achieve 3 draws
- **Completionist** - Try all skins
- **passionated Player** - Play 20 games
- **Theme Explorer** - Try all themes

##  Key Implementation Highlights

### AI Algorithm
The "Impossible" difficulty uses the Minimax algorithm to evaluate all possible game states and choose the optimal move, making it unbeatable when playing optimally.

### Responsive Layout
- Mobile-first approach
- Flexible grid system for game board
- Adaptive spacing and sizing
- Scrollable content on small screens

### Performance
- Efficient DOM manipulation
- CSS animations over JavaScript
- Optimized event listeners
- Debounced resize handlers

## Design Features

- **Modern UI/UX** - Clean, intuitive interface
- **Visual Feedback** - Hover effects, animations, sound
- **Theme Consistency** - Color-coordinated across all themes
- **Accessibility** - Focus states, keyboard navigation, reduced motion support


##  Live Demo
- Before contributing, explore the live version of the project to understand features, UI flow, and behavior:

  - Live Demo (GitHub Pages)
  ```bash
  https://jenil656.github.io/Internship-projects/tic-tak-toe/
  ```
  - This helps ensure your changes align with the existing design and functionality.

## How to Contribute

- 1. Fork the Repository
     - Click the Fork button on GitHub to create your own copy of the project.

- 2. Clone Your Fork
  ```bash
        git clone https://github.com/your-username/Internship-projects.git
        cd Internship-projects/weather 
    ```
- 3. Create a New Branch
    - Always work on a separate branch:
      ```bash
          git checkout -b feature/your-feature-name
      ```

