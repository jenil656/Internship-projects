# SkyCast - Weather Dashboard

A feature-rich, modern weather application with stunning UI/UX, advanced animations, and comprehensive weather data visualization.

## 🌟 Features

### Core Features
- **Live Weather Data**: Real-time weather information from OpenWeatherMap API
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Temperature Units**: Switch between Celsius and Fahrenheit
- **Geolocation**: Automatic location detection

### Advanced Features

#### 1. Air Quality Index (AQI) Dashboard
- Real-time air quality monitoring
- Color-coded AQI levels (Good to Hazardous)
- Detailed pollutant breakdown (PM2.5, PM10, NO₂, CO)
- Beautiful gauge visualization

#### 2. Smart Clothing & Activity Advisor
- Temperature-based clothing recommendations
- Weather-appropriate activity suggestions
- Humidity and wind speed considerations

#### 3. Interactive Weather Maps
- Multiple map layers (Clouds, Precipitation, Temperature)
- Powered by Leaflet.js
- Interactive pan and zoom

#### 4. Extended 5-Day Forecast
- Daily temperature highs and lows
- Weather icons and descriptions
- Smooth animations

#### 5. Hourly Temperature Graph
- 24-hour temperature trends
- Interactive Chart.js visualization
- Hover tooltips with detailed data

#### 6. Favorites System
- Save favorite cities to localStorage
- Quick access sidebar
- One-click weather retrieval

#### 7. Sun & Moon Tracking
- Sunrise and sunset times
- Moon phase calculator
- Visual sun progress indicator

#### 8. Dynamic Thermostat UI Themes
- Temperature-reactive color schemes:
  - **Freezing** (< 0°C): Icy Blue theme
  - **Cold** (0-15°C): Cool Teal theme
  - **Warm** (16-29°C): Sunny Orange theme
  - **Hot** (> 30°C): Fiery Red theme

#### 9. Share Weather Snapshot
- Generate beautiful weather cards
- Download as PNG image
- Share on social media

#### 10. Detailed Atmosphere Stats
- UV Index with visual indicator
- Wind speed and direction
- Humidity percentage
- Visibility distance
- Atmospheric pressure
- Precipitation levels

### UI/UX Enhancements
- **Smooth Animations**: CSS transitions and keyframe animations
- **Glassmorphism Effects**: Modern frosted glass aesthetics
- **Gradient Accents**: Dynamic color gradients
- **Micro-interactions**: Hover effects and state changes
- **Weather Particles**: Animated rain and snow effects
- **Custom Typography**: Orbitron and Sora font pairing
- **Loading Screens**: Elegant loading animations

##  Setup Instructions

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- OpenWeatherMap API key (free tier available)

### Installation

1. **Clone or Download** this project to your local machine

2. **Get an API Key**:
   - Visit [OpenWeatherMap](https://openweathermap.org/api)
   - Sign up for a free account
   - Generate an API key

3. **Configure API Key**:
   - Open `script.js`
   - Replace the placeholder API key on line 7:
   ```javascript
   const apiKey = 'YOUR_API_KEY_HERE';
   ```

4. **Run the Application**:
   - Open `index.html` in your web browser
   - Or use a local server:
     ```bash
     # Using Python 3
     python -m http.server 8000
     
     # Using Node.js
     npx serve
     ```
   - Navigate to `http://localhost:8000`

##  Usage Guide

### Searching for Weather
1. Enter a city name in the search bar
2. Click the search button or press Enter
3. Weather data will load automatically

### Using Geolocation
1. Click the "My Location" button in the top bar
2. Allow location access when prompted
3. Your local weather will display

### Managing Favorites
1. Search for a city
2. Click the star icon in the weather card
3. Access favorites from the sidebar or Favorites section
4. Click any favorite to view its weather

### Viewing Extended Forecast
1. Click "Forecast" in the sidebar
2. View 5-day weather predictions
3. Hover over days for more details

### Exploring Weather Maps
1. Click "Map" in the sidebar
2. Toggle between Cloud, Rain, and Temperature layers
3. Zoom and pan to explore

### Sharing Weather
1. Click the "Share" button (top-right)
2. Review the weather snapshot preview
3. Click "Download Image" to save

##  Customization

### Changing Colors
Edit CSS variables in `style.css`:
```css
:root {
    --accent-primary: #00d9ff;  /* Primary accent color */
    --accent-secondary: #7c3aed; /* Secondary accent color */
    /* ... more variables */
}
```

### Modifying Animations
Adjust animation durations in `style.css`:
```css
--transition-fast: 0.2s ease;
--transition-normal: 0.3s ease;
--transition-slow: 0.5s ease;
```

##  Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Advanced styling, animations, and responsive design
- **JavaScript (ES6+)**: Async/await, Fetch API, localStorage
- **Chart.js**: Temperature graph visualization
- **Leaflet.js**: Interactive maps
- **html2canvas**: Screenshot functionality
- **Font Awesome**: Icon library
- **Google Fonts**: Orbitron & Sora typefaces

##  API Endpoints Used

1. **Current Weather**: `/data/2.5/weather`
2. **5-Day Forecast**: `/data/2.5/forecast`
3. **Air Pollution**: `/data/2.5/air_pollution`
4. **Weather Maps**: `/map/{layer}/{z}/{x}/{y}.png`

##  Project Structure

```
weather-app/
│
├── index.html          # Main HTML structure
├── style.css           # All styles and animations
├── script.js           # Application logic and API calls
└── README.md           # Documentation
```

## Performance Optimizations

- Lazy loading of forecast data
- Debounced search input
- CSS-only animations where possible
- Efficient localStorage usage
- Conditional API calls

## Troubleshooting

### Weather data not loading
- Check your API key is correct
- Ensure you're not exceeding API rate limits (60 calls/minute on free tier)
- Verify internet connection

### Geolocation not working
- Enable location services in browser settings
- Allow location access when prompted
- Use HTTPS for production deployments

### Map not displaying
- Check console for JavaScript errors
- Ensure Leaflet.js CDN is loading
- Verify API key has map access enabled

## Acknowledgments

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- Icons by [Font Awesome](https://fontawesome.com/)
- Maps by [Leaflet](https://leafletjs.com/)
- Charts by [Chart.js](https://www.chartjs.org/)
