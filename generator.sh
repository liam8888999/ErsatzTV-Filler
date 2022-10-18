#!/bin/bash
#V0.0.13 - Beta

version="V0.0.13 - Beta"
echo $version

CONFIG=${1:-config.conf}

if [[ ! -z $(command -v apt) ]];
then
if [[ -z $(command -v ffmpeg) ]];
then
sudo apt install ffmpeg -y
fi
if [[ -z $(command -v xsltproc) ]];
then
sudo apt install xsltproc -y
fi
if [[ -z $(command -v jq) ]];
then
sudo apt install jq -y
fi
if [[ -z $(command -v tv_sort) ]];
then
  sudo apt install xmltv-util -y
fi
if [[ -z $(command -v curl) ]];
then
  sudo apt install curl -y
fi
fi

# load in configuration variables
. "$CONFIG"

#retrieve script location

wdir="$PWD"; [ "$PWD" = "/" ] && wdir=""
case "$0" in
  /*) scriptdir="${0}";;
  *) scriptdir="$wdir/${0#./}";;
esac
scriptdir="${scriptdir%/*}"



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
  echo videolength=30 >> $helperdir/config-temp.conf
else
  echo videolength=$videolength >> $helperdir/config-temp.conf
fi
if [[ -z $state ]];
then
  echo state='Texas' >> $helperdir/config-temp.conf
else
  echo state=$state >> $helperdir/config-temp.conf
fi
if [[ -z $city ]];
then
  echo city='Austin' >> $helperdir/config-temp.conf
else
  echo city=$city >> $helperdir/config-temp.conf
fi
if [[ -z $newsduration ]];
then
  echo newsduration=60 >> $helperdir/config-temp.conf
else
  echo newsduration=$newsduration >> $helperdir/config-temp.conf
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
find $scriptdir/audio -name '*.mp3' -print > $workdir/music.txt
#add number to begining of line for randomisation
awk 'BEGIN{srand()}{print rand(), $0}' $workdir/music.txt | sort -n -k 1 | awk 'sub(/\S* /,"")'

#End Audio

# Retrieve information country code etc.
curl ipinfo.io | jq >> $workdir/information.json
country=$(jq -r '.country' $workdir/information.json)
echo country=$country >> $helperdir/config-temp.conf

#call weather.sh
cd $helperdir
./weather.sh
#Music: https://audiotrimmer.com/royalty-free-music/
