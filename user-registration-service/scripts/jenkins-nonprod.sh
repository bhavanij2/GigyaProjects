#!/bin/bash

. ./scripts/jenkins-build-scripts/jenkins-setup.sh

utils_setup

chmod +x scripts/env.sh
. ./scripts/env.sh

echo '{"version":"'"${VERSION}"'"}' > buildInfo.json

chmod +x scripts/build.sh
scripts/build.sh

chmod +x scripts/cf-deploy-np.sh
scripts/cf-deploy-np.sh

#chmod +x scripts/stage-deploy.sh
#scripts/stage-deploy.sh