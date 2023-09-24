searchLocation("Long Branch");

var windString = "Wind: ";
var humString = "Humidty: ";
var tempString = "Temp: ";

var submitButton = document.getElementById("submit");
var input = document.getElementById("input");

submitButton.addEventListener("click", function () {
    var locationName = input.value;
    searchLocation(locationName);
});

var lon = 0;
var lat = 0;
function searchLocation(location) {
    fetch(
        "http://api.openweathermap.org/geo/1.0/direct?q=" +
            location +
            "&limit=5&appid=f6aa28f203f516a4b998dd881bfd8fc6"
    )
        .then(function (thing) {
            return thing.json();
        })
        .then(function (data) {
            console.log(data);
            lon = data[0].lon;
            console.log(lon);
            lat = data[0].lat;
            console.log(lat);

            displayPage(lat, lon);
        });
}

function displayPage(lat, lon) {
    fetch(
        "https://api.openweathermap.org/data/2.5/weather?lat=" +
            lat +
            "&lon=" +
            lon +
            "&appid=f6aa28f203f516a4b998dd881bfd8fc6"
    )
        .then(function (thing) {
            return thing.json();
        })
        .then(function (data) {
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

            var location = document.getElementById("location");

            // PANEL 2
            var currentTemp = document.getElementById("currentTemp");
            var feelsLike = document.getElementById("feelsLike");
            var humidity = document.getElementById("humidity");

            // PANEL 1
            var windSpeed = document.getElementById("windSpeed");
            var windGust = document.getElementById("windGust");
            var windDirection = document.getElementById("windDirection");

            location.innerText = data.name;
            var convertedTemp = kelvinToF(data.main.temp);
            console.log(convertedTemp);

            // PANEL 2
            currentTemp.innerText += "Current Temp: " + convertedTemp;
            feelsLike.innerText +=
                "Feels Like: " + kelvinToF(data.main.feels_like);
            humidity.innerText += humString + data.main.humidity + "%";

            // PANEL 1
            windSpeed.innerText += windString + data.wind.speed + " mph";
            windGust.innerText += "Wind Gusts: " + data.wind.gust + " mph";
            windDirection.innerText +=
                "Wind Direction: " + data.wind.deg + "\xB0";

            getIcon(location, data.weather[0].icon);

            console.log(data.main.temp);

            getFiveDay(lat, lon);
        });
}

function getFiveDay(lat, lon) {
    fetch(
        "https://api.openweathermap.org/data/2.5/forecast?lat=" +
            lat +
            "&lon=" +
            lon +
            "&appid=f6aa28f203f516a4b998dd881bfd8fc6"
    )
        .then(function (thing) {
            return thing.json();
        })
        .then(function (data) {
            console.log(data);
            var elementIds = [
                "day1",
                "day2",
                "day3",
                "day4",
                "day5",
                "temp1",
                "temp2",
                "temp3",
                "temp4",
                "temp5",
                "wind1",
                "wind2",
                "wind3",
                "wind4",
                "wind5",
                "humidity1",
                "humidity2",
                "humidity3",
                "humidity4",
                "humidity5",
            ];

            clearInnerTextOfElements(elementIds);

            // 5 DAY PANEL
            // -------------------------------------------------
            // DAY
            var day1 = document.getElementById("day1");
            var day2 = document.getElementById("day2");
            var day3 = document.getElementById("day3");
            var day4 = document.getElementById("day4");
            var day5 = document.getElementById("day5");

            // TEMP
            var temp1 = document.getElementById("temp1");
            var temp2 = document.getElementById("temp2");
            var temp3 = document.getElementById("temp3");
            var temp4 = document.getElementById("temp4");
            var temp5 = document.getElementById("temp5");

            // WIND
            var wind1 = document.getElementById("wind1");
            var wind2 = document.getElementById("wind2");
            var wind3 = document.getElementById("wind3");
            var wind4 = document.getElementById("wind4");
            var wind5 = document.getElementById("wind5");

            // HUMIDITY
            var humidity1 = document.getElementById("humidity1");
            var humidity2 = document.getElementById("humidity2");
            var humidity3 = document.getElementById("humidity3");
            var humidity4 = document.getElementById("humidity4");
            var humidity5 = document.getElementById("humidity5");

            // -------------------------------------------------
            // DAY
            day1.innerText = getDate(data.list[0].dt_txt);
            day2.innerText = getDate(data.list[8].dt_txt);
            day3.innerText = getDate(data.list[16].dt_txt);
            day4.innerText = getDate(data.list[24].dt_txt);
            day5.innerText = getDate(data.list[32].dt_txt);

            //  DAY ICON
            getIcon(day1, data.list[0].weather[0].icon);
            getIcon(day2, data.list[8].weather[0].icon);
            getIcon(day3, data.list[16].weather[0].icon);
            getIcon(day4, data.list[24].weather[0].icon);
            getIcon(day5, data.list[32].weather[0].icon);

            // TEMP

            temp1.innerText += tempString + kelvinToF(data.list[0].main.temp);
            temp2.innerText += tempString + kelvinToF(data.list[8].main.temp);
            temp3.innerText += tempString + kelvinToF(data.list[16].main.temp);
            temp4.innerText += tempString + kelvinToF(data.list[24].main.temp);
            temp5.innerText += tempString + kelvinToF(data.list[32].main.temp);

            // WIND

            wind1.innerText += windString + data.list[0].wind.speed + "mph";
            wind2.innerText += windString + data.list[8].wind.speed + "mph";
            wind3.innerText += windString + data.list[16].wind.speed + "mph";
            wind4.innerText += windString + data.list[24].wind.speed + "mph";
            wind5.innerText += windString + data.list[32].wind.speed + "mph";

            // HUMIDITY

            humidity1.innerText += humString + data.list[0].main.humidity + "%";
            humidity2.innerText += humString + data.list[8].main.humidity + "%";
            humidity3.innerText +=
                humString + data.list[16].main.humidity + "%";
            humidity4.innerText +=
                humString + data.list[24].main.humidity + "%";
            humidity5.innerText +=
                humString + data.list[32].main.humidity + "%";

            console.log(getDate(data.list[0].dt_txt));
        });
}

// fetch(
//     "https://api.openweathermap.org/data/2.5/weather?lat=39.6959&lon=-74.2535&appid=f6aa28f203f516a4b998dd881bfd8fc6"
// )
//     .then(function (thing) {
//         return thing.json();
//     })
//     .then(function (data) {
//         console.log(data);
//         var mainWeather = document.getElementById("panel1");
//         var basicPanel = document.getElementById("panel2");
//         var iconPanel = document.getElementById("panel3");
//         var location = document.getElementById("location");

//         // 5 DAY PANEL
//         var day1 = document.getElementById("day1");
//         var day2 = document.getElementById("day2");
//         var day3 = document.getElementById("day3");
//         var day4 = document.getElementById("day4");

//         // PANEL 2
//         var currentTemp = document.getElementById("currentTemp");
//         var feelsLike = document.getElementById("feelsLike");
//         var humidity = document.getElementById("humidity");

//         // PANEL 1
//         var windSpeed = document.getElementById("windSpeed");
//         var windGust = document.getElementById("windGust");
//         var windDirection = document.getElementById("windDirection");

//         location.innerText = data.name;
//         var convertedTemp = kelvinToF(data.main.temp);
//         console.log(convertedTemp);

//         // PANEL 2
//         currentTemp.innerText += " " + convertedTemp;
//         feelsLike.innerText += " " + kelvinToF(data.main.feels_like);
//         humidity.innerText += " " + data.main.humidity;

//         // PANEL 1
//         windSpeed.innerText += " " + data.wind.speed + " mph";
//         windGust.innerText += " " + data.wind.gust + " mph";
//         windDirection.innerText += " " + data.wind.deg + "\xB0";

//         getIcon(location, data.weather[0].icon);

//         console.log(data.main.temp);

//         searchLocation("London");
//     });

function kelvinToF(kelvin) {
    const celsius = kelvin - 273.15;
    let fahrenheit = celsius * (9 / 5) + 32;
    fahrenheit = Math.round(fahrenheit) + "\xB0" + "F";
    return fahrenheit;
}

function clearInnerTextOfElements(elementIds) {
    elementIds.forEach(function (elementId) {
        var element = document.getElementById(elementId);
        if (element) {
            element.innerText = "";
        }
    });
}

// function fiveDayEntry(var1,var2,var3,var4,var5,data,dataCommand) {
//     var var1 = document.getElementById(""+ var1 + "");
//     var var2 = document.getElementById(""+ var2 + "");
//     var var3 = document.getElementById(""+ var3 + "");
//     var var4 = document.getElementById(""+ var4 + "");
//     var var5 = document.getElementById(""+ var5 + "");

//     day1.innerText = getDate(data.list[0].dataCommand);
//     day2.innerText = getDate(data.list[8].dataCommand);
//     day3.innerText = getDate(data.list[1].dataCommand);
//     day4.innerText = getDate(data.list[2].dataCommand);
//     day5.innerText = getDate(data.list[3].dataCommand);
// }

function getDate(string) {
    let month = string.substr(5, 2);
    let year = string.substr(0, 4);
    let day = string.substr(8, 2);

    string = month + "/" + day + "/" + year;
    return string;
}

function getIcon(element, iconTag) {
    var iconURL = "https://openweathermap.org/img/wn/" + iconTag + "@2x.png";

    var image = document.createElement("img");

    image.src = iconURL;
    image.setAttribute("class", "icon");
    element.append(image);
}

function getStats(data, container) {}
