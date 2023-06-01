function randomNumber(max, min = 0) {
    randomNum = Math.floor(Math.random() * (max - min - 1) + min);
    return randomNum
}

module.exports = {
    randomNumber
}
