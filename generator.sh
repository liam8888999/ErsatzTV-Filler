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

#set workdir

workdir=$scriptdir/workdir

#set weatherdir

weatherdir=$scriptdir/weather

# Add directory variables to config-temp.config
echo $weatherdir >> $workdir/config-temp.config
echo $workdir >> $workdir/config-temp.config
echo $scriptdir >> $workdir/config-temp.config


#make sure workdir exists
if [ ! -d $workdir ]; then
  mkdir -p $workdir;
fi

#General cleanup

rm -f $weatherdir/*
rm -r $workdir/*

# check variables are set. if not set default fallbacks

if [[ -z $videolength ]];
then
  echo videolengthr=30 >> $workdir/config-temp.config
else
  echo videolength=$videolength >> $workdir/config-temp.config
fi
if [[ -z $state ]];
then
  echo state='Texas' >> $workdir/config-temp.config
else
  echo state=$state >> $workdir/config-temp.config
fi
if [[ -z $city ]];
then
  echo city='Austin' >> $workdir/config-temp.config
else
  echo city=$city >> $workdir/config-temp.config
fi
if [[ -z $newsduration ]];
then
  echo newsduration=60 >> $workdir/config-temp.config
else
  echo newsduration=$newsduration >> $workdir/config-temp.config
fi
if [[ -z $textspeed ]];
then
  echo textspeed=40 >> $workdir/config-temp.config
else
  echo textspeed=$ntextspeed >> $workdir/config-temp.config
fi
if [[ -z $videoresolution ]];
then
  echo videoresolution=1280x720 >> $workdir/config-temp.config
else
  echo videoresolution=$videoresolution >> $workdir/config-temp.config
fi
if [[ -z $newsfeed ]];
then
  echo newsfeed="https://rss.nytimes.com/services/xml/rss/nyt/World.xml" >> $workdir/config-temp.config
else
  echo newsfeed=$newsfeed >> $workdir/config-temp.config
fi
if [[ -z $newstextcolour ]];
then
  echo newstextcolour=random >> $workdir/config-temp.config
else
  echo newstextcolour=$newstextcolour >> $workdir/config-temp.config
fi
if [[ -z $newsbackgroundcolour ]];
then
  echo newsbackgroundcolour=random >> $workdir/config-temp.config
else
  echo newsbackgroundcolour=$newsbackgroundcolour >> $workdir/config-temp.config
fi
if [[ -z $backgroundcolour ]];
then
  echo backgroundcolour=random >> $workdir/config-temp.config
else
  echo backgroundcolour=$backgroundcolour >> $workdir/config-temp.config
fi
if [[ -z $output ]];
then
  echo output=~ >> $workdir/config-temp.config
else
  echo output=$output >> $workdir/config-temp.config
fi
if [[ -z $offlinebackgroundcolour ]];
then
  echo offlinebackgroundcolour=random >> $workdir/config-temp.config
else
  echo offlinebackgroundcolour=$offlinebackgroundcolour >> $workdir/config-temp.config
fi
if [[ -z $offlinetextcolour ]];
then
  echo offlinetextcolour=random >> $workdir/config-temp.config
else
  echo offlinetextcolour=$offlinetextcolour >> $workdir/config-temp.config
fi
if [[ -z $xmltv ]];
then
  echo xmltv="http://127.0.0.1:8409/iptv/xmltv.xml" >> $workdir/config-temp.config
else
  echo xmltv= >> $workdir/config-temp.config
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
echo $country >> workdir/config-temp.config
