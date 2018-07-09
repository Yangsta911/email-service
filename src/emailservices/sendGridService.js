import * as https from 'https';
import config from '../config';
import { createLogger } from '../logger/logger';
import dateformat from 'dateformat';

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
  const sendGridEmail = {
    personalizations: [{
      // to: []
      // cc: [],
      // bcc: []
    }],
    from: from || {
      email: 'test@example.com'
    },
    subject: subject || 'subject',
    content: [
      {
        type: 'text/plain',
        value: text || 'Empty email'
      }]
  };
  // logger.debug('SendGridEmail', sendGridEmail);
  const { to, cc, bcc, from, subject, text } = email;
  if (to) {
    sendGridEmail.personalizations[0].to = getReceipts(to);
  }

  if (cc) {
    sendGridEmail.personalizations[0].cc = getReceipts(cc);
  }

  if (bcc) {
    sendGridEmail.personalizations[0].bcc = getReceipts(bcc);
  }

  logger.debug('SendGridEmail', JSON.stringify(sendGridEmail));

  return sendGridEmail;
};

export const createSendGridService = () => {
  return {
    test: async () => {
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

        const req = https.get(options, (resp) => {
          // TODO: check the document of the return code.
          logger.debug('TestResponseCode:', resp.statusCode);

          if (resp.statusCode === 200) {
            return resolve(true);
          } else {
            return reject(false);
          }
        }).on('error', (err) => {
          reject(err);
        });

        // TODO: ideally should have timeout mechanism
        req.end();
      });
    },
    send: async (email) => {

      logger.info('Sending email via send grid');
      const sendGridEmail = buildSendGridEamil(email);

      logger.debug('sendGridEmail', sendGridEmail);
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

      return new Promise((resolve, reject) => {

        const req = https.request(options, (resp) => {
          if (resp.statusCode === 202) {
            return resolve(true);
          } else {
            //TODO: should return the right message from backend
            logger.debug('SendEmailResponseCode:', resp.statusMessage);
            reject(resp.statusMessage);
          }
        });

        req.write(JSON.stringify(sendGridEmail));
        req.end();
      });
    }
  };
};