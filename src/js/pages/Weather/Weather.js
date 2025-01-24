'use strict';

import './weather.css';
import { leafletMap } from '../../Classes/LeafletMap';
import { Aqi } from '../../Classes/Aqi/Aqi';
import { kphToBeaufort } from '../../scripts/kphToBeaufort.js';
import { degToCompass } from '../../scripts/degToCompass.js';

class Weather {
  constructor() {
    this.url =
      'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/';
    this.units = 'metric'; // metric / us / uk
    this.location = '';
    this.key = 'SS3NAEGN7NVCHG3XAF38UDC6W';
    this.kphToBeaufort = kphToBeaufort;
    this.degToCompass = degToCompass;

    this.getElements();
    this.eventHandlers();
    this.map = new leafletMap(0, 71, 1);

    // air quality index
    this.aqi = new Aqi();
    this.aqiContainer.innerHTML = this.aqi.html;
    this.aqi.fetchData(13.7534, 100.505);

    // test data
    this.setGridLocation('กรุงเทพมหานคร, ประเทศไทย', 13.7534, 100.505);
    this.setTemperature(31.3, 30.6, 35.3);
    this.setRain(0, 0, null);
    this.setWind(9.7, 7.8, 103, 1011.6);
    this.setSolar(9, '06:46:02', '18:13:18', 0.75);
    this.conditions = 'Partially cloudy';
    this.updateDom();
  }
  updateDom = () => {
    this.latitudeDispl.innerText = `LATITUDE: ${this.gridLocation.latitude}`;
    this.longitudeDispl.innerText = `LONGITUDE: ${this.gridLocation.longitude}`;
    this.locationDisp.innerText = this.gridLocation.address;

    this.updateWeatherIcon();
    this.uvIndexDispl.className = '=';
    this.humidityDispl.innerText = `HUMIDITY: ${this.temperature.humidity}%`;
    this.uvIndexDispl.classList.add(`uv-index-${this.solar.uvindex}`);
    if (this.solar.uvindex === 0) {
      this.uvIndexNa.style.display = 'block';
    } else {
      this.uvIndexNa.style.display = 'none';
    }
    this.tempDisp.innerText = `${this.temperature.temp}°c`;
    this.feelslikeDispl.innerText = `FEELS LIKE: ${this.temperature.feelslike}°c`;
    this.updateThermometer();
    this.conditionsDispl.innerText = this.conditions;
    this.windSpeedDispl.innerText = `${this.wind.windspeed} kph`;
    this.beaufortIconUpdate(this.wind.beaufort, this.wind.winddir);
    this.windDirDispl.innerText = `${this.wind.winddir}°`;
    this.pressureDispl.innerText = `${this.wind.pressure} mba`;
    this.windDirectionDispl1.style.transform = `rotate(${this.wind.winddir + 180}deg)`;
    this.windDirectionDispl2.style.transform = `rotate(${this.wind.winddir + 180}deg)`;
    this.sunriseSetText.innerText = `${this.solar.sunrise}  ~  ${this.solar.sunset}`
  };
  getElements = () => {
    this.locationInput = document.getElementById('weather-location');
    this.aqiToggle = document.getElementById('aqi-toggle');
    this.latitudeDispl = document.getElementById('latitude');
    this.longitudeDispl = document.getElementById('longitude');
    this.locationDisp = document.getElementById('location');

    this.weatherIconDispl = document.getElementById('weather-icon-bcg');
    this.humidityDispl = document.getElementById('humidity');
    this.uvIndexDispl = document.getElementById('uv-index');
    this.uvIndexNa = document.getElementById('uv-index-na');
    this.tempDisp = document.getElementById('temp');
    this.feelslikeDispl = document.getElementById('feels-like');
    this.thermometerDispl = document.getElementById('thermometer');
    this.conditionsDispl = document.getElementById('conditions');
    this.windSpeedDispl = document.getElementById('windspeed');
    this.beaufortIcon = document.getElementById('beaufort-icon');
    this.beaufortForceText = document.getElementById('beaufort-force-text');
    this.windDirDispl = document.getElementById('winddir');
    this.pressureDispl = document.getElementById('pressure');
    this.windDirectionDispl1 = document.getElementById('wind-direction-1');
    this.windDirectionDispl2 = document.getElementById('wind-direction-2');
    this.sunriseSetText = document.getElementById('sunrise-set-text');
    this.aqiContainer = document.getElementById('city-aqi-container');
  };
  eventHandlers = () => {
    this.locationInput.addEventListener('focus', this.addEnterEvent);
    this.locationInput.addEventListener('blur', this.remEnterEvent);
    this.aqiToggle.addEventListener('change', this.toggleAqiLayer);
  };
  toggleAqiLayer = () => {
    if (this.aqiToggle.checked) {
      this.map.addAqi();
    } else if (!this.aqiToggle.checked) {
      this.map.remAqi();
    }
  }
  addEnterEvent = (e) => {
    e.target.addEventListener('keydown', this.checkEnter);
  };
  remEnterEvent = (e) => {
    e.target.removeEventListener('keydown', this.checkEnter);
  };
  checkEnter = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.location = e.target.value;
      this.setRequest();
      this.fetchData();
    }
  };
  setRequest = () => {
    this.request = `${this.url}${this.location}?unitGroup=${this.units}&key=${this.key}&iconSet=icons2&contentType=json`;
  };
  fetchData = async () => {
    const response = await fetch(this.request);
    const x = await response.json();
    // console.log(x);
    // console.log(x.currentConditions);
    // console.log(x.currentConditions.sunrise);

    this.setGridLocation(x.resolvedAddress, x.latitude, x.longitude);
    const cc = x.currentConditions;
    this.setTemperature(cc.temp, cc.feelslike, cc.humidity);
    this.setRain(cc.precip, cc.precipprob, cc.preciptype);
    const beaufort = this.kphToBeaufort(cc.windspeed);
    this.setWind(cc.windgust, cc.windspeed, cc.winddir, cc.pressure, beaufort);
    this.setSolar(cc.uvindex, cc.sunrise, cc.sunset, cc.moonphase);
    this.conditions = cc.conditions;
    this.icon = cc.icon;

    // console.log(this.gridLocation);
    // console.log(this.temperature);
    // console.log(this.rain);
    // console.log(this.wind);
    // console.log(this.solar);
    this.aqi.fetchData(x.latitude, x.longitude);

    this.updateDom();
    // this.map.innerHTML = ''
    if (!this.map) {
      this.map = new leafletMap(this.gridLocation.latitude, this.gridLocation.longitude, 9.5);
    } else {
      this.map.flyTo(this.gridLocation.latitude, this.gridLocation.longitude);
    }
    
    // const map = new leafletMap();
  };
  // updateConditions = ()
  setGridLocation = (address, latitude, longitude) => { // done
    this.gridLocation = {
      address: address,
      latitude: latitude,
      longitude: longitude,
    };
  };
  setTemperature = (temp, feelslike, humidity) => { //done
    this.temperature = {
      temp: temp,
      feelslike: feelslike,
      humidity: humidity,
    };
  };
  setRain = (precip, precipprob, preciptype) => {
    this.rain = {
      precip: precip,
      precipprob: precipprob,
      preciptype: preciptype,
    };
  };
  setWind = (windgust, windspeed, winddir, pressure, beaufort) => { // done
    this.wind = {
      windgust: windgust,
      windspeed: windspeed,
      winddir: winddir,
      pressure: pressure,
      beaufort: beaufort,
    };
  };
  setSolar = (uvindex, sunrise, sunset, moonphase) => {
    this.solar = {
      uvindex: uvindex,
      sunrise: sunrise.slice(0, 5),
      sunset: sunset.slice(0, 5),
      moonphase: moonphase,
    };
  };
  updateWeatherIcon = () => {
    this.weatherIconDispl.className = '';
    this.weatherIconDispl.classList.add(`${this.icon}`);
  };
  updateThermometer = () => {
    this.thermometerDispl.className = '';
    if (this.temperature.temp > 29.9) {
      this.thermometerDispl.classList.add(`hotter`);
    } else {
      this.thermometerDispl.classList.add(`cooler`);
    }
  };
  beaufortIconUpdate = (force, direction) => {
    this.beaufortIcon.className = '';
    const heading = degToCompass(direction).toUpperCase();
    this.beaufortIcon.classList.add(`force-${force}`);
    this.beaufortForceText.innerText = `${heading} FORCE ${force} WINDS`;
  }
}

export { Weather };

//  "description":
//  days [ -
//    "datetime": "2025-01-22"
//    "tempmax": 33.7,
//    "tempmin": 21,
//    "temp": 27.3,
//    "feelslikemax": 31.6,
//    "feelslikemin": 21,
//    "feelslike": 26.7,
//    "humidity": 49,
//    "precip": 0,
//    "precipprob": 0,
//    "windgust": 19.1,
//    "windspeed": 12.6,
//    "winddir": 113.3,
//    "pressure": 1010.3,
//    "cloudcover": 38.5,
//    "visibility": 14.2,
//    "solarradiation": 196.1,
//    "solarenergy": 16.9,
//    "uvindex": 9,
//    "severerisk": 10,
//    "sunrise": "06:46:02",
//    "sunset": "18:13:18",
//    "moonphase": 0.75,
//    "conditions": "Partially cloudy",
//    "description": "Becoming cloudy in the afternoon.",

// fetchImage = async () => {
//   try {
//     const response = await fetch(this.request, { method: 'GET', mode: 'cors' });
//     const imgArray = await response.json();
//     console.log(imgArray);
//     this.imgIndex = Math.min(this.imgIndex, imgArray.data.length);
//     const src = imgArray.data[this.imgIndex].images.original.url;
//     this.img.src = src;
//     if (this.logUrl) {
//       console.log(src);
//     }
//     this.errors = 0;
//   } catch (err) {
//     console.log(err);
//     if (this.errors < 5) {
//       this.search();
//       this.errors++
//     }
//   }
// };

// snow
// snow-showers-day
// snow-showers-night
// thunder-rain
// thunder-showers-day
// thunder-showers-night
// rain
// showers-day
// showers-night
// fog
// wind
// cloudy
// partly-cloudy-day
// partly-cloudy-night
// clear-day
// clear-night
