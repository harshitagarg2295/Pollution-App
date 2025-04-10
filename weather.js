const apiKey = "17dd58e388f245b9027d8c057cd5eb96"
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q="

const searchBox = document.querySelector(".search input")
const searchBtn = document.querySelector(".search button")
const weatherIcon = document.querySelector(".weather-icon")
const prevBtn = document.querySelector(".prev")

window.addEventListener("DOMContentLoaded", () => {
    const city = localStorage.getItem("selectedCity");

    if (city) {
        checkWeather(city); // Call your weather API function with this city
    } else {
        console.log("No city found in localStorage");
    }
});

async function checkWeather(city) {

    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

    if (response.status == 404) {
        document.querySelector(".error p").style.display = "block"
        document.querySelector(".weather").style.display = "none"
    }
    else {

        var data = await response.json();

        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°c";
        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".wind").innerHTML = data.wind.speed + "Km/hr";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";

        if (data.weather[0].main == "Clouds") {
            weatherIcon.src = "images/clouds.png"
        }
        else if (data.weather[0].main == "Clear") {
            weatherIcon.src = "images/clear.png"
        }
        else if (data.weather[0].main == "Drizzle") {
            weatherIcon.src = "images/drizzle.png"
        }
        else if (data.weather[0].main == "Mist") {
            weatherIcon.src = "images/mist.png"
        }
        else if (data.weather[0].main == "Rain") {
            weatherIcon.src = "images/rain.png"
        }
        else if (data.weather[0].main == "Snow") {
            weatherIcon.src = "images/snow.png"
        }

        document.querySelector(".weather").style.display = "block"
        document.querySelector(".error p").style.display = "none"

        document.querySelector(".prev").style.display = "block"
    }


}

prevBtn.addEventListener("click",()=>{
    window.location.href = "index.html";

})