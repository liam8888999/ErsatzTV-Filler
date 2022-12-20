#!/bin/bash
#V0.0.21 - Beta
CONFIG=${1:-config.conf}
# load in configuration variables
. "$CONFIG"
#start logging

#if [ ! -d $log_location ]; then
#  mkdir -p $log_location;
#fi
#chmod 0777 $log_location
if [[ ! -z "$ETV_FILLER_DOCKER" ]]
then
    log_location=/tmp/ErsatzTV-Filler
fi

if [ ! -d $log_location ]; then
  mkdir -p $log_location;
fi

version="V0.0.21 - Beta"

log_per_run1=$(echo $log_per_run | tr '[:upper:]' '[:lower:]')
if [[ $log_per_run1 = yes ]]
then
exec > >(tee -a "$log_location/log_`date +%F%H:%M`.log") 2>&1
echo ""
echo '-----------------------------------------------------------------------------------------------'
echo ""
date
echo $version
echo this will automatically output to a log file at "$log_location/log_`date +%F%H:%M`.log"
else
  exec > >(tee -a "$log_location/log_`date +%F`.log") 2>&1
  echo ""
  echo '-----------------------------------------------------------------------------------------------'
  echo ""
  date
  echo $version
  echo this will automatically output to a log file at "$log_location/log_`date +%F`.log"
fi
echo $logperr

#finish logging
if [[ -f $workdir/update-run ]];
then
echo no files will be generated. you will need to run the script again with the updated variables
fi

rm -f /tmp/ErsatzTV-Filler-autoupdate.sh

#retrieve script location

wdir="$PWD"; [ "$PWD" = "/" ] && wdir=""
case "$0" in
  /*) scriptdir="${0}";;
  *) scriptdir="$wdir/${0#./}";;
esac
scriptdir="${scriptdir%/*}"

if [[ -f $scriptdir/running.txt ]];
then
  echo There is already an instance of this generator running. This instance will stop now.
  exit 0
fi

touch $scriptdir/running.txt

if [[ ! -z $(command -v apt) ]];
then
if [[ -z $(command -v ffmpeg) ]];
then
echo "sudo apt install ffmpeg -y"
fi
if [[ -z $(command -v xsltproc) ]];
then
echo "sudo apt install xsltproc -y"
fi
if [[ -z $(command -v jq) ]];
then
echo "sudo apt install jq -y"
fi
if [[ -z $(command -v tv_sort) ]];
then
echo "sudo apt install xmltv-util -y"
fi
if [[ -z $(command -v curl) ]];
then
echo "sudo apt install curl -y"
fi
fi

echo theme is $theme

#set workdir

workdir=$scriptdir/workdir

#make sure workdir exists
if [ ! -d $workdir ]; then
  mkdir -p $workdir;
fi


if [[ ! -z "$ETV_FILLER_DOCKER" ]];
then
  themedir=/themes
else
  themedir=$scriptdir/themes
fi

if [ ! -d $themedir ]; then
  mkdir -p $themedir;
fi


#set weatherdir

weatherdir=$scriptdir/weather

#set helperdir
helperdir=$scriptdir/helper-scripts

helperfiledir=$scriptdir/helper-files

#General cleanup

rm -f $weatherdir/*
if [[ ! -f $workdir/update-run ]];
then
rm -r $workdir/*
fi
rm -f $helperdir/config-temp.conf

cat << EOF > $scriptdir/config.conf
  #V0.0.21 - Beta

  # set theme name

  theme=$theme

  #automatic updates (yes / no)
  # Automatically disabled if running in docker
  autoupdate=$autoupdate

  #choose which filler to create
  #weather
  processweather=$processweather
  #news
  processnews=$processnews
  #channel offline
  processchanneloffline=$processchanneloffline

  # Set custom audio location (This is set by default to /audio when using docker)
  customaudio=$customaudio

  #type place name inside '' and it will automatically remove the spaces for you
  #the output is where you want the generated video files to go. this is the location you should point ErsatzTV at.
  #It is suggested to set this to a different location than the generator
  #e.g. if generator.sh is in /home/boy/ErsatzTV-Filler you may want to set it to something like /home/boy/etv-filler-output
  #the output variable now does nothing when run in docker. docker output is always /output
  output=$output
  city='$city'
  state='$state'

  # Would you like to generate weather v4. Weather v4 is a mix of all the other weather versions in 1 video. Default is no.
  generate_weatherv4=$generate_weatherv4
  #would you like to shuffle the videos. Default is no
  shuffle_v4=$shuffle_v4


  #weather fade duration - default is 5 seconds
  weathervideofadeoutduration=$weathervideofadeoutduration
  weathervideofadeinduration=$weathervideofadeinduration
  weatheraudiofadeoutduration=$weatheraudiofadeoutduration
  weatheraudiofadeinduration=$weatheraudiofadeinduration

  #news fade duration - default is 5 seconds
  newsvideofadeoutduration=$newsvideofadeoutduration
  newsvideofadeinduration=$newsvideofadeinduration
  newsaudiofadeoutduration=$newsaudiofadeoutduration
  newsaudiofadeinduration=$newsaudiofadeinduration

  #desired video length e.g. 30 for 30sec -- must be in seconds
  videolength=$videolength

  #set a rss url for your news feed
  newsfeed="$newsfeed"

  #set a rss url for an additional news feed (optional)
  newsfeed1="$newsfeed1"

  #set a rss url for an additional news feed (optional)
  newsfeed2="$newsfeed2"

  #channel currently offline filler
  #for this to work you need to run the script once
  #which will generate placeholder videos titled with the channel number
  #you will need to add each of these to its own collection and schedule that collection
  #during planned channel offline times

  #ErsatzTV xmltv url - http://ip/:PORT/iptv/xmltv.xml
  xmltv="$xmltv"

  #advanced user configuration


  #desired video resolution 1280x720
  videoresolution=$videoresolution
  #set the speed for the scrolling text. Default is 40. Higher is faster
  textspeed=$textspeed
  #Adjust the news duration to fit your needs must be in seconds
  newsduration=$newsduration

  # Logs
  # set the log location - in docker this defaults to /tmp/ErsatzTV-Filler/
  log_location=$log_location
  # Set the amount of days to keep log files
  log_days=$log_days
  #Use smaller log files generated for each run instead of each day - yes/no (default no)
  log_per_run=$log_per_run
EOF


if [[ ! -f $themedir/default.theme ]];
then
cat << EOF > $themedir/default.theme
  #V0.0.23 - Beta

  #desired background colour around image can be set to random for a random colour to be generated for each video
  backgroundcolour=black

  #set background colour for news - can be set to random
  newsbackgroundcolour=random

  #set text colour for news - can be set to random
  newstextcolour=random

  #set colours for channel currently offline filler
  offlinebackgroundcolour=random
  offlinetextcolour=random
EOF
fi

if [[ -z $theme ]];
then
  theme=default.theme
else
  theme="$theme.theme"
fi

. $themedir/$theme

# Add directory variables to config-temp.config
echo weatherdir=$weatherdir >> $helperdir/config-temp.conf
echo workdir=$workdir >> $helperdir/config-temp.conf
echo scriptdir=$scriptdir >> $helperdir/config-temp.conf
echo helperdir=$helperdir >> $helperdir/config-temp.conf

# check variables are set. if not set default fallbacks
if [[ -z $log_per_run ]];
then
  echo log_per_run=no >> $helperdir/config-temp.conf
else
  echo log_per_run=$log_per_run >> $helperdir/config-temp.conf
fi
if [[ -z $generate_weatherv4 ]];
then
  echo generate_weatherv4=no >> $helperdir/config-temp.conf
else
  echo generate_weatherv4=$generate_weatherv4 >> $helperdir/config-temp.conf
fi
if [[ -z $newsaudiofadeinduration ]];
then
  echo newsaudiofadeinduration=5 >> $helperdir/config-temp.conf
else
  echo newsaudiofadeinduration=$newsaudiofadeinduration >> $helperdir/config-temp.conf
fi
if [[ -z $newsaudiofadeoutduration ]];
then
  echo newsaudiofadeoutduration=5 >> $helperdir/config-temp.conf
else
  echo newsaudiofadeoutduration=$newsaudiofadeoutduration >> $helperdir/config-temp.conf
fi
if [[ -z $newsvideofadeinduration ]];
then
  echo newsvideofadeinduration=5 >> $helperdir/config-temp.conf
else
  echo newsvideofadeinduration=$newsvideofadeinduration >> $helperdir/config-temp.conf
fi
if [[ -z $newsvideofadeoutduration ]];
then
  echo newsvideofadeoutduration=5 >> $helperdir/config-temp.conf
else
  echo newsvideofadeoutduration=$newsvideofadeoutduration >> $helperdir/config-temp.conf
fi

if [[ -z $weatheraudiofadeinduration ]];
then
  echo weatheraudiofadeinduration=5 >> $helperdir/config-temp.conf
else
  echo weatheraudiofadeinduration=$weatheraudiofadeinduration >> $helperdir/config-temp.conf
fi
if [[ -z $weatheraudiofadeoutduration ]];
then
  echo weatheraudiofadeoutduration=5 >> $helperdir/config-temp.conf
else
  echo weatheraudiofadeoutduration=$weatheraudiofadeoutduration >> $helperdir/config-temp.conf
fi
if [[ -z $weathervideofadeinduration ]];
then
  echo weathervideofadeinduration=5 >> $helperdir/config-temp.conf
else
  echo weathervideofadeinduration=$weathervideofadeinduration >> $helperdir/config-temp.conf
fi
if [[ -z $weathervideofadeoutduration ]];
then
  echo weathervideofadeoutduration=5 >> $helperdir/config-temp.conf
else
  echo weathervideofadeoutduration=$weathervideofadeoutduration >> $helperdir/config-temp.conf
fi
if [[ -z $log_location ]];
then
  echo log_location=/tmp/ErsatzTV-Filler >> $helperdir/config-temp.conf
else
  echo log_location=$log_location >> $helperdir/config-temp.conf
fi
if [[ -z $log_days ]];
then
  echo log_days=7 >> $helperdir/config-temp.conf
else
  echo log_days=$log_days >> $helperdir/config-temp.conf
fi
if [[ -z $autoupdate ]];
then
  echo autoupdate=yes >> $helperdir/config-temp.conf
else
  echo autoupdate=$autoupdate >> $helperdir/config-temp.conf
fi
if [[ -z $videolength ]];
then
  echo videolength=00:00:30 >> $helperdir/config-temp.conf
else
  echo videolength=$(date -d@$videolength -u +%H:%M:%S) >> $helperdir/config-temp.conf
fi
if [[ -z $videolength ]];
then
  echo videolength1=30 >> $helperdir/config-temp.conf
else
  echo videolength1=$videolength >> $helperdir/config-temp.conf
fi
if [[ -z $state ]];
then
  echo stateurl='Texas' >> $helperdir/config-temp.conf
else
    stateurl=$(echo $state|sed -e 's/ /%20/g')
  echo stateurl=$stateurl >> $helperdir/config-temp.conf
fi
if [[ -z $city ]];
then
  echo cityurl='Austin' >> $helperdir/config-temp.conf
else
  cityurl=$(echo $city|sed -e 's/ /%20/g')
  echo cityurl=$cityurl >> $helperdir/config-temp.conf
fi
if [[ -z $newsduration ]];
then
  echo newsduration=00:01:00 >> $helperdir/config-temp.conf
else
  echo newsduration=$(date -d@$newsduration -u +%H:%M:%S) >> $helperdir/config-temp.conf
fi
if [[ -z $newsduration ]];
then
  echo newsduration1=60 >> $helperdir/config-temp.conf
else
  echo newsduration1=$newsduration >> $helperdir/config-temp.conf
fi
if [[ -z $textspeed ]];
then
  echo textspeed=40 >> $helperdir/config-temp.conf
else
  echo textspeed=$textspeed >> $helperdir/config-temp.conf
fi
if [[ -z $videoresolution ]];
then
  echo videoresolution=1280x720 >> $helperdir/config-temp.conf
else
  echo videoresolution=$videoresolution >> $helperdir/config-temp.conf
fi
if [[ -z $newsfeed ]];
then
  echo newsfeed="https://rss.nytimes.com/services/xml/rss/nyt/World.xml" >> $helperdir/config-temp.conf
else
  echo newsfeed=$newsfeed >> $helperdir/config-temp.conf
fi
if [[ -z $newstextcolour ]];
then
  echo newstextcolour=random >> $helperdir/config-temp.conf
else
  echo newstextcolour=$newstextcolour >> $helperdir/config-temp.conf
fi
if [[ -z $newsbackgroundcolour ]];
then
  echo newsbackgroundcolour=random >> $helperdir/config-temp.conf
else
  echo newsbackgroundcolour=$newsbackgroundcolour >> $helperdir/config-temp.conf
fi
if [[ -z $backgroundcolour ]];
then
  echo backgroundcolour=$backgroundcolour >> $helperdir/config-temp.conf
fi
if [[ -z $output ]];
  then
    echo output=~ >> $helperdir/config-temp.conf
  else
    echo output=$output >> $helperdir/config-temp.conf
  fi
if [[ -z $offlinebackgroundcolour ]];
then
  echo offlinebackgroundcolour=$offlinebackgroundcolour >> $helperdir/config-temp.conf
fi
if [[ -z $offlinetextcolour ]];
then
  echo offlinetextcolour=$offlinetextcolour >> $helperdir/config-temp.conf
fi
echo offline colour is $offlinetextcolour
if [[ -z $xmltv ]];
then
  echo xmltv="http://127.0.0.1:8409/iptv/xmltv.xml" >> $helperdir/config-temp.conf
else
  echo xmltv=$xmltv >> $helperdir/config-temp.conf
fi
if [[ -z $processweather ]];
then
  echo processweather=yes >> $helperdir/config-temp.conf
else
  echo processweather=$processweather >> $helperdir/config-temp.conf
fi
if [[ -z $processnews ]];
then
  echo processnews=yes >> $helperdir/config-temp.conf
else
  echo processnews=$processnews >> $helperdir/config-temp.conf
fi
if [[ -z $processchanneloffline ]];
then
  echo processchanneloffline=yes >> $helperdir/config-temp.conf
else
  echo processchanneloffline=$processchanneloffline >> $helperdir/config-temp.conf
fi
if [[ -z $shuffle_v4 ]];
then
  echo shuffle_v4=no >> $helperdir/config-temp.conf
else
  echo shuffle_v4=$shuffle_v4 >> $helperdir/config-temp.conf
fi



#set duration correctly
#ffmpegvideolength=$(date -d@$videolength -u +%H:%M:%S)
#ffmpegnewsduration=$(date -d@$newsduration -u +%H:%M:%S)

#copy colours.txt
cp $helperfiledir/colours.txt $workdir/colours.txt

#setup audio
#list audio files

cd $scriptdir

echo creating music.txt


  if [[ -z $customaudio ]]; then
find $scriptdir/audio-fallback \( -not -path '*/[@.]*' -name "*.mp3" -o -name "*.flac" \) -print > $workdir/music.txt
else
  if [[ ! -z "$ETV_FILLER_DOCKER" ]]
  then
  customaudio=/audio
  find $customaudio \( -not -path '*/[@.]*' -name "*.mp3" -o -name "*.flac" \) -print > $workdir/music.txt
else
find $customaudio \( -not -path '*/[@.]*' -name "*.mp3" -o -name "*.flac" \) -print > $workdir/music.txt
fi
fi
if [[ ! -s $workdir/music.txt ]];
then
  echo no audio files found in the location
  find $scriptdir/audio-fallback \( -not -path '*/[@.]*' -name "*.mp3" -o -name "*.flac" \) -print > $workdir/music.txt
fi
#add number to begining of line for randomisation
awk 'BEGIN{srand()}{print rand(), $0}' $workdir/music.txt | sort -n -k 1 | awk 'sub(/\S* /,"")'

echo counting audio files

audioamount=$(wc -l $workdir/music.txt | cut -d " " -f 1)
echo audioamount=$audioamount >> $helperdir/config-temp.conf

#End Audio
if [[ ! -f $workdir/update-run ]];
then
echo getting country info for setting various things in the script

# Retrieve information country code etc.
curl ipinfo.io | jq >> $workdir/information.json
country=$(jq -r '.country' $workdir/information.json)
echo country=$country >> $helperdir/config-temp.conf
fi

#call autoupdate.sh
if [[ ! -z "$ETV_FILLER_DOCKER" ]]
then
  echo Switching to weather.sh
  cd $helperdir
  ./weather.sh
else
    echo Switching to autoupdate.sh
  cd $helperdir
  ./autoupdate.sh
fi

#Music: https://audiotrimmer.com/royalty-free-music/
