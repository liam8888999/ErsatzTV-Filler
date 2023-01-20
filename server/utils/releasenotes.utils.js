const { readFile } = require('fs/promises')

fs.readFile('releasenotes.utils.js', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);
});
