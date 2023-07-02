const fs = require('fs');
const xml2js = require('xml2js');
const { WORKDIR } = require("../constants/path.constants");

const CHANNEL_OFFLINE = async () => {
  // Function to split XMLTV by channel
  function splitXMLTVByChannel(xmltvFilePath, callback) {
    fs.readFile(xmltvFilePath, 'utf8', (err, xmlData) => {
      if (err) {
        console.error('Error reading XMLTV file:', err);
        callback(err);
        return;
      }

      xml2js.parseString(xmlData, (parseErr, result) => {
        if (parseErr) {
          console.error('Error parsing XML:', parseErr);
          callback(parseErr);
          return;
        }

        const channels = result.tv.channel;

        channels.forEach(channel => {
          const channelId = channel.$.id;

          const programs = result.tv.programme.filter(program => program.$.channel === channelId);

          const builder = new xml2js.Builder();

          const channelXMLData = {
            tv: {
              channel: [channel],
              programme: programs
            }
          };

          const channelXMLString = builder.buildObject(channelXMLData);

          const channelFilePath = `${WORKDIR}/${channelId}.xml`;
          fs.writeFile(channelFilePath, channelXMLString, 'utf8', writeErr => {
            if (writeErr) {
              console.error(`Error writing channel file (${channelFilePath}):`, writeErr);
              return;
            }
            console.log(`Channel file saved: ${channelFilePath}`);
          });

          // Check if this is the last channel
          if (channel === channels[channels.length - 1]) {
            // Invoke the callback once the last channel is processed
            callback();
          }
        });
      });
    });
  }

  // Function to find start time
  const startTimefind = async () => {
    // Read the XML file
    fs.readFile('workdir/417930auepg.com.au.xml', 'utf-8', (err, data) => {
      if (err) {
        console.error('Error reading XML file:', err);
        return;
      }

      // Parse the XML
      xml2js.parseString(data, (parseErr, result) => {
        if (parseErr) {
          console.error('Error parsing XML:', parseErr);
          return;
        }

        // Extract the show start time
        const showName = 'Vietnamese'; // Replace with the name of the show you're looking for

        const programme = result.tv.programme.find(program => program.title[0] === showName);

        if (programme) {
          const startTimeString = programme.$.start;
          console.log('Start Time:', formatTime(startTimeString));

          // Calculate the end time based on the start time and duration
          const duration = programme.$.duration;
          const startTime = new Date(startTimeString);
          const endTime = new Date(startTime.getTime() + duration * 1000);
          console.log('End Time:', formatTime(endTime));
        } else {
          console.log('Show not found.');
        }
      });

      function formatTime(date) {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let ampm = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;

        return hours + ':' + minutes + ' ' + ampm;
      }
    });
  }

  // Usage
  const xmltvFilePath = `${WORKDIR}/epg2.xml`;
  splitXMLTVByChannel(xmltvFilePath, () => {
    startTimefind(); // Call the startTimefind function after splitting the XMLTV file
  });
};

module.exports = {
  CHANNEL_OFFLINE
};
