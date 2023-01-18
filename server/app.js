const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const fs = require('fs');

// Setup express middleware for ejs view engine, allows the use
// of layouts and ejs templating for html generation on the server
app.set('view engine', 'ejs');
app.use(expressLayouts);

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));


// Home Route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/config.html');
});

// Config Route

// Themes Route

// Update Route

// TODO: API Routes

app.post('/config.html', (req, res) => {
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
            res.sendFile(__dirname + '/config.html');
     });
    });
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
