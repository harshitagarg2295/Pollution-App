
const apiKey = "17dd58e388f245b9027d8c057cd5eb96"
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q="

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
        document.querySelector(".city-heading").innerHTML = data.name;
        document.querySelector(".wind").innerHTML = data.wind.speed + "Km/hr";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";

        const weatherCondition = data.weather[0].main;

        switch (weatherCondition) {
            case "Clouds":
                weatherIcon.src = "images/clouds.png";
                break;
            case "Clear":
                weatherIcon.src = "images/clear.png";
                break;
            case "Drizzle":
                weatherIcon.src = "images/drizzle.png";
                break;
            case "Mist":
            case "Haze":
            case "Smoke":
                weatherIcon.src = "images/mist.png";
                break;
            case "Rain":
                weatherIcon.src = "images/rain.png";
                break;
            case "Snow":
                weatherIcon.src = "images/snow.png";
                break;
            default:
                weatherIcon.src = "images/clouds.png"; // फ़ॉलबैक इमेज
        }
        
        document.querySelector(".weather").style.display = "block"
        document.querySelector(".error p").style.display = "none"

        document.querySelector(".prev").style.display = "block"
    }


}

prevBtn.addEventListener("click", () => {
    window.location.href = "index.html";

})
