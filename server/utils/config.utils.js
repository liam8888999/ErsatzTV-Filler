const dotenv = require('dotenv')
const {CONFIG_CONSTANTS} = require("../constants/path.constants");
const {overWriteFileContents} = require("../utils/file.utils");
const {stringifyDotEnv} = require("../utils/string.utils")

const parseConfigurationFile = (path) => {
    return dotenv.config({path})
}

const writeValueToConfigurationFile = async (key, value) => {
    const latestDotEnvConfig = parseConfigurationFile(CONFIG_CONSTANTS().USER_CONFIG)

    const newDotEnv = {
        ...latestDotEnvConfig.parsed,
        [key]: value
    };

    const dotEnvResult = stringifyDotEnv(newDotEnv);
    await overWriteFileContents(CONFIG_CONSTANTS().USER_CONFIG,  dotEnvResult)
}

module.exports = {
    parseConfigurationFile,
    writeValueToConfigurationFile
}