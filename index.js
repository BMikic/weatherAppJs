const express = require('express');
const Datastore = require('nedb');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server listening on ${port}`));
app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));

const database = new Datastore('datastore.db');
database.loadDatabase();

app.get('/api', (request, response) => {
    database.find({}, (err, data) => {
        if (err) {
            response.end();
            return;
        }
        response.json(data);
    })
})

app.post('/api', (request, response) => {
    console.log('I got request!');
    const data = request.body
    database.findOne({lat: data.lat, lon: data.lon}, (err, doc) => {
        if (!doc) {
            return database.insert(data);
        }
    })
    const timestamp = Date.now();
    data.timestamp = timestamp;
    response.json(data)
})

app.get('/weather/:latlon', async (request, response) => {
    const latlon = request.params.latlon.split(',');
    
    const lat = latlon[0];
    const lon = latlon[1];
    const api_key = process.env.API_KEY;
    const weather_url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${api_key}`;
    const weather_response = await fetch(weather_url);
    const weather_data = await weather_response.json();

    const aq_url = `https://docs.openaq.org/v2/latest?coordinates=${lat},${lon}`;
    const aq_response = await fetch(aq_url);
    const aq_data = await aq_response.json();

    const data = { 
        weather: weather_data,
        air_quality: aq_data
    }

    response.json(data);
})