# ErsatzTV-Filler Configuration (News)

News configuration options are settings that control the News filler functions that users can set as needed.

## News Configuration Options

### Process News?

- `yes/no`

This is the option whether you want the News filler to generate, it can be set as `yes` to process or `no` if you dont want it to process.

### News Video Fade Out Duration

- `Time (seconds)`

This is the option to set a fade out for the video which will make the video fade to black for the selected amount of seconds at the end. If you want 5 seconds then you would just set `5` as the option.

### News Video Fade In Duration

- `Time (seconds)`

This is the option to set a fade in for the video which will make the video fade in from black for the selected amount of seconds at the start. If you want 5 seconds then you would just set `5` as the option.

### News Audio Fade Out Duration

- `Time (seconds)`

This is the option to set a fade out for the audio which will make the audio volume fade to 0 for the selected amount of seconds at the end. If you want 5 seconds then you would just set `5` as the option.

### News Audio Fade In Duration

- `Time (seconds)`

This is the option to set a fade in for the audio which will make the audio volume fade from 0 for the selected amount of seconds at the start. If you want 5 seconds then you would just set `5` as the option.

### Newsfeed URL

- `URL`

This is the option to set the url for the rss feed that will be used to extract the newsfeeds from. Only 1 newsfeed is currently supported.

### News Video Duration

- `Time (seconds)`

This is the option to select how long you wish the news video to run for. If you want 30 seconds then you would just set `30` as the option.

### News Articles To Display

- `Number`

This is the option to select how many news articles to display in the video. If you want 10 articles then you would just set `10` as the option.

### News Generation Interval

- `Time (minutes)`

This is the option to select how often you wish the news filler to be regenerated to include new articles. If you want it to run every 30 minutes then you would just set `30` as the option.

*Note:* This is based on the cron of '\*/{interval} \* \* \* \*' e.g. '\*/30 \* \* \* \*'

### Show the news header?

- `yes/no`

This is the option whether you want to show the header in the news filler, it can be set as `yes` to show or `no` if you dont want it to show.

### News header text

- `String (header text)`

This is the option to select what text to show in the news header.
