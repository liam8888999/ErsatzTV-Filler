const logger = require("../utils/logger.utils");
const moment = require('moment-timezone');

const { WEATHER } = require("../generators/weather.generator");
const { NEWS } = require("../generators/news.generator");
const { XMLTVPARSE } = require("../generators/xmltvmerge.generator");
const { CHANNEL_OFFLINE } = require("../generators/channel-offline.generator");
const { VANITYCARDS } = require("../generators/vanitycards.generator");

const GENERATION = async () => {
//   WEATHER();
//  NEWS();
//  XMLTVPARSE()
//  CHANNEL_OFFLINE()
//  VANITYCARDS()
}

module.exports = {
    GENERATION
};
