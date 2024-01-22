# ErsatzTV-Filler Configuration (Weather)

Weather configuration options are settings that control the Weather filler functions that users can set as needed.

## Weather Configuration Options

### Process Weather?

- `yes/no`

This is the option whether you want the Weather filler to generate, it can be set as `yes` to process or `no` if you dont want it to process.

### Generate Weather V4 (Upcoming)

- `yes/no`

This option is currently unused but will be active in a future version.

### Weather Video Fade Out Duration

- `Time (seconds)`

This is the option to set a fade out for the video which will make the video fade to black for the selected amount of seconds at the end. If you want 5 seconds then you would just set `5` as the option.

### Weather Video Fade In Duration

- `Time (seconds)`

This is the option to set a fade in for the video which will make the video fade in from black for the selected amount of seconds at the start. If you want 5 seconds then you would just set `5` as the option.

### Weather Audio Fade Out Duration

- `Time (seconds)`

This is the option to set a fade out for the audio which will make the audio volume fade to 0 for the selected amount of seconds at the end. If you want 5 seconds then you would just set `5` as the option.

### Weather Audio Fade In Duration

- `Time (seconds)`

This is the option to set a fade in for the audio which will make the audio volume fade from 0 for the selected amount of seconds at the start. If you want 5 seconds then you would just set `5` as the option.

### Weather Generation Interval

- `Time (minutes)`

This is the option to select how often you wish the Weather filler to be regenerated to update the weather information in the videos. If you want it to run every 10 minutes then you would just set `10` as the option.

*Note:* This is based on the cron of '\*/{interval} \* \* \* \*' e.g. '\*/10 \* \* \* \*'

### Weather Video Duration

- `Time (seconds)`

This is the option to set the duration the weather filler will run for. If you want 30 seconds then you would just set `30` as the option.

### Weather Header text

- `String (header text)`

This is the option to select what text to show in the weather header.

### Show the Weather Header?

- `yes/no`

This is the option whether you want to show the header in the weather filler, it can be set as `yes` to show or `no` if you dont want it to show.

### Temperature Units
- `<empty>/fahrenheit/celsius`

Used by the various image and text to speech generators to determine what to display.  Empty will default to Celsius or both in some cases.

### Use wttr.in Instead Of weatherforyou.net
- `yes/no`

Yes to use wttr.in for weather, no to parse the city/state/country values on weatherforyou.net
If the Country field is set to a country other than US, wttr.in will be used as well.

### Booked.Net Widget Code
- `Widget HTML`

Click on the link and customize any of the available widgets to your desired location.

Click on the "Get HTML code" button and copy the text displayed with "A Script" selected.

Paste that text into the field.  This will cause the booked.net images to be used.

### Read The Weather
- `yes/no`

If set to yes, the audio on the weather videos will be a text to speech read of the current weather and the 3-day temperature forecast.

### Custom Weather Reader Script

- `String (custom weather reader script text)`

The text for a custom weather reader script. If this option has any text then it will automatically be used otherwise it will fallback to the default.

The Format should be 'The current temperature is {{CURRENT_TEMP}}' with the variables enclosed in `{{VARIABLE}}`

The available variables are:

 *  - {{TODAY}} - RETURNS `today`
 *  - {{TOMORROW}} - RETURNS `tomorrows day name (e.g. wednesday)`
 *  - {{DAY_THREE}} - RETURNS `the day after tomorrows day name (e.g. thursday)`
 *  - {{OBSERVATION_TIME}} - RETURNS `weathers observation time`
 *  - {{LOCAL_OBSERVATION_DATETIME}} - RETURNS `weathers observation time (localised)`
 *  - {{WEATHER_HEADER}} - RETURNS `the text from the weather header config option`
 *  - {{CITY}} - RETURNS `City of weather report`
 *  - {{STATE}} - RETURNS `State of weather report`
 *  - {{COUNTRY}} - RETURNS `Country of weather report`
 *  - {{CURRENT_CONDITIONS}} - RETURNS `the current weather conditions (e.g. sunny/cloudy)`
 *  - {{CURRENT_TEMP}} - RETURNS `the current temperature`
 *  - {{CURRENT_FEELSLIKE}} - RETURNS `the current feels like temperature`
 *  - {{CURRENT_CLOUDCOVER}} - RETURNS `the current cloud cover percentage`
 *  - {{CURRENT_HUMIDITY}} - RETURNS `the current humidity percentage`
 *  - {{CURRENT_PRESSURE}} - RETURNS `the current pressure`
 *  - {{CURRENT_PRESSUREINCHES}} - RETURNS `the current pressure (inches)`
 *  - {{CURRENT_UVINDEX}} - RETURNS `the current uv index`
 *  - {{CURRENT_WIND_DIR}} - RETURNS `the current wind direction (North, South, East, West)`
 *  - {{CURRENT_WIND_SPEED}} - RETURNS `the current wind speed`
 *  - {{LATITUDE}} - RETURNS `the latitute of the weather forecast location`
 *  - {{LONGITUDE}} - RETURNS `the longitude of the weather forecast location`
 *  - {{POPULATION}} - RETURNS `the population of the weather forecast location`
 *  - {{TODAY_AVERAGETEMP}} - RETURNS `todays average temperature`
 *  - {{TODAY_DATE}} - RETURNS `todays date`
 *  - {{TODAY_MAXTEMP}} - RETURNS `todays maximum temperature`
 *  - {{TODAY_MINTEMP}} - RETURNS `todays minimum temperature`
 *  - {{TODAY_SUNHOUR}} - RETURNS `todays amount of sunlight hours`
 *  - {{TODAY_TOTALSNOW_CM}} - RETURNS `todays total snow fall in cm`
 *  - {{TODAY_UVINDEX}}' - RETURNS `todays uv index`
 *  - {{TODAY_MOON_ILLUMINATION}} - RETURNS `todays moon moon illumination`
 *  - {{TODAY_MOON_PHASE}} - RETURNS `todays moon phase`
 *  - {{TODAY_MOONRISE}} - RETURNS `todays moonrise time`
 *  - {{TODAY_MOONSET}} - RETURNS `todays moon set time`
 *  - {{TODAY_SUNRISE}} - RETURNS `todays sunrise time`
 *  - {{TODAY_SUNSET}} - RETURNS `todays sunset time`
 *  - {{TOMORROW_AVERAGETEMP}} - RETURNS `tomorrows average temperature`
 *  - {{TOMORROW_DATE}} - RETURNS `tomorrows date`
 *  - {{TOMORROW_MAXTEMP}} - RETURNS `tomorrows maximum temperature`
 *  - {{TOMORROW_MINTEMP}} - RETURNS `tomorrows minimum temperature`
 *  - {{TOMORROW_SUNHOUR}} - RETURNS `tomorrows amount of sunlight hours`
 *  - {{TOMORROW_TOTALSNOW_CM}} - RETURNS `tomorrows total snow fall in cm`
 *  - {{TOMORROW_UVINDEX}}' - RETURNS `tomorrows uv index`
 *  - {{TOMORROW_MOON_ILLUMINATION}} - RETURNS `tomorrows moon moon illumination`
 *  - {{TOMORROW_MOON_PHASE}} - RETURNS `tomorrows moon phase`
 *  - {{TOMORROW_MOONRISE}} - RETURNS `tomorrows moonrise time`
 *  - {{TOMORROW_MOONSET}} - RETURNS `tomorrows moon set time`
 *  - {{TOMORROW_SUNRISE}} - RETURNS `tomorrows sunrise time`
 *  - {{TOMORROW_SUNSET}} - RETURNS `tomorrows sunset time`
 *  - {{DAY_THREE_AVERAGETEMP}} - RETURNS `the day after tomorrows average temperature`
 *  - {{DAY_THREE_DATE}} - RETURNS `the day after tomorrows date`
 *  - {{DAY_THREE_MAXTEMP}} - RETURNS `the day after tomorrows maximum temperature`
 *  - {{DAY_THREE_MINTEMP}} - RETURNS `the day after tomorrows/ minimum temperature`
 *  - {{DAY_THREE_SUNHOUR}} - RETURNS `the day after tomorrows amount of sunlight hours`
 *  - {{DAY_THREE_TOTALSNOW_CM}} - RETURNS `the day after tomorrows total snow fall in cm`
 *  - {{DAY_THREE_UVINDEX}}' - RETURNS `the day after tomorrows uv index`
 *  - {{DAY_THREE_MOON_ILLUMINATION}} - RETURNS `the day after tomorrows moon moon illumination`
 *  - {{DAY_THREE_MOON_PHASE}} - RETURNS `the day after tomorrows moon phase`
 *  - {{DAY_THREE_MOONRISE}} - RETURNS `the day after tomorrows moonrise time`
 *  - {{DAY_THREE_MOONSET}} - RETURNS `the day after tomorrows moon set time`
 *  - {{DAY_THREE_SUNRISE}} - RETURNS `the day after tomorrows sunrise time`
 *  - {{DAY_THREE_SUNSET}} - RETURNS `the day after tomorrows sunset time`
