// Import Modules
import axios from "axios";
import OWM from '@/js/owm'
import TEMPLATE from '@/js/template'
import SLIDER from '@/js/slider'
import SNIPPETS from "@/js/snippets";

// Import of styles
import '@/styles/index.scss'

// const citiesName = ["London", "Milan", "Bangkok", "Los Angeles", "Nairobi"];
const weatherSlider = document.querySelector("#weather-slider");
const citiesName = weatherSlider.dataset.cities.split(", ")

let citiesData = [];

// create axios instance with reusable options
const PexelsClient =  axios.create({
    baseURL: 'https://api.pexels.com/v1/',
    headers: {
        Authorization: process.env.PEXELS_KEY,
    }
});

async function searchPexelImage(query) {
    let response = await PexelsClient.get("search", {
        params: {
            query: query,
            orientation: 'landscape',
            per_page: 1
        }
    }).catch((error) => {
        console.log(error);
    })

    return response.data.photos[0]
}

// FETCH WEATHER DATA
for (const cityName of citiesName) {
    let cityData = await OWM.getCityWeather(cityName);
    cityData.background = await searchPexelImage(cityData.name);
    citiesData.push(cityData);
}

$(function () {
    const app = $(weatherSlider);

    // CREATE CITY TEMPLATE
    if (citiesData) {
        for (let i = 0; i < citiesData.length; i++) {
            const city = citiesData[i];

            // create city base template
            let $city = $(TEMPLATE.baseCityEl).appendTo(app);
            $($city).appendTo(app);

            // city background
            let cityBG = city.background.src[window.innerWidth < 768 ? "portrait" : "landscape"];
            
            $($city).append($('<div>', {
                class: "city__bg",
                css : {
                    backgroundImage: `url(${cityBG})`
                }
            }));

            let $cityCurrent = $($city).find('.city__current');
            let $cityForecast = $($city).find('.city__forecast');

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