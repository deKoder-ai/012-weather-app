'use strict';

const key = 'SS3NAEGN7NVCHG3XAF38UDC6W';
const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/london?key=${key}`;
getWeather = () => {
  fetch('https://url.com/some/url')
    .then(function (response) {
      console.log(response);
    })
    .catch(function (err) {
      console.log(err);
    });
};

export { getWeather };
