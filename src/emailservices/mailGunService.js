import * as https from 'https';
import * as querystring from 'querystring';
import config from '../config';
import { createLogger } from '../logger/logger';
import { createTimer, clearTimer } from '../utils/timer';
import { abortRequest } from './request';

const logger = createLogger('com.siteminder.email-service.mailGunService');

const doSendEmail = async (email) => {
  logger.info('Sending email');
  const postData = querystring.stringify(email);
  const options = {
    host: config.mailGun.host,
    port: config.mailGun.port,
    path: `/${config.mailGun.version}/${config.mailGun.domain}/messages`,
    method: 'POST',
    auth: `${config.mailGun.user}:${config.mailGun.pass}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  return new Promise((resolve, reject) => {
    let timer;
    const req = https.request(options, (resp) => {
      logger.debug('SendEmailResponseCode:', resp.statusCode);
      clearTimer(timer);

      if (resp.statusCode === 200) {
        resp.resume();
        return resolve(true);
      } else {
        //TODO: should return the right message from backend
        resp.resume();
        const error = new Error(resp.statusMessage);
        error.code = resp.statusCode;
        return reject(error);
      }
    }).on('error', (err) => {
      reject(err);
    });
    req.write(postData);
    req.end();

    // request time out monitor
    timer = createTimer(
      () => {
        abortRequest(req);
        return resolve(false);
      },
      10000
    );
  });
};

const doTestBackend = async () => {
  logger.debug('Pinging the mail gun backend');
  return new Promise((resolve, reject) => {

    // TODO: the options should be passed as parameter
    const options = {
      host: config.mailGun.host,
      port: config.mailGun.port,
      path: `/${config.mailGun.version}/${config.mailGun.domain}/stats`,
      auth: `${config.mailGun.user}:${config.mailGun.pass}`
    };

    // logger.debug('Optons', options);
    let timer;
    const req = https.get(options, (resp) => {
      logger.debug('TestResponseCode:', resp.statusCode);

      clearTimer(timer);
      if (resp.statusCode === 200) {
        resp.resume();
        return resolve(true);
      } else {
        resp.resume();
        return reject(false);
      }
    }).on('error', (err) => {
      reject(err);
    });
    req.end();

    // request time out monitor
    timer = createTimer(
      () => {
        abortRequest(req);
        return resolve(false);
      },
      10000);
  });
};

export const createMailGunService = () => {
  return {
    test: async () => {
      return doTestBackend();
    },
    send: async (email) => {
      return doSendEmail(email);
    },
    name: () => {
      return 'Mail Gun';
    }
    // poll: (interval = 13000) => {
    //   logger.debug('Start polling backend');
    //   doTestBackend()
    //     .then((result) => {
    //       logger.debug('The backend is good', result);
    //       isSystemOk = result;
    //     })
    //     .catch(() => {
    //       logger.debug('Network error');
    //       isSystemOk = false;
    //     })
    //   setInterval(doTestBackend, interval);
    // },
    // stop: () => {
    //   clearInterval(interval);
    //   interval = undefined;
    // },
    // isSystemOk: () => {
    //   return isSystemOk;
    // }
  };
};