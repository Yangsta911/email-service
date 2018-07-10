import config from '../config';

const Logger = require('lamlog');

// TODO: print out to console only, config the logger correctly for product env
export const createLogger = (name) => {
  return new Logger({
    name,
    level: config.logger.level || 'info'
  });
};