// Countdown Timer Setup
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
        document.getElementById("countdown").innerHTML = "Enjoy your trip!";
    }
}

// Function to update the current time
function updateCurrentTime() {
    const now = new Date();
    const options = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }; // 12-hour format
    document.getElementById("currentTime").textContent = now.toLocaleTimeString('en-US', options);
}

// Function to update the clock hands
function updateClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // Calculate the degrees for each hand
    const hourDeg = (hours % 12) * 30 + minutes * 0.5; // 30 degrees per hour + 0.5 per minute
    const minuteDeg = minutes * 6; // 6 degrees per minute
    const secondDeg = seconds * 6; // 6 degrees per second

    // Rotate the hands
    document.getElementById("hourHand").style.transform = `rotate(${hourDeg}deg)`;
    document.getElementById("minuteHand").style.transform = `rotate(${minuteDeg}deg)`;
    document.getElementById("secondHand").style.transform = `rotate(${secondDeg}deg)`;
}

// Weather API
const apiKey = '2c76b6a03e2bd1547e50494010ebea93'; // Replace with your actual API key
const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=Phoenix,AZ,US&appid=${apiKey}&units=imperial`;

function getWeather() {
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            const weatherContainer = document.getElementById("weather");
            const weatherDescription = data.weather[0].description;
            const temperature = data.main.temp;
            weatherContainer.textContent = `${weatherDescription}, ${temperature} °F`;
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            document.getElementById("weather").textContent = 'Weather data not available.';
        });
}

// Hebcal Zmanim API Setup
const hebcalApiUrl = `https://www.hebcal.com/zmanim?cfg=json&latitude=33.4484&longitude=-112.0740`;

async function fetchZmanim() {
    try {
        const response = await fetch(hebcalApiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        const data = await response.json();
        displayZmanim(data);
    } catch (error) {
        console.error('Error fetching zmanim:', error);
        document.getElementById("zmanim").textContent = 'Zmanim data not available. Please check the API parameters or try again later.';
    }
}

function displayZmanim(data) {
    const zmanimContainer = document.getElementById("zmanim");
    zmanimContainer.innerHTML = ''; // Clear previous content

    // Specify the zmanim you want to display in Hebrew
    const zmanimInHebrew = {
        alotHaShachar: 'עלות השחר',
        sunrise: 'שקיעת החמה',
        sofZmanShmaMGA: 'סוף זמן שמע',
        chatzot: 'חצות',
        sunset: 'שקיעה',
        tzeit50min: 'צאת הכוכבים',
    };

    // Loop through the zmanim and display only those in Hebrew
    for (const [key, value] of Object.entries(zmanimInHebrew)) {
        if (data.times[key]) { // Check if the zman exists in the response
            const zmanElement = document.createElement('div');
            const zmanTime = new Date(data.times[key]); // Convert to Date object for formatting

            // Format the time to a more readable format
            const options = { hour: '2-digit', minute: '2-digit', hour12: true }; // 12-hour format
            const formattedTime = zmanTime.toLocaleTimeString('en-US', options);
            
            // Set the text content with AM/PM next to the time in the desired format
            zmanElement.textContent = `${formattedTime} :${value}`;
            zmanElement.classList.add('zman-item'); // Add a class for styling
            zmanimContainer.appendChild(zmanElement);
        }
    }
}

// Initialize countdown and API calls
const countdownInterval = setInterval(updateCountdown, 1000);
setInterval(updateCurrentTime, 1000); // Update current time every second
setInterval(updateClock, 1000); // Update clock every second
getWeather(); // Call the weather function
fetchZmanim(); // Call the zmanim function

// Initial calls
updateClock(); // Initial call to set the clock at page load
