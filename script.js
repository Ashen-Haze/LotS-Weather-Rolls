function generateWeather() {
    /* SEASON AND TEMPERATURE BLOCK */
    
    var season = 'e';
    
    // GET SEASON FROM I/O 
    // that's you chris
    
    var high = 0;
    var low = 0;

    // highs are +1 to the high end to account for RNG range
    switch(season){
        case 's': // spring
            high = 76;
            low = 40;
            break;
        case 'u': // summer
            high = 101;
            low = 55;
            break;
        case 'a': // autumn/fall
            high = 76;
            low = 30;
            break;
        case 'w': // winter
            high = 51;
            low = 0;
            break;
        default:
            console.log("Something went wrong. What's a season again?");
            throw new Error();
    }

    // generate temperature ranges
    var temp1 = getRandomInt(high - low) + low;
    var temp2 = getRandomInt(10) + 3;
    high = temp1 + temp2;
    low = temp1 - temp2;


    /* BASIC WEATHER BLOCK */

    var wind = getRandomInt(3) + 1; 
    var precip = false;

    switch(season){
        case 's': // spring: 2/5
            if(getRandomInt(5) <= 1){
             precip = true;
            }
            break;
        case 'u': // summer: 1/5
            if(getRandomInt(5) <= 0){
             precip = true;
            }
            break;
        case 'a': // autumn: 5/9
            if(getRandomInt(9) <= 4){
             precip = true;
            }
            break;
        case 'w': // winter: 5/9
            if(getRandomInt(9) <= 4){
             precip = true;
            }
            break;
    }

    var precip_amount = 0;
    var precip_freq = 0;

    if(precip){
        precip_amount = getRandomInt(3) + 1;
        
        if(precip_amount == 3){ // if heavy rain
            precip_freq = getRandomInt(2) + 2;
        } else {
            precip_freq = getRandomInt(3) + 1;
        }
    }

    var clouds = 0;

    if(precip){
        clouds = getRandomInt(3) + 1;
    } else {
        clouds = getRandomInt(4);
    }


    /* CONDITIONAL WEATHER BLOCK oh god */ 

    // 3/4 chance for snow 
    var snow = 0; 
    if(precip && (low < 32)){
        snow = getRandomInt(4); 
    }

    // 1/5 chance for sleet
    var sleet = false;
    if(precip && (low < 32) && !getRandomInt(5)){ 
        sleet = true;
    }

    // 1/8 chance for hail
    var hail = false;
    if(precip && (low > 55) && !getRandomInt(8)){
        hail = true;
    }

    // variable chance for thunder
    var thunder = false;

    // if heavy precip, 1/2 chance
    if((precip_amount == 3) && getRandomInt(2)){
        thunder = true;
    }

    // if light/med precip, 1/4 chance
    else if(precip && !getRandomInt(4)){
        thunder = true;
    }

    // if no precip but dense clouds, 1/6 chance
    else if(!precip && (clouds == 3) && !getRandomInt(6)){
        thunder = true;
    }


    /* CLAN SPECIFIC BLOCK */

    /* casc: [0]
     * mete: [1]
     * twil: [2]
     * neut: [3] */
    let clan_precip = ['f', 'f', 'f', 'f'];
    
    // 1/3 chance to reduce precip
    for(let i = 0; i < clan_precip.length; i++){
        if(!getRandomInt(3)){
            clan_precip[i] = 'r';
        }
    }


    /* WARNING CONDITIONALS BLOCK */

    // help
    
    updatePage() // keep this at the bottom
}

// generates an int between 0 and (max - 1)
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function updatePage() {
    // hi
}