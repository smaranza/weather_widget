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

// FETCH WEATHER DATA
let citiesData = [];
for (const cityName of citiesName) {
    citiesData.push(await fetchCityData(cityName));
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
                // $(TEMPLATE.nameEl(city)),
                $(TEMPLATE.currentEl(city)),
                // $(TEMPLATE.iconEl(city.current.weather.iconSrc))
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
        threshold: 10,
        slideCls: 'weather-city'
    });

    // REGISTER EVENTS
    $(window).one('click', getMotionPermission);
});

// UTILS
async function fetchCityData(name) {
    let city = await OWM.getCityWeather(name);
    city.background = await searchPexelImage(city.name);
    return city
}

async function searchPexelImage(query) {
    const rAmount = 5;
    let response = await axios.get('https://api.pexels.com/v1/search', {
        params: {
            query: query,
            orientation: 'landscape',
            per_page: 5
        },
        headers: {
            Authorization: process.env.PEXELS_KEY,
        }
    }).catch((error) => {
        console.log(error);
    })

    let image = '';
    if (response.status == 200) {
        let rnd = Math.floor(Math.random() * rAmount);
        image = response.data.photos[rnd]
    }

    return image
}

function getMotionPermission() {
    if (typeof (DeviceMotionEvent) !== null && typeof (DeviceMotionEvent.requestPermission) === "function") {
        DeviceMotionEvent.requestPermission()
            .then(response => {
                if (response == "granted") {
                    window.addEventListener("devicemotion", handleMotionEvent)
                }
            })
            .catch(console.error)
    }
}

function handleMotionEvent(event) {
    const k = 3,
          x = event.acceleration.x,
          y = event.acceleration.y;
  
    $('.slider__slide.is__active .city__bg').css({
        transition: '30ms',
        transform: `translate(${-x * k}px, ${-y * k}px)`
    })
}