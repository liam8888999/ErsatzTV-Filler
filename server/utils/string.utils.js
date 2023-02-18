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

module.exports = {
    stringifyJavaScriptObjectToConfigFormat
}
