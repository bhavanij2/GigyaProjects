#!/bin/bash

. ./scripts/jenkins-build-scripts/jenkins-setup.sh

utils_setup

chmod +x scripts/env.sh
. ./scripts/env.sh

echo '{"version":"'"${VERSION}"'"}' > buildInfo.json

chmod +x scripts/build.sh
scripts/build.sh || exit 1

#chmod +x scripts/cf-deploy.sh
#scripts/cf-deploy.sh || exit 1

chmod +x scripts/stage-deploy.sh
scripts/stage-deploy.sh || exit 1