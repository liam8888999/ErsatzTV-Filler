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

#set workdir

workdir=$scriptdir/workdir

#set weatherdir

weatherdir=$scriptdir/weather

#fix white spaces for curl

stateurl=$(echo $state|sed -e 's/ /%20/g')
cityurl=$(echo $city|sed -e 's/ /%20/g')

#make sure workdir exists
if [ ! -d $workdir ]; then
  mkdir -p $workdir;
fi

#General cleanup

rm -f $weatherdir/v1.png
rm -f $weatherdir/v2.png
rm -f $weatherdir/v3.png
rm -f $workdir/colours.txt
rm -f $workdir/news.txt
rm -f $workdir/news.xslt
rm -f $workdir/*.txt

#copy colours.txt
cp $scriptdir/colours.txt $workdir/colours.txt

# Audio

#select audio
#list audio files
find $scriptdir/audio -name '*.mp3' -print > $workdir/music.txt
#add number to begining of line for randomisation
awk 'BEGIN{srand()}{print rand(), $0}' $workdir/music.txt | sort -n -k 1 | awk 'sub(/\S* /,"")'

#choose random numbers
randomNumber=$(shuf -i 1-7 -n 1 --repeat)
randomNumber1=$(shuf -i 1-7 -n 1 --repeat)
randomNumber2=$(shuf -i 1-7 -n 1 --repeat)
audio=$(head -n $randomNumber $workdir/music.txt | tail -n 1)
audio1=$(head -n $randomNumber1 $workdir/music.txt | tail -n 1)
audio2=$(head -n $randomNumber2 $workdir/music.txt | tail -n 1)

#End Audio

#generic Backgrounds (weather)

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

#weather

#retrieve weather data

curl wttr.in/${cityurl}.png --output $weatherdir/v1.png
curl v2.wttr.in/${cityurl}.png --output $weatherdir/v2.png
curl v3.wttr.in/${stateurl}.png --output $weatherdir/v3.png
wait

#make video

ffmpeg -f lavfi -i color=$background:$videoresolution:d=$videolength -i $weatherdir/v1.png -stream_loop -1 -i $audio -shortest -filter_complex "[1]scale=iw*1:-1[wm];[0][wm]overlay=x=(W-w)/2:y=(H-h)/2" -pix_fmt yuv420p -c:a copy $output/weather-v1.mp4
ffmpeg -f lavfi -i color=$background1:$videoresolution:d=$videolength -i $weatherdir/v2.png -stream_loop -1 -i $audio1 -shortest -filter_complex "[1]scale=iw*1:-1[wm];[0][wm]overlay=x=(W-w)/2:y=(H-h)/2" -pix_fmt yuv420p -c:a copy $output/weather-v2.mp4
ffmpeg -f lavfi -i color=$background2:$videoresolution:d=$videolength -i $weatherdir/v3.png -stream_loop -1 -i $audio2 -shortest -filter_complex "[1]scale=iw*0.9:-1[wm];[0][wm]overlay=x=(W-w)/2:y=(H-h)/2" -pix_fmt yuv420p -c:a copy $output/weather-v3.mp4

#end weather


#news

#news backgound
#background colour randomiser
if [[ $newsbackgroundcolour == random ]]
then
#awk 'BEGIN{srand()}{print rand(), $0}' $workdir/colours.txt | sort -n -k 1 | awk 'sub(/\S* /,"")'
#newsbackgroundrandomNumber=$(shuf -i 1-140 -n 1 --repeat)
#newsbackground=$(head -n $newsbackgroundrandomNumber $workdir/colours.txt | tail -n 1)
newsbackground=White
else
newsbackground=$newsbackgroundcolour
fi

#news text colour
if [[ $newstextcolour == random ]]
then
#awk 'BEGIN{srand()}{print rand(), $0}' $workdir/colours.txt | sort -n -k 1 | awk 'sub(/\S* /,"")'
#newstextcolourrandomNumber=$(shuf -i 1-140 -n 1 --repeat)
#newstextcolour=$(head -n $newstextcolourandomNumber $workdir/colours.txt | tail -n 1)
newstextcolour=Black
else
newstextcolour1=$newstextcolour
fi

# The file where we will write out the style sheet, for later use by
#  xsltprc
newsstyle="$workdir/news.xslt"

# Write the (simple) stylesheet to a convenient file -- we will edit
#  it in place later

cat << EOF > $newsstyle
<xsl:stylesheet version="1.0"
        xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="/rss/channel">
  <xsl:for-each select="item">

\fB<xsl:value-of select="title"/>\fR
.br
<xsl:value-of select="description"/>
</xsl:for-each>

</xsl:template>
</xsl:stylesheet>
EOF

echo $newsfeed1
# main news


# Generate Results
curl -s "$newsfeed" | xsltproc $newsstyle - | grep -v xml |  man -l - | col -bx > $workdir/newstemp.txt
#remove empty line at top of file
sed -i '1,/^$/d' $workdir/newstemp.txt
#add paragraph numbering
awk -v RS='\n\n' -vORS='\n\n' '{print NR " " $0}' $workdir/newstemp.txt > $workdir/news1.txt
# Copy first 10 arcticles
sed '/^1 /,/^\s*$/!d' $workdir/news1.txt >> $workdir/news2.txt
sed '/^2 /,/^\s*$/!d' $workdir/news2.txt >> $workdir/news3.txt
sed '/^3 /,/^\s*$/!d' $workdir/news3.txt >> $workdir/news4.txt
sed '/^4 /,/^\s*$/!d' $workdir/news4.txt >> $workdir/news5.txt
sed '/^5 /,/^\s*$/!d' $workdir/news5.txt >> $workdir/news6.txt
sed '/^6 /,/^\s*$/!d' $workdir/news6.txt >> $workdir/news7.txt
sed '/^7 /,/^\s*$/!d' $workdir/news7.txt >> $workdir/news8.txt
sed '/^8 /,/^\s*$/!d' $workdir/news8.txt >> $workdir/news9.txt
sed '/^9 /,/^\s*$/!d' $workdir/news9.txt >> $workdir/news10.txt
sed '/^10 /,/^\s*$/!d' $workdir/news10.txt >> $workdir/news11.txt
#remove paragraph numbering
sed 's/^10 //' $workdir/news11.txt >> $workdir/news12.txt
sed 's/^0 //' $workdir/news12.txt >> $workdir/news13.txt
sed 's/^1 //' $workdir/news13.txt >> $workdir/news14.txt
sed 's/^2 //' $workdir/news14.txt >> $workdir/news15.txt
sed 's/^3 //' $workdir/news15.txt >> $workdir/news16.txt
sed 's/^4 //' $workdir/news16.txt >> $workdir/news17.txt
sed 's/^5 //' $workdir/news17.txt >> $workdir/news18.txt
sed 's/^6 //' $workdir/news18.txt >> $workdir/news19.txt
sed 's/^7 //' $workdir/news19.txt >> $workdir/news20.txt
sed 's/^8 //' $workdir/news20.txt >> $workdir/news21.txt
sed 's/^9 //' $workdir/news21.txt >> $newsdir/news.txt

# Generate Video

ffmpeg -f lavfi -i color=$newsbackground:$videoresolution:d=$newsduration -stream_loop -1 -i $audio -shortest -vf "drawtext=textfile='$workdir/news.txt': fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf: x=(w-text_w)/2:y=h-$textspeed*t: fontcolor=$newstextcolour1: fontsize=W/40:"  -pix_fmt yuv420p -c:a copy $output/news.mp4



#optional news 1



# Generate Results
curl -s "$newsfeed1" | xsltproc $newsstyle - | grep -v xml |  man -l - | col -bx > $workdir/newstemp1.txt
#remove empty line at top of file
sed -i '1,/^$/d' $workdir/newstemp1.txt
#add paragraph numbering
awk -v RS='\n\n' -vORS='\n\n' '{print NR " " $0}' $workdir/newstemp1.txt > $workdir/optional1-news1.txt
# Copy first 10 arcticles
sed '/^1 /,/^\s*$/!d' $workdir/optional1-news1.txt >> $workdir/optional1-news2.txt
sed '/^2 /,/^\s*$/!d' $workdir/optional1-news2.txt >> $workdir/optional1-news3.txt
sed '/^3 /,/^\s*$/!d' $workdir/optional1-news3.txt >> $workdir/optional1-news4.txt
sed '/^4 /,/^\s*$/!d' $workdir/optional1-news4.txt >> $workdir/optional1-news5.txt
sed '/^5 /,/^\s*$/!d' $workdir/optional1-news5.txt >> $workdir/optional1-news6.txt
sed '/^6 /,/^\s*$/!d' $workdir/optional1-news6.txt >> $workdir/optional1-news7.txt
sed '/^7 /,/^\s*$/!d' $workdir/optional1-news7.txt >> $workdir/optional1-news8.txt
sed '/^8 /,/^\s*$/!d' $workdir/optional1-news8.txt >> $workdir/optional1-news9.txt
sed '/^9 /,/^\s*$/!d' $workdir/optional1-news9.txt >> $workdir/optional1-news10.txt
sed '/^10 /,/^\s*$/!d' $workdir/optional1-news10.txt >> $workdir/optional1-news11.txt
#remove paragraph numbering
sed 's/^10 //' $workdir/optional1-news11.txt >> $workdir/optional1-news12.txt
sed 's/^0 //' $workdir/optional1-news12.txt >> $workdir/optional1-news13.txt
sed 's/^1 //' $workdir/optional1-news13.txt >> $workdir/optional1-news14.txt
sed 's/^2 //' $workdir/optional1-news14.txt >> $workdir/optional1-news15.txt
sed 's/^3 //' $workdir/optional1-news15.txt >> $workdir/optional1-news16.txt
sed 's/^4 //' $workdir/optional1-news16.txt >> $workdir/optional1-news17.txt
sed 's/^5 //' $workdir/optional1-news17.txt >> $workdir/optional1-news18.txt
sed 's/^6 //' $workdir/optional1-news18.txt >> $workdir/optional1-news19.txt
sed 's/^7 //' $workdir/optional1-news19.txt >> $workdir/optional1-news20.txt
sed 's/^8 //' $workdir/optional1-news20.txt >> $workdir/optional1-news21.txt
sed 's/^9 //' $workdir/optional1-news21.txt >> $newsdir/optional1-news.txt

# Generate Video

ffmpeg -f lavfi -i color=$newsbackground:$videoresolution:d=$newsduration -stream_loop -1 -i $audio -shortest -vf "drawtext=textfile='$workdir/optional1-news.txt': fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf: x=(w-text_w)/2:y=h-$textspeed*t: fontcolor=$newstextcolour1: fontsize=W/40:"  -pix_fmt yuv420p -c:a copy $output/news.mp4

#optional news 2
#end news
