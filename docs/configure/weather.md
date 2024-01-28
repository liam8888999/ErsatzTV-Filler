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

The text for a custom weather reader script. If this option has any text then it will automatically be used otherwise it will fall back to the default. Clicking on the `View Scripts` link will display the current template and how it will be filled out when sent to be converted to speech.

The Format should be 'The current temperature is {{currentConditions.temp}}' with the variables enclosed in `{{variable}}`

Each set of {} indicates a grouping to get to data inside that group use a .

For example:

* Current Feels Like Temperature = `{{currentConditions.feelsLike}}`
* Today's Forecast High = `{{forecast.today.maxtemp}}`

Many of the unitless variables are dynamic based on your temperature setting.  Metric units will be in the short form by default unless the `Temperature Unit` is set to `Fahrenheit`.

Clicking on the `View Data` link will generate and display a file containing the data used to generate the weather reader script.

An example with `Farenheight` set:
```json
{
    "currentConditions": {
        "FeelsLikeC": "-3",
        "feelsLike": "26",
        "cloudcover": "0",
        "humidity": "51",
        "observationDate": "Sunday, January 28, 2024 at 4:00 AM",
        "day": "Sunday",
        "date": "Sunday, January 28, 2024",
        "observation_time": "11:00 AM",
        "precip": "0.0",
        "precipMM": "0.0",
        "pressure": "30",
        "temp_C": "0",
        "temp": "32", //Farenheight degrees
        "uvIndex": "1",
        "visibility": "9",
        "weatherCode": "113",
        "conditions": "Clear",
        "weatherIconUrl": [
            {
              "value": ""
            }
        ],
        "windDir": "west ",
        "winddirDegree": "280",
        "windspeedKmph": "9",
        "windspeed": "6" //Miles Per Hour
    },
    "location": {
        "city": "Broomfield",
        "country": "United States of America",
        "latitude": "39.921",
        "longitude": "-105.086",
        "population": "44692",
        "state": "Colorado"
    },
    "forecast": {
        "1": {
            "astronomy": {
                "moon_illumination": "91",
                "moon_phase": "Waning Gibbous",
                "moonrise": "09:14 PM",
                "moonset": "09:18 AM",
                "sunrise": "07:12 AM",
                "sunset": "05:16 PM"
            },
            "avgtempC": "6",
            "avgtemp": "42",
            "date": "Sunday, January 28",
            "day": "Sunday",
            "maxtempC": "12",
            "maxtemp": "53",
            "mintempC": "2",
            "mintemp": "35",
            "sunHour": "10.0",
            "totalSnow_cm": "0.0",
            "uvIndex": "3"
        },
        "2": {
            "astronomy": {
                "moon_illumination": "84",
                "moon_phase": "Waning Gibbous",
                "moonrise": "10:12 PM",
                "moonset": "09:38 AM",
                "sunrise": "07:11 AM",
                "sunset": "05:17 PM"
            },
                "avgtempC": "6",
                "avgtemp": "43",
                "date": "Monday, January 29",
                "day": "Monday",
                "maxtempC": "12",
                "maxtemp": "54",
                "mintempC": "2",
                "mintemp": "36",
                "sunHour": "10.0",
                "totalSnow_cm": "0.0",
                "uvIndex": "3"
        },
        "today": {
            "astronomy": {
                "moon_illumination": "95",
                "moon_phase": "Waning Gibbous",
                "moonrise": "08:14 PM",
                "moonset": "08:58 AM",
                "sunrise": "07:13 AM",
                "sunset": "05:15 PM"
            },
            "avgtempC": "4",
            "avgtemp": "40",
            "date": "Saturday, January 27",
            "day": "Saturday",
            "maxtempC": "12",
            "maxtemp": "54",
            "mintempC": "0",
            "mintemp": "32",
            "sunHour": "10.0",
            "totalSnow_cm": "0.0",
            "uvIndex": "3"
        }
    },
    "units": {
        "temperature": "fahrenheit",
        "speed": "Miles",
        "depth": "Inches"
    },
    "header": "Current Weather",
    "request": [
        {
            "query": "Lat 39.94 and Lon -105.04",
            "type": "LatLon"
        }
    ]
}
```
