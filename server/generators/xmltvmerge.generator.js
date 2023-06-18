const fs = require('fs');
const parser = require('epg-parser');
const { XMLTVMERGEDIR } = require("../constants/path.constants");
const { create, node } = require('xmlbuilder2');
const builder = require('xmlbuilder');
const { downloadImage } = require("../utils/downloadimage.utils");
const logger = require("../utils/logger.utils");
const { retrieveCurrentConfiguration } = require("../modules/config-loader.module");
const { createDirectoryIfNotExists } =require("../utils/file.utils");

const XMLTVPARSE = async () => {

  createDirectoryIfNotExists(XMLTVMERGEDIR);

const config_current = await retrieveCurrentConfiguration()

let epg1;
if (config_current.epg1.startsWith("http")) {
await downloadImage(`${config_current.epg1}`, `${XMLTVMERGEDIR}/epg1.xml`)
.then(logger.success)
.catch(logger.error);

epg1 = await fs.readFileSync(`${XMLTVMERGEDIR}/epg1.xml`, { encoding: 'utf-8' })
} else {
epg1 = await fs.readFileSync(`${config_current.epg1}`, { encoding: 'utf-8' })
};

let epg2;
if (config_current.epg2.startsWith("http")) {
await downloadImage(`${config_current.epg2}`, `${XMLTVMERGEDIR}/epg2.xml`)
    .then(logger.success)
    .catch(logger.error);

epg2 = await fs.readFileSync(`${XMLTVMERGEDIR}/epg2.xml`, { encoding: 'utf-8' })
} else {
epg2 = await fs.readFileSync(`${config_current.epg2}`, { encoding: 'utf-8' })
};

const object1 = parser.parse(await epg1)
const object2 = parser.parse(await epg2)

//console.log(await result)



const mergedObject = {
  channels: [...object1.channels, ...object2.channels],
  programs: [...object1.programs, ...object2.programs]
};

//console.log(mergedObject);




    // Write updated object back to file
    //fs.writeFileSync(`${WORKDIR}/parsed.txt`, JSON.stringify(mergedObject, null, 2));


  const data = mergedObject;


  // Create the root element of the XML document
  const xml = builder.create('tv', { version: '1.0', encoding: 'UTF-8' });

  // Add channels to the XML document
  data.channels.forEach(channel => {
    const channelElem = xml.ele('channel', { id: channel.id });
    channel.name.forEach(name => channelElem.ele('display-name', name.value));
    channel.icon.forEach(icon => channelElem.ele('icon', { src: icon }));
  });

  // Add programs to the XML document
  data.programs.forEach(program => {
    const programElem = xml.ele('programme', {
      start: program.start,
      stop: program.stop,
      channel: program.channel
    });

    program.title.forEach(title => programElem.ele('title', title.value));
    program.desc.forEach(desc => programElem.ele('desc', desc.value));
    program.category.forEach(category => programElem.ele('category', category.value));

    program.episodeNum.forEach(episodeNum => {
      programElem.ele('episode-num', { system: episodeNum.system }, episodeNum.value);
    });

    program.icon.forEach(icon => programElem.ele('icon', { src: icon }));
  });

  // Convert the XML document to string
  const xmlString = xml.end({ pretty: true });

  // Save the XML string to a file
  fs.writeFileSync(`${XMLTVMERGEDIR}/mergedxmltv.xml`, xmlString, 'utf8');

  logger.success('XMLTV file created successfully.');



};


module.exports = {
    XMLTVPARSE
}
