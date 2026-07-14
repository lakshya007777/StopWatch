const display = document.getElementById("display");
let timer = null;
let startTime = 0;
let elapsedTime = 0;
let isRunning = false;

function start() {
    if (!isRunning) {
        startTime = Date.now() - elapsedTime;
        timer = setInterval(update, 10);
        isRunning = true;
    }
}

function stop() {
    if (isRunning) {
        clearInterval(timer);
        elapsedTime = Date.now() - startTime;
        isRunning = false;
    }
}

function reset() {
    clearInterval(timer);
    startTime = 0;
    elapsedTime = 0;
    isRunning = false;
    display.innerHTML = `00:00:00<span class="milliseconds">:00</span>`;
}

function update() {
    const currentTime = Date.now();
    elapsedTime = currentTime - startTime;

    let hours = Math.floor(elapsedTime / (1000 * 60 * 60));
    let minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
    let seconds = Math.floor((elapsedTime / 1000) % 60);
    let milliseconds = Math.floor((elapsedTime % 1000) / 10);

    hours = String(hours).padStart(2, "0");
    minutes = String(minutes).padStart(2, "0");
    seconds = String(seconds).padStart(2, "0");
    milliseconds = String(milliseconds).padStart(2, "0");

    display.innerHTML = `${hours}:${minutes}:${seconds}<span class="milliseconds">:${milliseconds}</span>`;
}

// Weather fetching logic
async function fetchWeather(lat, lon) {
    try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        const data = await response.json();
        const weather = data.current_weather;
        
        document.getElementById("w-temp").textContent = `${Math.round(weather.temperature)}°C`;
        
        const code = weather.weathercode;
        let icon = "☀️";
        let desc = "Clear";
        
        if (code === 0) { icon = "☀️"; desc = "Clear sky"; }
        else if (code >= 1 && code <= 3) { icon = "⛅"; desc = "Partly cloudy"; }
        else if (code >= 45 && code <= 48) { icon = "🌫️"; desc = "Fog"; }
        else if (code >= 51 && code <= 67) { icon = "🌧️"; desc = "Rain"; }
        else if (code >= 71 && code <= 77) { icon = "❄️"; desc = "Snow"; }
        else if (code >= 80 && code <= 82) { icon = "🌧️"; desc = "Rain showers"; }
        else if (code >= 95) { icon = "⛈️"; desc = "Thunderstorm"; }
        
        document.getElementById("w-icon").textContent = icon;
        document.getElementById("w-desc").textContent = desc;
    } catch (e) {
        document.getElementById("w-desc").textContent = "Weather unavailable";
    }
}

// Get user location for weather
window.addEventListener('DOMContentLoaded', () => {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
            fetchWeather(position.coords.latitude, position.coords.longitude);
        }, () => {
            // Fallback location (e.g., London) if user denies geolocation
            fetchWeather(51.5074, -0.1278);
        });
    } else {
        fetchWeather(51.5074, -0.1278);
    }
});