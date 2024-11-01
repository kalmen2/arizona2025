// Countdown Timer
const targetDate = new Date("2025-02-02T06:30:00").getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const timeLeft = targetDate - now;

    if (timeLeft >= 0) {
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        document.getElementById("days").textContent = days;
        document.getElementById("hours").textContent = hours;
        document.getElementById("minutes").textContent = minutes;
        document.getElementById("seconds").textContent = seconds;
    } else {
        clearInterval(countdownInterval);
        document.getElementById("countdown").textContent = "Enjoy your trip!";
    }
}

// Current Time
function updateCurrentTime() {
    const now = new Date();
    const options = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    document.getElementById("currentTime").textContent = now.toLocaleTimeString('en-US', options);
}

// Weather API
const apiKey = '2c76b6a03e2bd1547e50494010ebea93';
const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=Phoenix,AZ,US&appid=${apiKey}&units=imperial`;

function getWeather() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const weatherContainer = document.getElementById("weather");
            const weatherDescription = data.weather[0].description;
            const temperature = data.main.temp;
            weatherContainer.textContent = `${weatherDescription}, ${temperature} °F`;
        })
        .catch(error => {
            console.error('Error fetching weather:', error);
            document.getElementById("weather").textContent = 'Weather data not available.';
        });
}

// Zmanim API
const hebcalApiUrl = `https://www.hebcal.com/zmanim?cfg=json&latitude=33.4484&longitude=-112.0740`;

async function fetchZmanim() {
    try {
        const response = await fetch(hebcalApiUrl);
        const data = await response.json();
        displayZmanim(data);
    } catch (error) {
        console.error('Error fetching zmanim:', error);
        document.getElementById("zmanim").textContent = 'Zmanim data not available.';
    }
}

function displayZmanim(data) {
    const zmanimContainer = document.getElementById("zmanim");
    const zmanimInHebrew = {
        alotHaShachar: 'עלות השחר',
        sunrise: 'זריחה',
        sofZmanShmaMGA: 'סוף זמן שמע',
        chatzot: 'חצות',
        sunset: 'שקיעה',
        tzeit50min: 'צאת הכוכבים',
    };

    for (const [key, label] of Object.entries(zmanimInHebrew)) {
        if (data.times[key]) {
            const zmanElement = document.createElement('div');
            const time = new Date(data.times[key]);
            zmanElement.textContent = `${time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} :${label}`;
            zmanElement.classList.add('zman-item');
            zmanimContainer.appendChild(zmanElement);
        }
    }
}

// Initialize
const countdownInterval = setInterval(updateCountdown, 1000);
setInterval(updateCurrentTime, 1000);
getWeather();
fetchZmanim();
