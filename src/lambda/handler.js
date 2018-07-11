import { send } from '../emailservices/emailServices';
import { createMailGunService } from '../emailservices/mailGunService';
import { createSendGridService } from '../emailservices/sendGridService';
import { createLogger } from '../logger/logger';
import { validateMultipleEmailReceipts, isEmptyString } from '../validator/validator';
import { createJSONResponse, createResponse } from './response';

const logger = createLogger('com.siteminder.email-service.lambda.handler.test');

const services = [createSendGridService(), createMailGunService()];

const doSendEmail = async (email) => {
  return send(email, services);

};

const handleGet = (event, context, callback) => {
  const promises = [];
  for (const service of services) {
    promises.push(service.test());
  }

  Promise.all(promises)
    .then((result) => {
      const status = result.map((value, index) => {
        return {
          name: services[index].name(),
          status: value,
        };
      });
      callback(null, createJSONResponse(
        status,
        200));
    })
    .catch(() => {
      callback(null, createResponse(
        'Failed to get the status',
        500));
    });
};


const handlePost = async (event, context, callback) => {
  let body;

  try {
    body = JSON.parse(event.body);
  } catch (error) {
    body = event.body;
  }

  if (!body || !body.email) {
    logger.debug('EventBody', body);

    callback(null, createResponse(
      'Bad request: The email parameter is missing',
      400));

    return;
  }

  const { from, to, cc, bcc, subject, text } = body.email;
  if (!validateMultipleEmailReceipts(from)) {
    callback(null, createResponse(
      'Bad request: a valid from  address is required',
      400));

    return;
  }

  if (!subject || isEmptyString(subject)) {
    callback(null, createResponse(
      'Bad request: subject cannot be empty',
      400));

    return;
  }

  if (!text || isEmptyString(text)) {
    callback(null, createResponse(
      'Bad request: email body cannot be empty',
      400));

    return;
  }

  // email validation is at lambda level, instead of at the service level
  // as this is business specific logic
  // a valid email object for the email service may not be a valid email object
  // for this specific backend
  const emailParam = { from, subject, text };

  // TODO: receipts should be only email address,
  // doesn't support 'Name <a.a.com>' yet
  // will need seek how to support named address
  if (validateMultipleEmailReceipts(to)) {
    emailParam.to = to;
  } else {
    callback(null, createResponse(
      'Bad request: at least one \'to\' receipt(s) is required',
      400));

    return;
  }

  if (validateMultipleEmailReceipts(cc)) {
    emailParam.cc = cc;
  }

  if (validateMultipleEmailReceipts(bcc)) {
    emailParam.bcc = bcc;
  }

  // both are invalid
  if (!emailParam.to && !emailParam.cc && !emailParam.bcc) {
    callback(null, createResponse(
      'Bad request: The email parameter must contain at one valid receipts for to, cc or bcc fields',
      400));
    return;
  }

  doSendEmail(emailParam)
    .then(() => {
      callback(null, createResponse(
        'Email sent successfully',
        200));
    })
    .catch((error) => {
      logger.error('Sending email failed', error.code);
      if (error && error.code === 400) {
        callback(null, createResponse(
          error.message,
          400));
      } else {
        // TODO: 1. define the systsem errors, 2. Setup an error handling mechanism
        if (error && error.name === 'NoGoodServiceFoundException') {
          callback(null, createResponse(
            'Seems all email providers are down, please try later',
            500));
        } else {
          callback(null, createResponse(
            'System error occurred while trying to send the email, please contact system admin to get detail logs',
            500));
        }

      }
    });

  // doSendEmail(emailParam)
  //   .then(() => {
  //     callback(null, createResponse(
  //       'Email sent successfully',
  //       200));
  //   })
  //   .catch((error) => {
  //     logger.error('Sending email failed', error.code);
  //     if(error && error.code === 400){
  //       callback(null, createResponse(
  //         error.message,
  //         400));
  //     }else {
  //       if(error && error.name === 'NoGoodServiceFoundException'){
  //         callback(null, createResponse(
  //           'Seems all email providers are down, please try later',
  //           500));
  //       }else{
  //         callback(null, createResponse(
  //           'System error occurred while trying to send the email, please contact system admin to get detail logs',
  //           500));
  //       }

  //     }
  //   });
};

const methodHandlers = {
  GET: handleGet,
  POST: handlePost
};

export const handler = (event, context, callback) => {
  if (event.httpMethod) {
    try {
      const httpMethod = event.httpMethod;
      if (httpMethod in methodHandlers) {
        logger.debug(`Handling http method: ${httpMethod}`);
        methodHandlers[httpMethod](event, context, callback);
      } else {
        callback(null, createResponse(`method:${event.httpMethod} not supportted`, 500));
      }
    } catch (error) {
      logger.error('Error occurred', error);
      callback(null, createResponse('Error occurred, check the system log for details', 500));
    }
  } else {
    callback(null, createResponse('Not called by api gateway', 500));
  }
};