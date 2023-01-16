const today = new Date().toLocaleDateString();
const apiKey1 = "977c66b327bdaf4134efc0fd4b37c5ed";
const apiKey2 = "e818d098be7aa81b1573d50947983078";

const dateEl = document.getElementById("date");
const inputEl = document.getElementById("searchInput");
const searchHistoryEl = document.getElementById("searchHistory");
const cityNameEl = document.getElementById("currentCity");
const tempEl = document.getElementById("temperature");
const windEl = document.getElementById("windSpeed");
const humidityEl = document.getElementById("humidity");
const uvIndexEl = document.getElementById("UVIndex");

let historyList = JSON.parse(localStorage.getItem("searchHistory")) || [];
historyList.forEach((city) => {
    createSearchBtn(city);
});

let currentCity = "";

// gets current city from input and sends to getWeatherData and saveToLocalStorage
document.getElementById("searchBtn").addEventListener("click", (e) => {
    e.preventDefault();
    currentCity = inputEl.value;
    if (currentCity === "") {
        return alert("Please enter a city name");
    }
    getCityCoord(currentCity);
});

document.getElementById("clearHistory").addEventListener("click", clearHistory);
function clearHistory() {
    localStorage.clear();
    historyList = [];
    location.reload();
}

function saveToLocalStorage(city) {
    historyList.push(city);
    localStorage.setItem("searchHistory", JSON.stringify(historyList));
}

function createSearchBtn(city) {
    const newBtn = document.createElement("li");
    newBtn.setAttribute("id", city);
    newBtn.classList.add("btn", "btn-secondary", "mb-2");
    newBtn.innerText = city;
    searchHistoryEl.append(newBtn);
    newBtn.addEventListener("click", (e) => {
        const newQuery = e.target.innerText;
        getCityCoord(newQuery);
    });
}
function fillPage(data) {
    cityNameEl.innerHTML = `${currentCity} ${today} <img src="http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png">`;
    tempEl.innerHTML = `${data.current.temp}°F`;
    humidityEl.innerHTML = `${data.current.humidity}%`;
    windEl.innerHTML = `${data.current.wind_speed} mph`;
    uvIndexEl.innerHTML = `${data.current.uvi}`;
}

function getWeatherData({ lat, lon }) {
    const unit = "&units=imperial";
    const weatherQuery = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}${unit}&appid=${apiKey2}`;
    fetch(weatherQuery)
        .then((response) => {
            if (!response.ok) {
                throw response;
            }
            return response.json();
        })
        .then((data) => {
            fillPage(data);
        })
        .catch((error) => {
            alert("An error occurred: " + error);
        });
}

function getCityCoord(city) {
    const queryURL = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey1}`;
    fetch(queryURL)
        .then((response) => {
            if (!response.ok) {
                throw response;
            }
            return response.json();
        })
        .then((data) => {
            currentCity = data[0].name;
            getWeatherData(data[0]);
            if (historyList.includes(data[0].name)) {
                return;
            }
            createSearchBtn(data[0].name);
            saveToLocalStorage(data[0].name);
        })
        .catch((error) => {
            alert("An error occurred: " + error);
        });
}