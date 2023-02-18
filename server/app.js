const { createWebServer, startWebServer } = require("../server/modules/web-server.module");
const { setupConfigurationFile } = require("../server/modules/config-loader.module");


//This is called a self executing function. It allows us to create an application context for our app, and also start it asynchronously
(async function(){
    // Very basic splitting up of concerns, now we can use this entry point app and create and manage our modules for configs.
    // Also very basic global error caching for the entire application, might still completely stall if not careful but can be improved at a later date.

    try {
        await setupConfigurationFile();

        createWebServer();

        startWebServer();
    } catch(e){
        console.error("Fatal error occurred!", e)
    }
})()

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
