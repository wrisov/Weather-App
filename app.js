//AIzaSyCc4xzHR08lE9Lu5-BbnjmoG0ZuWCmhK08
const path = require('path');
const http = require('http');
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')
const express = require('express');
var favicon = require('serve-favicon')
var bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
var app = express();
app.set('view engine', 'ejs')
var server = http.createServer(app);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(favicon(path.join(__dirname, '/public', 'Favicon12.ico')))
app.get('/', function (req, res) {
  res.render('index', {weather: null, error: null});
})

app.post('/', (req, res) => {
  var encodedAddress = encodeURIComponent(req.body.city);
  if (!encodedAddress) {
    console.log('Please provide an address')
} else {
    geocode(encodedAddress, (error, { latitude, longitude, location }) => {
        if (error) {
            return res.render('index', {weather: null, error: error})
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.render('index', {weather: null, error: error})
            }

            console.log(location)
            console.log(forecastData)
            let weatherText = `In ${location} The weather forecast is ${forecastData}.`
            res.render('index', {weather: weatherText, error: null});
        })
    })
}
})
// const argv = yargs
//   .options({
//     a: {
//       demand: true,
//       alias: 'address',
//       describe: 'Address to fetch weather for',
//       string: true
//     }
//   })
//   .help()
//   .alias('help', 'h')
//   .argv;


server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
