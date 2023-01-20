const fs = require('fs');
const marked = require('marked');
const ejs = require('ejs');

fs.readFile('../../Changelog.md', 'utf8', (err, data) => {
    if (err) throw err;

    const html = marked(data);
    ejs.renderFile('home.ejs', {markdown: html}, (err, str) => {
        if (err) throw err;
        console.log(str);
    });
});
