#!/bin/bash

mvn clean
mvn install
mvn cobertura:cobertura -Dcobertura.report.format=xml