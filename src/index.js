// Import Weather API
import OWM from '@/js/owm'
// import Slider from '@/js/slider'


// Import of styles
import '@/styles/index.scss'

const app = $('#root')
const citiesName = [ "London", "Milan", "Bangkok", "Los Angeles", "Nairobi"];


// FETCH WEATHER DATA
let citiesData = [];

for (const cityName of citiesName) {

    // fetch city weather
    let city = await OWM.getCityWeather(cityName);
   citiesData.push(city)
}



// CREATE CITY TEMPLATE


// INIT SLIDER


// REGISTER EVENTS


// EFFECTS ETC


$(app).text(JSON.stringify(citiesData))