import { handler } from '../handler';
import { createLogger } from '../../logger/logger';

const logger = createLogger('com.siteminder.emailServices.lambda.handler.test');

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

  xit('should return 200', (done) => {
    handler(
      {
        httpMethod: 'POST',
        body: {
          // email: {
          //   to: 'saddly@gmail.com',
          //   cc: 'bb.com',
          //   bcc:'cc.com',
          //   from: 'Mailgun Sandbox <postmaster@sandboxde9fd8cb91c148ea9bf1d7a8b5cff7c7.mailgun.org>',
          //   subject: 'Hello Q.S. Wang',
          // }
          email: {
            from: 'Mailgun Sandbox <postmaster@sandboxde9fd8cb91c148ea9bf1d7a8b5cff7c7.mailgun.org>',
            subject: 'Hello Q.S. Wang',
            to: '',

            bcc: 'saddly@gmail.com',
            text: 'Congratulations Q.S. Wang, you just sent an email with Mailgun!  You are truly awesome!'
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
  });
});