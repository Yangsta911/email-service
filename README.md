# Email service

An AWS Lambda function to send emails.

The primary purpose of this function is to provide a server-side back-end for sending emails.

The back-end support 2 email providers:

[Mailgun](https://www.mailgun.com)

[SendGrid](https://www.sendgrid.com)

The back-end supports the failover mechanism between email providers. 

The back-end supports following features

1. multiple receipts, CCs, and BCCs, though these fields accept raw email address only, i.e. name@email.com. The named email addrees, e.g. "My name <name.email.com>", is not supporting now.
1. support plain text email body only
1. Doesn't allow empty or invalid from field. From field accepts the raw email address only.
1. Subject, and email body cannot be empty

## Solution
Instead of setting up an restapi back end server on an EC2 (or other cloud platform) instance to handle email service, ueses the AWS Lambda function and API Gateway to support it. 

The serveless Lambda architecture provides the easy deployment, lower cost, and auto scalable solution for the simple email service.

The limitation is that API Gateway has the maximax 30 seconds timeout limition, which means the fronend may not be able to receive the response if the email sending process is over 30 seconds. 

However for a plain text email, the timeout sounds good enough. The potential issue is that if the email service will have to support huge attachment, then the timeout is an issue.

For avoiding the unresponsible http request, which can hang the whole process, the http request is monitored by a local timer with default 10s timeout.

For simplicity the current failover mechanism is looping over the 2 services,  and pick the first working one. With the request timeout monitor as described above, the loop won't be hanged too long even any of the services are slow of response.

For a really system, at least following factors should be considered
1. Check the status of the services at backend
2. Pick the fastest one
3. Balance the loadding
4. Retry if both services are down

## Development
1. Fork/Clone
1. Install dependencies - `npm install`
1. Test - `npm run test`
1. Build - `npm run build`
1. Lint - `npm run lint`

Note: some of the tests are marked as xit, as these tests are accessing the backend which should not be run as part of the standard alone unit tests.

## Deployment
Note: use node8.10 as this is the version lambda supports.

Make sure you have aws cli installed, and configured correctly.

1. Create a lambda function manully via AWS protal, and specify the lambda source is from a S3 bucket, e.g. s3://${bucketname}/emailservice.zip
1. export 2 enviroment 

    export EMAIL_LAMBDA_NAME=${the_name_of_lambda}
    export EMAIL_S3=${the_name_of_s3_bucket}

1. run `npm run deploy`
1. The following env variable need to be set on lambda function
  MAIL_GUN_USER=<the mail gun api user>
  MAIL_GUN_PASS=<the mail gun api pass>
  SEND_GRID_TOKEN=<the send grid api token>

## End2End Test
### Send email
Please modify the email.json file, and change the address to the right emaiil address. 
So far seems only gmail address are working all rightl
1. `cd tests`
1. `chmod +x ./send.sh`
1. `./send.sh email.json`

### Get status
1. `cd tests`
1. `chmod +x ./status.sh`
1. `./status.sh`

## Issues
1. The mail gun sand box's receipts invitation email is broken. Click agree show a 404 not found page. No way to test multiple receipts, CCs, BCCs
2. Seems only gmail address can receive the message. Haven't got enough time to figure out the reason. Guess that some of the free email accounts are filtering the emails form these api?

## TODO
1. Support named email address
1. The email providers have different rules of validation the email, need find the common set which become the validation rules of the service.
1. Use a validator module for input validation
1. Use AWS system store to replace the env variables
1. Allow the user custom the request timeout value
1. Retry mechanism for the case if both of the providers are 
1. Specify the primary provider
1. Performance test
