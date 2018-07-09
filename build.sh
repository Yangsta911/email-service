
rm -f ./emailservice.zip
#cp -r ./node_modules build
cd dist
zip -r ../emailservice.zip .
aws s3 cp ../emailservice.zip s3://qs-lambda-code
aws lambda update-function-code --function-nam emailservice --s3-bucket qs-lambda-code --s3-key emailservice.zip