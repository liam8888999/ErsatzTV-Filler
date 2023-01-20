const fs = require('fs');
let data;
fs.readFile('../../Changelog.md', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);
});
