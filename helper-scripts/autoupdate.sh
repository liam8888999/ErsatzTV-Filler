#!/bin/bash
#V0.0.17 - Beta

# load in configuration variables
. config-temp.conf

# skip autoupdate in docker
if [[ ! -z "$ETV_FILLER_DOCKER" ]]
then
    return 0 2>/dev/null || exit 0
fi


#for test
#test variable run yes/no
#convert variable to lowercase
autoupdate1=$(echo $autoupdate | tr '[:upper:]' '[:lower:]')
if [[ $autoupdate1 = yes ]]
then
  echo updater11
echo '#!/bin/bash' >> /tmp/ErsatzTV-Filler-autoupdate.sh
echo cd $scriptdir
#echo git pull >> /tmp/ErsatzTV-Filler-autoupdate.sh
echo rm \$0 >> /tmp/ErsatzTV-Filler-autoupdate.sh
rm -f $scriptdir/running.txt >> /tmp/ErsatzTV-Filler-autoupdate.sh
#echo exec $scriptdir/generator.sh >> /tmp/ErsatzTV-Filler-autoupdate.sh

chmod +x /tmp/ErsatzTV-Filler-autoupdate.sh

# cleanup

rm -f $helperdir/config-temp.conf
cd $scriptdir

exec /tmp/ErsatzTV-Filler-autoupdate.sh
else
rm -f $helperdir/config-temp.conf
rm -f $scriptdir/running.txt
cd $scriptdir
#./generator.sh
fi
