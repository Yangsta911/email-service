import { handler } from '../handler';
import { createLogger } from '../../logger/logger';

const logger = createLogger('com.siteminder.email-service.lambda.handler.test');

describe('The email service lambda handler', () => {
  it('should return 400 error for absence of both to,cc,and bcc', () => {
    handler(
      {
        httpMethod: 'POST',
        body: {
          email: {

          }
        }
      },
      {

      },
      (error, response) => {
        logger.debug('Reponse', response);
        expect(response.statusCode).toBe(400);
      }
    );
  });

  it('should return 400 error for invalid format of both to,cc,and bcc', () => {
    handler(
      {
        httpMethod: 'POST',
        body: {
          email: {
            to: 'aa.com',
            cc: 'bb.com',
            bcc: 'cc.com'
          }
        }
      },
      {

      },
      (error, response) => {
        logger.debug('Reponse', response);
        expect(response.statusCode).toBe(400);
      }
    );
  });

  xit(
    'should return 200',
    (done) => {
      handler(
        {
          httpMethod: 'POST',
          body: {
            email: {
              from: 'postmaster@sandboxde9fd8cb91c148ea9bf1d7a8b5cff7c7.mailgun.org',
              subject: 'Hello Q.S. Wang',
              to: '12345@gmail.com',
              bcc: '67890@gmail.com',
              text: 'Congratulations Q.S. Wang, you just sent an email'
            }
          }
        },
        {

        },
        (error, response) => {
          logger.debug('Reponse', response);
          expect(response.statusCode).toBe(200);
          done();
        }
      );
    },
    30000);

  xit('should get status', (done) => {
    handler(
      {
        httpMethod: 'GET',
      },
      {

      },
      (error, response) => {
        logger.debug('Reponse', response);
        expect(response.statusCode).toBe(200);
        done();
      }
    );
  }, 20000);
});