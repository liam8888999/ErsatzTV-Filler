#!/bin/bash

# load in configuration variables
. config.conf

#retrieve script location

wdir="$PWD"; [ "$PWD" = "/" ] && wdir=""
case "$0" in
  /*) scriptdir="${0}";;
  *) scriptdir="$wdir/${0#./}";;
esac
scriptdir="${scriptdir%/*}"

#fix white spaces for curl

stateurl=$(echo $state|sed -e 's/ /%20/g')
cityurl=$(echo $city|sed -e 's/ /%20/g')

#make sure workdir exists
if [ ! -d $scriptdir/workdir ]; then
  mkdir -p $scriptdir/workdir;
fi

#General cleanup

rm -f $scriptdir/weather/v1.png
rm -f $scriptdir/weather/v2.png
rm -f $scriptdir/weather/v3.png
rm -f $scriptdir/workdir/colours.txt

#select audio
find $scriptdir/audio -name '*.mp3' -print > $scriptdir/workdir/music.txt

awk 'BEGIN{srand()}{print rand(), $0}' $scriptdir/workdir/music.txt | sort -n -k 1 | awk 'sub(/\S* /,"")'

#random number
randomNumber=$(shuf -i 1-7 -n 1 --repeat)
randomNumber1=$(shuf -i 1-7 -n 1 --repeat)
randomNumber2=$(shuf -i 1-7 -n 1 --repeat)
audio=$(head -n $randomNumber $scriptdir/workdir/music.txt | tail -n 1)
audio1=$(head -n $randomNumber1 $scriptdir/workdir/music.txt | tail -n 1)
audio2=$(head -n $randomNumber2 $scriptdir/workdir/music.txt | tail -n 1)

#background randomisation
if [[ $backgroundcolour == random ]]
then
cp $scriptdir/colours.txt $scriptdir/workdir/colours.txt
awk 'BEGIN{srand()}{print rand(), $0}' $scriptdir/workdir/colours.txt | sort -n -k 1 | awk 'sub(/\S* /,"")'
backgroundrandomNumber=$(shuf -i 1-140 -n 1 --repeat)
backgroundrandomNumber1=$(shuf -i 1-140 -n 1 --repeat)
backgroundrandomNumber2=$(shuf -i 1-140 -n 1 --repeat)
background=$(head -n $backgroundrandomNumber $scriptdir/workdir/colours.txt | tail -n 1)
background1=$(head -n $backgroundrandomNumber1 $scriptdir/workdir/colours.txt | tail -n 1)
background2=$(head -n $backgroundrandomNumber2 $scriptdir/workdir/colours.txt | tail -n 1)
else
background=$backgroundcolour
background1=$backgroundcolour
background2=$backgroundcolour
fi

#weather

#retrieve weather data

curl wttr.in/${cityurl}.png --output $scriptdir/weather/v1.png
curl v2.wttr.in/${cityurl}.png --output $scriptdir/weather/v2.png
curl v3.wttr.in/${stateurl}.png --output $scriptdir/weather/v3.png
wait

#make video

ffmpeg -f lavfi -i color=$background:$videoresolution:d=$videolength -i $scriptdir/weather/v1.png -stream_loop -1 -i $audio -shortest -filter_complex "[1]scale=iw*1:-1[wm];[0][wm]overlay=x=(W-w)/2:y=(H-h)/2" -pix_fmt yuv420p -c:a copy $output/weather-v1.mp4
ffmpeg -f lavfi -i color=$background1:$videoresolution:d=$videolength -i $scriptdir/weather/v2.png -stream_loop -1 -i $audio1 -shortest -filter_complex "[1]scale=iw*1:-1[wm];[0][wm]overlay=x=(W-w)/2:y=(H-h)/2" -pix_fmt yuv420p -c:a copy $output/weather-v2.mp4
ffmpeg -f lavfi -i color=$background2:$videoresolution:d=$videolength -i $scriptdir/weather/v3.png -stream_loop -1 -i $audio2 -shortest -filter_complex "[1]scale=iw*0.9:-1[wm];[0][wm]overlay=x=(W-w)/2:y=(H-h)/2" -pix_fmt yuv420p -c:a copy $output/weather-v3.mp4
#end weather
