// Use Built in javascript functions to retrieve the date

let d = new Date()
let month = d.getMonth()
let year = d.getFullYear()
let dayOfTheMonth = d.getDate()
let fullDate = '(' + month + '/' + dayOfTheMonth + '/' + year + ')'

// Using API

// Set the Api key to a variable 
let APIkey = '8121ebc866b52ea8600081b69ea2ab51'

// Retrieve the city name store in local storage or initialize it with ottawa
let cityName = JSON.parse(localStorage.getItem("city")) || 'ottawa'

// Define the query URL based on the city name
let queryURL = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&appid=' + APIkey

// Adding new cities


// Retrieve the cities stored in local storage or make an empty list
// Append buttons based on the list of cities in local storage
// Add styling and the value attribute
let cityButtonsArray = JSON.parse(localStorage.getItem("cities")) || []
for (let i = 0; i < cityButtonsArray.length; i++) {
    let newCity = document.createElement("button")
    let buttonsDiv = document.getElementById("buttons")
    newCity.innerHTML = cityButtonsArray[i]
    newCity.classList.add("btn", "border", "btn-block", "mt-0", "text-left", "city")
    newCity.setAttribute("value", cityButtonsArray[i])
    buttonsDiv.appendChild(newCity)
}

// Selector for the input element
let city = document.getElementById("cityInput")

// Selector for the search button
let search = document.getElementById("searchButton")


// Add an event listener for when the user clicks the search button
// A new button is appended to the list and the API is called to set the DOM to weather information
// The city added is also added to list in local storage
search.addEventListener("click", function() {
    let newCity = document.createElement("button")
    let buttonsDiv = document.getElementById("buttons")
    newCity.innerHTML = city.value.toLowerCase()
    newCity.classList.add("btn", "border", "btn-block", "mt-0", "text-left", "city")
    newCity.setAttribute("value", city.value.toLowerCase())
    buttonsDiv.appendChild(newCity)
    cityButtonsArray.push(city.value.toLowerCase())
    localStorage.setItem("cities", JSON.stringify(cityButtonsArray))
    cityName = city.value
    queryURL = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&appid=' + APIkey
    localStorage.setItem('city', JSON.stringify(cityName))
    callAPI()
})



// Add Event Listener to all Buttons
let buttons = document.getElementById('buttons')
let citySelect = document.querySelectorAll('.city')


// Add an event listener to the city buttons to allow the user to update the page with the specified city with weather data
buttons.addEventListener('click', function() {
    if (event.target.matches('.city')) {
        cityName = event.target.value
        queryURL = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&appid=' + APIkey
        localStorage.setItem('city', JSON.stringify(cityName))
        callAPI()
    }
})


// Function to fetch the URL with weather data
function callAPI() {
    fetch(queryURL)
        .then(function(response) {
            return response.json()
        })
        .then(function(weatherData) {

            let dateIndex = 0

            // city
            let cityNameFetched = weatherData.city.name

            // weather icon
            let weatherIcon = weatherData.list[dateIndex].weather[0].icon

            // Temp in kelvins
            let temperature = (Number((weatherData.list[dateIndex].main.temp) * 9 / 5 - 459.67)).toFixed(1)

            // Humidity
            let humidity = weatherData.list[dateIndex].main.humidity

            // Wind Speed
            let windSpeed = Number(weatherData.list[dateIndex].wind.speed).toFixed(1)

            // Latitude
            let latitude = JSON.stringify(weatherData.city.coord.lat)

            // Longitude
            let longitude = JSON.stringify(weatherData.city.coord.lon)

            // HTML Selectors
            let cityNameSelector = document.getElementById("city-name")
            let temperatureSelector = document.getElementById("temperature")
            let humiditySelector = document.getElementById("humidity")
            let windSpeedSelector = document.getElementById("wind-speed")
            let weatherIconElement = document.createElement('img')

            // Updating Main HTML with API values
            cityNameSelector.textContent = cityNameFetched + ' (' + month + '/' + dayOfTheMonth + '/' + year + ')'
            temperatureSelector.textContent = 'Temperature: ' + temperature + '\u00B0 F'
            humiditySelector.textContent = 'Humidity: ' + humidity + '%'
            windSpeedSelector.textContent = 'Wind Speed: ' + windSpeed + ' MPH'
            cityNameSelector.appendChild(weatherIconElement)
            weatherIconElement.setAttribute('src', 'http://openweathermap.org/img/wn/' + weatherIcon + '.png')

            // Retrieving UV Info
            let UVqueryURL = 'https://api.openweathermap.org/data/2.5/uvi?appid=' + APIkey + '&lat=' + latitude + '&lon=' + longitude
            fetch(UVqueryURL)
                .then(function(uvResponse) {
                    return uvResponse.json()
                })
                .then(function(UVData) {
                    let uvIndex = UVData.value
                    let uvIndexSelector = document.getElementById("uv-index")
                    let uvLable = document.getElementById("uv-label")
                    uvLable.textContent = 'UVIndex:'
                    uvIndexSelector.textContent = uvIndex
                        // If the uv index is greater or equal to 8 the disabled button is red
                    if (uvIndex >= 8) {
                        uvIndexSelector.classList.add("bg-danger")
                        uvIndexSelector.classList.remove("bg-warning")
                        uvIndexSelector.classList.remove("bg-success")
                    }
                    // If the uv index is greater or equal to 8 the disabled button is yellow
                    else if (uvIndex < 8 && uvIndex > 2) {
                        uvIndexSelector.classList.add("bg-warning")
                        uvIndexSelector.classList.remove("bg-success")
                        uvIndexSelector.classList.remove("bg-danger")
                    }
                    // If the uv index is greater or equal to 8 the disabled button is green
                    else {
                        uvIndexSelector.classList.add("bg-success")
                        uvIndexSelector.classList.remove("bg-danger")
                        uvIndexSelector.classList.remove("bg-warning")
                    }
                })

            // Updating 5-Day Forecast
            let day = 1

            // While loop used to cycle through the 5-day forecast
            while (day < 6) {
                // Date index used to retrieve the appropriate weather data for the next day
                dateIndex += 7
                    // Day is updated
                dayOfTheMonth += 1
                    // fullDate is constructed
                fullDate = '(' + month + '/' + dayOfTheMonth + '/' + year + ')'

                // weather icon
                weatherIcon = weatherData.list[dateIndex].weather[0].icon

                // Temp in kelvins converted to Farenheit
                temperature = (Number((weatherData.list[dateIndex].main.temp) * 9 / 5 - 459.67)).toFixed(1)

                // Humidity
                humidity = weatherData.list[dateIndex].main.humidity

                // Select the elements in the HTML
                let dateSelector = document.getElementById("date" + day)
                let weatherIconSelector = document.getElementById('weather-icon' + day)
                let tempSelector = document.getElementById("temp" + day)
                let humidSelector = document.getElementById("humid" + day)

                // Update the date, weather icon, temperature and humidity on the page
                dateSelector.textContent = fullDate
                weatherIconSelector.setAttribute('src', 'http://openweathermap.org/img/wn/' + weatherIcon + '.png')
                tempSelector.textContent = "Temp: " + temperature + '\u00B0 F'
                humidSelector.textContent = "Humidity: " + humidity + '%'
                    // increment the day and repeat for all 5 days
                day += 1

            }
            // Set the day back to the current date 
            dayOfTheMonth = d.getDate()
        })
}

// Call the API to initialize with the most recent
callAPI()