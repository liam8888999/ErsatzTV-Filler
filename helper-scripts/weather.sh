#!/bin/bash
#V0.0.17 - Beta

# load in configuration variables
. config-temp.conf
#test variable run yes/no
#convert variable to lowercase
if [[ ! -z "$ETV_FILLER_DOCKER" ]];
then
  output=/output
fi

processweather1=$(echo $processweather | tr '[:upper:]' '[:lower:]')
if [[ $processweather1 = yes ]]
then

#weather

#audio
randomNumber=$audionumber
randomNumber1=$audionumber
randomNumber2=$audionumber
audio=$(head -n $randomNumber $workdir/music.txt | tail -n 1)
audio1=$(head -n $randomNumber1 $workdir/music.txt | tail -n 1)
audio2=$(head -n $randomNumber2 $workdir/music.txt | tail -n 1)


#Backgrounds

#background randomisation
if [[ $backgroundcolour == random ]]
then
awk 'BEGIN{srand()}{print rand(), $0}' $workdir/colours.txt | sort -n -k 1 | awk 'sub(/\S* /,"")'
backgroundrandomNumber=$(shuf -i 1-140 -n 1 --repeat)
backgroundrandomNumber1=$(shuf -i 1-140 -n 1 --repeat)
backgroundrandomNumber2=$(shuf -i 1-140 -n 1 --repeat)
background=$(head -n $backgroundrandomNumber $workdir/colours.txt | tail -n 1)
background1=$(head -n $backgroundrandomNumber1 $workdir/colours.txt | tail -n 1)
background2=$(head -n $backgroundrandomNumber2 $workdir/colours.txt | tail -n 1)
echo $background
echo $background1
else
background=$backgroundcolour
background1=$backgroundcolour
background2=$backgroundcolour
fi

#set weather celcius or farenheit using country code
if [[ $country == US ]]
then
weathermeasurement=?u
else
weathermeasurement=?m
fi



#retrieve weather data




curl wttr.in/${cityurl}.png$weathermeasurement --output $weatherdir/v1.png
curl v2.wttr.in/${cityurl}.png$weathermeasurement --output $weatherdir/v2.png
curl v3.wttr.in/${stateurl}.png$weathermeasurement --output $weatherdir/v3.png
wait

#make video

ffmpeg -y -f lavfi -i color=$background:$videoresolution -i $weatherdir/v1.png -stream_loop -1 -i "$audio" -shortest -filter_complex "[1]scale=iw*1:-1[wm];[0][wm]overlay=x=(W-w)/2:y=(H-h)/2,fade=type=out:duration=2:start_time=6;afade=type=out:duration=2:start_time=6" -pix_fmt yuv420p -c:a copy -t $videolength $output/weather-v1.mp4
touch $output/weather-v1.mp4
ffmpeg -y -f lavfi -i color=$background1:$videoresolution -i $weatherdir/v2.png -stream_loop -1 -i "$audio1" -shortest -filter_complex "[1]scale=iw*1:-1[wm];[0][wm]overlay=x=(W-w)/2:y=(H-h)/2" -pix_fmt yuv420p -c:a copy -t $videolength $output/weather-v2.mp4
touch $output/weather-v2.mp4
ffmpeg -y -f lavfi -i color=$background2:$videoresolution -i $weatherdir/v3.png -stream_loop -1 -i "$audio2" -shortest -filter_complex "[1]scale=iw*0.9:-1[wm];[0][wm]overlay=x=(W-w)/2:y=(H-h)/2" -pix_fmt yuv420p -c:a copy -t $videolength $output/weather-v3.mp4
touch $output/weather-v3.mp4
#end weather
./news.sh
else
./news.sh
fi
