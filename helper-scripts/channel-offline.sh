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

processchanneloffline1=$(echo $processchanneloffline | tr '[:upper:]' '[:lower:]')
if [[ $processchanneloffline1 = yes ]]
then
#channel Currently offline

#make sure workdir/xmltv exists
if [ ! -d $workdir/xmltv ]; then
  mkdir -p $workdir/xmltv;
fi

if [ ! -d $output/channel-resuming ]; then
  mkdir -p $output/channel-resuming;
fi

#retrieve and split xmltv

curl $xmltv --output $workdir/xmltv.xml
tv_split --output $workdir/xmltv/%channel.xml $workdir/xmltv.xml

# List files to txt files
find $workdir/xmltv -name '*.xml' -print > $workdir/xmlfiles.txt
awk -F/ '{print $NF}' $workdir/xmlfiles.txt > $workdir/xmlfiles2.txt
cut -d "." -f 1,2 $workdir/xmlfiles2.txt > $workdir/xmlfiles3.txt
sort $workdir/xmlfiles3.txt > $workdir/xmlfiles4.txt
#add .etv to end of number files. not needed as etv only supports filenames with 1 decimal as title
#sed -i '/[0-9]$/ s/$/.etv/' $workdir/xmlfiles4.txt

#loop

#set xmltvloop variable

xmltvloop=$(head -n 1 $workdir/xmlfiles4.txt)

while [[ ! -z $xmltvloop ]]; do

#randomise audio
randomNumberoffline=$audionumber
offlineaudio=$(head -n $randomNumberoffline $workdir/music.txt | tail -n 1)

# get and read xmltv data
tv_to_text --output $workdir/tempxml$xmltvloop.xml $workdir/xmltv/$xmltvloop.xml
awk '/news/{p=1}p' $workdir/tempxml$xmltvloop.xml > $workdir/xmltemp$xmltvloop.txt
awk '!/news/' $workdir/xmltemp$xmltvloop.txt > $workdir/xmltemp2$xmltvloop.xml
head -1 $workdir/xmltemp2$xmltvloop.xml > $workdir/xmltemp3$xmltvloop.txt
cut -d "-" -f 1 $workdir/xmltemp3$xmltvloop.txt > $workdir/xmltemp4$xmltvloop.txt
starttime=$(cat $workdir/xmltemp4$xmltvloop.txt)
actualstarttime=$(date --date="$starttime" +%I:%M%p)
cut -f 2 $workdir/xmltemp3$xmltvloop.txt > $workdir/xmltemp45$xmltvloop.txt
cut -d " " -f 1 $workdir/xmltemp45$xmltvloop.txt > $workdir/xmltemp5$xmltvloop.txt
nextshow=$(cat $workdir/xmltemp5$xmltvloop.txt)

#news backgound
#background colour randomiser
if [[ $offlinebackgroundcolour == random ]]
then
#awk 'BEGIN{srand()}{print rand(), $0}' $workdir/colours.txt | sort -n -k 1 | awk 'sub(/\S* /,"")'
#newsbackgroundrandomNumber=$(shuf -i 1-140 -n 1 --repeat)
#newsbackground=$(head -n $newsbackgroundrandomNumber $workdir/colours.txt | tail -n 1)
offlinebackground1=White
else
offlinebackground1=$offlinebackgroundcolour
fi

#news text colour
if [[ $offlinetextcolour == random ]]
then

  randomise() {
      shuf -i 1-$audioamount -n 1 --repeat
  }

#awk 'BEGIN{srand()}{print rand(), $0}' $workdir/colours.txt | sort -n -k 1 | awk 'sub(/\S* /,"")'
#newstextcolourrandomNumber=$(shuf -i 1-140 -n 1 --repeat)
#newstextcolour=$(head -n $newstextcolourandomNumber $workdir/colours.txt | tail -n 1)
offlinetextcolour1=Black
else
offlinetextcolour1=$offlinetextcolour
fi

echo    This Channel is Currently offline >> $workdir/upnext$xmltvloop.txt
echo >> $workdir/upnext.txt
echo       Next showing at: $starttime >> $workdir/upnext$xmltvloop.txt
echo >> $workdir/upnext.txt
echo    Starting With: $nextshow >> $workdir/upnext$xmltvloop.txt

ffmpeg -y -f lavfi -i color=$offlinebackground1:$videoresolution -stream_loop -1 -i "$offlineaudio" -shortest -vf "drawtext=textfile='$workdir/upnext$xmltvloop.txt': fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf: x=(w-text_w)/2:y=(h-text_h)/2: fontcolor=$offlinetextcolour1: fontsize=W/40:"  -pix_fmt yuv420p -c:a copy -t 00:00:05.000 $output/channel-resuming/$xmltvloop.mp4
touch $output/channel-resuming/$xmltvloop.mp4
awk 'NR>1' $workdir/xmlfiles4.txt > $workdir/xmllll.txt && mv $workdir/xmllll.txt $workdir/xmlfiles4.txt

xmltvloop=$(head -n 1 $workdir/xmlfiles4.txt)
done

./cleanup.sh

else
./cleanup.sh
fi
