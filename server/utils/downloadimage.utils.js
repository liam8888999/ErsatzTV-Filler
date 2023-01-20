import('node-fetch');
const fs = require('fs');

const url = 'https://www.shutterstock.com/image-photo/surreal-image-african-elephant-wearing-260nw-1365289022.jpg'

function downloadImage(url, filepath){
    return fetch(url)
        .then(res => {
            if (res.status !== 200) {
                throw new Error(`Failed to fetch image with status code ${res.status}`);
            }
            return new Promise((resolve, reject) => {
                res.body
                    .pipe(fs.createWriteStream(filepath))
                    .on('error', reject)
                    .on('close', () => resolve(filepath));
            });
        });
}

module.exports = {
    downloadImage
}
