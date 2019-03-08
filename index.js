function getData(url){
    return new Promise(function(res, rej){
        let req = new XMLHttpRequest();
        req.open('GET', url);
        req.onload = function(){
            let result = JSON.parse(this.response);
            res(result);
        };
        req.onerror = function(e){
            if(req.status === 404){
                rej('NOT FOUND');
            }
            rej(e);
        };
        req.send();
    });
}


(async function(){
    const key = 'bff124cc1acef3d3ae17375e746e2edc';
    const data = await getData(`http://api.openweathermap.org/data/2.5/weather?q=Kiev&appid=${key}`);
    const weather = document.getElementById('weather');
    const weatherDetails = document.createElement('ul');
          weatherDetails.classList.add('weatherDetails');

    const main = {temp, temp_max, temp_min, humidity, pressure} = data.main;
    console.log(data);

//city handle
    const city = document.createElement('h2');
          city.classList.add('city')
          city.innerText = data.name;
    weather.appendChild(city);

//discription handle
    const des = document.createElement('p');
          des.classList.add('description')
          des.innerText = data.weather[0].description;
    weather.appendChild(des);

//temperature handle
    const tempWithCelsius = temp => `${parseInt( (temp - 273.15) )}${'&#xb0;'}`;

    const currentTemp = document.createElement('h1');
    currentTemp.classList.add('currentTemp')
    currentTemp.innerHTML = tempWithCelsius(temp)+'C'.toLowerCase();


    const tempMaxMi = document.createElement('p');
    tempMaxMi.classList.add('maxMi');
    tempMaxMi.innerHTML = `${tempWithCelsius(temp_max)}/${tempWithCelsius(temp_min)}`;

    weather.appendChild(currentTemp);

//day handle
    const day = document.createElement('p');
          day.classList.add('day')
          day.innerText = new Date(data.dt*1000).toLocaleString('UA', {weekday: 'long'});
    weather.appendChild(day);

    weather.appendChild(tempMaxMi);

//details section handle
    const opt = {
        hour12: false,
        hour:"2-digit",
        minute:"2-digit"
    }
    const sunrise = new Date(data.sys.sunrise * 1000).toLocaleString('uk-UA', opt);
    const sunset = new Date(data.sys.sunset * 1000).toLocaleString('uk-UA', opt);

    function detailsWeatherList(text, title, className, whereTo){
        const li = document.createElement('li');
        const titleWrap = document.createElement('h4');
        const textWrap = document.createElement('p');

        titleWrap.innerText = `${title}`;
        textWrap.innerHTML = `${text}`;
        li.classList.add(className);

        li.appendChild(titleWrap);
        li.appendChild(textWrap);
        whereTo.appendChild(li);
    }

    detailsWeatherList(`${sunrise}`, 'Sunrise', 'sunrise', weatherDetails);
    detailsWeatherList(`${sunset}`, 'Sunset', 'sunset', weatherDetails);
    detailsWeatherList(`${humidity}%`, 'Humidity', 'humidity', weatherDetails);
    detailsWeatherList(`${pressure} hPa`, 'Pressure', 'pressure', weatherDetails);
    detailsWeatherList(`${data.wind.speed} m/sec`, 'Wind', 'windspeed', weatherDetails);
    detailsWeatherList(`${data.visibility/1000} km`, 'Visibility', 'visibility', weatherDetails);
    
    weather.appendChild(weatherDetails);
})();