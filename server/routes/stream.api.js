const {ROUTE_CONSTANTS} = require("../constants/route.constants");
const { settheme } = require("../utils/themes.utils.js");
const { downloadImage } = require("../utils/downloadimage.utils");
const logger = require("../utils/logger.utils");
const { WEATHER } = require("../generators/weather.generator");
const { NEWS } = require("../generators/news.generator");
const { XMLTVPARSE } = require("../generators/xmltvmerge.generator");
const { CHANNEL_OFFLINE } = require("../generators/channel-offline.generator");
const { CHANNEL_LOGO } = require("../generators/channel-logo.generator");
const { VANITYCARDS } = require("../generators/vanitycards.generator");
const { retrieveCurrentConfiguration } = require("../modules/config-loader.module");
const { spawn } = require('child_process');
const {NEWSDIR, FFMPEGSTREAMCOMMAND} = require("../constants/path.constants");
const path = require('path');

const loadApistreamRoutes = (app) => {

  // Middleware to handle errors
  app.use((err, req, res, next) => {
    logger.error(`Page routes Error: ${err}`); // Log the error for debugging purposes

    // Set a default error status and message
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    // Send an error response to the client
    if (req.accepts('html')) {
    // Render an error HTML page
    res.status(status).send(`<html><head><style>body { background-color: #4d4d4d; }</style><title>Error</title></head><body><center><br><br><br><h1 style="color: red;">Error: ${status}</h1></center><br><center><h2 style="color: orange;">OOPS, Something went terribly wrong.</h2><br><span style="font-size: 48px;">🙁</span></center></body></html>`);

  } else {
    // Send a JSON response to the client
    res.status(status).json({ error: message });
  }
  });

// stream
app.get('/live/news/:filenum', async (req, res) => {
  const config_current = await retrieveCurrentConfiguration();
  const { filenum } = req.params;
logger.info("live streaming news")

  console.log('Client connected, starting FFmpeg stream');

  res.setHeader('Content-Type', 'video/mp4');

  let output_location;
 if (config_current.fillersubdirs) {
   output_location = `${path.join(config_current.output, `NEWS`)}`
 } else {
   output_location = config_current.output
 }

 const ffmpegBinary = config_current.customffmpeg || FFMPEGSTREAMCOMMAND;

 const ffmpeg = spawn(ffmpegBinary, [
   '-stream_loop', '-1',
   '-i', path.join(output_location, `news-${filenum}.mp4`),
   '-metadata', `title=news-${filenum}`,
   '-c', 'copy', // no re-encoding
   '-f', 'mp4',
   '-movflags', 'frag_keyframe+empty_moov+default_base_moof',
   'pipe:1'
 ]);

  // Pipe FFmpeg output to HTTP response
  ffmpeg.stdout.pipe(res);

  // Handle FFmpeg errors
  ffmpeg.stderr.on('data', (data) => {
    console.error(`FFmpeg stderr: ${data}`);
  });

  // Clean up when client disconnects
  req.on('close', () => {
    console.log('Client disconnected, killing FFmpeg');
    ffmpeg.kill('SIGINT');
  });
});

app.get('/live/weather/:filenum', async (req, res) => {
  const config_current = await retrieveCurrentConfiguration();
  const { filenum } = req.params;
logger.info("live streaming news")

  console.log('Client connected, starting FFmpeg stream');

  res.setHeader('Content-Type', 'video/mp4');

  let output_location;
 if (config_current.fillersubdirs) {
   output_location = `${path.join(config_current.output, `Weather`)}`
 } else {
   output_location = config_current.output
 }

 const ffmpegBinary = config_current.customffmpeg || FFMPEGSTREAMCOMMAND;

 const ffmpeg = spawn(ffmpegBinary, [
   '-stream_loop', '-1',
   '-i', path.join(output_location, `weather-v${filenum}.mp4`),
   '-metadata', `title=weather-v${filenum}`,
   '-c', 'copy', // no re-encoding
   '-f', 'mp4',
   '-movflags', 'frag_keyframe+empty_moov+default_base_moof',
   'pipe:1'
 ]);

  // Pipe FFmpeg output to HTTP response
  ffmpeg.stdout.pipe(res);

  // Handle FFmpeg errors
  ffmpeg.stderr.on('data', (data) => {
    console.error(`FFmpeg stderr: ${data}`);
  });

  // Clean up when client disconnects
  req.on('close', () => {
    console.log('Client disconnected, killing FFmpeg');
    ffmpeg.kill('SIGINT');
  });
});

app.get('/live/vanitycard/:filenum', async (req, res) => {
  const config_current = await retrieveCurrentConfiguration();
  const { filenum } = req.params;
logger.info("live streaming news")

  console.log('Client connected, starting FFmpeg stream');

  res.setHeader('Content-Type', 'video/mp4');

  let output_location;
 if (config_current.fillersubdirs) {
   output_location = `${path.join(config_current.output, `VANITYCARDS`)}`
 } else {
   output_location = config_current.output
 }

 const ffmpegBinary = config_current.customffmpeg || FFMPEGSTREAMCOMMAND;

 const ffmpeg = spawn(ffmpegBinary, [
   '-stream_loop', '-1',
   '-i', path.join(output_location, `vanitycard-${filenum}.mp4`),
   '-metadata', `title=vanitycard-${filenum}`,
   '-c', 'copy', // no re-encoding
   '-f', 'mp4',
   '-movflags', 'frag_keyframe+empty_moov+default_base_moof',
   'pipe:1'
 ]);

  // Pipe FFmpeg output to HTTP response
  ffmpeg.stdout.pipe(res);

  // Handle FFmpeg errors
  ffmpeg.stderr.on('data', (data) => {
    console.error(`FFmpeg stderr: ${data}`);
  });

  // Clean up when client disconnects
  req.on('close', () => {
    console.log('Client disconnected, killing FFmpeg');
    ffmpeg.kill('SIGINT');
  });
});

app.get('/live/channeloffline/:chanid', async (req, res) => {
  const config_current = await retrieveCurrentConfiguration();
  const { chanid } = req.params;
logger.info("live streaming news")

  console.log('Client connected, starting FFmpeg stream');

  res.setHeader('Content-Type', 'video/mp4');

  let output_location;
 if (config_current.fillersubdirs) {
   output_location = `${path.join(config_current.output, `CHANNELOFFLINE`)}`
 } else {
   output_location = config_current.output
 }

 const ffmpegBinary = config_current.customffmpeg || FFMPEGSTREAMCOMMAND;

 const ffmpeg = spawn(ffmpegBinary, [
   '-stream_loop', '-1',
   '-i', path.join(output_location, `${chanid}.mp4`),
   '-metadata', `title=${chanid}`,
   '-c', 'copy', // no re-encoding
   '-f', 'mp4',
   '-movflags', 'frag_keyframe+empty_moov+default_base_moof',
   'pipe:1'
 ]);

  // Pipe FFmpeg output to HTTP response
  ffmpeg.stdout.pipe(res);

  // Handle FFmpeg errors
  ffmpeg.stderr.on('data', (data) => {
    console.error(`FFmpeg stderr: ${data}`);
  });

  // Clean up when client disconnects
  req.on('close', () => {
    console.log('Client disconnected, killing FFmpeg');
    ffmpeg.kill('SIGINT');
  });
});


}

module.exports = {
    loadApistreamRoutes
}
