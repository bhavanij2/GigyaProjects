#!/bin/bash

while IFS=, read -r brand userType username sapid contactGlopid role extra
do
    HTTP_RESPONSE=$(curl --silent --write-out "HTTPSTATUS:%{http_code}" \
    -H "Content-Type: application/json"  -H "Authorization: Bearer dfas" -X GET http://localhost:3001/v1/users/$username/brands/$brand/personas/$userType/accounts)
    # extract the body
    HTTP_BODY=$(echo $HTTP_RESPONSE | sed -e 's/HTTPSTATUS\:.*//g')

    # extract the status
    HTTP_STATUS=$(echo $HTTP_RESPONSE | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')

    echo "$username|$sapid|$HTTP_STATUS|$HTTP_BODY"
done < ./import/national-04-org.csv.csv
