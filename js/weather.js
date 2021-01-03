var apikey = '4d8fb5b93d4af21d66a2948710284366';
var lang = encodeURI(navigator.language || navigator.userLanguage);
var langcode = lang.slice(0, 2);

if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(onSuccess)
}

async function onSuccess(pos) {
	let lat = pos.coords.latitude, lon = pos.coords.longitude;

	let res = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=daily,hourly,minutely&appid=${apikey}&lang=${langcode}&units=metric`);

	if (res.ok) {
		let data = await res.json();
		updateWeather(data);
	}
}

function updateWeather(data) {
	let div = document.getElementById('weather-display');
	let cur = data.current.weather[0];
	let icon = `https://openweathermap.org/img/wn/${cur.icon}.png`;
	div.innerHTML = `${cur.main}<img src="${icon}" width="24" height="24"></img> ${data.current.temp}<sup>o</sup>`;
}