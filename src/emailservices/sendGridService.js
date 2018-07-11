import * as https from 'https';
import config from '../config';
import { createLogger } from '../logger/logger';
import dateformat from 'dateformat';
import { createTimer, clearTimer } from '../utils/timer';
import { abortRequest } from './request';

const logger = createLogger('com.siteminder.email-service.sendGrid');

const getReceipts = (emails) => {
  const emailArray = emails.split(',');

  const emailObjects = emailArray.map((value) => {
    return {
      email: value
    };
  });

  // logger.debug('objects', JSON.stringify(emailObjects));
  return emailObjects;
};

const buildSendGridEamil = (email) => {
  // TODO: read the doc to understand the user code of muliptle personalizations


  const { to, cc, bcc, from, subject, text } = email;
  const sendGridEmail = {
    personalizations: [{
    }],
    from: {
      email: from
    },
    subject: subject,
    content: [
      {
        type: 'text/plain',
        value: text
      }]
  };

  if (to) {
    sendGridEmail.personalizations[0].to = getReceipts(to);
  }

  if (cc) {
    sendGridEmail.personalizations[0].cc = getReceipts(cc);
  }

  if (bcc) {
    sendGridEmail.personalizations[0].bcc = getReceipts(bcc);
  }

  return sendGridEmail;
};

const doSendEmail = async (email) => {
  logger.info('Sending email');
  const sendGridEmail = buildSendGridEamil(email);

  const options = {
    host: config.sendGrid.host,
    port: config.sendGrid.port,
    path: `/${config.mailGun.version}/mail/send`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.sendGrid.token}`
    }
  };

  let timer;
  return new Promise((resolve, reject) => {
    const req = https.request(options, (resp) => {
      clearTimer(timer);
      logger.debug('SendEmailResponseCode', resp.statusCode);
      if (resp.statusCode === 202) {
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

    req.write(JSON.stringify(sendGridEmail));
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

const doTestBackend = async () => {
  logger.debug('Pinging the send grid backend');
  return new Promise((resolve, reject) => {
    const day = dateformat(new Date(), 'yyyy-mm-dd');

    const options = {
      host: config.sendGrid.host,
      port: config.sendGrid.port,
      path: `/${config.mailGun.version}/stats?start_date=${day}&end_date=${day}`,
      headers: {
        Authorization: `Bearer ${config.sendGrid.token}`
      }
    };

    let timer;
    const req = https.get(options, (resp) => {
      // TODO: check the document of the return code.
      logger.debug('TestResponseCode:', resp.statusCode);
      clearTimer(timer);
      if (resp.statusCode === 200) {
        resp.resume();
        return resolve(true);
      } else {
        resp.resume();
        const error = new Error(resp.statusMessage);
        error.code = resp.statusCode;
        return reject(error);
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
      });

  });
};

export const createSendGridService = () => {
  return {
    test: async () => {
      return doTestBackend();
    },
    send: async (email) => {
      return doSendEmail(email);
    },
    name: () => {
      return 'Send Grid';
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
    //   interval == setInterval(doTestBackend, interval);
    // },
    // stop: () =>{
    //   clearInterval(interval);
    //   interval = undefined;
    // },
    // isSystemOk: () => {
    //   return isSystemOk;
    // }
  };
};