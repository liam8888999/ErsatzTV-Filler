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

  *  - `{{TODAY}}` - today
  *  - `{{TOMORROW}}` - tomorrows day name (e.g. wednesday)
  *  - `{{DAY_THREE}}` - the day after tomorrows day name (e.g. thursday)
  *  - `{{OBSERVATION_TIME}}` - weathers observation time
  *  - `{{LOCAL_OBSERVATION_DATETIME}}` - weathers observation time (localised)
  *  - `{{WEATHER_HEADER}}` - the text from the weather header config option
  *  - `{{CITY}}` - City of weather report
  *  - `{{STATE}}` - State of weather report
  *  - `{{COUNTRY}}` - Country of weather repor
  *  - `{{CURRENT_CONDITIONS}}` - the current weather conditions (e.g. sunny/cloudy)
  *  - `{{CURRENT_TEMP}}` - the current temperature
  *  - `{{CURRENT_FEELSLIKE}}` - the current feels like temperature
  *  - `{{CURRENT_CLOUDCOVER}}` - the current cloud cover percentage
  *  - `{{CURRENT_HUMIDITY}}` - the current humidity percentage
  *  - `{{CURRENT_PRESSURE}}` - the current pressure
  *  - `{{CURRENT_PRESSUREINCHES}}` - the current pressure (inches)
  *  - `{{CURRENT_UVINDEX}}` - the current uv index
  *  - `{{CURRENT_WIND_DIR}}` - the current wind direction (North, South, East, West)
  *  - `{{CURRENT_WIND_SPEED}}` - the current wind speed
  *  - `{{LATITUDE}}` - the latitute of the weather forecast location
  *  - `{{LONGITUDE}}` - the longitude of the weather forecast location
  *  - `{{POPULATION}}` - the population of the weather forecast location
  *  - `{{TODAY_AVERAGETEMP}}` - todays average temperature
  *  - `{{TODAY_DATE}}` - todays date
  *  - `{{TODAY_MAXTEMP}}` - todays maximum temperature
  *  - `{{TODAY_MINTEMP}}` - todays minimum temperature
  *  - `{{TODAY_SUNHOUR}}` - todays amount of sunlight hours
  *  - `{{TODAY_TOTALSNOW_CM}}` - todays total snow fall in cm
  *  - `{{TODAY_UVINDEX}}' - `todays uv index
  *  - `{{TODAY_MOON_ILLUMINATION}}` - todays moon moon illumination
  *  - `{{TODAY_MOON_PHASE}}` - todays moon phase
  *  - `{{TODAY_MOONRISE}}` - todays moonrise time
  *  - `{{TODAY_MOONSET}}` - todays moon set time
  *  - `{{TODAY_SUNRISE}}` - todays sunrise time
  *  - `{{TODAY_SUNSET}}` - todays sunset time
  *  - `{{TOMORROW_AVERAGETEMP}}` - tomorrows average temperature
  *  - `{{TOMORROW_DATE}}` - tomorrows date
  *  - `{{TOMORROW_MAXTEMP}}` - tomorrows maximum temperature
  *  - `{{TOMORROW_MINTEMP}}` - tomorrows minimum temperature
  *  - `{{TOMORROW_SUNHOUR}}` - tomorrows amount of sunlight hours
  *  - `{{TOMORROW_TOTALSNOW_CM}}` - tomorrows total snow fall in cm
  *  - `{{TOMORROW_UVINDEX}}' - `tomorrows uv index
  *  - `{{TOMORROW_MOON_ILLUMINATION}}` - tomorrows moon moon illumination
  *  - `{{TOMORROW_MOON_PHASE}}` - tomorrows moon phase
  *  - `{{TOMORROW_MOONRISE}}` - tomorrows moonrise time
  *  - `{{TOMORROW_MOONSET}}` - tomorrows moon set time
  *  - `{{TOMORROW_SUNRISE}}` - tomorrows sunrise time
  *  - `{{TOMORROW_SUNSET}}` - tomorrows sunset time
  *  - `{{DAY_THREE_AVERAGETEMP}}` - the day after tomorrows average temperature
  *  - `{{DAY_THREE_DATE}}` - the day after tomorrows date
  *  - `{{DAY_THREE_MAXTEMP}}` - the day after tomorrows maximum temperature
  *  - `{{DAY_THREE_MINTEMP}}` - the day after tomorrows/ minimum temperature
  *  - `{{DAY_THREE_SUNHOUR}}` - the day after tomorrows amount of sunlight hours
  *  - `{{DAY_THREE_TOTALSNOW_CM}}` - the day after tomorrows total snow fall in cm
  *  - `{{DAY_THREE_UVINDEX}}' - `the day after tomorrows uv index
  *  - `{{DAY_THREE_MOON_ILLUMINATION}}` - the day after tomorrows moon moon illumination
  *  - `{{DAY_THREE_MOON_PHASE}}` - the day after tomorrows moon phase
  *  - `{{DAY_THREE_MOONRISE}}` - the day after tomorrows moonrise time
  *  - `{{DAY_THREE_MOONSET}}` - the day after tomorrows moon set time
  *  - `{{DAY_THREE_SUNRISE}}` - the day after tomorrows sunrise time
  *  - `{{DAY_THREE_SUNSET}}` - the day after tomorrows sunset time
