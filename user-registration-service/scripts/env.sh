#!/bin/bash

export VERSION=${GIT_COMMIT}
export APP_NAME="c7-user-registration-service"


# TODO: http://jira.monsanto.com/browse/GCX-2105
# for cf-deploy-prod
export zionName="aperture-user-registration-service-cf-aws"
export space="agents-of-shield"

echo '{"version":"'"${VERSION}"'"}' > buildInfo.json
