function formatDate(timestamp) {
  let date = new Date(timestamp);
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let month = months[date.getMonth()];
  let dates = date.getDate();
  let year = date.getFullYear();
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];

  return `${day} ${month} ${dates}, ${year} ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"];

  return days[day];
}

function displayForcast(response) {
  let forcast = response.data.daily;

  let forcastElement = document.querySelector("#forcast");

  let forcastHTML = `<div class="row">`;
  forcast.forEach(function (forcastDay, index) {
    if (index !== 0 && index < 6) {
      forcastHTML =
        forcastHTML +
        `<div class="col">
    <ul class="forcast-layout">
      <li>
        ${formatDay(forcastDay.dt)}
        <ul class="day-forcast">
          <li>
            <img
              src="http://openweathermap.org/img/wn/${
                forcastDay.weather[0].icon
              }@2x.png"
              alt=""
              class="forcast-icon"
            />
          </li>
          <li class="forcast-temperatures">
            <span class="forcast-high">${Math.round(
              forcastDay.temp.max
            )}</span><span class="high-low-units">°C</span>
            <span class="forcast-low">${Math.round(
              forcastDay.temp.min
            )}</span><span class="high-low-units">°C</span>
          </li>
        </ul>
      </li>
    </ul>
    </div>
  `;
    }
  });
  forcastHTML = forcastHTML + `</div>`;
  forcastElement.innerHTML = forcastHTML;
}

function getForcast(coordinates) {
  let apiKey = "49cb7b6601adf66f3ce54eb040e3a0ba";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForcast);
}

function displayTemperature(response) {
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let dateElement = document.querySelector("#date");
  let iconElement = document.querySelector("#icon");
  let highElement = document.querySelector("#high");
  let lowElement = document.querySelector("#low");

  celsiusTemperature = response.data.main.temp;
  highCelsiusTemperature = response.data.main.temp_max;
  lowCelsiusTemperature = response.data.main.temp_min;

  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  cityElement.innerHTML = response.data.name;
  descriptionElement.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
  highElement.innerHTML = Math.round(highCelsiusTemperature);
  lowElement.innerHTML = Math.round(lowCelsiusTemperature);

  if (response.data.weather[0].description === "clear sky") {
    document.body.style.backgroundImage = "url('images/white-sunshine.jpg')";
  } else if (response.data.weather[0].description === "snow") {
    document.body.style.backgroundImage = "url('images/white-snow.jpg')";
  } else if (
    response.data.weather[0].description === "thunderstorm" ||
    response.data.weather[0].description === "drizzle" ||
    response.data.weather[0].description === "rain"
  ) {
    document.body.style.backgroundImage = "url('images/white-dew.jpg')";
  } else {
    document.body.style.backgroundImage = "url('images/white-cloud.jpg')";
  }
  getForcast(response.data.coord);
}

function search(city) {
  let apiKey = "49cb7b6601adf66f3ce54eb040e3a0ba";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}

function currentLocationTemp() {
  {
    navigator.geolocation.getCurrentPosition(showPosition);
  }
  function showPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    let apiKey = "49cb7b6601adf66f3ce54eb040e3a0ba";
    let apiUrl = "https://api.openweathermap.org/data/2.5/weather?";
    let location = document.querySelector("#city");
    location.innerHTML = `Latitude: ${latitude} Longitude: ${longitude}`;
    axios
      .get(
        `${apiUrl}lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
      )
      .then(displayTemperature);
  }
}
function displayFahrenheitTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  fahrenheitLink.classList.remove("active");
  celsiusLink.classList.add("active");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

let celsiusTemperature = null;

let currentLocationButton = document.querySelector("#current-location-button");
currentLocationButton.addEventListener("click", currentLocationTemp);

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

search("Toronto");
