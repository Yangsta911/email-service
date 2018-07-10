
rm -f ./emailservice.zip
#cp -r ./node_modules build
cd dist
zip -r ../emailservice.zip .
aws s3 cp ../emailservice.zip s3://${EMAIL_S3}
aws lambda update-function-code --function-nam ${EMAIL_LAMBDA_NAME} --s3-bucket ${EMAIL_S3} --s3-key emailservice.zip