let APIkey = '8121ebc866b52ea8600081b69ea2ab51'

let cityName = 'toronto'

let queryURL = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&appid=' + APIkey

fetch(queryURL)
    .then(function(response) {
        return response.json()
    })
    .then(function(weatherData) {
        console.log(weatherData)
        console.log(weatherData.city.name)

    })