#!/bin/bash

# environment variables for deployment
. ./scripts/env.sh

# grep is using bash variable expansion - MUST USE DOUBLE QUOTES
# awk doesn't want the $1 to be expanded by bash - MUST USE SINGLE QUOTES
oldapp=`cf apps | grep "^${APP_NAME}_" | grep -v "${VERSION}" | grep -v "^${APP_NAME}_previous" | awk '{print $1}'`
previousApp=`cf apps | grep "^${APP_NAME}_previous_" | grep -v "${VERSION}" | awk '{print $1}'`

cd target

cf push ${APP_NAME}_${VERSION} --no-start --no-route -b mon_java -s cflinuxfs2 -p *.jar
cf map-route ${APP_NAME}_${VERSION} mcf-np.local -n ${APP_NAME}
cf bs ${APP_NAME}_${VERSION} user-registration-service-vault-details
cf se ${APP_NAME}_${VERSION} SPRING_PROFILES_ACTIVE nonprod
cf start ${APP_NAME}_${VERSION}

# stop current apps and rename it to _previous_
for app in $oldapp
do
    appName=`echo $app | cut -d _ -f 1`
    appVersion=`echo $app | cut -d _ -f 2`
    newAppName=`echo ${appName}_previous_${appVersion}`

    cf unmap-route $app mcf-np.local -n ${APP_NAME}
    cf stop $app
    cf rename $app $newAppName
done

# delete previous if there is any oldapp
if [ -n "$oldapp" ]; then
    for app in $previousApp
    do
        cf delete $app -f
    done
fi