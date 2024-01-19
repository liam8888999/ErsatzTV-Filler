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