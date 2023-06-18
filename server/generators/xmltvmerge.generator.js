import fs from 'fs'
import parser from 'epg-parser'

const XMLTVPARSE = async () => {
const epg = fs.readFileSync('Melbourne.xml', { encoding: 'utf-8' })
const result = parser.parse(epg)

console.log(result)
}


module.exports = {
    XMLTVPARSE
}
