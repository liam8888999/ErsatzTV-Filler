# Documentation

Themes

Themes use hex colours without the leading #

Channel-Offline

On the first run a video for each channel will be created, this video will not have any information in it but must be used scheduled in the time when the channel is expected to be offline.
If a new channel is added its video will be created during the next scheduled run or it can be run manually from the web interface or api.
For it to work the time when the channel is expected to be offline must be in 1 item on the schedule and must have a custom title of Channel-Offline (this will also appear nicely in any epg).
You will also need to add each {channelnumber}-offline.mp4 file created automatically to the other videos library and add each one you use to a collection by its self (or with any other things you may want to interweave it with during the offline times, such as short videos, as long as each channel has its own offline collection with only that channeloffline video in it or you will see the the wrong information on the wrong channel).
This collection should then be added to the schedule at times when the channel is planned to be offline (overnight would be a good example), you would then set it for the whole duration of the offline time (duration or flood mode, if the next scheduled item has a fixed start time, would both work), you would then set the Channel-Offline custom title and build the playout.
You will then see the channel-Offline filler during the offline times as long as there is enough time between when the offline time is set and the offline time starts for at least 1 video generation to occur (this will only apply to the first scheduled offline time as it will automatically search for and build ahead next time).


WEATHER

There are 4 types of weather videos,
1. Current and 3 day basic weather forecast
2. Data rich weather information
3. Weather map with city temperatures
4. All of the above joined together

To generate weather you can set your city and state in the config area, if you do not set your city and state it will automatically try and determine based off your reported online location.
Once the videos are created they are added to the other videos library in ErsatzTV, these can then be used in collections or filler and added to schedules to allow them to display on your channels.
