// Sets default location to Long Branch
searchLocation("Long Branch");

// STRING VARIABLES
// --------------------------------------------------------
var windString = "Wind: ";
var humString = "Humidty: ";
var tempString = "Temp: ";

// LOCATION VARIABLES
// --------------------------------------------------------
var geoName = "";
var lon = 0;
var lat = 0;

// DOM ELEMENTS
// --------------------------------------------------------
const submitButton = document.getElementById("submit");
const input = document.getElementById("input");
const recentLocation = document.getElementById("recent-location");
const date = document.getElementById("date");

// EVENT LISTENERS
// --------------------------------------------------------
submitButton.addEventListener("click", function () {
    var locationName = input.value;
    input.value = " ";
    searchLocation(locationName);
});

recentLocation.addEventListener("click", function (eventObj) {
    var clickedButton = eventObj.target;
    var loc = clickedButton.innerText;

    if (clickedButton.tagName === "LI") {
        searchLocation(loc);
    }
});

// INITIALIZE LOCAL STORAGE AND RECENT LOCATION BAR
// --------------------------------------------------------
setLocalStorage();
displayRecentLocation();

// FUNCTIONS
// --------------------------------------------------------
// Searches for a location and then get longitude and latitude
function searchLocation(location) {
    fetch(
        "https://api.openweathermap.org/geo/1.0/direct?q=" +
            location +
            "&limit=5&appid=f6aa28f203f516a4b998dd881bfd8fc6"
    )
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (data.length === 0) {
                alert("Location Not Found");
            } else {
                console.log(data);
                lon = data[0].lon;
                console.log(lon);
                lat = data[0].lat;
                console.log(lat);
                geoName = data[0].name;
                console.log(geoName);
                displayPage(lat, lon);
            }
        });
}

// Displays weather information on the page
function displayPage(lat, lon) {
    fetch(
        "https://api.openweathermap.org/data/2.5/weather?lat=" +
            lat +
            "&lon=" +
            lon +
            "&appid=f6aa28f203f516a4b998dd881bfd8fc6"
    )
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log("HERERERERERERER");
            console.log(data);

            var elementIds = [
                "currentTemp",
                "feelsLike",
                "humidity",
                "windSpeed",
                "windGust",
                "windDirection",
            ];

            clearInnerTextOfElements(elementIds);

            // PANEL 1
            var location = document.getElementById("location");
            var mainIcon = document.getElementById("mainIcon");

            // PANEL 2
            var currentTemp = document.getElementById("currentTemp");
            var feelsLike = document.getElementById("feelsLike");
            var humidity = document.getElementById("humidity");

            // PANEL 3
            var windSpeed = document.getElementById("windSpeed");
            var windGust = document.getElementById("windGust");
            var windDirection = document.getElementById("windDirection");

            location.innerText = geoName;

            var locStor = getLocalStorage();
            console.log("List:" + locStor);
            var match = 0;
            locStor.forEach(function (index) {
                if (index === geoName) {
                    match++;
                }
            });
            if (match === 0) {
                locStor.shift();
                locStor.push(geoName);
                recentLocation.innerHTML = "";
                localStorage.setItem("location", JSON.stringify(locStor));
                displayRecentLocation();
            }

            console.log("List After:" + locStor);

            mainIcon.src =
                "https://openweathermap.org/img/wn/" +
                data.weather[0].icon +
                "@2x.png";

            var convertedTemp = kelvinToF(data.main.temp);
            console.log(convertedTemp);

            // PANEL 2
            currentTemp.innerText = "Current Temp: " + convertedTemp;
            feelsLike.innerText =
                "Feels Like: " + kelvinToF(data.main.feels_like);
            humidity.innerText = humString + data.main.humidity + "%";

            // PANEL 1
            windSpeed.innerText = windString + data.wind.speed + " mph";
            windGust.innerText = "Wind Gusts: " + data.wind.gust + " mph";
            windDirection.innerText =
                "Wind Direction: " + data.wind.deg + "\xB0";

            // getIcon(location, data.weather[0].icon);

            console.log(data.main.temp);

            getFiveDay(lat, lon);
        });
}

// Gets 5 day weather forecast
function getFiveDay(lat, lon) {
    fetch(
        "https://api.openweathermap.org/data/2.5/forecast?lat=" +
            lat +
            "&lon=" +
            lon +
            "&appid=f6aa28f203f516a4b998dd881bfd8fc6"
    )
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var elementIds = [];
            for (var i = 1; i <= 5; i++) {
                elementIds.push(
                    "day" + i,
                    "temp" + i,
                    "wind" + i,
                    "humidity" + i
                );
            }

            clearInnerTextOfElements(elementIds);

            date.innerText = getDate(data.list[0].dt_txt, 1);

            // 5 DAY PANEL
            // -------------------------------------------------

            for (var i = 0; i < 5; i++) {
                var day = document.getElementById("day" + (i + 1));
                var temp = document.getElementById("temp" + (i + 1));
                var wind = document.getElementById("wind" + (i + 1));
                var humidity = document.getElementById("humidity" + (i + 1));

                day.innerText = getDate(data.list[i * 8].dt_txt, 0);
                getIcon(day, data.list[i * 8].weather[0].icon);

                temp.innerText =
                    tempString + kelvinToF(data.list[i * 8].main.temp);
                wind.innerText =
                    windString + data.list[i * 8].wind.speed + "mph";
                humidity.innerText =
                    humString + data.list[i * 8].main.humidity + "%";
            }

            console.log(getDate(data.list[0].dt_txt, 0));
        });
}

// Converts kelvin to fahrenheit
function kelvinToF(kelvin) {
    const celsius = kelvin - 273.15;
    let fahrenheit = celsius * (9 / 5) + 32;
    fahrenheit = Math.round(fahrenheit) + "\xB0" + "F";
    return fahrenheit;
}

// Clears inner text of HTML Elements
function clearInnerTextOfElements(elementIds) {
    elementIds.forEach(function (elementId) {
        var element = document.getElementById(elementId);
        if (element) {
            element.innerText = "";
        }
    });
}

// Formats date
function getDate(string, date) {
    let month = string.substr(5, 2);
    let year = string.substr(0, 4);
    let day = string.substr(8, 2);
    day = day - date;

    string = month + "/" + day + "/" + year;
    return string;
}

// Gets weather icon and displays it
function getIcon(element, iconTag) {
    var iconURL = "https://openweathermap.org/img/wn/" + iconTag + "@2x.png";

    var image = document.createElement("img");

    image.src = iconURL;
    image.setAttribute("class", "icon");
    element.append(image);
}

// Sets initial values in local storage
function setLocalStorage() {
    var locationArray = [
        "London",
        "Rome",
        "New York City",
        "Atlantic City",
        "New Brunswick",
    ];

    localStorage.setItem("location", JSON.stringify(locationArray));
}

// Gets data from local storage
function getLocalStorage() {
    return JSON.parse(localStorage.getItem("location")) || [];
}

// Displays recent location history
function displayRecentLocation() {
    var array = getLocalStorage();
    for (var i = 0; i < array.length; i++) {
        var el = document.createElement("li");

        el.textContent = array[i];
        el.classList.add("clickable");
        console.log(array);
        console.log("Iteration: " + i);
        recentLocation.append(el);
    }
}
