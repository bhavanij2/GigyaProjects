#!/bin/bash
set -e

cd ..

branch=`git rev-parse --abbrev-ref HEAD`

if [ $branch != "master" ]; then
    echo "***** CRITICAL ERROR: This script cannot be executed in $branch branch!"
    exit 1
fi

if ! git diff-index --quiet HEAD --; then
    echo "***** CRITICAL ERROR: This script cannot be executed because local changes were detected!"
    exit 1
fi

version=`mvn org.apache.maven.plugins:maven-help-plugin:3.1.0:evaluate -Dexpression=project.version -q -DforceStdout`

releaseVersionDefault=${version/-SNAPSHOT/}

read -p "Enter release version [$releaseVersionDefault]: " releaseVersion
releaseVersion=${releaseVersion:-$releaseVersionDefault}

read -p "Enter release title: " releaseTitle

echo "Versioning build $version -> $releaseVersion..."

mvn versions:set -DnewVersion=$releaseVersion > /dev/null

mvn versions:commit > /dev/null

echo "Tagging build as v$releaseVersion..."

git tag -a v$releaseVersion -m $releaseTitle

git push origin master --tags

echo "Don't forget to update the development build to a new SNAPSHOT version!"