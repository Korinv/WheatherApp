"use strict";

const localization = document.querySelector(".localization");
const weather = document.querySelector(".weather");
const temperature = document.querySelector(".temperature");
const input = document.querySelectorAll(".form__input");
const formCity = document.querySelector(".form__city");
const formLL = document.querySelector(".form__ll");
const inputCity = document.querySelector(".form__input--city");
const inputLat = document.querySelector(".form__input--lat");
const inputLng = document.querySelector(".form__input--lng");
const btnCity = document.querySelector(".btn__city");
const btnLatLng = document.querySelector(".btn__latlng");
const inputLang = document.querySelector(".form__lang--input");
const inputUni = document.querySelector(".form__uni--input");
const btnSave = document.querySelector(".btn__save");

// Geolocalization
function _getPosition() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async function (res) {
        const { latitude } = res.coords;
        const { longitude } = res.coords;
        const respo = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${"051b5e361d8b50d5967df82e4846606d"}&units=${
            inputUni.value
          }&lang=${inputLang.value}`
        );
        console.log(respo);
        const data = await respo.json();
        // await console.log(data);
        await _changePage(data);
      },
      function () {
        localization.textContent = "Could not get your position";
        localization.style.color = "red";
      }
    );
  }
}

function _changePage(data) {
  localization.textContent = data.name;
  localization.style.color = "greenyellow";
  const temp = Math.round(data.main.temp);
  if (inputUni.value === "metric") {
    temperature.textContent = `${temp}°C`;
    if (temp <= -20) {
      temperature.style.color = "white";
    } else if (temp <= 0) {
      temperature.style.color = "aquamarine";
    } else if (temp <= 20) {
      temperature.style.color = "greenyellow";
    } else if (temp <= 40) {
      temperature.style.color = "yellow";
    } else {
      temperature.style.color = "red";
    }
  } else {
    temperature.textContent = `${temp}°F`;
    if (temp <= -4) {
      temperature.style.color = "white";
    } else if (temp <= 32) {
      temperature.style.color = "aquamarine";
    } else if (temp <= 68) {
      temperature.style.color = "greenyellow";
    } else if (temp <= 104) {
      temperature.style.color = "yellow";
    } else {
      temperature.style.color = "red";
    }
  }

  temperature.style.fontSize = "64px";
  weather.textContent = data.weather[0].description;
  weather.style.fontSize = "32px";
}

function _form(e) {
  formCity.addEventListener("submit", submitCity.bind(this));
  formLL.addEventListener("submit", submitLL.bind(this));
  btnCity.addEventListener("click", submitCity.bind(this));
  btnLatLng.addEventListener("click", submitLL.bind(this));
  btnSave.addEventListener("click", changed.bind(this));
}

function submitCity(e) {
  e.preventDefault();
  _dataFormCity();
}

function submitLL(e) {
  e.preventDefault();
  _dataFormLL();
}

function changed(e) {
  e.preventDefault();
  _getPosition();
}

function _noCityOrLL(data) {
  if (data.cod === "404") {
    temperature.style.color = "red";
    temperature.textContent =
      data.message.charAt(0).toUpperCase() + data.message.slice(1);
    temperature.style.fontSize = "64px";
    weather.textContent = "Try again";
    localization.textContent = "";
  } else if (data.cod === "400") {
    temperature.style.color = "red";
    temperature.textContent =
      data.message.charAt(0).toUpperCase() + data.message.slice(1);
    temperature.style.fontSize = "64px";
    weather.textContent = "Try again";
    localization.textContent = "";
  }
  _clearForm();
}

async function _dataFormCity() {
  console.log(inputCity.value);
  const respo = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${
      inputCity.value
    }&appid=${"051b5e361d8b50d5967df82e4846606d"}&units=${
      inputUni.value
    }&lang=${inputLang.value}`
  );
  const data = await respo.json();
  await _noCityOrLL(data);
  // await console.log(data);
  await _changePage(data);
  _clearForm();
}

async function _dataFormLL() {
  const respo = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${
      inputLat.value
    }&lon=${inputLng.value}&appid=${"051b5e361d8b50d5967df82e4846606d"}&units=${
      inputUni.value
    }&lang=${inputLang.value}`
  );
  const data = await respo.json();
  await _noCityOrLL(data);
  // await console.log(data);
  await _changePage(data);
  _clearForm();
}

function _clearForm() {
  inputCity.value = inputLat.value = inputLng.value = "";
}

_getPosition();
_clearForm();
_form();
