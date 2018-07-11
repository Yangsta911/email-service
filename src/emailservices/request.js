import {createLogger} from '../logger/logger';

const logger = createLogger('com.siteminder.email-service.request');

export const abortRequest = (req) =>{
  if(!req){
    return;
  }

  req.on('error', () => {
    //abort caused socket error, sawllow it here.
  });
  req.abort();
  logger.debug('requst aborted');
};