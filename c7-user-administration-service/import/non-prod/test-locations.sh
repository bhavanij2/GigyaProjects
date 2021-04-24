#!/bin/bash

while IFS=, read -r sapid dealerName
do
    HTTP_RESPONSE=$(curl --silent --write-out "HTTPSTATUS:%{http_code}" -d '{"sapLocationId":"'$sapid'"}' \
    -H "Content-Type: application/json"  -H "Authorization: Bearer dfas" -X POST http://localhost:3001/v1/locations)
    # extract the body
    HTTP_BODY=$(echo $HTTP_RESPONSE | sed -e 's/HTTPSTATUS\:.*//g')

    # extract the status
    HTTP_STATUS=$(echo $HTTP_RESPONSE | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')

    echo "$sapid|$HTTP_STATUS|$HTTP_BODY"
done < ./import/non-prod/prod_users.csv
