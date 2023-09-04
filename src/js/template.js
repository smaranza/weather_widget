import SNIPPETS from "@/assets/snippets";

const TEMPLATE = {
    baseCityEl: `<div class="weather-city">
                    <div class="city__current"></div>
                    <div class="city__forecast"></div>
                    <div class="city__waves"></div>
                </div>`,

    nameEl: (name) => $('<h2>', {
        class: 'current__location h__3',
        html: name.toString()
    }),

    iconEl: (src) => $('<img>', {
        class: 'weather__icon',
        src: src
    }),

    currentEl: function (city) {
        const cName = this.nameEl(city.name);

        const cDescription = $('<h5>', {
            class: 'current__desc',
            html: city.current.weather.main.toString()
        })
        const cTemp = $('<h3>', {
            class: 'current__temp h__2 is__celsius',
            html: parseInt(city.current.main.temp)
        })
        const cMinMax = $('<h5>', {
            class: 'current__minmax',
            html: `${parseInt(city.current.main.temp_min)}° / ${parseInt(city.current.main.temp_max)}°`
        })

        return $('<div class="city__current-inner">').append(cName, cDescription, cTemp, cMinMax)
    },

    forecastList: function (forecast) {
        let $fList = $('<ul class="city__forecast-inner"></ul>');
        
        for (const day in forecast) {
            // use midday forecast as default forecast in mobile, otherwise take last entry (closest to midday)
            let $fItem = $('<li class="forecast__day">');
            
            // @NEXT implement dropdown for hours in mobile
            let avDayData = (forecast[day][4]) ? forecast[day][4] : forecast[day][day.length - 1];

            // build forecast item for next days
            // using main temp == min and max
            $fItem.append(
                $('<h6>').html(avDayData.date || avDayData.day.slice(0, 3)),
                this.iconEl(avDayData.weather.iconSrc),
                $('<h5>').html(`${parseInt(avDayData.main.temp)}°`),
                $('<div class="forecast__extra">').html([
                    $('<h5>').html(`<span>Rain</span> ${parseInt(avDayData.pop) * 100}%`),
                    $('<h5>').html(`<span>Humidity</span> ${parseInt(avDayData.main.humidity)}%`),
                    $('<h5>').html(`<span>Wind</span> ${this.getWind(avDayData.wind)}`),
                    $('<h5>').html(`<span>Clouds</span> ${parseInt(avDayData.clouds.all)}%`)
                ])
            );

            $($fList).append($fItem);
        }

        return $fList
    },

    wave01: '<svg id="wave-2" class="wave" viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"><path d="M0 462L7.8 475.3C15.7 488.7 31.3 515.3 47.2 524.7C63 534 79 526 94.8 519.5C110.7 513 126.3 508 142 506.3C157.7 504.7 173.3 506.3 189.2 501.8C205 497.3 221 486.7 236.8 488.5C252.7 490.3 268.3 504.7 284.2 517.2C300 529.7 316 540.3 331.8 534.7C347.7 529 363.3 507 379 501.5C394.7 496 410.3 507 426.2 503.5C442 500 458 482 473.8 489.3C489.7 496.7 505.3 529.3 521 541.3C536.7 553.3 552.3 544.7 568.2 538C584 531.3 600 526.7 615.8 527.7C631.7 528.7 647.3 535.3 663.2 532.8C679 530.3 695 518.7 710.8 506.3C726.7 494 742.3 481 758 477.2C773.7 473.3 789.3 478.7 805.2 487.7C821 496.7 837 509.3 852.8 518C868.7 526.7 884.3 531.3 892.2 533.7L900 536L900 601L892.2 601C884.3 601 868.7 601 852.8 601C837 601 821 601 805.2 601C789.3 601 773.7 601 758 601C742.3 601 726.7 601 710.8 601C695 601 679 601 663.2 601C647.3 601 631.7 601 615.8 601C600 601 584 601 568.2 601C552.3 601 536.7 601 521 601C505.3 601 489.7 601 473.8 601C458 601 442 601 426.2 601C410.3 601 394.7 601 379 601C363.3 601 347.7 601 331.8 601C316 601 300 601 284.2 601C268.3 601 252.7 601 236.8 601C221 601 205 601 189.2 601C173.3 601 157.7 601 142 601C126.3 601 110.7 601 94.8 601C79 601 63 601 47.2 601C31.3 601 15.7 601 7.8 601L0 601Z" fill="currentColor" stroke-linecap="round" stroke-linejoin="miter"></path></svg>',

    wave02: '<svg id="wave-1" class="wave" viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"><path d="M0 551L12.5 543.8C25 536.7 50 522.3 75 523.8C100 525.3 125 542.7 150 515.5C175 488.3 200 416.7 225 399.8C250 383 275 421 300 441.7C325 462.3 350 465.7 375 457.2C400 448.7 425 428.3 450 429.5C475 430.7 500 453.3 525 477.5C550 501.7 575 527.3 600 531.8C625 536.3 650 519.7 675 499.2C700 478.7 725 454.3 750 434.3C775 414.3 800 398.7 825 392.8C850 387 875 391 887.5 393L900 395L900 601L887.5 601C875 601 850 601 825 601C800 601 775 601 750 601C725 601 700 601 675 601C650 601 625 601 600 601C575 601 550 601 525 601C500 601 475 601 450 601C425 601 400 601 375 601C350 601 325 601 300 601C275 601 250 601 225 601C200 601 175 601 150 601C125 601 100 601 75 601C50 601 25 601 12.5 601L0 601Z" fill="currentColor" stroke-linecap="round" stroke-linejoin="miter"></path></svg>',

    getWind: (wind) => {
        let speed = parseInt(wind.speed);
        let deg = wind.deg;

        let dir = "";

        if ( !(speed > 0) || typeof deg !== 'number' || isNaN(wind.deg)) {
            return `${speed} km/h <br/> -`;
        }
    
        // keep within the range: 0 <= deg < 360
        deg = deg % 360;
 
        if (258.75 <= deg || deg < 78.25) // N
            dir += "N"

        if (101.25 <= deg && deg < 258.75) // S
            dir += "S"

        if (11.25 <= deg && deg < 168.75) // E
            dir += "E"

        if (191.25 <= deg && deg < 348.75) // W
            dir += "W"

        if ((326.25 <= deg && deg < 348.75) || (11.25 <= deg && deg < 33.75)) // NN
            dir += "N"

        if ((146.25 <= deg && deg < 168.75) || (191.25 <= deg && deg < 213.75)) // SS
            dir += "S"

        if ((56.25 <= deg && deg < 78.75) || (101.25 <= deg && deg < 123.75)) // EE
            dir += "E"

        if ((236.25 <= deg && deg < 258.75) || (303.75 <= deg && deg < 326.25)) // WW
            dir += "W"

        return `${speed} <small>km/h</small><br/> ${dir}`;
    }
}

export default TEMPLATE;