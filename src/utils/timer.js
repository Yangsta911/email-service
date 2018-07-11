import { createLogger } from '../logger/logger';

const logger = createLogger('com.siteminder.email-service.timer');

export const createTimer = (callback, timeout = 5000) => {
  if (!callback) {
    return undefined;
  }

  logger.info('Creating timer');
  return setTimeout(() => {
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