// Import Weather API
import OWM from '@/js/owm'
import TEMPLATE from '@/js/template'
import SLIDER from '@/js/slider'

// Import of styles
import '@/styles/index.scss'

// const citiesName = ["London", "Milan", "Bangkok", "Los Angeles", "Nairobi"];
const weatherSlider = document.querySelector("#weather-slider");
const citiesName = weatherSlider.dataset.cities.split(", ")

let citiesData = [];

// FETCH WEATHER DATA
for (const cityName of citiesName) {
    citiesData.push(await OWM.getCityWeather(cityName));
}

$(function () {
    const app = $(weatherSlider);

    // CREATE CITY TEMPLATE
    if (citiesData) {
        for (let i = 0; i < citiesData.length; i++) {
            const city = citiesData[i];

            // create city base template
            let $cityBase = $(TEMPLATE.baseCityEl).appendTo(app);
            $($cityBase).appendTo(app);

            let $cityCurrent = $($cityBase).find('.city__current');
            let $cityForecast = $($cityBase).find('.city__forecast');

            // append city current weather section
            $($cityCurrent).append([
                $(TEMPLATE.nameEl(city.name)),
                $(TEMPLATE.currentEl(city.current)),
                $(TEMPLATE.iconEl(city.current.weather.iconSrc))
            ]);

            // append city forecast weather section
            $($cityForecast).append(
                $(TEMPLATE.forecastList(city.forecast))
            );
        }
    }
    
    // INIT SLIDER
    const carousel = new SLIDER({
        infinite: true,
        slideCls: 'weather-city'
    });
});



// REGISTER EVENTS


// EFFECTS ETC


// $(app).text(JSON.stringify(citiesData))