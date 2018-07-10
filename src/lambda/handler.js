import { send } from '../emailservices/emailServices';
import { createMailGunService } from '../emailservices/mailGunService';
import { createSendGridService } from '../emailservices/sendGridService';
import { createLogger } from '../logger/logger';
import { validateMultipleEmailReceipts, isString } from '../validator/validator';

const logger = createLogger('com.siteminder.emailServices.lambda.handler.test');

export const createResponse = (message, status, contentType = 'plain/text') => {

  if (status === undefined) {
    throw new Error('Must specif the status code');
  }
  let headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT',
  };

  if (contentType) {
    headers = {
      ...headers,
      'Content-Type': contentType
    };
  }

  let reponse = {
    statusCode: status || 200,
    headers,
  };

  if (message) {
    reponse = {
      ...reponse,
      body: message,
    };
  }

  return reponse;
};

export const createJSONResponse = (message, status) => {
  return createResponse(JSON.stringify(message), status, 'application/json');
};

const doSendEmail = async (email) => {
  const services = [createMailGunService(), createSendGridService()];

  return send(email, services);

};

const handleGet = () => {

};


const handlePost = (event, context, callback) => {
  let body;

  try {
    body = JSON.parse(event.body);
  } catch (error) {
    body = event.body;
  }

  if (!body || !body.email) {
    logger.debug('body', body);

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

  if (!subject || !isString(subject) || subject.length === 0) {
    callback(null, createResponse(
      'Bad request: subject cannot be empty',
      400));

    return;
  }

  if (!text || !isString(text) || text.length === 0) {
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
      'Bad request: at least one \'to\' receipts is required',
      400));

    return;
  }

  if (validateMultipleEmailReceipts(cc)) {
    emailParam.cc = cc;
  }

  if (validateMultipleEmailReceipts(bcc)) {
    emailParam.bcc = bcc;
  }

  logger.debug('emailParam', emailParam);
  // both are invalid
  if (!emailParam.to && !emailParam.cc && !emailParam.bcc) {
    logger.debug('to/cc/bcc cannot be both empty');
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
    .catch(() => {
      callback(null, createResponse(
        'System error occurred while trying to send the email, please contact system admin to get detail logs',
        500));
    });
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