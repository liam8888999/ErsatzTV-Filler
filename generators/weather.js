/**
*Generate Weather
*V0.0.25 - Beta
*/
const fs = require('fs');
const client = require('https');



console.log("starting weather")

/**
*Check if weather should be run
*/

/**
*Choose random audio file from audio folder
*/

/**
*randomise background
*/

/**
*set country
*/

/**
*download images
*/

/**
*image download function
*/

function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        client.get(url, (res) => {
            if (res.statusCode === 200) {
                res.pipe(fs.createWriteStream(filepath))
                    .on('error', reject)
                    .once('close', () => resolve(filepath));
            } else {
                // Consume response data to free up memory
                res.resume();
                reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));

            }
        });
    });
}

/**
*image downloading
*/

    downloadImage('wttr.in/${cityurl}.png$weathermeasurement', '$weatherdir/v1.png')
    .then(console.log)
    .catch(console.error);

    downloadImage('v2.wttr.in/${cityurl}.png$weathermeasurement', '$weatherdir/v1.png')
    .then(console.log)
    .catch(console.error);

    downloadImage('v3.wttr.in/${stateurl}.png$weathermeasurement', '$weatherdir/v1.png')
    .then(console.log)
    .catch(console.error);

/**
*calculate fade times
*/

/**
*set variables
*/
const weathervideolength = retrieveCurrentConfiguration().weathervideolength;
const weathervideofadeduration = retrieveCurrentConfiguration().weathervideofadeduration;
const weatheraudiofadeduration = retrieveCurrentConfiguration().weatheraudeofadeduration;

/**
*set fade time
*/

const weathervideofadeoutstart = weathervideolength - weathervideofadeduration;
const weatheraudeofadeduration = weathervideolength - weatheraudiofadeduration;

/**
*make the videos
*/







/**
*check if v4 should be generated
*/

/**
*check if weather v4 should be shuffled
*/

/**
*add files to .txt file in random order if shuffled, on random if not shuffled
*/

/**
*generate weather v4 video
*/
