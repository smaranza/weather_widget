import axios from "axios";
import SNIPPETS from "@/js/snippets";

/*
    Open Weather Map API (OWM)

    "Weather forecasts, nowcasts and history in a fast and elegant way"
    source: https://openweathermap.org/

    https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
*/
const OWMAPI = {
    // create axios instance with reusable options
    client: axios.create({
        baseURL: 'https://api.openweathermap.org',
        params: {
            appid: process.env.API_KEY,
        }
    }),

    // expose coords {lat, lon} object
    coords: {},

    /* 
        Fetch city coordinates
        @param (string) City Name
    */
    getCityCoords: async function (cityName) {
        const client = this.client;

        const response = await client.get("/geo/1.0/direct", {
            params: {
                q: cityName,
                limit: 3
            }
        }).catch((error) => {
            console.log(error);
        })

        // populate this coordinates
        this.coords = response.data[0];
        return response.data[0]
    },

    /* 
        Fetch current weather, given coords
    */
    fetchCurrent: async function () {
        // fetch current weather
        const current = await this.makeApiCall("/data/2.5/weather");
        current.weather = current['weather'][0];
    
        // fetch current weather icon
        current.weather.iconSrc = this.getIconByWeather(current.weather.icon);
        return current
    },

    /* 
        return icon image source
        i.e. https://openweathermap.org/img/wn/10d@2x.png
    */
    getIconByWeather: function(condition) {
       return `https://openweathermap.org/img/wn/${condition}@2x.png`;
    },

    /* 
        Fetch location forecast, given coords

        Call 5 day / 3 hour forecast data
        i.e. https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
     */
    fetchForecast: async function () {
        const response = await this.makeApiCall("/data/2.5/forecast");
        let dailyForecast = [];

        // Sort list by time & date
        response.list.sort((a, b) => {
            return ((a.dt_txt < b.dt_txt) ? -1 : ((a.dt_txt > b.dt_txt) ? 1 : 0));
        });
        
        // slice forecast list into days
        for (let i = 0; i < response.list.length; i++) {
            // skip today's forecast
            let today = new Date(Date.now()).toDateString();
            let itemDate = new Date(response.list[i].dt_txt).toDateString();

            if (today == itemDate) {
                continue
            }
            
            // 40 timestamps (8 * 5 days = every 3h )
            dailyForecast.push(response.list.splice(i, 7));
        }

        for (let i = 0; i < dailyForecast.length; i++) {
            const day = dailyForecast[i];
            for (const hour of day) {
                let timestamp = new Date(hour.dt_txt);
                hour.date = timestamp.toDateString();
                hour.day = SNIPPETS.weekdays[timestamp.getDay()];
                hour.time = timestamp.getHours();
                hour.weather = hour['weather'][0];
                hour.weather.iconSrc = this.getIconByWeather(hour.weather.icon);
            }
        }

        return dailyForecast
    },

    /* 
       Calls Open Weather Map given endpoint
       @param call (string) endpoint
       @param extraParams (object) extra query parameters
    */
    makeApiCall: async function (call, extraParams) {
        let params = {
            lat: this.coords.lat,
            lon: this.coords.lon,
            units: 'metric'
        }

        if (extraParams) {
            params = { ...params, ...extraParams }
        };

        const response = await this.client.get(call, {
            params: params
        }).catch((error) => {
            console.log(error);
        })

        return response.data
    },

    /* 
       Handles City Weather data
       1. Fetch geo coordinates
       2. Fetch current weather
       3. Fetch forecast
       @param call (string) endpoint
       @param extraParams (object) extra query parameters
    */
    getCityWeather: async function (name) {
        const client = this.client;

        let weather = await this.getCityCoords(name)
            .then(async (res) => {
                return {
                    name: res.name,
                    countryIso: res.country,
                    state: res.state,
                    coords: {
                        lat: res.lat,
                        lon: res.lon
                    },
                    current: await this.fetchCurrent(),
                    forecast: await this.fetchForecast(),
                }
            });

        return weather
    },
}

export default OWMAPI;