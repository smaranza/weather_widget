
const TEMPLATE = {
    baseCityEl: `<div class="weather-city">
                    <div class="city__current"></div>
                    <div class="city__forecast"></div>
                    <div class="city__temps"></div>
                </div>`,

    celsiusEl: `<span class="is__celsius">°</span>`,

    nameEl: (name) => $('<h2>', {
        class: 'current__location h__3',
        html: name.toString()
    }),

    iconEl: (src) => $('<img>', {
        class: 'weather__icon',
        src: src
    }),

    currentEl: function (city) {
        const cName = this.nameEl(city.name),
              cIcon = this.iconEl(city.current.weather.iconSrc);

        const cDescription = $('<h5>', {
            class: 'current__desc h__5',
            html: city.current.weather.main.toString()
        })
        const cTemp = $('<h3>', {
            class: 'current__temp h__2',
            html: parseInt(city.current.main.temp) + this.celsiusEl
        })
        const cMinMax = $('<h5>', {
            class: 'current__minmax h__5',
            html: `${parseInt(city.current.main.temp_min) + this.celsiusEl} / ${parseInt(city.current.main.temp_max)+ this.celsiusEl}`
        })

        return $('<div class="city__current-inner">').append(cName, cDescription, cTemp, cIcon, cMinMax)
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
                        this.iconEl(avDayData.weather.iconSrc),
                        $('<h5>').html(`${parseInt(avDayData.main.temp)}°`) // using main temp == min and max
                    );

                $($fList).append($fItem);
            }
        }
        return $fList
    }
}

export default TEMPLATE;