// initialize app data
// all temperatures are measured in fahrenheit
const data = {
    seasons: [
        {
            text: "Newleaf (Spring)",
            lowestTemp: 40,
            highestTemp: 75,
        },
        {
            text: "Greenleaf (Summer)",
            lowestTemp: 55,
            highestTemp: 100,
        },
        {
            text: "Leaf-fall (Autumn)",
            lowestTemp: 30,
            highestTemp: 75,
        },
        {
            text: "Leaf-bare (Winter)",
            lowestTemp: 0,
            highestTemp: 50,
        },
    ],
    wind: {
        chance: 1/3,
        speeds: [
            "Low",
            "Moderate",
            "High",
        ],
    },
    clouds: {
        coverages: [
            "Clear",
            "Cloudy",
            "Overcast",
        ],
    },
    precip: {
        chances: [
            2/5, // spring
            1/5, // summer
            5/9, // autumn
            5/9, // winter
        ],
        types: [
            {
                name: "Rain",
                chance: 1,
                minTemp: 33,
            },
            {
                name: "Snow",
                chance: 1,
                maxTemp: 32,
            },
            {
                name: "Hail",
                chance: 1/8,
                minTemp: 55,
            },
            {
                name: "Sleet",
                chance: 1/5,
                maxTemp: 32,
            },
        ],
        amounts: [
            "Light",
            "Moderate",
            "Heavy",
        ],
        frequencies: [
            "Occasional",
            "Sporadic",
            "Constant",
        ],
        coverages: [
            "not",
            "partially",
            "fully",
        ],
    },
    territories: [
        "Meteorclan",
        "Cascadeclan",
        "Twilightclan",
        "Neutral territories",
    ],
};

// initialize page content
const seasonSelect = document.querySelector("#season-select");
for (let i = 0; i < data.seasons.length; i++) {
    const option = document.createElement("option");
    option.innerText = data.seasons[i].text;
    option.value = i;
    seasonSelect.appendChild(option);
}

// selecting a season updates the displayed temperature range
seasonSelect.addEventListener("change", updateSeasonTemps);
function updateSeasonTemps() {
    const season = data.seasons[seasonSelect.value];
    document.querySelector("#season-low").innerText = season.lowestTemp;
    document.querySelector("#season-high").innerText = season.highestTemp;
    document.querySelector("#season-temps").hidden = false;
}

// logic for generating random weather info
function generateWeather() {
    // local functions for random generation
    function randomNum(min, max) {
        let diff = max - min
        diff = Math.random() * diff
        return Math.round(diff) + min
    }

    function randomIndex(array) {
        return array[randomNum(0, array.length - 1)]
    }

    function randomChance(chance) {
        return Math.random() < chance
    }

    // initialize default info
    const weather = {
        temp: {
            low: 0,
            high: 0,
        },
        wind: {
            speed: "None",
            chilling: "",
        },
        clouds: {
            coverage: "None",
            thunder: "No",
        },
        precip: {
            types: "None",
            amount: "",
            frequency: "",
            chilling: "",
        },
        territories: [],
        warnings: [],
    };

    // temperature range
    // low and high points can be 3-12 degrees from the basis
    // but they cannot exceed the seasonal low and high points
    const season = data.seasons[seasonSelect.value];
    const tempBasis = randomNum(season.lowestTemp, season.highestTemp);

    let lowTemp = tempBasis - randomNum(3, 12);
    let highTemp = tempBasis + randomNum(3, 12);
    if (lowTemp < season.lowestTemp) lowTemp = season.lowestTemp;
    if (highTemp > season.highestTemp) highTemp = season.highestTemp;

    weather.temp.low = lowTemp;
    weather.temp.high = highTemp;

    // wind
    if (randomChance(data.wind.chance)) {
        weather.wind.speed = randomIndex(data.wind.speeds);
        // TODO implement wind chill later
    }

    // precipitation
    // chance to occur depends on season
    let precipChance = data.precip.chances[seasonSelect.value];
    precipChance = randomChance(precipChance);
    if (precipChance) {
        // precipitation types
        const precipTypes = data.precip.types.filter(type => {
            if (lowTemp > type.maxTemp) return false;
            if (highTemp < type.minTemp) return false;
            return randomChance(type.chance);
        }); // TODO somehow prevent rain and snow occurring together
        weather.precip.types = precipTypes.map(i => i.name).join(", ")

        // remember precipitation amount
        const precipAmount = randomIndex(data.precip.amounts);
        weather.precip.amount = precipAmount;

        // precipitation frequency
        // frequency cannot be occasional if amount is heavy
        let precipFreq = data.precip.frequencies;
        if (precipAmount == data.precip.amounts[2]) precipFreq = precipFreq.slice(1);
        weather.precip.frequency = randomIndex(precipFreq);

        // territory coverage
        // random territories will have reduced weather effects
        for (let territory of data.territories) {
            if (randomChance(1/4)) {
                weather.territories.push(territory);
            }
        }

        // TODO implement precipitation chill later
    }

    // clouds
    // cloud coverage cannot be clear if precipitation occurs
    let cloudCoverages = data.clouds.coverages;
    if (precipChance) cloudCoverages = cloudCoverages.slice(1);
    weather.clouds.coverage = randomIndex(cloudCoverages);

    // thunder
    // chance to occur depends on weather intensity
    const precipIntensity = data.precip.amounts.indexOf(weather.precip.amount) + 1;
    const cloudIntensity = data.clouds.coverages.indexOf(weather.clouds.coverage) + 1;
    switch (true) {
        case precipIntensity >= 3 && randomChance(1/2):
        case precipIntensity > 0 && randomChance(1/4):
        case cloudIntensity >= 3 && randomChance(1/6):
            weather.clouds.thunder = "Yes";
            break;
        default:
            weather.clouds.thunder = "No";
            break;
    }

    // warnings for weather intensity
    switch (true) {
        case lowTemp <= 10:
        case weather.precip.types.includes("Snow") && precipIntensity >= 3:
        case weather.precip.types.includes("Sleet") && precipIntensity >= 3:
            weather.warnings.push("Danger to all cats. Avoid prolonged time outside.");
            break;
        case lowTemp <= 20:
        case weather.precip.types.includes("Rain") && precipIntensity >= 3:
        case weather.precip.types.includes("Snow") && precipIntensity >= 2:
        case weather.precip.types.includes("Sleet") && precipIntensity >= 2:
            weather.warnings.push("Danger to cats without thick fur. Avoid prolonged time outside.");
            break;
        case lowTemp <= 32:
            weather.warnings.push("Danger to elders, kits, and cats with short fur. Avoid prolonged time outside.");
            break;
        case highTemp >= 90:
            weather.warnings.push("Danger to cats without thin fur. Avoid prolonged time in direct sunlight.");
            break;
        case highTemp >= 75:
            weather.warnings.push("Danger to elders, kits, and cats with thick fur. Avoid prolonged time in direct sunlight.");
            break;
    }
    if (precipIntensity >= 3) {
        weather.warnings.push("Danger of falling branches.")
    }
    const windIntensity = data.wind.speeds.indexOf(weather.wind.speed) + 1;
    if (windIntensity >= 3) {
        weather.warnings.push("Danger of small flying objects.")
    }

    // return weather info
    return weather;
}

// display weather info after clicking the generate button
document.querySelector("#new-weather").addEventListener("click", updateWeatherInfo)
function updateWeatherInfo() {
    // notify the user when no season is selected
    if (seasonSelect.value == "") {
        alert("Please select a season!");
        return;
    }

    // initialize weather info
    const weather = generateWeather();

    // update page content
    document.querySelector("#temp-low").innerText = weather.temp.low;
    document.querySelector("#temp-high").innerText = weather.temp.high;
    document.querySelectorAll("td[hidden]").forEach(i => i.hidden = false);

    document.querySelector("#wind-speed").innerText = weather.wind.speed;
    document.querySelector("#wind-chilling").innerText = weather.wind.chilling;

    document.querySelector("#cloud-coverage").innerText = weather.clouds.coverage;
    document.querySelector("#cloud-thunder").innerText = weather.clouds.thunder;

    document.querySelector("#precip-types").innerText = weather.precip.types;
    document.querySelector("#precip-amount").innerText = weather.precip.amount;
    document.querySelector("#precip-frequency").innerText = weather.precip.frequency;
    document.querySelector("#precip-chilling").innerText = weather.precip.chilling;

    const territories = document.querySelector("#territory-list");
    territories.querySelector("p").hidden = !weather.territories.length;
    territories.querySelectorAll("li").forEach(i => i.remove());
    for (let territory of weather.territories) {
        const item = document.createElement("li");
        item.innerText = territory;
        territories.appendChild(item);
    }

    const warnings = document.querySelector("#warning-list");
    warnings.querySelectorAll("li").forEach(i => i.remove());
    for (let warning of weather.warnings) {
        const item = document.createElement("li");
        item.innerText = warning;
        warnings.appendChild(item);
    }
}
