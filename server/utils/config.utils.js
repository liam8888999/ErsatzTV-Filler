const dotenv = require('dotenv')
const parseConfigurationFile = (path) => {
    return dotenv.config({path})
}

const writeValueToConfigurationFile = () => {

}

module.exports = {
    parseConfigurationFile
}