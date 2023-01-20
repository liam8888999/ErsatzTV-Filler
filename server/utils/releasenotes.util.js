const { readFile } = require('fs/promises')

async function content(path) {
  return await readFile(path, 'utf8')
}

const releaseNotes = async () => {
await content('./releasenotes.util.js')
}

console.log(releaseNotes)
