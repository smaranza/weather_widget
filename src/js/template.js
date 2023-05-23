
const TEMPLATE = {
    baseCityEl: `<div class="weather-city">
                    <div class="city__current"></div>
                    <div class="city__forecast"></div>
                    <div class="city__temps"></div>
                </div>`,

    nameEl: (name) => $('<h2>', {
        class: 'current__location header__3',
        html: name.toString()
    }),

    currentEl: function (current) {
        const cDescription = $('<h5>', {
            class: 'current__desc header__5',
            html: current.weather.main.toString()
        })
        const cTemp = $('<h3>', {
            class: 'current__temp header__2',
            html: parseInt(current.main.temp) + "°"
        })
        const cMinMax = $('<h5>', {
            class: 'current__minmax header__5',
            html: `${parseInt(current.main.temp_min)}° / ${parseInt(current.main.temp_max)}°`
        })

        return $('<div class="city__current-inner">').append(cDescription, cTemp, cMinMax)
    },

    forecastList: function (forecast) {
        let $fList = $('<ul class="city__forecast-inner"></ul>');

        for (const day in forecast) {
            if (Object.hasOwnProperty.call(forecast, day)) {
                // use midday forecast as default forecast, otherwise take last entry (closest to midday)
                let avDayData = (forecast[day][4]) ? forecast[day][4] : forecast[day][day.length - 1];

                // build forecast item for next days
                let $fItem = $('<li class="forecast__day">')
                    .append(
                        $('<h5>').html(avDayData.day),
                        // $('<h5>').html(avDayData.dt_txt),
                        this.iconEl(avDayData.weather.iconSrc),
                        $('<h5>').html(`${parseInt(avDayData.main.temp)}°`) // using main temp == min and max
                    );

                $($fList).append($fItem);
            }
        }
        return $fList
    },

    iconEl: (src) => $('<img>', {
        class: 'weather__icon',
        src: src
    })
}

export default TEMPLATE;