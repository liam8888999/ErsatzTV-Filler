# ErsatzTV-Filler Configuration (XMLTV Merge)

XMLTV Merge configuration options are settings that control the XMLTV Merge functions that users can set as needed.

## XMLTV Merge Configuration Options

### Run XMLTVMERGER?

- `yes/no`

This is the option whether you want the XMLTV Merger to run, it can be set as `yes` to run or `no` if you dont want it to run.

### EPG Files To Merge

- `URL/Filepath (multiple, comma seperated)`

This is the option to set the location of the XMLTV files you wish to merge. Can be either a `URL` or a `Filepath`. They should be seperated with a comma e.g. `http://example.com/xmltv.xml,/home/example/xmltv.com`

### XMLTVMERGER Interval

- `Time (minutes)`

This is the option to select how often you wish the XMLTV Merger to be run to update the output XMLTV file. If you want it to run every 30 minutes then you would just set `30` as the option.

*Note:* This is based on the cron of '\*/{interval} \* \* \* \*' e.g. '\*/30 \* \* \* \*'
