#!/bin/bash

while IFS=, read -r dealerName sapid username federationId firstName lastName addressLine1 addressLine2 city state country brand userType username contactGlopid role extra
do
    if [ "$role" == "Site Manager" ]
    then
        ROLE_ID="glb:seed:ad\"",\""glb:cp:ad\"",\""glb:acceleron:ad\"",\""glb:bioag:ad"
    elif [ "$role" == "Seedsman" ]
    then
        ROLE_ID="glb:seed:ad"
    else
        ROLE_ID="glb:seed:chfarm\"",\""glb:bioag:chfarm\"",\""glb:acceleron:chfarm"
        echo "$ROLE_ID"
    fi
    HTTP_RESPONSE=$(curl --silent --write-out "HTTPSTATUS:%{http_code}" -d '{"userId":"'$username'", "userName":"'$username'", "sapAccountId":"'$sapid'", "brand":"'$brand'", "persona":"'$userType'", "roleIdList":["'$ROLE_ID'"], "contactGlopid":"'$contactGlopid'", "federationId":"'$federationId'", "firstName":"'$firstName'", "lastName":"'$lastName'"}' \
    -H "Content-Type: application/json"  -H "Authorization: Bearer dfas" -X POST http://localhost:3001/v1/users)
    # extract the body
    HTTP_BODY=$(echo $HTTP_RESPONSE | sed -e 's/HTTPSTATUS\:.*//g')

    # extract the status
    HTTP_STATUS=$(echo $HTTP_RESPONSE | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')

    echo "$username|$sapid|$HTTP_STATUS|$HTTP_BODY"
done < ./import/non-prod/national-04-org.csv