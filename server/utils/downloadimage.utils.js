const http = require('http');

function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
      const client = http.createClient(80, url);
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

module.exports = {
    downloadImage
}
