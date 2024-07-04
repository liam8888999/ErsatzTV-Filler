const googleTTS = require("google-tts-api");
const fs = require("fs");
const logger = require("../../utils/logger.utils");
const mp3Duration = require("mp3-duration");
const createAudio = (newsFeedread, audiolanguage, filePath) => {
    return new Promise((resolve) => {
        audiolanguage = audiolanguage || 'en';
        googleTTS.getAllAudioBase64(newsFeedread, {lang: `${audiolanguage}`}).then((results) => {
            const buffers = results.map(results => Buffer.from(results.base64, 'base64'));
            const finalBuffer = Buffer.concat(buffers);
            fs.writeFileSync(filePath, finalBuffer);
            logger.success(`Audio file ${filePath} created successfully`);
        })
          .catch((err) => {
              logger.error(err);
          });
        setTimeout(resolve, 3000);
    });
}

const speedFactor = (file, newsduration) => {
    return mp3Duration(file).then((duration) =>  {
        logger.debug('Your file is ' + duration + ' seconds long');
        const factor = duration / newsduration;
        logger.debug('speedFactor is:', factor);
        return factor;
    }).catch((err) => {
        logger.error(err);
        return newsduration;
    });
}

const ffmpegSpeechOrMusicCommand = (useSpeech, file, factor, inputPosition) => {
    if(useSpeech === true) {
        return `"${file}" -filter_complex "[${inputPosition}:a]atempo=${factor},volume=${inputPosition}[a]" -map 0 -map "[a]" `;
    }
    return `"${file}" -shortest  -c:a copy `;
}
module.exports = {
    createAudio,
    speedFactor,
    ffmpegSpeechOrMusicCommand
};
