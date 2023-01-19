function stringifyDotEnv(obj) {
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
    stringifyDotEnv
}