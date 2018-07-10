import { createLogger } from '../logger/logger';

const logger = createLogger('com.siteminder.timer');

export const createTimer = (req, callback, timeout = 5000) => {
  if (!req) {
    return undefined;
  }

  logger.info('creating timer');
  return setTimeout(() => {
    req.on('error', () => {
      //abort caused socket error, sawllow it here.
    });
    req.abort();
    logger.debug('requst aborted');
    if (callback) {
      callback();
    }
  }, timeout);
};

export const clearTimer = (timer) => {
  if (timer) {
    logger.debug('Clearing timer');
    clearTimeout(timer);
  }
  return undefined;
};