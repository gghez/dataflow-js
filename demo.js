var dataflowJs = require('./src/index');
var Q = require('q');

var http = require('http');

var TransformBlock = dataflowJs.TransformBlock;
var ActionBlock = dataflowJs.ActionBlock;
var TransformManyBlock = dataflowJs.TransformManyBlock;

var WEATHER_REST_API = 'http://api.openweathermap.org/data/2.5/forecast?lat=35&lon=139';

var readUrl = new TransformBlock(function (url) {
    var defer = Q.defer();

    http.get(url, function (res) {
        var chunks = [];
        res.on('data', function (chunk) {
            chunks.push(chunk.toString());
        });
        res.on('end', function () {
            var cityForecasts = JSON.parse(chunks.join(''));
            defer.resolve(cityForecasts);
        });

    }).on('error', function (err) {
        defer.reject(err);
    });

    return defer.promise;
});

var clearForecasts = new TransformManyBlock(function (cityForecasts) {
    return cityForecasts.list.filter(function (forecast) {
        return forecast.weather.some(function (w) {
            return w.id == 800; // 800 = Clear
        });
    });
});

var printForecast = new ActionBlock(function (forecast) {
    console.log(forecast.dt_txt, ' with wind speed:', forecast.wind.speed);
});

readUrl.linkTo(clearForecasts);
clearForecasts.linkTo(printForecast);


console.log('Clear weather dates:');
readUrl.post(WEATHER_REST_API);

readUrl.completion.then(function () {
    console.log('end.');
});
