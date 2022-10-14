#!/bin/bash


#user definable configuration

#weather

output=/home/xxx/xxx
city=Melbourne
state=Victoria

#non user definable configuration

wdir="$PWD"; [ "$PWD" = "/" ] && wdir=""
case "$0" in
  /*) scriptdir="${0}";;
  *) scriptdir="$wdir/${0#./}";;
esac
scriptdir="${scriptdir%/*}"


#General cleanup

rm -f $scriptdir/weather/v1.png
rm -f $scriptdir/weather/v2.png
rm -f $scriptdir/weather/v3.png

#weather

#retrieve weather data

curl wttr.in/${city}_t.png --output $scriptdir/weather/v1.png
curl v2.wttr.in/${city}_t.png --output $scriptdir/weather/v2.png
curl v3.wttr.in/${state}_t.png --output $scriptdir/weather/v3.png
wait

#make video

ffmpeg -i $scriptdir/weather/weather.avi -i $scriptdir/weather/v1.png -filter_complex "[0:v][1:v] overlay=0:50" -pix_fmt yuv420p -c:a copy $output/weather-v1.mp4
ffmpeg -i $scriptdir/weather/weather.avi -i $scriptdir/weather/v2.png -filter_complex "[0:v][1:v] overlay=200:30" -pix_fmt yuv420p -c:a copy $output/weather-v2.mp4
ffmpeg -i $scriptdir/weather/weather.avi -i $scriptdir/weather/v3.png -filter_complex "[0:v][1:v] overlay=4:0" -pix_fmt yuv420p -c:a copy $output/weather-v3.mp4

#end weather
