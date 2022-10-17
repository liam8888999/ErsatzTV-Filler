#!/bin/bash
#V0.0.7 - Beta

# load in configuration variables
. ../workdir/config.conf

echo $newsbackgroundcolour

#weather

#retrieve weather data


curl wttr.in/${cityurl}.png$weathermeasurement --output $weatherdir/v1.png
curl v2.wttr.in/${cityurl}.png$weathermeasurement --output $weatherdir/v2.png
curl v3.wttr.in/${stateurl}.png$weathermeasurement --output $weatherdir/v3.png
wait

#make video

ffmpeg -y -f lavfi -i color=$background:$videoresolution:d=$videolength -i $weatherdir/v1.png -stream_loop -1 -i $audio -shortest -filter_complex "[1]scale=iw*1:-1[wm];[0][wm]overlay=x=(W-w)/2:y=(H-h)/2" -pix_fmt yuv420p -c:a copy $output/weather-v1.mp4
ffmpeg -y -f lavfi -i color=$background1:$videoresolution:d=$videolength -i $weatherdir/v2.png -stream_loop -1 -i $audio1 -shortest -filter_complex "[1]scale=iw*1:-1[wm];[0][wm]overlay=x=(W-w)/2:y=(H-h)/2" -pix_fmt yuv420p -c:a copy $output/weather-v2.mp4
ffmpeg -y -f lavfi -i color=$background2:$videoresolution:d=$videolength -i $weatherdir/v3.png -stream_loop -1 -i $audio2 -shortest -filter_complex "[1]scale=iw*0.9:-1[wm];[0][wm]overlay=x=(W-w)/2:y=(H-h)/2" -pix_fmt yuv420p -c:a copy $output/weather-v3.mp4

#end weather
