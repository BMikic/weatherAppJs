let lat, lon;
if ('geolocation' in navigator) {
  console.log('geolocation is available');
  navigator.geolocation.getCurrentPosition(async position => {
    let lat, lon, weather, air;
    try {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    document.getElementById('latitude').textContent = lat.toFixed(2);
    document.getElementById('longitude').textContent = lon.toFixed(2);

    const api_url = `weather/${lat},${lon}`;
    const response = await fetch(api_url);
    const json = await response.json();

    weather = json.weather;
    air = json.air_quality.results[0];
    // console.log(weather)
    console.log(json)

    document.getElementById('summary').textContent = weather.weather[0].description;
    document.getElementById('temperature').textContent = weather.main.temp;
    
    document.getElementById('aq_parameter').textContent = air.measurements[0].parameter;
    document.getElementById('aq_value').textContent = air.measurements[0].value;
    document.getElementById('aq_units').textContent = air.measurements[0].unit;
    document.getElementById('aq_date').textContent = air.measurements[0].lastUpdated;
  } catch {
    console.log('Something went wrong')
    air = { value: -1 };
    document.getElementById('aq_parameter').textContent = 'Data missing!';
    document.getElementById('aq_value').textContent = 'Data missing!';
    document.getElementById('aq_units').textContent = 'Data missing!';
    document.getElementById('aq_date').textContent = 'Data missing!';
  }

  const data = { lat, lon, weather, air };
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };
  const db_response = await fetch('/api', options);
  const db_json = await db_response.json();
  console.log(db_json)
  });
} else {
  console.log('geolocation is not available');
}
