# ErsatzTV-Filler Configuration (General)

General configuration options are cross app settings that users can set as needed.

## General Configuration Options

### Custom Audio Location

- `Filepath`

This is the option to set a `filepath` for custom audio files to be used withing the filler videos. If not set a fallback audio library (inlcuded) will be used.

### Output Directory

- `Filepath`

This is the option to set a `filepath` for where the generated filler video files should go. This is is the filepath that should also be set under an other video library in ersatztv.

### City

- `Location (City)`

This is the option to set the `City` you want to use for various filler types. Currently it is only used for weather.

*Note:* If the location is 2 words e.g. 'San Antonio' the 2 words should be seperated with a '+' e.g. 'San+Antonio'

### State


- `Location (State)`

This is the option to set the `State` you want to use for various filler types. Currently it is only used for weather.

*Note:* If the location is 2 words e.g. 'New Mexico' the 2 words should be seperated with a '+' e.g. 'New+Mexico'

### Video Length

- `Time (seconds)`

This is the option to select how long you wish the filler videos to run for. If you want 10 seconds then you would just set `10` as the option. This option is currently only used for Vanity Cards and Weather filler types

### ErsatzTV Location

- `URL`

This is the option to set the `URL` of ersatztv. This should point to the ersatztv homepage, it should be in the format of http://ip:port

### Video Resolution

- `Number (Video Resolution)`

This is the option to set the resolution of the filler video files. The format should be 'numberxnumber' e.g. '1920x1080'

### Web Port

- `Number`

This is the option to set the web port for ErsatzTV-Filler. For example if you set it to '8408' (the default), you would then access ErsatzTV-Filler in your web browser via 'http://ip:8408'

### Custom FFMPEG Command - Advanced

- `Command`

This is an option to set a custom ffmpeg command if you want to use a different version of ffmpeg than what is packaged. The command should be in the format of 'path/ffmpeg(.exe) -y', ensure there is no trailing space.

### FFMPEG Encoder - Expirimental (Not Recommended)

- `Variable`

This is the option to set a custom FFMPEG Encoder to enable hardware acceleration. This setting is not recommended to be used and is expirimental. Will not work in docker.

### HW Accel Mode - Expirimental (Not Recommended)

- `Variable`

This is the option to set a custom HW Accel Mode to enable hardware acceleration. This setting is not recommended to be used and is expirimental. Will not work in docker.

### HW Accel Device - Expirimental (Not Recommended)

- `Variable`

This is the option to set a custom HW Accel Device to enable hardware acceleration. This setting is not recommended to be used and is expirimental. Will not work in docker.
