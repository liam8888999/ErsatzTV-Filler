import('node-fetch');
const fs = require('fs');

function downloadImage(url, filepath) {
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
