#!/bin/bash
set -e
# Creates a local build and copies the content of the dist folder to a given S3 bucket
#./workflows/buildToS3.sh -b BUCKETNAME [-p PROFILE]

FOLDER='dist'
PROFILE="default"

while [[ $# -gt 0 ]]
do
key="$1"

case $key in
    -b|--bucket)
    BUCKET="$2"
    shift # past argument
    shift # past value
    ;;
    -cf|--cloudfront)
    shift # past argument
    shift # past value
    ;;
    -p|--profile)
    PROFILE="$2"
    shift # past argument
    shift # past value
    ;;
esac
done

if [ -z $BUCKET ]
  then
    echo "ERROR: Bucket is required as parameter -b"
    exit
fi

echo "BUILDING APP"
yarn build

echo "------------------------"
echo "Starting AWS Operations with profile $PROFILE"
echo ""
echo ""

echo "Uploading from $FOLDER >> $BUCKET"
aws s3 cp $FOLDER s3://$BUCKET --region eu-central-1 --recursive --profile $PROFILE --metadata-directive REPLACE
aws s3 cp $FOLDER/index.html s3://$BUCKET --region eu-central-1 --profile $PROFILE --metadata-directive REPLACE --content-type text/html
aws s3 cp "$FOLDER/index.html" "s3://$BUCKET/index_$(date +%Y-%m-%d_%H%M).html" --region eu-central-1 --profile "$PROFILE" --metadata-directive REPLACE --content-type text/html

echo "COPY COMPLETE"

