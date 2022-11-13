#!/bin/bash
#V0.0.20 - Beta

echo starting autoupdate

# load in configuration variables
. config-temp.conf

git fetch |& tee $workdir/update

if [[ -s $workdir/update ]];
then

echo there is an update available

#for test
#test variable run yes/no
#convert variable to lowercase
autoupdate1=$(echo $autoupdate | tr '[:upper:]' '[:lower:]')
if [[ $autoupdate1 = yes ]]
then
  echo auto updates are turned on so the script will now update
echo '#!/bin/bash' >> /tmp/ErsatzTV-Filler-autoupdate.sh
echo cd $scriptdir >> /tmp/ErsatzTV-Filler-autoupdate.sh
echo git pull >> /tmp/ErsatzTV-Filler-autoupdate.sh
echo "rm -f $scriptdir/running.txt" >> /tmp/ErsatzTV-Filler-autoupdate.sh
echo touch $workdir/update-run >> /tmp/ErsatzTV-Filler-autoupdate.sh
echo exec $scriptdir/generator.sh >> /tmp/ErsatzTV-Filler-autoupdate.sh

chmod +x /tmp/ErsatzTV-Filler-autoupdate.sh

# cleanup

rm -f $helperdir/config-temp.conf
cd $scriptdir

exec /tmp/ErsatzTV-Filler-autoupdate.sh
else
  echo auto update is disabled the script will not update.
  echo moving to weather.sh
cd $helperdir
./weather.sh
fi
else
  echo there are no updates available.
  echo moving to weather.sh
cd $helperdir
./weather.sh
fi
