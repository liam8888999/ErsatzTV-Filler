#!/bin/bash


#user definable configuration

#weather
#type place name inside '' and it will automatically remove the spaces for you

output=/home/liam/etv-filler
city='Austin'
state='Texas'
#desired video length e.g. 30 for 30sec -- must be in seconds
videolength=30
#desired background colour around image
backgroundcolour=black

#advanced user configuration
#desired video resolution 1280x720
videoresolution=1280x720
#non user definable configuration

#setting directory

wdir="$PWD"; [ "$PWD" = "/" ] && wdir=""
case "$0" in
  /*) scriptdir="${0}";;
  *) scriptdir="$wdir/${0#./}";;
esac
scriptdir="${scriptdir%/*}"

#fix white spaces for curl

stateurl=$(echo $state|sed -e 's/ /%20/g')
cityurl=$(echo $city|sed -e 's/ /%20/g')

#select audio

find $scriptdir/audio -name '*.mp3' -print > $scriptdir/workdir/music.txt

awk 'BEGIN{srand()}{print rand(), $0}' $scriptdir/workdir/music.txt | sort -n -k 1 | awk 'sub(/\S* /,"")'

#random number

minimum=1
maximum=7
randomNumber=$(($minimum + $RANDOM % $maximum))
audio=$(head -n $randomNumber $scriptdir/workdir/music.txt | tail -n 1)


#General cleanup

rm -f $scriptdir/weather/v1.png
rm -f $scriptdir/weather/v2.png
rm -f $scriptdir/weather/v3.png

#weather

#retrieve weather data

curl wttr.in/${cityurl}.png --output $scriptdir/weather/v1.png
curl v2.wttr.in/${cityurl}.png --output $scriptdir/weather/v2.png
curl v3.wttr.in/${stateurl}.png --output $scriptdir/weather/v3.png
wait

#make video

ffmpeg -f lavfi -i color=$backgroundcolour:$videoresolution:d=$videolength -i $scriptdir/weather/v1.png -stream_loop -1 -i $audio -shortest -filter_complex "[1]scale=iw*1:-1[wm];[0][wm]overlay=x=(W-w)/2:y=(H-h)/2" -pix_fmt yuv420p -c:a copy $output/weather-v1.mp4
ffmpeg -f lavfi -i color=$backgroundcolour:$videoresolution:d=$videolength -i $scriptdir/weather/v2.png -stream_loop -1 -i $audio -shortest -filter_complex "[1]scale=iw*1:-1[wm];[0][wm]overlay=x=(W-w)/2:y=(H-h)/2" -pix_fmt yuv420p -c:a copy $output/weather-v2.mp4
ffmpeg -f lavfi -i color=$backgroundcolour:$videoresolution:d=$videolength -i $scriptdir/weather/v3.png -stream_loop -1 -i $audio -shortest -filter_complex "[1]scale=iw*0.9:-1[wm];[0][wm]overlay=x=(W-w)/2:y=(H-h)/2" -pix_fmt yuv420p -c:a copy $output/weather-v3.mp4
#end weather
