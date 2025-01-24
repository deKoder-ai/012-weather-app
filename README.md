# template

basic webpack website skeleton
https://www.upgrad.com/blog/introduction-to-package-json-scripts-in-node-js/

npm install | install all dependencies from package.json
npm run build | compile project
npm run dev | starts a development server and loads the website
npm run deploy | check this on odin

read more on webpack merge:
https://webpack.js.org/guides/production/

https://www.visualcrossing.com/weather/weather-data-services
SS3NAEGN7NVCHG3XAF38UDC6W
https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/london?key=11111111111111111

Giphy
c5PTTbRxY1Wth7jYtEHAjasnsXjjmAVu
'https://api.giphy.com/v1/gifs/translate?api_key=YOUR_KEY_HERE&s=cats'

https://aqicn.org/
Air Quality
33849d1c7b4e9181661a2ea8a1b7a42d043f0dcc


Use everything we’ve been discussing to create a weather forecast site using the Visual Crossing API from previous lessons. You should be able to search for a specific location and toggle displaying the data in Fahrenheit or Celsius.

You should change the look of the page based on the data, maybe by changing the color of the background or by adding images that describe the weather. (You could even use the Giphy API to find appropriate weather-related gifs and display them). Feel free to use promises or async/await in your code, though you should try to become comfortable with both.

Write the functions that hit the API. You’re going to want functions that can take a location and return the weather data for that location. For now, just console.log() the information.
Write the functions that process the JSON data you’re getting from the API and return an object with only the data you require for your app.
Set up a form that will let users input their location and will fetch the weather info (still just console.log() it).
Display the information on your webpage!
Add any styling you like!
Optional: add a ‘loading’ component that displays from the time the form is submitted until the information comes back from the API. Use DevTools to simulate network speeds.