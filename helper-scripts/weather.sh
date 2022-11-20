#!/bin/bash
#V0.0.16 - Beta

echo starting weather.sh

# load in configuration variables
. config-temp.conf
#test variable run yes/no
#convert variable to lowercase
if [[ ! -z "$ETV_FILLER_DOCKER" ]];
then
  output=/output
fi

if [[ -f $workdir/update-run ]];
then
processweather=no
fi

processweather1=$(echo $processweather | tr '[:upper:]' '[:lower:]')
if [[ $processweather1 = yes ]]
then

  echo weather will be processed.

  echo selecting random audio

  if [[ $audioamount = 1 ]]
  then
randomNumber=1
randomNumber1=1
randomNumber2=1
else
  randomNumber=$(shuf -i 1-$audioamount -n 1 --repeat)
  randomNumber1=$(shuf -i 1-$audioamount -n 1 --repeat)
  randomNumber2=$(shuf -i 1-$audioamount -n 1 --repeat)
fi

audio=$(head -n $randomNumber $workdir/music.txt | tail -n 1)
audio1=$(head -n $randomNumber1 $workdir/music.txt | tail -n 1)
audio2=$(head -n $randomNumber2 $workdir/music.txt | tail -n 1)

echo selecting backgound colour.

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

echo setting weather format.

#set weather celcius or farenheit using country code
if [[ $country == US ]]
then
weathermeasurement=?u
else
weathermeasurement=?m
fi



#retrieve weather data


echo retrieving weather data

curl wttr.in/${cityurl}.png$weathermeasurement --output $weatherdir/v1.png
curl v2.wttr.in/${cityurl}.png$weathermeasurement --output $weatherdir/v2.png
curl v3.wttr.in/${stateurl}.png$weathermeasurement --output $weatherdir/v3.png
wait

echo calculating fade out times.

# Maths for fade
weathervideofadeoutstart=$(echo `expr $videolength1 - $weathervideofadeoutduration` | bc)
weatheraudiofadeoutstart=$(echo `expr $videolength1 - $weatheraudiofadeoutduration` | bc)
#make video

echo making the videos.



#ffmpeg -y -f lavfi -i color=$background:$videoresolution -i $weatherdir/v1.png -stream_loop -1 -i "$audio" -shortest -filter_complex "[1]scale=iw*1:-1[wm];[0][wm]overlay=x=(W-w)/2:y=(H-h)/2" -pix_fmt yuv420p -c:a copy -t $videolength $workdir/weather-v1.mp4
#ffmpeg -y -i $workdir/weather-v1.mp4 -vf "fade=t=in:st=0:d=$weathervideofadeinduration,fade=t=out:st=$weathervideofadeoutstart:d=$weathervideofadeoutduration" -af "afade=t=in:st=0:d=$weatheraudiofadeinduration,afade=t=out:st=$weatheraudiofadeoutstart:d=$weatheraudiofadeoutduration" $output/weather-v1.mp4
#touch $output/weather-v1.mp4
#ffmpeg -y -f lavfi -i color=$background1:$videoresolution -i $weatherdir/v2.png -stream_loop -1 -i "$audio1" -shortest -filter_complex "[1]scale=iw*1:-1[wm];[0][wm]overlay=x=(W-w)/2:y=(H-h)/2" -pix_fmt yuv420p -c:a copy -t $videolength $workdir/weather-v2.mp4
#ffmpeg -y -i $workdir/weather-v2.mp4 -vf "fade=t=in:st=0:d=$weathervideofadeinduration,fade=t=out:st=$weathervideofadeoutstart:d=$weathervideofadeoutduration" -af "afade=t=in:st=0:d=$weatheraudiofadeinduration,afade=t=out:st=$weatheraudiofadeoutstart:d=$weatheraudiofadeoutduration" $output/weather-v2.mp4
#touch $output/weather-v2.mp4
#ffmpeg -y -f lavfi -i color=$background2:$videoresolution -i $weatherdir/v3.png -stream_loop -1 -i "$audio2" -shortest -filter_complex "[1]scale=iw*0.9:-1[wm];[0][wm]overlay=x=(W-w)/2:y=(H-h)/2" -pix_fmt yuv420p -c:a copy -t $videolength $workdir/weather-v3.mp4
#ffmpeg -y -i $workdir/weather-v3.mp4 -vf "fade=t=in:st=0:d=$weathervideofadeinduration,fade=t=out:st=$weathervideofadeoutstart:d=$weathervideofadeoutduration" -af "afade=t=in:st=0:d=$weatheraudiofadeinduration,afade=t=out:st=$weatheraudiofadeoutstart:d=$weatheraudiofadeoutduration" $output/weather-v3.mp4
#touch $output/weather-v3.mp4

generate_weatherv4_1=$(echo $generate_weatherv4 | tr '[:upper:]' '[:lower:]')
if [[ $generate_weatherv4_1 = yes ]]
then
  videolength2=$(echo `expr $videolength1*3` | bc)
  weathervideofadeoutstart2=$(echo `expr $videolength2 - $weathervideofadeoutduration` | bc)
  weatheraudiofadeoutstart2=$(echo `expr $videolength2 - $weatheraudiofadeoutduration` | bc)

  echo generating weather v4
  ffmpeg -y -f lavfi -i color=$background:$videoresolution -i $weatherdir/v1.png -stream_loop -1 -filter_complex "[1]scale=iw*1:-1[wm];[0][wm]overlay=x=(W-w)/2:y=(H-h)/2" -pix_fmt yuv420p -c:a copy -t $videolength $workdir/weatherv4-v1.mp4
  ffmpeg -y -f lavfi -i color=$background1:$videoresolution -i $weatherdir/v2.png -stream_loop -1 -filter_complex "[1]scale=iw*1:-1[wm];[0][wm]overlay=x=(W-w)/2:y=(H-h)/2" -pix_fmt yuv420p -c:a copy -t $videolength $workdir/weatherv4-v2.mp4
  ffmpeg -y -f lavfi -i color=$background2:$videoresolution -i $weatherdir/v3.png -stream_loop -1 -filter_complex "[1]scale=iw*0.9:-1[wm];[0][wm]overlay=x=(W-w)/2:y=(H-h)/2" -pix_fmt yuv420p -c:a copy -t $videolength $workdir/weatherv4-v3.mp4
  ffmpeg -y -f lavfi -i $workdir/weatherv4-v1.mp4 -i $workdir/weatherv4-v2.mp4 -i $workdir/weatherv4-v3.mp4 -i "$audio1" -shortest -pix_fmt yuv420p -c:a copy -t $videolength2 $workdir/weather-v4.mp4
  ffmpeg -y -i $workdir/weather-v4.mp4 -vf "fade=t=in:st=0:d=$weathervideofadeinduration,fade=t=out:st=$weathervideofadeoutstart2:d=$weathervideofadeoutduration" -af "afade=t=in:st=0:d=$weatheraudiofadeinduration,afade=t=out:st=$weatheraudiofadeoutstart2:d=$weatheraudiofadeoutduration" $output/weather-v4.mp4
  fi
#end weather
echo moving to news.sh
./news.sh
else
  echo weather will not be processed.
  echo moving to news.sh
./news.sh
fi
