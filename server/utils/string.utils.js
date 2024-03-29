const logger = require("../utils/logger.utils");
const path = require('path')

/**
 * Stringify an object specifically for our config
 * @param obj
 * @returns {string}
 */
function stringifyJavaScriptObjectToConfigFormat(obj) {
    let result = "";
    for (const [key, value] of Object.entries(obj)) {
        if (key) {
            const line = `${key}=${String(value)}`;
            result += line + "\n";
        }
    }
    return result;
}

function asssubstitution(asslocation) {
  logger.info(`ass file path: ${asslocation}`)
  const assfilelocation = asslocation
const asslocationsubstituted = `${assfilelocation.replace(/\\/g, "/").replace(/:/g, "\\:").replace(/\[/g, "\\[").replace(/\]/g, "\\]")}`
    logger.info(`ass location substituted: ${asslocationsubstituted}`)
return asslocationsubstituted
}

module.exports = {
    stringifyJavaScriptObjectToConfigFormat,
    asssubstitution
}
