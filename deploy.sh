#!/bin/bash -e

build() {
    echo "Building..."
    VERSION=$(npm pkg get version | sed 's/"//g')
    rm -frv dist
    ng build --configuration production

    cd dist

    tar czf event-tools-$VERSION.tgz event-tools
    sha256sum event-tools-$VERSION.tgz > event-tools-$VERSION.tgz.sha
}


case "$1" in
    prod)
        echo "Deploying to production server"
        build
        scp event-tools-$VERSION.tgz et:/home/uploads
        scp event-tools-$VERSION.tgz.sha et:/home/uploads
        ssh et "ln -sf /home/uploads/event-tools-$VERSION.tgz /home/uploads/event-tools-latest.tgz;ln -sf /home/uploads/event-tools-$VERSION.tgz.sha /home/uploads/event-tools-latest.tgz.sha"
        ;;
    test)
        echo "Deploying to test server"
        build
        scp event-tools-$VERSION.tgz nazgul:/home/uploads
        scp event-tools-$VERSION.tgz.sha nazgul:/home/uploads
        ssh nazgul "ln -sf /home/uploads/event-tools-$VERSION.tgz /home/uploads/event-tools-latest.tgz;ln -sf /home/uploads/event-tools-$VERSION.tgz.sha /home/uploads/event-tools-latest.tgz.sha"
        ;;
    ver)
        if [ "$2" = "patch" ]; then
            npm version patch
        elif [ "$2" = "minor" ]; then
            npm version minor
        elif [ "$2" = "major" ]; then
            npm version major
        else
            echo "Usage: $0 ver {patch|minor|major}"
            exit 1
        fi
        VERSION=$(npm pkg get version | sed 's/"//g')
        sed -i "s/frontendVersion.=.\".*\"/frontendVersion = \"${VERSION}\"/g" /home/seba/workspace/event-tools-frontend/src/app/version.ts
        git add src/app/version.ts
        git commit -m "Bump version to $VERSION"
        ;;
    merge)
        echo "Marge main with dev"
        git switch main
        git merge dev
        git push
        git switch dev
        ;;
    *)
        echo "Usage: $0 {prod|test|ver}"
        exit 1
esac
