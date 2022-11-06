#!/bin/bash
#V0.0.17 - Beta

# load in configuration variables
. config-temp.conf

git fetch |& tee $workdir/update

if [[ -s $workdir/update ]];
then

# skip autoupdate in docker
if [[ ! -z "$ETV_FILLER_DOCKER" ]]
then
    autoupdate1=no
fi


#for test
#test variable run yes/no
#convert variable to lowercase
autoupdate1=$(echo $autoupdate | tr '[:upper:]' '[:lower:]')
if [[ $autoupdate1 = yes ]]
then
echo '#!/bin/bash' >> /tmp/ErsatzTV-Filler-autoupdate.sh
echo cd $scriptdir >> /tmp/ErsatzTV-Filler-autoupdate.sh
echo git pull >> /tmp/ErsatzTV-Filler-autoupdate.sh
echo "rm -f $scriptdir/running.txt" >> /tmp/ErsatzTV-Filler-autoupdate.sh
echo exec $scriptdir/generator.sh >> /tmp/ErsatzTV-Filler-autoupdate.sh

chmod +x /tmp/ErsatzTV-Filler-autoupdate.sh

# cleanup

rm -f $helperdir/config-temp.conf
cd $scriptdir

exec /tmp/ErsatzTV-Filler-autoupdate.sh
else
cd $helperdir
./weather.sh
fi
else
cd $helperdir
./weather.sh
fi
