import * as https from 'https';
import config from '../config';
import { createLogger } from '../logger/logger';
import dateformat from 'dateformat';
import { createTimer, clearTimer } from '../utils/timer';

const logger = createLogger('com.siteminder.sendGrid');

const getReceipts = (emails) => {
  const emailArray = emails.split(',');

  const emailObjects = emailArray.map((value) => {
    return {
      email: value
    };
  });

  logger.debug('objects', emailObjects);
  return emailObjects;
};

const buildSendGridEamil = (email) => {
  // TODO: read the doc to understand the user code of muliptle personalizations


  const { to, cc, bcc, from, subject, text } = email;
  // logger.debug('email', subject);
  const sendGridEmail = {
    personalizations: [{
      // to: []
      // cc: [],
      // bcc: []
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
  logger.info('Sending email via send grid');
  const sendGridEmail = buildSendGridEamil(email);

  logger.debug('Email to send', sendGridEmail);
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

  logger.debug('Sending email via send grid', options);
  let timer;
  return new Promise((resolve, reject) => {
    const req = https.request(options, (resp) => {
      clearTimer(timer);

      if (resp.statusCode === 202) {
        resp.resume();
        return resolve(true);
      } else {
        //TODO: should return the right message from backend
        logger.debug('SendEmailResponseCode:', resp.statusMessage);
        resp.resume();
        reject(resp.statusMessage);
      }
    });

    req.write(JSON.stringify(sendGridEmail));
    req.end();
    timer = createTimer(
      req,
      () => {
        return resolve(false);
      },
      10000);
  });
};

const doTestBackend = async () => {
  logger.debug('Pinging the send grid backend');
  return new Promise((resolve, reject) => {
    const day = dateformat(new Date(), 'yyyy-mm-dd');

    // TODO: the options should be passed as parameter
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
        return resolve(false);
      }
    }).on('error', (err) => {
      reject(err);
    });
    req.end();
    // request time out monitor
    timer = createTimer(req, () => {
      return resolve(false);
    });

  });
};

let isSystemOk = false;
export const createSendGridService = () => {
  return {
    test: async () => {
      if (!isSystemOk) {
        isSystemOk = await doTestBackend();
      }
      return isSystemOk;
    },
    send: async (email) => {
      return doSendEmail(email);
    },
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