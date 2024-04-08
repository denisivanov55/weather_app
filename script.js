const link = "http://api.weatherapi.com/v1/current.json?key=006691f56cdf4911983134458240304";

const root = document.getElementById('root');
const popup = document.getElementById('popup');
const textInput = document.getElementById('text-input');
const form = document.getElementById('form');

let store = {
    city: "Novosibirsk",
    feelslikeC: 0,
    tempC: 0,
    lastUpdated: "HH:mm AM",
    isDay: 1,
    description: "",
    properties: {
        cloud: {},
        humidity: {},
        windDir: {},
        windKph: {},
        pressureMb: {},
        uv: {},
        visKm: {}
    },
};

const fetchData = async () => {
    try {
        const query = localStorage.getItem('query') || store.city;
        const result = await fetch(`${link}&q=${store.city}&aqi=no`);
        const data = await result.json();

        const {
            current: {
                feelslike_c: feelslikeC,
                cloud,
                temp_c: tempC,
                humidity,
                last_updated: lastUpdated,
                pressure_mb: pressureMb,
                uv,
                vis_km: visKm,
                is_day: isDay,
                condition: description,
                wind_dir: windDir,
                wind_kph: windKph,
            },
            location: { name }
        } = data;

        store = {
            ...store,
            isDay,
            city: name,
            feelslikeC,
            tempC,
            lastUpdated,
            description: description.text,
            properties: {
                cloud: {
                    title: 'cloud',
                    value: `${cloud} %`,
                    icon: 'cloud.png'
                },
                humidity: {
                    title: 'humidity',
                    value: `${humidity} %`,
                    icon: 'humidity.png'
                },
                windDir: {
                    title: 'wind dir',
                    value: `${windDir}`,
                    icon: '',
                },
                windKph: {
                    title: 'wind',
                    value: `${windKph} km/h`,
                    icon: 'wind.png'
                },
                pressureMb: {
                    title: 'pressure',
                    value: `${pressureMb} mb`,
                    icon: 'gauge.png'
                },
                uv: {
                    title: 'uv',
                    value: `${uv}`,
                    icon: 'uv-index.png'
                },
                visKm: {
                    title: 'visibility',
                    value: `${uv} km`,
                    icon: 'visibility.png'
                }
            }
        };
        renderComponent();

    } catch (err) {
        console.log(err);
    }

};

const getImage = (description) => {
    const value = description.toLowerCase();

    switch (value) {
        case "partly cloudy":
            return './day/116.png';
        case "cloud":
            return 'cloud.png';
        case "fog":
            return 'fog.png';
        case "sunny":
            return './day/113.png';
        case "light rain":
            return './day/296.png';
        case "overcast":
            return './day/122.png';
        default:
            return 'the.png';
    }
};

const renderProperty = (properties) => {
    return Object.values(properties).map(({ title, value, icon }) => {

        return `<div class="property">
                <div class="property-icon">
                <img src="./img/icons/${icon}" alt="">
                </div>
                <div class="property-info">
                <div class="property-info__value">${value}</div>
                <div class="property-info__description">${title}</div>
                </div>
            </div>`;
    }).join("");
};

const markup = () => {
    const { city, description, lastUpdated, tempC, isDay, properties } = store;
    const containerClass = isDay === 1 ? 'is-day' : '';

    return `<div class="container" ${containerClass}>
                <div class="top">
                    <div class="city">
                        <div class="city-subtitle">Weather Today in</div>
                        <div class="city-title" id="city">
                        <span>${city}</span>
                        </div>
                    </div>
                    <div class="city-info">
                        <div class="top-left">
                            <img class="icon" src="./img/${getImage(description)}" alt="" />
                            <div class="description">${description}</div>
                        </div>
                
                        <div class="top-right">
                            <div class="city-info__subtitle">as of ${lastUpdated}</div>
                            <div class="city-info__title">${tempC}°C</div>
                        </div>
                    </div>
                 </div>
                 <div id="properties">${renderProperty(properties)}</div>
            </div>`
};

const togglePopupClass = () => {
    popup.classList.toggle('active');
};
const renderComponent = () => {
    root.innerHTML = markup();

    const city = document.getElementById('city');
    city.addEventListener('click', togglePopupClass);
};

const handleInput = (e) => {
    store = {
        ...store,
        city: e.target.value
    };
};

const handleSubmit = (e) => {
    e.preventDefault();
    const value = store.city;

    if (!value) return null;

    localStorage.setItem('query', value);
    fetchData();
    togglePopupClass();
};

form.addEventListener('submit', handleSubmit);
textInput.addEventListener('input', handleInput);


fetchData();