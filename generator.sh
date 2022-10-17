#!/bin/bash
#V0.0.7 - Beta

# load in configuration variables
. config.conf

#retrieve script location

wdir="$PWD"; [ "$PWD" = "/" ] && wdir=""
case "$0" in
  /*) scriptdir="${0}";;
  *) scriptdir="$wdir/${0#./}";;
esac
scriptdir="${scriptdir%/*}"

#make sure workdir exists
if [ ! -d $workdir ]; then
  mkdir -p $workdir;
fi

#set workdir

workdir=$scriptdir/workdir

#set weatherdir

weatherdir=$scriptdir/weather

#set helperdir
helperdir=$scriptdir/helper-scripts

#General cleanup

rm -f $weatherdir/*
rm -r $workdir/*

# Add directory variables to config-temp.config
echo weatherdir=$weatherdir >> $workdir/config-temp.conf
echo workdir=$workdir >> $workdir/config-temp.conf
echo scriptdir=$scriptdir >> $workdir/config-temp.conf
echo helperdir=$helperdir >> $workdir/config-temp.conf

# check variables are set. if not set default fallbacks

if [[ -z $videolength ]];
then
  echo videolengthr=30 >> $workdir/config-temp.conf
else
  echo videolength=$videolength >> $workdir/config-temp.conf
fi
if [[ -z $state ]];
then
  echo state='Texas' >> $workdir/config-temp.conf
else
  echo state=$state >> $workdir/config-temp.conf
fi
if [[ -z $city ]];
then
  echo city='Austin' >> $workdir/config-temp.conf
else
  echo city=$city >> $workdir/config-temp.conf
fi
if [[ -z $newsduration ]];
then
  echo newsduration=60 >> $workdir/config-temp.conf
else
  echo newsduration=$newsduration >> $workdir/config-temp.conf
fi
if [[ -z $textspeed ]];
then
  echo textspeed=40 >> $workdir/config-temp.conf
else
  echo textspeed=$textspeed >> $workdir/config-temp.conf
fi
if [[ -z $videoresolution ]];
then
  echo videoresolution=1280x720 >> $workdir/config-temp.conf
else
  echo videoresolution=$videoresolution >> $workdir/config-temp.conf
fi
if [[ -z $newsfeed ]];
then
  echo newsfeed="https://rss.nytimes.com/services/xml/rss/nyt/World.xml" >> $workdir/config-temp.conf
else
  echo newsfeed=$newsfeed >> $workdir/config-temp.conf
fi
if [[ -z $newstextcolour ]];
then
  echo newstextcolour=random >> $workdir/config-temp.conf
else
  echo newstextcolour=$newstextcolour >> $workdir/config-temp.conf
fi
if [[ -z $newsbackgroundcolour ]];
then
  echo newsbackgroundcolour=random >> $workdir/config-temp.conf
else
  echo newsbackgroundcolour=$newsbackgroundcolour >> $workdir/config-temp.conf
fi
if [[ -z $backgroundcolour ]];
then
  echo backgroundcolour=random >> $workdir/config-temp.conf
else
  echo backgroundcolour=$backgroundcolour >> $workdir/config-temp.conf
fi
if [[ -z $output ]];
then
  echo output=~ >> $workdir/config-temp.conf
else
  echo output=$output >> $workdir/config-temp.conf
fi
if [[ -z $offlinebackgroundcolour ]];
then
  echo offlinebackgroundcolour=random >> $workdir/config-temp.conf
else
  echo offlinebackgroundcolour=$offlinebackgroundcolour >> $workdir/config-temp.conf
fi
if [[ -z $offlinetextcolour ]];
then
  echo offlinetextcolour=random >> $workdir/config-temp.conf
else
  echo offlinetextcolour=$offlinetextcolour >> $workdir/config-temp.conf
fi
if [[ -z $xmltv ]];
then
  echo xmltv="http://127.0.0.1:8409/iptv/xmltv.xml" >> $workdir/config-temp.conf
else
  echo xmltv=$xmltv >> $workdir/config-temp.conf
fi
if [[ -z $processweather ]];
then
  echo processweather=yes >> $workdir/config-temp.conf
else
  echo processweather=$processweather >> $workdir/config-temp.conf
fi
if [[ -z $processnews ]];
then
  echo processnews=yes >> $workdir/config-temp.conf
else
  echo processnews=$processnews >> $workdir/config-temp.conf
fi
if [[ -z $processchanneloffline ]];
then
  echo processchanneloffline=yes >> $workdir/config-temp.conf
else
  echo processchanneloffline=$processchanneloffline >> $workdir/config-temp.conf
fi

#copy colours.txt
cp $scriptdir/colours.txt $workdir/colours.txt

#setup audio
#list audio files
find $scriptdir/audio -name '*.mp3' -print > $workdir/music.txt
#add number to begining of line for randomisation
awk 'BEGIN{srand()}{print rand(), $0}' $workdir/music.txt | sort -n -k 1 | awk 'sub(/\S* /,"")'

#End Audio

# Retrieve information country code etc.
curl ipinfo.io | jq >> $workdir/information.json
country=$(jq -r '.country' $workdir/information.json)
echo country=$country >> $workdir/config-temp.conf

#call weather.sh
.$helperdir/weather.sh
