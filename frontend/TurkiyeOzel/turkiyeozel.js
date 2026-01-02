
const key = "3d343230029e8b263287ffe252c6a4de";

const searchBar = document.getElementById("searchBar");


searchBar.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        sonuc(searchBar.value);
    }
});

const sonuc = async (sehirAdi) => {
   
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${sehirAdi}&limit=1&appid=${key}`;
    
    const geoRes = await fetch(url);
    const geoData = await geoRes.json();
    console.log(geoData);

    if (geoData.length == 0) {
        alert("Şehir bulunamadı!");
        return;
    }

    let lat = geoData[0].lat;
    let lon = geoData[0].lon;

   
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric&lang=tr`;

    const weatherRes = await fetch(weatherURL);
    const weatherData = await weatherRes.json();

    console.log(weatherData);
    
    havaDurumunuYaz(weatherData);
};

function havaDurumunuYaz(veri) {

    document.querySelector(".sehir").innerText = `${veri.name}, ${veri.sys.country}`;
    document.querySelector(".sicaklik").innerText = `${Math.round(veri.main.temp)}°C`;
    document.querySelector(".durum").innerText = veri.weather[0].description;
    document.querySelector(".minmax").innerText =`${Math.round(veri.main.temp_min)}°C / ${Math.round(veri.main.temp_max)}°C`;
};

