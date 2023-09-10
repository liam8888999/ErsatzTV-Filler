# ErsatzTV-Filler Configuration (Vanity Cards)

Vanity Cards configuration options are settings that control the Vanity Cards filler functions that users can set as needed.

## Vanity Cards Configuration Options

### Process Vanity Cards?

- `yes/no`

This is the option whether you want the Vanity Cards filler to generate, it can be set as `yes` to process or `no` if you dont want it to process.

### Amount of Vanity Card Videos

- `Number`

This is the option to select how many different vanity card filler videos to create (with different vanity cards, randomly selected). If you want 5 videos then you would just set `5` as the option.

### Vanity Generation Interval

- `Time (minutes)`

This is the option to select how often you wish the Vanity Cards filler to be regenerated to refresh the vanity cards shown in the videos. If you want it to run every 5 minutes then you would just set `5` as the option.

*Note:* This is based on the cron of '\*/{interval} \* \* \* \*' e.g. '\*/5 \* \* \* \*'
