
import { createLogger } from '../logger/logger';

const logger = createLogger('com.siteminder.email-service.emailServices');

export const findGoodService = async (services) => {

  if (!services || !Array.isArray(services) || services.length == 0) {
    const error = new Error('No email service configured');
    error.name = 'NoServiceFoundException';
    throw error;
  }

  // TODO: This is probably not the best solution even with the request timeout mechanism
  for (const service of services) {
    const result = await service.test();

    if (result) {
      logger.debug('Found good service', service.name());
      return service;
    }
  }
};

export const send = async (email, services) => {
  const service = await findGoodService(services);

  if (!service) {
    logger.debug('No good service');
    const error = new Error('All services are down at the moment, please try later');
    error.name = 'NoGoodServiceFoundException';

    throw error;
  }

  return service.send(email);
};

