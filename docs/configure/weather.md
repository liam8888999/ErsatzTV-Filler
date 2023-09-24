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

This is the option to select how often you wish the Weather filler to be regenerated to update the news information in the videos. If you want it to run every 10 minutes then you would just set `10` as the option.

*Note:* This is based on the cron of '\*/{interval} \* \* \* \*' e.g. '\*/10 \* \* \* \*'

### Weather Video Duration

- `Time (seconds)`

This is the option to set the duration the weather filler will run for. If you want 30 seconds then you would just set `30` as the option.
