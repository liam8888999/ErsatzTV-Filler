#!/bin/bash
#V0.0.17 - Beta

# load in configuration variables
. config-temp.conf

#General cleanup

echo "Starting clean up"

rm -f $weatherdir/*
rm -r $workdir/*
rm -f $scriptdir/running.txt
rm -f $workdir/update
find $log_location -mtime +$log_days -exec rm -f {} \;
echo "Finished cleaning up"
exit 0
