import * as https from 'https';
import * as querystring from 'querystring';
import config from '../config';
import { createLogger } from '../logger/logger';

const logger = createLogger('com.siteminder.mailGunService');

export const createMailGunService = () => {
  return {
    test: async () => {
      logger.debug('Pinging the mail gun backend');
      return new Promise((resolve, reject) => {
        
        // TODO: the options should be passed as parameter
        const options = {
          host: config.mailGun.host,
          port: config.mailGun.port,
          path: `/${config.mailGun.version}/${config.mailGun.domain}/stats`,
          auth: `${config.mailGun.user}:${config.mailGun.pass}`
        };

        logger.debug('Optons', options);
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
      logger.debug('email',email);
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
        const req = https.request(options, (resp) => {
          logger.debug('SendEmailResponseCode:', resp.statusCode);

          if (resp.statusCode === 200) {
            return resolve(true);
          } else {
            //TODO: should return the right message from backend
            logger.debug('SendEmailResponseCode:', resp.statusMessage);
            return reject(false);
          }
        });

        req.write(postData);
        req.end();
      });
    }
  };
};