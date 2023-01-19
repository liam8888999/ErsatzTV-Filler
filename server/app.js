const { createWebServer, startWebServer } = require("../server/modules/web-server.module");

// Very basic splitting up of concerns, now we can use this entry point app and create and manage our modules for configs.

try {
    createWebServer();

    startWebServer();
} catch(e){
    console.error("Fatal error occurred!", e)
}


// TODO: API Routes
// app.post('api/config.html', (req, res) => {
//     fs.readFile('config.conf', 'utf8', function(err, data) {
//         if (err) return res.send(`Error: ${err.message}`);
//         let lines = data.split('\n');
//         let newLines = [];
//         for (let i = 0; i < lines.length; i++) {
//             let line = lines[i];
//             let parts = line.split('=');
//             let key = parts[0].trim();
//             if (req.body[key]) {
//                 newLines.push(`${key}=${req.body[key]}`);
//             } else {
//                 newLines.push(line);
//             }
//         }
//         fs.writeFile('config.conf', newLines.join('\n'), 'utf8', function (err) {
//             if (err) return res.send(`Error: ${err.message}`);
//             res.sendFile(__dirname + '/config.html');
//      });
//     });
// });


