# ErsatzTV-Filler Api

Most of ErsatzTV-Fillers functions can be controlled via the Api.

## Config Api

- ### `/api/config/readconfigjson`

    This Api is used to return the config.json file contents.

- ### `/api/config/webtheme/load`

    This Api is used to return the web theme (dark/light) in json.

## Health Api

- ### `/api/health`

    This Api is used to return the health check information that can be seen on the homepage.

## Logs Api

- ### `/logs/load`

    This Api is used to return the latest log file contents.

- ### `/logs/zip`

    This Api is used to retrieve a zip file of all all files in the logs folder.

## Media Api

- ### `/media/:filename`

    This Api is used to retrieve a file from the output folder where :filename is the name of the file you want to get.

## Run Api

- ### `/api/run/weather`

    This Api is used to begin manually running the Weather generation.

- ### `/api/run/news`

    This Api is used to begin manually running the News generation.

- ### `/api/run/channel-offline`

    This Api is used to begin manually running the Channel Offline generation.

- ### `/api/run/xmltvmerger`

    This Api is used to begin manually running the XMLTV Merger.

- ### `/api/run/vanitycard`

    This Api is used to begin manually running the Vanity Card generation.

## XMLTVMERGE Api

- ### `/xmltvmerge/mergedxmltv.xml`

    This Api is used to retrieve the merged xmltv file.
