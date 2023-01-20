const { readFile } = require('fs/promises')

async function content(path) {
  return await readFile(path, 'utf8')
}

const text = await content('./existing-file.txt')

console.log(`${text}`)
