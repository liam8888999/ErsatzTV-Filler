const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const fs = require('fs');

const TEMPLATES_FOLDER = "server/templates/"; // Have to do this because it expects the layout in the top level directory.
const LAYOUTS_FOLDER = "layouts/";
const PAGES_FOLDER = "pages/";
const DEFAULT_LAYOUT = LAYOUTS_FOLDER + "layout.ejs";

// Setup express middleware for ejs view engine, allows the use
// of layouts and ejs templating for html generation on the server
app.set('views', TEMPLATES_FOLDER);
app.set('view engine', 'ejs');
app.use(expressLayouts);

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));


// Home Route
app.get('/', (req, res) => {
    // Render the specific ejs template view
    res.render(PAGES_FOLDER + "home", {
        layout: DEFAULT_LAYOUT, //Just registering which layout to use for each view
        page: "Home" //This is used by the front end to figure out where it is, allows us to statically set the active class on the navigation links. The page will not load without this variable.
    });
});

// Config Route
app.get('/config', (req, res) => {
    // Render the specific ejs template view
    res.render(PAGES_FOLDER + "config", {
        layout: DEFAULT_LAYOUT, //Just registering which layout to use for each view
        page: "Config"
    });
});

// Themes Route
app.get('/themes', (req, res) => {
    // Render the specific ejs template view
    res.render(PAGES_FOLDER + "themes", {
        layout: DEFAULT_LAYOUT, //Just registering which layout to use for each view
        page: "Themes"
    });
});

// Update Route
app.get('/updates', (req, res) => {
    // Render the specific ejs template view
    res.render(PAGES_FOLDER + "update", {
        layout: DEFAULT_LAYOUT, //Just registering which layout to use for each view
        page: "Updates"
    });
});

// TODO: API Routes
app.post('api/config.html', (req, res) => {
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
