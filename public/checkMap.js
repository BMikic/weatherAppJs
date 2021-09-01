var myMap = L.map('myMap').setView([0, 0], 2);
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const tiles = L.tileLayer(tileUrl, { attribution });
tiles.addTo(myMap);

getData();

async function getData() {
    const response = await fetch('/api');
    const data = await response.json();
    
    for (item of data) {
        console.log(item)
        const marker = L.marker([item.lat, item.lon]).addTo(myMap);
         let txt = `
         The weather here at ${item.lat}&deg;, ${item.lon}&deg; ${item.weather.summary} with a temperature of ${item.weather.temperature}&deg; C.
         `;
        if (item.air.value < 0) {
            txt += " No air quality reading.";
        } else {
            txt += `
            The concentration of particulate matter (${item.air.measurements[0].parameter}) is ${item.air.measurements[0].value} ${item.air.measurements[0].unit} last read
            on ${ item.air.measurements[0].lastUpdated }.`;
        }
        
        marker.bindPopup(txt);
        // console.log(air)
    }

}