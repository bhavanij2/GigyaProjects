#!/bin/bash
. ./scripts/env.sh

tar -zcvf ${APP_NAME}_${VERSION}.tar.gz buildInfo.json target/*.jar

aws s3 cp --sse AES256 ${APP_NAME}_${VERSION}.tar.gz s3://acs2-c7-us-east-1-285453578300/deployables/${APP_NAME}/${APP_NAME}_${VERSION}.tar.gz