import axios from "axios";

/*
    Open Weather Map API (OWM)

    "Weather forecasts, nowcasts and history in a fast and elegant way"
    source: https://openweathermap.org/

    https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
*/
const OWMAPI = {
    // create axios instance with reusable options
    client: axios.create({
        baseURL: 'http://api.openweathermap.org',
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
        }).catch(function (error) {
            console.log(error);
        })

        this.coords = response.data[0];

        return response.data[0]
    },

    /* 
        Fetch current weather, given coords
    */
    fetchCurrent: async function () {
        return await this.makeApiCall("/data/2.5/weather")
    },

    /* 
        Fetch location forecast, given coords
     */
    fetchForecast: async function () {
        const response = await this.makeApiCall("/data/2.5/forecast");
        let dailyForecast = {};

        for (let i = 0; i < response.list.length; i++) {
            // slice forecast list into days
            // api responds with 40 timestamps (8 * 5 days = every 3h )
            dailyForecast[i] = response.list.splice(0, 7);
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
        }).catch(function (error) {
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