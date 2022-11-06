#!/bin/bash
#V0.0.17 - Beta

version="V0.0.17 - Beta"
echo $version

#retrieve script location

wdir="$PWD"; [ "$PWD" = "/" ] && wdir=""
case "$0" in
  /*) scriptdir="${0}";;
  *) scriptdir="$wdir/${0#./}";;
esac
scriptdir="${scriptdir%/*}"

if [[ -f $scriptdir/running.txt ]];
then
  exit 0
fi

touch $scriptdir/running.txt

CONFIG=${1:-config.conf}

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


# load in configuration variables
. "$CONFIG"


#set workdir

workdir=$scriptdir/workdir

#make sure workdir exists
if [ ! -d $workdir ]; then
  mkdir -p $workdir;
fi

#set weatherdir

weatherdir=$scriptdir/weather

#set helperdir
helperdir=$scriptdir/helper-scripts

helperfiledir=$scriptdir/helper-files

#General cleanup

rm -f $weatherdir/*
rm -r $workdir/*
rm -f $helperdir/config-temp.conf


cat << EOF > $scriptdir/config.conf
  #weather
  #V0.0.17 - Beta

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
  #desired video length e.g. 30 for 30sec -- must be in seconds
  videolength=$videolength
  #desired background colour around image can be set to random for a random colour to be generated for each video
  backgroundcolour=$backgroundcolour

  #set background colour for news - can be set to random
  newsbackgroundcolour=$newsbackgroundcolour

  #set text colour for news - can be set to random
  newstextcolour=$newstextcolour

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

  #set colours for channel currently offline filler
  offlinebackgroundcolour=$offlinebackgroundcolour
  offlinetextcolour=$offlinetextcolour

  #advanced user configuration


  #desired video resolution 1280x720
  videoresolution=$videoresolution
  #set the speed for the scrolling text. Default is 40. Higher is faster
  textspeed=$textspeed
  #Adjust the news duration to fit your needs must be in seconds
  newsduration=$newsduration
EOF



# Add directory variables to config-temp.config
echo weatherdir=$weatherdir >> $helperdir/config-temp.conf
echo workdir=$workdir >> $helperdir/config-temp.conf
echo scriptdir=$scriptdir >> $helperdir/config-temp.conf
echo helperdir=$helperdir >> $helperdir/config-temp.conf

# check variables are set. if not set default fallbacks

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
  echo backgroundcolour=random >> $helperdir/config-temp.conf
else
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
  echo offlinebackgroundcolour=random >> $helperdir/config-temp.conf
else
  echo offlinebackgroundcolour=$offlinebackgroundcolour >> $helperdir/config-temp.conf
fi
if [[ -z $offlinetextcolour ]];
then
  echo offlinetextcolour=random >> $helperdir/config-temp.conf
else
  echo offlinetextcolour=$offlinetextcolour >> $helperdir/config-temp.conf
fi
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


#set duration correctly
#ffmpegvideolength=$(date -d@$videolength -u +%H:%M:%S)
#ffmpegnewsduration=$(date -d@$newsduration -u +%H:%M:%S)

#copy colours.txt
cp $helperfiledir/colours.txt $workdir/colours.txt

#setup audio
#list audio files

cd $scriptdir

if [[ ! -z "$ETV_FILLER_DOCKER" ]]
then
customaudio=/audio
fi

  if [[ -z $customaudio ]]; then
find $scriptdir/audio-fallback \( -name "*.mp3" -o -name "*.flac" \) -print > $workdir/music.txt
else
find $customaudio \( -name "*.mp3" -o -name "*.flac" \) -print > $workdir/music.txt
fi
#add number to begining of line for randomisation
awk 'BEGIN{srand()}{print rand(), $0}' $workdir/music.txt | sort -n -k 1 | awk 'sub(/\S* /,"")'

audioamount=$(wc -l $workdir/music.txt | cut -d " " -f 1)
echo audioamount=$audioamount >> $helperdir/config-temp.conf

#End Audio

# Retrieve information country code etc.
curl ipinfo.io | jq >> $workdir/information.json
country=$(jq -r '.country' $workdir/information.json)
echo country=$country >> $helperdir/config-temp.conf

# Auto update

git fetch |& tee $workdir/update

if [[ ! -s $workdir/update ]];
then
    cd $helperdir
    ./autoupdate.sh
    exit 0
  else
    echo generator
# end auto update


#call weather.sh
cd $helperdir
./weather.sh

fi
#Music: https://audiotrimmer.com/royalty-free-music/
