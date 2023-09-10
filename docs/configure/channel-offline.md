# ErsatzTV-Filler Configuration (Channel Offline)

Channel Offline configuration options are settings that control the Channel Offline filler functions that users can set as needed.

## Channel Offline Configuration Options

### Process Channel Offline?

- `yes/no`

This is the option whether you want the Channel Offline filler to generate, it can be set as `yes` to process or `no` if you dont want it to process.

### Channel Offline Generation Interval

- `Time (minutes)`

This is the option to select how often you wish the Channel Offline filler to be regenerated to update the required information in the videos. If you want it to run every 30 minutes then you would just set `30` as the option.

*Note:* This is based on the cron of '\*/{interval} \* \* \* \*' e.g. '\*/30 \* \* \* \*'
