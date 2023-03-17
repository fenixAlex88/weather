const KEY = 'c6aac0e984519508cbdc1ecb29ab5843';

const root = document.getElementById('root');
const popUp = document.getElementById('popup');
const textImput = document.getElementById('text-input');
const form = document.getElementById('form');
const popupClose = document.getElementById('close');

let store = {
    city: localStorage.getItem('city') || 'New York'
};

const fetchData = async () => {
    try {
        const data = await
            fetch(`http://api.weatherstack.com/current?access_key=${KEY}&query=${store.city}`)
                .then((response) => {
                    return response.json();
                });

                console.log(data);
        const {
            current: {
                feelslike,
                temperature,
                observation_time: observationTime,
                is_day: isDay,
                weather_descriptions: discription,
                cloudcover,
                humidity,
                wind_speed: windSpeed,
                visibility,
                pressure,
                uv_index: uvIndex
            }
        } = data;


        store = {
            ...store,
            feelslike,
            temperature,
            observationTime,
            isDay,
            discription: discription[0],
            properties: {
                cloudcover: {
                    title: 'cloudcover',
                    value: `${cloudcover}%`,
                    icon: 'cloud.png'
                },
                humidity: {
                    title: 'humidity',
                    value: `${humidity}%`,
                    icon: 'humidity.png'
                },
                windSpeed: {
                    title: 'wind speed',
                    value: `${windSpeed} km/h`,
                    icon: 'wind.png'
                },
                visibility: {
                    title: 'visibility',
                    value: `${visibility} km`,
                    icon: 'visibility.png'
                },
                pressure: {
                    title: 'pressure',
                    value: `${pressure} MBar`,
                    icon: 'gauge.png'
                },
                uvIndex: {
                    title: 'uv index',
                    value: uvIndex>10?'extrime':uvIndex>7?'Very High':uvIndex>5?'High':uvIndex>2?'Moderate':'Low',
                    icon: 'uv-index.png'
                }
            }
        };
        renderComponent();
    } catch (ex) {
        console.log(ex);
        alert(`Неудалось узнать погоду в городе ${store.city} :((`);
    }
}

const getImage = (description) => {
    switch (description.toLowerCase()) {
        case "partly cloudy":
            return "partly.png";
        case "fog":
            return "fog.png";
        case "sunny":
            return "sunny.png";
        case "cloud":
            return "cloud.png";
        case "haze":
            return "haze.png";
        case "mist":
            return "fog.png";
        case "overcast":
            return "cloud.png";
        default:
            return "the.png";
    }
};

const renderProperty = (properties) =>
    Object.values(properties).map(({icon, title, value}) => {
        return `<div class="property">
            <div class="property-icon">
              <img src="./img/icons/${icon}" alt="">
            </div>
            <div class="property-info">
              <div class="property-info__value">${title}</div>
              <div class="property-info__description">${value}</div>
            </div>
          </div>`;
    }).join('');


const markUp = () => {
    const {city, discription, observationTime, temperature, feelslike, isDay, properties} = store;
    const containetClass = isDay === 'yes' ? 'is-day' : '';
    return `<div class="container ${containetClass}">
            <div class="top">
              <div class="city">
                <div class="city-subtitle">Weather Today in</div>
                  <div class="city-title" id="city">
                  <span>${city}</span>
                </div>
              </div>
              <div class="city-info">
                <div class="top-left">
                <img class="icon" src="img/${getImage(discription)}" alt="" />
                <div class="description">${discription}</div>
              </div>
            
              <div class="top-right">
                <div class="city-info__subtitle">as of ${observationTime}</div>
                <div class="city-info__title">${temperature}&deg feels like ${feelslike}&deg</div>
              </div>
            </div>
          </div>
        <div id="properties">${renderProperty(properties)}</div>
      </div>`
};
const togglePopupClass = () => {
    popUp.classList.toggle('active');
};

const handleSubmit = (e) => {
    e.preventDefault();
    const city = textImput.value;
    if (!city) return;
    store = {
        ...store,
        city
    };
    localStorage.setItem('city', city);
    fetchData();
    togglePopupClass();
}

const renderComponent = () => {
    root.innerHTML = markUp();
    const city = document.getElementById('city');
    city.addEventListener('click', togglePopupClass);
}

form.addEventListener('submit', handleSubmit);
popupClose.addEventListener('click', togglePopupClass);

fetchData();



