const api = {
  key: "e4cdac73f7b5742149d41f122b4297ea",
  base: "https://api.openweathermap.org/data/2.5/"
};

const searchbox = document.querySelector('.search-box');
searchbox.addEventListener('input', () => {
  getCitySuggestions(searchbox.value);
});
searchbox.addEventListener('keypress', (evt) => {
  if (evt.keyCode === 13) {
    getWeather(searchbox.value);
  }
});

function getCitySuggestions(query) {
  fetch(`${api.base}find?q=${query}&type=like&sort=population&cnt=5&appid=${api.key}`)
    .then(response => {
      return response.json();
    }).then(data => {
      const suggestions = data.list.map(city => `${city.name}, ${city.sys.country}`);
      displayCitySuggestions(suggestions);
    });
}

function displayCitySuggestions(suggestions) {
  const suggestionContainer = document.querySelector('.suggestions');
  suggestionContainer.innerHTML = '';

  suggestions.forEach(suggestion => {
    const suggestionElement = document.createElement('div');
    suggestionElement.classList.add('suggestion');
    suggestionElement.innerText = suggestion;
    suggestionElement.addEventListener('click', () => {
      searchbox.value = suggestion;
      suggestionContainer.innerHTML = '';
      getWeather(suggestion);
    });

    suggestionContainer.appendChild(suggestionElement);
  });
}

function getWeather(query) {
  fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
    .then(response => {
      return response.json();
    }).then(weather => {
      displayWeather(weather);
    });
}

function displayWeather(weather) {
  let city = document.querySelector('.location .city');
  city.innerText = `${weather.name}, ${weather.sys.country}`;

  let now = new Date();
  let date = document.querySelector('.location .date');
  date.innerText = dateBuilder(now);

  let temp = document.querySelector('.current .temp');
  temp.innerHTML = `${Math.round(weather.main.temp)}<span>°c</span>`;

  let weather_el = document.querySelector('.current .weather');
  weather_el.innerText = weather.weather[0].main;

  let hilow = document.querySelector('.hi-low');
  hilow.innerText = `${Math.round(weather.main.temp_min)}°c / ${Math.round(weather.main.temp_max)}°c`;
}

function dateBuilder(d) {
  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return `${day} ${date} ${month} ${year}`;
}
