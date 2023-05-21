// Import Weather API
import OWM from '@/js/owm'
import TEMPLATE from '@/js/template'
// import Slider from '@/js/slider'


// Import of styles
import '@/styles/index.scss'

const app = $('.weather-slider')
const citiesName = ["London", "Milan", "Bangkok", "Los Angeles", "Nairobi"];


for (const cityName of citiesName) {
     // FETCH WEATHER DATA
     let cityData = await OWM.getCityWeather(cityName);

     // CREATE CITY TEMPLATE
     if (cityData) {
          // create city base template
          let $cityBase = $(TEMPLATE.baseCityEl);
          $($cityBase).appendTo(app);

          let $cityCurrent = $($cityBase).find('.city__current');
          let $cityForecast = $($cityBase).find('.city__forecast');

          // append city current weather section
          $($cityCurrent).append([
               $(TEMPLATE.nameEl(cityName)),
               $(TEMPLATE.currentEl(cityData.current)),
               $(TEMPLATE.iconEl(cityData.current.weather.iconSrc))
          ]);
          
          // append city forecast weather section
          $($cityForecast).append(
               $(TEMPLATE.forecastList(cityData.forecast))
          );
     }

     // break
}

// INIT SLIDER


// REGISTER EVENTS


// EFFECTS ETC


// $(app).text(JSON.stringify(citiesData))