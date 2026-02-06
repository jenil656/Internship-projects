// SkyCast - Weather Dashboard JavaScript
//38e6e8e289230edc931d8019201a1cc4
// API Configuration
const apiKey = CONFIG.WEATHER_API_KEY; // Replace with your OpenWeatherMap API key
let currentUnit = 'metric'; // metric = Celsius, imperial = Fahrenheit
let currentCity = '';
let currentCoords = { lat: null, lon: null };
let weatherData = null;
let temperatureChart = null;
let weatherMap = null;
let currentLayer = 'clouds';

// DOM Elements
const elements = {
    // Navigation
    navBtns: document.querySelectorAll('.nav-btn'),
    contentSections: document.querySelectorAll('.content-section'),
    
    // Search
    cityInput: document.getElementById('cityInput'),
    submitBtn: document.getElementById('submitBtn'),
    searchSuggestions: document.getElementById('searchSuggestions'),
    
    // Actions
    geoBtn: document.getElementById('geoBtn'),
    unitToggle: document.getElementById('unitToggle'),
    favoriteBtn: document.getElementById('favoriteBtn'),
    shareBtn: document.getElementById('shareBtn'),
    
    // Display
    loader: document.getElementById('loader'),
    errorMessage: document.getElementById('errorMessage'),
    errorText: document.getElementById('errorText'),
    loadingScreen: document.getElementById('loadingScreen'),
    
    // Weather Data
    cityName: document.getElementById('cityName'),
    currentDateTime: document.getElementById('currentDateTime'),
    tempDisplay: document.getElementById('tempDisplay'),
    tempUnit: document.getElementById('tempUnit'),
    description: document.getElementById('description'),
    feelsLike: document.getElementById('feelsLike'),
    feelsLikeUnit: document.getElementById('feelsLikeUnit'),
    weatherIcon: document.getElementById('weatherIcon'),
    
    // Highlights
    uvIndex: document.getElementById('uvIndex'),
    uvBar: document.getElementById('uvBar'),
    windSpeed: document.getElementById('windSpeed'),
    windArrow: document.getElementById('windArrow'),
    humidity: document.getElementById('humidity'),
    humidityBar: document.getElementById('humidityBar'),
    visibility: document.getElementById('visibility'),
    pressure: document.getElementById('pressure'),
    precipitation: document.getElementById('precipitation'),
    
    // AQI
    aqiValue: document.getElementById('aqiValue'),
    aqiLabel: document.getElementById('aqiLabel'),
    aqiGaugeFill: document.getElementById('aqiGaugeFill'),
    pm25: document.getElementById('pm25'),
    pm10: document.getElementById('pm10'),
    no2: document.getElementById('no2'),
    co: document.getElementById('co'),
    
    // Sun & Moon
    sunrise: document.getElementById('sunrise'),
    sunset: document.getElementById('sunset'),
    sunProgress: document.getElementById('sunProgress'),
    moonPhase: document.getElementById('moonPhase'),
    moonrise: document.getElementById('moonrise'),
    moonset: document.getElementById('moonset'),
    moonIcon: document.getElementById('moonIcon'),
    
    // Advisor
    clothingAdvice: document.getElementById('clothingAdvice'),
    activityAdvice: document.getElementById('activityAdvice'),
    
    // Forecast
    hourlyForecast: document.getElementById('hourlyForecast'),
    extendedForecast: document.getElementById('extendedForecast'),
    
    // Favorites
    favoritesContainer: document.getElementById('favoritesContainer'),
    favoritesGrid: document.getElementById('favoritesGrid'),
    
    // Map
    weatherMap: document.getElementById('weatherMap'),
    layerBtns: document.querySelectorAll('.layer-btn'),
    
    // Modal
    shareModal: document.getElementById('shareModal'),
    sharePreview: document.getElementById('sharePreview'),
    downloadSnapshot: document.getElementById('downloadSnapshot'),
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

async function initializeApp() {
    // Hide loading screen after a delay
    setTimeout(() => {
        elements.loadingScreen.classList.add('hidden');
    }, 1500);
    
    // Set up event listeners
    setupEventListeners();
    
    // Update date/time
    updateDateTime();
    setInterval(updateDateTime, 60000); // Update every minute
    
    // Load favorites from localStorage
    loadFavorites();
    
    // Initialize map
    initializeMap();
    
    // Try to get user location automatically
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
            },
            (error) => {
                // If geolocation fails, load a default city
                fetchWeather('Ahmedabad');
            }
        );
    } else {
        fetchWeather('Ahmedabad');
    }
}

// Event Listeners Setup
function setupEventListeners() {
    // Navigation
    elements.navBtns.forEach(btn => {
        btn.addEventListener('click', () => switchSection(btn.dataset.section));
    });
    
    // Search
    elements.submitBtn.addEventListener('click', handleSearch);
    elements.cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    
    // Actions
    elements.geoBtn.addEventListener('click', getUserLocation);
    elements.unitToggle.addEventListener('click', toggleUnit);
    elements.favoriteBtn.addEventListener('click', toggleFavorite);
    elements.shareBtn.addEventListener('click', openShareModal);
    
    // Error message close
    const closeError = document.querySelector('.close-error');
    if (closeError) {
        closeError.addEventListener('click', () => {
            elements.errorMessage.classList.add('hidden');
        });
    }
    
    // Map layers
    elements.layerBtns.forEach(btn => {
        btn.addEventListener('click', () => switchMapLayer(btn.dataset.layer));
    });
    
    // Modal close
    const modalClose = document.querySelector('.modal-close');
    if (modalClose) {
        modalClose.addEventListener('click', closeShareModal);
    }
    
    // Download snapshot
    if (elements.downloadSnapshot) {
        elements.downloadSnapshot.addEventListener('click', downloadWeatherSnapshot);
    }
}

// Section Switching
function switchSection(sectionId) {
    elements.navBtns.forEach(btn => btn.classList.remove('active'));
    elements.contentSections.forEach(section => section.classList.remove('active'));
    
    const activeBtn = document.querySelector(`[data-section="${sectionId}"]`);
    const activeSection = document.getElementById(`${sectionId}Section`);
    
    if (activeBtn) activeBtn.classList.add('active');
    if (activeSection) activeSection.classList.add('active');
    
    // Fix map rendering when switching to map section
    if (sectionId === 'map' && weatherMap) {
        setTimeout(() => {
            weatherMap.invalidateSize();
        }, 100);
    }
}

// Date/Time Update
function updateDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    elements.currentDateTime.textContent = now.toLocaleDateString('en-US', options);
}

// Search Handling
function handleSearch() {
    const city = elements.cityInput.value.trim();
    if (city) {
        fetchWeather(city);
    }
}

// Get User Location
function getUserLocation() {
    if (navigator.geolocation) {
        toggleLoader(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
            },
            (error) => {
                showError('Unable to retrieve your location. Please enter a city manually.');
                toggleLoader(false);
            }
        );
    } else {
        showError('Geolocation is not supported by your browser.');
    }
}

// Fetch Weather Data
async function fetchWeather(city) {
    toggleLoader(true);
    hideError();
    
    try {
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${currentUnit}`;
        const response = await fetch(weatherUrl);
        
        if (!response.ok) {
            throw new Error('City not found');
        }
        
        const data = await response.json();
        weatherData = data;
        currentCity = city;
        currentCoords = { lat: data.coord.lat, lon: data.coord.lon };
        
        // Fetch additional data
        await Promise.all([
            fetchForecastData(data.coord.lat, data.coord.lon),
            fetchAirQuality(data.coord.lat, data.coord.lon),
            fetchUVIndex(data.coord.lat, data.coord.lon)
        ]);
        
        // Update UI
        updateWeatherUI(data);
        updateDynamicTheme(data.main.temp);
        
    } catch (error) {
        showError(error.message);
    } finally {
        toggleLoader(false);
    }
}

async function fetchWeatherByCoords(lat, lon) {
    toggleLoader(true);
    hideError();
    
    try {
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${currentUnit}`;
        const response = await fetch(weatherUrl);
        
        if (!response.ok) {
            throw new Error('Unable to fetch weather data');
        }
        
        const data = await response.json();
        weatherData = data;
        currentCity = data.name;
        currentCoords = { lat, lon };
        elements.cityInput.value = data.name;
        
        // Fetch additional data
        await Promise.all([
            fetchForecastData(lat, lon),
            fetchAirQuality(lat, lon),
            fetchUVIndex(lat, lon)
        ]);
        
        // Update UI
        updateWeatherUI(data);
        updateDynamicTheme(data.main.temp);
        
    } catch (error) {
        showError(error.message);
    } finally {
        toggleLoader(false);
    }
}

// Fetch Forecast Data
async function fetchForecastData(lat, lon) {
    try {
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${currentUnit}`;
        const response = await fetch(forecastUrl);
        const data = await response.json();
        
        updateHourlyForecast(data.list.slice(0, 8));
        update5DayForecast(data.list);
        updateTemperatureChart(data.list.slice(0, 8));
        
    } catch (error) {
        console.error('Error fetching forecast:', error);
    }
}

// Fetch Air Quality
async function fetchAirQuality(lat, lon) {
    try {
        const aqiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
        const response = await fetch(aqiUrl);
        const data = await response.json();
        
        if (data.list && data.list.length > 0) {
            updateAQI(data.list[0]);
        }
    } catch (error) {
        console.error('Error fetching air quality:', error);
    }
}

// Fetch UV Index (Note: OpenWeather UV API requires a different endpoint)
async function fetchUVIndex(lat, lon) {
    try {
        // Using onecall API for UV index (requires subscription in real API)
        // For demonstration, we'll use a placeholder
        const uvIndex = Math.floor(Math.random() * 11);
        updateUVIndex(uvIndex);
    } catch (error) {
        console.error('Error fetching UV index:', error);
    }
}

// Update Weather UI
function updateWeatherUI(data) {
    // Location
    elements.cityName.textContent = `${data.name}, ${data.sys.country}`;
    
    // Temperature with proper unit display
    elements.tempDisplay.textContent = Math.round(data.main.temp);
    elements.tempUnit.textContent = currentUnit === 'metric' ? '°C' : '°F';
    elements.feelsLike.textContent = Math.round(data.main.feels_like);
    elements.feelsLikeUnit.textContent = currentUnit === 'metric' ? '°C' : '°F';
    
    // Description
    elements.description.textContent = data.weather[0].description;
    
    // Icon - Enhanced with Font Awesome fallback
    const iconCode = data.weather[0].icon;
    const weatherMain = data.weather[0].main;
    const weatherId = data.weather[0].id;
    
    // Use OpenWeatherMap icon with @4x for better quality
    elements.weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
    elements.weatherIcon.alt = data.weather[0].description;
    
    // Update Font Awesome fallback icon
    updateFallbackIcon(weatherMain, weatherId, iconCode);
    
    // Add error handler for icon - show fallback if API icon fails
    elements.weatherIcon.onerror = function() {
        this.style.display = 'none';
        document.getElementById('weatherIconFallback').classList.remove('hidden');
    };
    
    // If icon loads successfully, hide fallback
    elements.weatherIcon.onload = function() {
        this.style.display = 'block';
        document.getElementById('weatherIconFallback').classList.add('hidden');
    };
    
    // Weather particles (rain/snow animation)
    updateWeatherParticles(weatherMain);
    
    // Highlights
    elements.windSpeed.textContent = `${data.wind.speed} ${currentUnit === 'metric' ? 'm/s' : 'mph'}`;
    if (elements.windArrow && data.wind.deg) {
        elements.windArrow.style.transform = `rotate(${data.wind.deg}deg)`;
    }
    
    elements.humidity.textContent = `${data.main.humidity}%`;
    if (elements.humidityBar) {
        elements.humidityBar.style.width = `${data.main.humidity}%`;
    }
    
    elements.visibility.textContent = `${(data.visibility / 1000).toFixed(1)} km`;
    elements.pressure.textContent = `${data.main.pressure} hPa`;
    
    // Precipitation
    const rain = data.rain ? data.rain['1h'] || 0 : 0;
    const snow = data.snow ? data.snow['1h'] || 0 : 0;
    elements.precipitation.textContent = `${(rain + snow).toFixed(1)} mm`;
    
    // Sun times
    updateSunTimes(data.sys.sunrise, data.sys.sunset, data.timezone);
    
    // Moon phase (calculated)
    updateMoonPhase();
    
    // Clothing & Activity Advisor
    updateAdvisors(data);
    
    // Update favorite button state
    updateFavoriteButtonState();
    
    // Update map
    if (weatherMap) {
        weatherMap.setView([data.coord.lat, data.coord.lon], 10);
    }
}

// Update Font Awesome fallback icon based on weather
function updateFallbackIcon(weatherMain, weatherId, iconCode) {
    const fallbackIcon = document.getElementById('weatherIconFallback');
    if (!fallbackIcon) return;
    
    const iconElement = fallbackIcon.querySelector('i');
    const isNight = iconCode.includes('n');
    
    // Remove all existing classes
    iconElement.className = 'fas';
    
    // Detailed weather icon mapping
    let iconClass = '';
    
    switch(weatherMain) {
        case 'Clear':
            iconClass = isNight ? 'fa-moon' : 'fa-sun';
            break;
        case 'Clouds':
            if (weatherId === 801) { // Few clouds
                iconClass = isNight ? 'fa-cloud-moon' : 'fa-cloud-sun';
            } else if (weatherId === 802) { // Scattered clouds
                iconClass = 'fa-cloud';
            } else { // Broken/overcast clouds
                iconClass = 'fa-clouds';
            }
            break;
        case 'Rain':
            if (weatherId >= 500 && weatherId < 505) { // Light to moderate rain
                iconClass = isNight ? 'fa-cloud-moon-rain' : 'fa-cloud-sun-rain';
            } else { // Heavy rain
                iconClass = 'fa-cloud-showers-heavy';
            }
            break;
        case 'Drizzle':
            iconClass = 'fa-cloud-rain';
            break;
        case 'Thunderstorm':
            iconClass = 'fa-cloud-bolt';
            break;
        case 'Snow':
            iconClass = 'fa-snowflake';
            break;
        case 'Mist':
        case 'Smoke':
        case 'Haze':
        case 'Dust':
        case 'Fog':
            iconClass = 'fa-smog';
            break;
        case 'Tornado':
            iconClass = 'fa-tornado';
            break;
        default:
            iconClass = 'fa-cloud-sun';
    }
    
    iconElement.classList.add(iconClass);
}

// Update AQI
function updateAQI(aqiData) {
    const aqi = aqiData.main.aqi;
    const components = aqiData.components;
    
    // AQI categories
    const aqiCategories = [
        { max: 1, label: 'Good', color: '#00e400' },
        { max: 2, label: 'Fair', color: '#ffff00' },
        { max: 3, label: 'Moderate', color: '#ff7e00' },
        { max: 4, label: 'Poor', color: '#ff0000' },
        { max: 5, label: 'Very Poor', color: '#8f3f97' }
    ];
    
    const category = aqiCategories.find(cat => aqi <= cat.max) || aqiCategories[4];
    
    elements.aqiValue.textContent = aqi;
    elements.aqiLabel.textContent = category.label;
    
    // Animate gauge
    const circumference = 2 * Math.PI * 80;
    const offset = circumference - (aqi / 5) * circumference;
    elements.aqiGaugeFill.style.strokeDashoffset = offset;
    
    // Update pollutants
    elements.pm25.textContent = components.pm2_5.toFixed(1);
    elements.pm10.textContent = components.pm10.toFixed(1);
    elements.no2.textContent = components.no2.toFixed(1);
    elements.co.textContent = components.co.toFixed(1);
}

// Update UV Index
function updateUVIndex(uvIndex) {
    elements.uvIndex.textContent = uvIndex;
    
    // UV categories
    let uvCategory = '';
    let uvColor = '';
    
    if (uvIndex <= 2) {
        uvCategory = 'Low';
        uvColor = '#00e400';
    } else if (uvIndex <= 5) {
        uvCategory = 'Moderate';
        uvColor = '#ffff00';
    } else if (uvIndex <= 7) {
        uvCategory = 'High';
        uvColor = '#ff7e00';
    } else if (uvIndex <= 10) {
        uvCategory = 'Very High';
        uvColor = '#ff0000';
    } else {
        uvCategory = 'Extreme';
        uvColor = '#8f3f97';
    }
    
    elements.uvIndex.textContent = `${uvIndex} - ${uvCategory}`;
    
    // Animate progress bar
    if (elements.uvBar) {
        elements.uvBar.style.width = `${Math.min((uvIndex / 11) * 100, 100)}%`;
        elements.uvBar.style.background = uvColor;
    }
}

// Update Sun Times
function updateSunTimes(sunrise, sunset, timezone) {
    const sunriseDate = new Date((sunrise + timezone) * 1000);
    const sunsetDate = new Date((sunset + timezone) * 1000);
    
    const sunriseTime = sunriseDate.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        timeZone: 'UTC'
    });
    
    const sunsetTime = sunsetDate.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        timeZone: 'UTC'
    });
    
    elements.sunrise.textContent = sunriseTime;
    elements.sunset.textContent = sunsetTime;
    
    // Calculate sun progress
    const now = Date.now() / 1000;
    const dayLength = sunset - sunrise;
    const elapsed = now - sunrise;
    const progress = Math.max(0, Math.min(100, (elapsed / dayLength) * 100));
    
    if (elements.sunProgress) {
        elements.sunProgress.style.width = `${progress}%`;
    }
}

// Update Moon Phase
function updateMoonPhase() {
    // Calculate moon phase (simplified calculation)
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    
    // Simple moon phase calculation
    const k1 = Math.floor(365.25 * (year + 4712));
    const k2 = Math.floor(30.6 * month + 0.5);
    
    const jd = k1 + k2 + day + 59;
    const ip = normalize((jd - 2451550.1) / 29.530588853);
    const phase = ip * 29.53;
    
    const phaseNames = [
        'New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous',
        'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'
    ];
    
    const phaseIndex = Math.floor((phase / 29.53) * 8);
    const phaseName = phaseNames[phaseIndex % 8];
    
    elements.moonPhase.textContent = phaseName;
    
    // Set moon icon based on phase
    const moonIcons = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'];
    elements.moonIcon.textContent = moonIcons[phaseIndex % 8];
    
    // For demonstration, using approximate times
    elements.moonrise.textContent = '20:15';
    elements.moonset.textContent = '08:45';
}

function normalize(value) {
    value = value - Math.floor(value);
    if (value < 0) value = value + 1;
    return value;
}

// Update Hourly Forecast
function updateHourlyForecast(hourlyData) {
    elements.hourlyForecast.innerHTML = '';
    
    hourlyData.forEach((hour, index) => {
        const time = new Date(hour.dt * 1000).toLocaleTimeString('en-US', { 
            hour: '2-digit',
            hour12: true 
        });
        
        const hourCard = document.createElement('div');
        hourCard.className = 'hourly-item';
        hourCard.style.animationDelay = `${index * 0.1}s`;
        
        const iconClass = getWeatherIcon(hour.weather[0].main, hour.weather[0].icon);
        
        hourCard.innerHTML = `
            <div class="hourly-time">${time}</div>
            <i class="fas ${iconClass} hourly-icon"></i>
            <div class="hourly-temp">${Math.round(hour.main.temp)}°</div>
        `;
        
        elements.hourlyForecast.appendChild(hourCard);
    });
}

// Get weather icon class
function getWeatherIcon(weatherMain, iconCode) {
    const isNight = iconCode.includes('n');
    
    switch(weatherMain) {
        case 'Clear':
            return isNight ? 'fa-moon' : 'fa-sun';
        case 'Clouds':
            return 'fa-cloud';
        case 'Rain':
            if (iconCode.includes('09') || iconCode.includes('10')) {
                return isNight ? 'fa-cloud-moon-rain' : 'fa-cloud-sun-rain';
            } else {
                return 'fa-cloud-showers-heavy';
            }
        case 'Drizzle':
            return 'fa-cloud-rain';
        case 'Thunderstorm':
            return 'fa-cloud-bolt';
        case 'Snow':
            return 'fa-snowflake';
        case 'Mist':
        case 'Smoke':
        case 'Haze':
        case 'Dust':
        case 'Fog':
            return 'fa-smog';
        default:
            return 'fa-cloud-sun';
    }
}

// Update 5-Day Forecast
function update5DayForecast(forecastList) {
    elements.extendedForecast.innerHTML = '';
    
    // Group by day
    const dailyForecasts = {};
    forecastList.forEach(item => {
        const date = new Date(item.dt * 1000).toDateString();
        if (!dailyForecasts[date]) {
            dailyForecasts[date] = [];
        }
        dailyForecasts[date].push(item);
    });
    
    // Get first 5 days
    const days = Object.keys(dailyForecasts).slice(0, 5);
    
    days.forEach((day, index) => {
        const dayData = dailyForecasts[day];
        const temps = dayData.map(d => d.main.temp);
        const maxTemp = Math.max(...temps);
        const minTemp = Math.min(...temps);
        const mainWeather = dayData[Math.floor(dayData.length / 2)].weather[0];
        
        const forecastDay = document.createElement('div');
        forecastDay.className = 'forecast-day';
        forecastDay.style.animationDelay = `${index * 0.1}s`;
        
        const date = new Date(day);
        const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        const unitSymbol = currentUnit === 'metric' ? '°C' : '°F';
        
        forecastDay.innerHTML = `
            <div class="forecast-date">${dateStr}</div>
            <div class="forecast-weekday">${weekday}</div>
            <img src="https://openweathermap.org/img/wn/${mainWeather.icon}@2x.png" 
                 alt="${mainWeather.description}" 
                 class="forecast-icon">
            <div class="forecast-temps">
                <span class="forecast-high">${Math.round(maxTemp)}${unitSymbol}</span>
                <span class="forecast-low">${Math.round(minTemp)}${unitSymbol}</span>
            </div>
            <div class="forecast-desc">${mainWeather.description}</div>
        `;
        
        elements.extendedForecast.appendChild(forecastDay);
    });
}

// Update Temperature Chart
function updateTemperatureChart(hourlyData) {
    const ctx = document.getElementById('temperatureChart');
    if (!ctx) return;
    
    const labels = hourlyData.map(hour => {
        return new Date(hour.dt * 1000).toLocaleTimeString('en-US', { 
            hour: '2-digit' 
        });
    });
    
    const temps = hourlyData.map(hour => Math.round(hour.main.temp));
    
    if (temperatureChart) {
        temperatureChart.destroy();
    }
    
    const unitSymbol = currentUnit === 'metric' ? 'C' : 'F';
    
    temperatureChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Temperature',
                data: temps,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointBackgroundColor: '#3b82f6',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    titleColor: '#1f2937',
                    bodyColor: '#4b5563',
                    borderColor: '#3b82f6',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: (context) => `${context.parsed.y}°${unitSymbol}`
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#6b7280',
                        callback: (value) => `${value}°`
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#6b7280'
                    }
                }
            }
        }
    });
}

// Update Weather Particles (Rain/Snow Animation)
function updateWeatherParticles(weatherMain) {
    const particlesContainer = document.getElementById('weatherParticles');
    if (!particlesContainer) return;
    
    particlesContainer.innerHTML = '';
    
    if (weatherMain === 'Rain' || weatherMain === 'Drizzle') {
        for (let i = 0; i < 50; i++) {
            const drop = document.createElement('div');
            drop.className = 'rain-drop';
            drop.style.left = `${Math.random() * 100}%`;
            drop.style.animationDuration = `${0.5 + Math.random() * 0.5}s`;
            drop.style.animationDelay = `${Math.random() * 2}s`;
            particlesContainer.appendChild(drop);
        }
    } else if (weatherMain === 'Snow') {
        for (let i = 0; i < 50; i++) {
            const flake = document.createElement('div');
            flake.className = 'snow-flake';
            flake.textContent = '❄';
            flake.style.left = `${Math.random() * 100}%`;
            flake.style.animationDuration = `${3 + Math.random() * 2}s`;
            flake.style.animationDelay = `${Math.random() * 5}s`;
            particlesContainer.appendChild(flake);
        }
    }
}

// Update Advisors (Clothing & Activity)
function updateAdvisors(data) {
    const temp = data.main.temp;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const weatherMain = data.weather[0].main;
    
    // Clothing Advice
    let clothingText = '';
    if (temp < 0) {
        clothingText = 'Heavy winter coat, gloves, and warm layers recommended.';
    } else if (temp < 10) {
        clothingText = 'Jacket and long sleeves recommended.';
    } else if (temp < 20) {
        clothingText = 'Light jacket or sweater suggested.';
    } else if (temp < 30) {
        clothingText = 'Comfortable casual wear is perfect.';
    } else {
        if (humidity > 70) {
            clothingText = 'Light, breathable fabrics recommended due to high humidity.';
        } else {
            clothingText = 'Light summer clothing is ideal.';
        }
    }
    
    elements.clothingAdvice.textContent = clothingText;
    
    // Activity Advice
    let activityText = '';
    
    if (weatherMain === 'Rain' || weatherMain === 'Thunderstorm') {
        activityText = 'Indoor activities recommended. Try museums or shopping.';
    } else if (weatherMain === 'Snow') {
        activityText = 'Great for winter sports! Consider skiing or snowboarding.';
    } else if (temp < 5) {
        activityText = 'Bundle up for outdoor walks or enjoy indoor activities.';
    } else if (temp > 30 && humidity > 70) {
        activityText = 'Stay hydrated! Consider water activities or air-conditioned venues.';
    } else if (windSpeed > 10) {
        activityText = 'Perfect for kite flying or windsurfing!';
    } else {
        activityText = 'Great weather for outdoor activities like hiking or cycling!';
    }
    
    elements.activityAdvice.textContent = activityText;
}

// Update Dynamic Theme based on temperature
function updateDynamicTheme(temp) {
    const root = document.documentElement;
    
    if (temp < 0) {
        root.setAttribute('data-temp-theme', 'freezing');
    } else if (temp < 15) {
        root.setAttribute('data-temp-theme', 'cold');
    } else if (temp < 25) {
        root.setAttribute('data-temp-theme', 'warm');
    } else {
        root.setAttribute('data-temp-theme', 'hot');
    }
}

// Toggle Unit (Celsius/Fahrenheit)
function toggleUnit() {
    currentUnit = currentUnit === 'metric' ? 'imperial' : 'metric';
    elements.unitToggle.querySelector('span').textContent = currentUnit === 'metric' ? '°C / °F' : '°F / °C';
    
    // Refresh weather data with new unit
    if (currentCoords.lat && currentCoords.lon) {
        fetchWeatherByCoords(currentCoords.lat, currentCoords.lon);
    }
}

// Favorites Management
function loadFavorites() {
    const favorites = JSON.parse(localStorage.getItem('weatherFavorites')) || [];
    updateFavoritesUI(favorites);
}

function saveFavorites(favorites) {
    localStorage.setItem('weatherFavorites', JSON.stringify(favorites));
}

function toggleFavorite() {
    if (!currentCity) return;
    
    const favorites = JSON.parse(localStorage.getItem('weatherFavorites')) || [];
    const index = favorites.findIndex(fav => fav.city === currentCity);
    
    if (index > -1) {
        favorites.splice(index, 1);
        elements.favoriteBtn.classList.remove('active');
    } else {
        favorites.push({
            city: currentCity,
            temp: Math.round(weatherData.main.temp),
            icon: weatherData.weather[0].icon,
            lat: currentCoords.lat,
            lon: currentCoords.lon
        });
        elements.favoriteBtn.classList.add('active');
    }
    
    saveFavorites(favorites);
    updateFavoritesUI(favorites);
}

function updateFavoriteButtonState() {
    const favorites = JSON.parse(localStorage.getItem('weatherFavorites')) || [];
    const isFavorite = favorites.some(fav => fav.city === currentCity);
    
    if (isFavorite) {
        elements.favoriteBtn.classList.add('active');
    } else {
        elements.favoriteBtn.classList.remove('active');
    }
}

function updateFavoritesUI(favorites) {
    // Update sidebar
    elements.favoritesContainer.innerHTML = '';
    
    if (favorites.length === 0) {
        elements.favoritesContainer.innerHTML = '<p class="no-favorites-msg">No pinned cities yet</p>';
    } else {
        favorites.forEach(fav => {
            const favItem = document.createElement('div');
            favItem.className = 'favorite-item';
            favItem.innerHTML = `
                <div class="favorite-item-content" data-city="${fav.city}">
                    <div class="favorite-item-info">
                        <div class="favorite-item-name">${fav.city}</div>
                        <div class="favorite-item-temp">${fav.temp}°</div>
                    </div>
                    <button class="remove-favorite" data-city="${fav.city}" title="Remove from favorites">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            
            const content = favItem.querySelector('.favorite-item-content');
            content.addEventListener('click', (e) => {
                if (!e.target.closest('.remove-favorite')) {
                    fetchWeather(fav.city);
                }
            });
            
            const removeBtn = favItem.querySelector('.remove-favorite');
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                removeFavorite(fav.city);
            });
            
            elements.favoritesContainer.appendChild(favItem);
        });
    }
    
    // Update favorites section grid
    if (favorites.length === 0) {
        elements.favoritesGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-star"></i>
                <p>No favorites yet</p>
                <small>Click the star icon on any city to save it here</small>
            </div>
        `;
    } else {
        elements.favoritesGrid.innerHTML = '';
        favorites.forEach(fav => {
            const favCard = document.createElement('div');
            favCard.className = 'favorite-card';
            favCard.innerHTML = `
                <button class="remove-favorite-card" data-city="${fav.city}" title="Remove from favorites">
                    <i class="fas fa-times"></i>
                </button>
                <div class="favorite-card-content" data-city="${fav.city}">
                    <h4>${fav.city}</h4>
                    <img src="https://openweathermap.org/img/wn/${fav.icon}@2x.png" alt="Weather">
                    <div class="favorite-card-temp">${fav.temp}°</div>
                </div>
            `;
            
            const content = favCard.querySelector('.favorite-card-content');
            content.addEventListener('click', (e) => {
                fetchWeather(fav.city);
                switchSection('dashboard');
            });
            
            const removeBtn = favCard.querySelector('.remove-favorite-card');
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                // Add fade-out animation
                favCard.style.transition = 'all 0.3s ease';
                favCard.style.opacity = '0';
                favCard.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    removeFavorite(fav.city);
                }, 300);
            });
            
            elements.favoritesGrid.appendChild(favCard);
        });
    }
}

function removeFavorite(city) {
    const favorites = JSON.parse(localStorage.getItem('weatherFavorites')) || [];
    const updated = favorites.filter(fav => fav.city !== city);
    saveFavorites(updated);
    updateFavoritesUI(updated);
    
    if (currentCity === city) {
        elements.favoriteBtn.classList.remove('active');
    }
}

// Map Functions
function initializeMap() {
    try {
        // Check if Leaflet is loaded
        if (typeof L === 'undefined') {
            console.error('Leaflet library not loaded');
            setTimeout(initializeMap, 1000); // Retry after 1 second
            return;
        }
        
        const mapElement = document.getElementById('weatherMap');
        if (!mapElement) {
            console.error('Map element not found');
            return;
        }
        
        // Clear any existing map instance
        if (weatherMap) {
            weatherMap.remove();
            weatherMap = null;
        }
        
        weatherMap = L.map('weatherMap', {
            zoomControl: true,
            scrollWheelZoom: true
        }).setView([23.0225, 72.5714], 10); // Default to Ahmedabad
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(weatherMap);
        
        // Add default weather layer
        const weatherLayer = L.tileLayer(
            `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${apiKey}`,
            { 
                opacity: 0.6,
                maxZoom: 19
            }
        );
        
        weatherLayer.addTo(weatherMap);
        
        // Fix map rendering issue - invalidate size after map section becomes visible
        setTimeout(() => {
            if (weatherMap) {
                weatherMap.invalidateSize();
            }
        }, 250);
        
    } catch (error) {
        console.error('Error initializing map:', error);
        // Retry initialization after a delay
        setTimeout(initializeMap, 2000);
    }
}

function switchMapLayer(layer) {
    currentLayer = layer;
    
    // Update active button
    elements.layerBtns.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-layer="${layer}"]`).classList.add('active');
    
    // Remove existing weather layer
    weatherMap.eachLayer((layer) => {
        if (layer instanceof L.TileLayer && layer !== weatherMap._layers[Object.keys(weatherMap._layers)[0]]) {
            weatherMap.removeLayer(layer);
        }
    });
    
    // Add new weather layer
    const layerMap = {
        clouds: 'clouds_new',
        precipitation: 'precipitation_new',
        temp: 'temp_new'
    };
    
    const weatherLayer = L.tileLayer(
        `https://tile.openweathermap.org/map/${layerMap[layer]}/{z}/{x}/{y}.png?appid=${apiKey}`,
        { opacity: 0.6 }
    );
    
    weatherLayer.addTo(weatherMap);
}

// Share Modal
function openShareModal() {
    if (!weatherData) {
        showError('Please load weather data first before sharing');
        return;
    }
    
    const modal = elements.shareModal;
    if (!modal) {
        console.error('Share modal not found');
        return;
    }
    
    modal.classList.remove('hidden');
    modal.classList.add('active');
    
    const unitSymbol = currentUnit === 'metric' ? 'C' : 'F';
    
    // Create preview with inline styles for proper rendering
    const previewHTML = `
        <div id="weatherShareCard" style="padding: 40px; text-align: center; background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%); border-radius: 20px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15); min-width: 400px; border: 2px solid #e0f2fe;">
            <div style="display: flex; align-items: center; justify-content: center; gap: 15px; margin-bottom: 20px;">
                <i class="fas fa-cloud-bolt" style="font-size: 32px; color: #3b82f6;"></i>
                <h2 style="color: #3b82f6; margin: 0; font-size: 28px; font-weight: 900;">SkyCast Pro</h2>
            </div>
            <h3 style="color: #1f2937; margin-bottom: 30px; font-size: 24px;">${weatherData.name}, ${weatherData.sys.country}</h3>
            <img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png" style="width: 180px; height: 180px; margin: 20px auto; filter: drop-shadow(0 10px 30px rgba(59, 130, 246, 0.3));">
            <div style="font-size: 96px; font-weight: 900; background: linear-gradient(135deg, #3b82f6, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin: 20px 0; line-height: 1;">
                ${Math.round(weatherData.main.temp)}°${unitSymbol}
            </div>
            <p style="font-size: 24px; color: #4b5563; text-transform: capitalize; margin: 20px 0;">${weatherData.weather[0].description}</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 30px; padding: 20px; background: rgba(59, 130, 246, 0.05); border-radius: 12px;">
                <div style="text-align: center;">
                    <i class="fas fa-droplet" style="color: #3b82f6; font-size: 20px; margin-bottom: 8px;"></i>
                    <p style="color: #6b7280; font-size: 14px; margin: 0;">Humidity</p>
                    <p style="color: #1f2937; font-size: 20px; font-weight: 700; margin: 5px 0 0 0;">${weatherData.main.humidity}%</p>
                </div>
                <div style="text-align: center;">
                    <i class="fas fa-wind" style="color: #3b82f6; font-size: 20px; margin-bottom: 8px;"></i>
                    <p style="color: #6b7280; font-size: 14px; margin: 0;">Wind</p>
                    <p style="color: #1f2937; font-size: 20px; font-weight: 700; margin: 5px 0 0 0;">${weatherData.wind.speed} ${currentUnit === 'metric' ? 'm/s' : 'mph'}</p>
                </div>
            </div>
            <p style="color: #9ca3af; margin-top: 30px; font-size: 14px; border-top: 1px solid rgba(0, 0, 0, 0.08); padding-top: 20px;">
                <i class="fas fa-calendar"></i> ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
        </div>
    `;
    
    elements.sharePreview.innerHTML = previewHTML;
}

function closeShareModal() {
    const modal = elements.shareModal;
    if (!modal) return;
    
    modal.classList.remove('active');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

async function downloadWeatherSnapshot() {
    const shareCard = document.getElementById('weatherShareCard');
    
    if (!shareCard) {
        showError('Unable to generate snapshot');
        return;
    }
    
    // Check if html2canvas is loaded
    if (typeof html2canvas === 'undefined') {
        showError('Screenshot library not loaded. Please refresh the page.');
        return;
    }
    
    try {
        // Show loading state
        const downloadBtn = elements.downloadSnapshot;
        const originalText = downloadBtn.innerHTML;
        downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
        downloadBtn.disabled = true;
        
        // Generate canvas with better quality
        const canvas = await html2canvas(shareCard, {
            backgroundColor: '#ffffff',
            scale: 2,
            logging: false,
            useCORS: true,
            allowTaint: true
        });
        
        // Convert to blob and download
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            const cityName = currentCity.replace(/\s+/g, '-').toLowerCase();
            const timestamp = new Date().toISOString().split('T')[0];
            link.download = `skycast-${cityName}-${timestamp}.png`;
            link.href = url;
            link.click();
            
            // Cleanup
            URL.revokeObjectURL(url);
            downloadBtn.innerHTML = originalText;
            downloadBtn.disabled = false;
            
            // Show success message
            showSuccessMessage('Weather snapshot downloaded successfully!');
        }, 'image/png');
        
    } catch (error) {
        console.error('Error generating snapshot:', error);
        showError('Failed to generate snapshot. Please try again.');
        
        // Reset button
        const downloadBtn = elements.downloadSnapshot;
        downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download Image';
        downloadBtn.disabled = false;
    }
}

// Add success message function
function showSuccessMessage(message) {
    const successBanner = document.createElement('div');
    successBanner.className = 'success-banner';
    successBanner.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    successBanner.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        padding: 15px 20px;
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(16, 185, 129, 0.3);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 600;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(successBanner);
    
    setTimeout(() => {
        successBanner.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => successBanner.remove(), 300);
    }, 3000);
}

// Utility Functions
function toggleLoader(show) {
    if (show) {
        elements.loader.classList.remove('hidden');
    } else {
        elements.loader.classList.add('hidden');
    }
}

function showError(message) {
    elements.errorText.textContent = message;
    elements.errorMessage.classList.remove('hidden');
}

function hideError() {
    elements.errorMessage.classList.add('hidden');
}

// Add CSS for weather particles
const style = document.createElement('style');
style.textContent = `
    .rain-drop {
        position: absolute;
        width: 2px;
        height: 20px;
        background: linear-gradient(transparent, rgba(59, 130, 246, 0.8));
        animation: rain-fall linear infinite;
    }
    
    @keyframes rain-fall {
        to {
            transform: translateY(250px);
        }
    }
    
    .snow-flake {
        position: absolute;
        color: rgba(59, 130, 246, 0.8);
        font-size: 20px;
        animation: snow-fall linear infinite;
    }
    
    @keyframes snow-fall {
        to {
            transform: translateY(250px) rotate(360deg);
        }
    }
`;
document.head.appendChild(style);
