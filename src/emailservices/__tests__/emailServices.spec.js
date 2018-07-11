import { findGoodService, send } from '../emailServices';
import { createLogger } from '../../logger/logger';

const logger = createLogger('com.siteminder.email-service.emailServices.test');

describe('email services', () => {
  it('should fiind the second servie', async () => {
    const service1 = {
      test: async () => {
        Promise.reject(false);
      },
      name: () => {
        return 'service1';
      }
    };

    const service2 = {
      test: async () => {
        logger.debug('Testing service2');
        return Promise.resolve(true);
      },
      name: () => {
        return 'service2';
      }
    };

    const dummyServices = [
      service1,
      service2
    ];

    const service = await findGoodService(dummyServices);
    expect(service).toBe(service2);
  });

  it('should find the first service', async () => {
    const service1 = {
      test: async () => {
        return Promise.resolve(true);
      },
      name: () => {
        return 'service1';
      }
    };

    const service2 = {
      test: async () => {
        logger.debug('Testing service2');
        return Promise.resolve(true);
      },
      name: () => {
        return 'service2';
      }
    };

    const dummyServices = [
      service1,
      service2
    ];

    const service = await findGoodService(dummyServices);
    expect(service).toBe(service1);

  });

  it('should send  the email', async () => {
    const mockSend = jest.fn();
    const service1 = {
      test: async () => {
        return Promise.resolve(true);
      },
      send: async () => {
        mockSend();
        return Promise.resolve();
      },
      name: () => {
        return 'service1';
      }
    };

    const service2 = {
      test: async () => {
        logger.debug('Testing service2');
        return Promise.resolve(true);
      },
      name: () => {
        return 'service2';
      }
    };
    const dummyServices = [
      service1,
      service2
    ];

    try {
      await send({}, dummyServices);
      expect(mockSend.mock.calls.length).toBe(1);
    } catch (error) {
      logger.error('Send Test failed', error);
      throw error;
    }
  });
});