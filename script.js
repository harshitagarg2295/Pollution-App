const apiKey = "17dd58e388f245b9027d8c057cd5eb96"

const apiURL = "https://api.openweathermap.org/data/2.5/air_pollution?"

const apiURLCity = "https://api.openweathermap.org/geo/1.0/direct?q="

const searchBox = document.querySelector(".search input");

const searchBtn = document.querySelector(".search button");

const automaticBtn = document.querySelector(".automatic");

const manualBtn = document.querySelector(".manual");

const nextBtn = document.querySelector(".next");

async function getPollutionByCity(city) {

    const response = await fetch(apiURLCity + city + `&limit=1` + `&appid=${apiKey}`)

    const data = await response.json();

    if (!data || data.length === 0) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".result").style.display = "none";
        return; // exit the function
    }

    // Get latitude & longitude

    const { lat, lon, name } = data[0];

    const pollutionRes = await fetch(apiURL + `lat=${lat}&lon=${lon}&appid=${apiKey}`);


    const pollutionData = await pollutionRes.json();


    updatePollutionUI(pollutionData, name)

}

async function getPollutionByCoords(lat, lon) {
    
    try {
        // Step 1: Fetch pollution data
        const pollutionRes = await fetch(apiURL + `lat=${lat}&lon=${lon}&appid=${apiKey}`);

        const pollutionData = await pollutionRes.json();

        // Step 2: Fetch city/location name using OpenStreetMap
        const locationRes = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`, {
        
        });

        const locationData = await locationRes.json();
            
        // Step 3: Get city or fallback location
        const address = locationData.address;

     const cityName =
    address.neighbourhood || address.suburb || address.village || address.town || address.city || "Your Location";
    
    // save the city name in storage
    localStorage.setItem("selectedCity", cityName);

        // Step 4: Show city name in UI
        document.querySelector(".aqi-city p").innerHTML = cityName;

        // Step 5: Update pollution data UI
        updatePollutionUI(pollutionData,cityName);

    } catch (error) {
        alert("Something went wrong while detecting your location data.");
        console.error(error);
    }
}

function updatePollutionUI(pollutionData, cityName = "Your Location") {

    document.querySelector(".aqi-city p").innerHTML = cityName;

    document.querySelector(".aqi").innerHTML = pollutionData.list[0].main.aqi

    document.querySelector("#pm2_5").innerHTML = Math.round(pollutionData.list[0].components.pm2_5)

    document.querySelector("#pm10").innerHTML = Math.round(pollutionData.list[0].components.pm10)

    console.log(pollutionData)

    const aqi = pollutionData.list[0].main.aqi;

    if (aqi == 1) {
        document.querySelector(".state").innerHTML = "Good"

        document.querySelector(".state").style.color = "#2ecc71" //green

        document.querySelector(".advice").innerHTML = "Air quality is great! Enjoy your day outside."
        
        document.querySelector(".aqi").style.color = "#2ecc71"

        document.querySelector(".advice").style.color = "#2ecc71"
    }
    else if (aqi == 2) {
        document.querySelector(".state").innerHTML = "Fair"

        document.querySelector(".state").style.color = "#2ecc71" 

        document.querySelector(".advice").innerHTML = "Air quality is acceptable. Sensitive individuals should be cautious."
        
        document.querySelector(".aqi").style.color = "#2ecc71"

        document.querySelector(".advice").style.color = "#2ecc71"
    }
    else if (aqi == 3) {
        document.querySelector(".state").innerHTML = "Moderate"

        document.querySelector(".state").style.color = "#e67e22" //orange

        document.querySelector(".advice").innerHTML = "Unhealthy for sensitive groups. Consider reducing outdoor activity."
        
        document.querySelector(".aqi").style.color = "#e67e22"

        document.querySelector(".advice").style.color = " #e67e22"
    }
    else if (aqi == 4) {
        document.querySelector(".state").innerHTML = "Poor "

        document.querySelector(".state").style.color = "#e74c3c" // red

        document.querySelector(".advice ").innerHTML = "Avoid outdoor activities, especially if you're sensitive."

        document.querySelector(".aqi").style.color = "#e74c3c"

        document.querySelector(".advice").style.color = "#e74c3c"
    }
    else if (aqi == 5) {
        document.querySelector(".state").innerHTML = "Very Poor "

        document.querySelector(".state").style.color = "#B22222" //dark red

        document.querySelector(".advice").innerHTML = "Air is hazardous. Stay indoors if possible."

        document.querySelector(".aqi").style.color = "#B22222"

        document.querySelector(".advice").style.color = "#B22222"
    }

    document.querySelector(".error").style.display = "none"
    document.querySelector(".result").style.display = "block";
    document.querySelector(".next").style.display = "block";

}

searchBtn.addEventListener("click", () => {

    const city = searchBox.value.trim(); // remove extra spaces

    if (city === "") {
        alert("Please enter valid city name");
    } else {
        getPollutionByCity(city);
    }

})

manualBtn.addEventListener("click", () => {
    document.querySelector(".search").style.display = "block";
    searchBox.value = ""; // input field reset

});

automaticBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                getPollutionByCoords(lat, lon);
            },
            (error) => {
                alert("Location access denied. Please allow location permission.");
            }
        );
    } else {
        alert("Geolocation is not supported by your browser.");
    }

    document.querySelector(".search").style.display = "none"; // inside automaticBtn click
    
});

nextBtn.addEventListener("click",()=>{
    let cityName = document.querySelector(".search input").value.trim();
    
    if (cityName !== "") {
        // Manual search case
        localStorage.setItem("selectedCity", cityName); 
    } else {
        // Current location case: already stored in localStorage, so no need to set again
        cityName = localStorage.getItem("selectedCity");
        if (!cityName) {
            alert("City name not found. Please search manually or allow location access.");
            return;
        }
    }

    // Navigate regardless of how city was set
    window.location.href = "weather.html";
})
