#!/bin/bash -e

VERSION=$(npm pkg get version | sed 's/"//g')

ng build

cd dist

tar czf event-tools-$VERSION.tgz event-tools
sha256sum event-tools-$VERSION.tgz > event-tools-$VERSION.tgz.sha
scp event-tools-$VERSION.tgz nazgul:/home/uploads
scp event-tools-$VERSION.tgz.sha nazgul:/home/uploads
ssh nazgul "ln -sf /home/uploads/event-tools-$VERSION.tgz /home/uploads/event-tools-latest.tgz;ln -sf /home/uploads/event-tools-$VERSION.tgz.sha /home/uploads/event-tools-latest.tgz.sha"

scp event-tools-$VERSION.tgz et:/home/uploads
scp event-tools-$VERSION.tgz.sha et:/home/uploads
ssh et "ln -sf /home/uploads/event-tools-$VERSION.tgz /home/uploads/event-tools-latest.tgz;ln -sf /home/uploads/event-tools-$VERSION.tgz.sha /home/uploads/event-tools-latest.tgz.sha"
