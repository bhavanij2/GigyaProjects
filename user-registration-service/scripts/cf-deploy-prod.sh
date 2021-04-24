chmod +x ./env.sh

. ./env.sh

if [ -z "$1" ]; then
    echo "usage: cf-deploy <filename>"
    echo -e "example: \033[0;33m./cf-deploy-prod.sh c7-portal-app_bd488bf267e2bd1ffb0850ef5458ed1dae80b168.tar\033[0;37m\n"
    exit 1
fi

c7=`cf space $space | grep "name:                      agents-of-shield"`

if [ -z "$c7" ]; then
    echo "You are not logged in to cf in '$space' space"
    exit 1
fi

# make sure CF is in PROD
isProd=`cf domains | grep "cf.local"`
if [ -z "$isProd" ]; then
    echo "***** CRITICAL ERROR: You are NOT in PROD environment"
    exit 1
fi

# install jq
if [ ! -f /tmp/jq ]; then
    curl -L -s https://github.com/stedolan/jq/releases/download/jq-1.5/jq-osx-amd64 > /tmp/jq
    chmod +x /tmp/jq
fi

export PATH="$PATH:/tmp"

# make sure MD5 is correct
export md5sum=`md5 $1 | cut -d = -f 2 | awk '{print $1}'`

# get cf username
#email=`cf target | grep "User:" | cut -d : -f 2 | xargs`
#echo $email

# make sure it is approved
zionId=`curl -s -X GET "http://stludockerprd01.monsanto.com:55984/deployment-doc/_design/deployables/_view/deployables?key=%22${zionName}%22" | /tmp/jq -r '.rows[] | select(.value==env.md5sum) | .id'`

if [ -z "$zionId" ]; then
    echo "No approval to deploy $1 (md5 = $md5sum)"
    exit 1
fi

APP_NAME=`echo $1 | cut -d _ -f 1`
VERSION=`echo $1 | cut -d _ -f 2 | cut -d . -f 1`

# extract file
rm -rf dist
mkdir dist
tar -xzf $1 -C dist
if [ $? != 0 ]; then
    exit 1
fi

# deploy to CF PROD

oldapp=`cf apps | grep "^${APP_NAME}_" | grep -v "${VERSION}" | grep -v "^${APP_NAME}_previous" | awk '{print $1}'`
previousApp=`cf apps | grep "^${APP_NAME}_previous_" | grep -v "${VERSION}" | awk '{print $1}'`

cd dist/target

cf push ${APP_NAME}_${VERSION} --no-start --no-route -b mon_java -p *.jar
cf map-route ${APP_NAME}_${VERSION} cf.local -n ${APP_NAME}
cf bs ${APP_NAME}_${VERSION} user-registration-service-vault-details
cf se ${APP_NAME}_${VERSION} SPRING_PROFILES_ACTIVE prod
cf start ${APP_NAME}_${VERSION}

# stop current apps and rename it to _previous_
for app in $oldapp
do
    appName=`echo $app | cut -d _ -f 1`
    appVersion=`echo $app | cut -d _ -f 2`
    newAppName=`echo ${appName}_previous_${appVersion}`

    cf unmap-route $app cf.local -n ${APP_NAME}
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

# Remind to mark deploy
echo -e "\n\n\n+--------------------------------------------------------------------------------------------------------------------------+"
echo -e "| *** Visit \033[0;33mhttps://velocity.monsanto.com/deployment/edit/$zionId\033[0;37m to mark the deployment done *** |"
echo -e "+--------------------------------------------------------------------------------------------------------------------------+\n\n"