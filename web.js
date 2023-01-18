const express = require('express');
const app = express();
const fs = require('fs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/', (req, res) => {
    fs.readFile('config.conf', 'utf8', function(err, data) {
        if (err) return res.send(`Error: ${err.message}`);
        let lines = data.split('\n');
        let newLines = [];
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            let parts = line.split('=');
            let key = parts[0].trim();
            if (req.body[key]) {
                newLines.push(`${key}=${req.body[key]}`);
            } else {
                newLines.push(line);
            }
        }
        fs.writeFile('config.conf', newLines.join('\n'), 'utf8', function (err) {
            if (err) return res.send(`Error: ${err.message}`);
            res.sendFile(__dirname + '/index.html');
     });
    });
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
