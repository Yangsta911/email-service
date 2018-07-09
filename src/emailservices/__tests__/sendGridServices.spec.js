import { createSendGridService } from '../sendGridService';

// Exclude from auto unit test, run manually for sendGrid backend test
xdescribe('The mail sendGrid service', () => {
  it('should run the test', async () => {
    const sendGridService = createSendGridService();

    const test = await sendGridService.test();
    expect(test).toBeTruthy();

  });

  it('should send the email', async () => {
    const sendGridService = createSendGridService();

    // const t = {
    //   personalizations: [{
    //     to: [{
    //       email:
    //         'saddly@gmail.com'
    //     }]
    //   }],
    //   from: {
    //     email:
    //       'a.a.com'
    //   },
    //   subject: 'abc',
    //   content: [
    //     {
    //       type: 'text/plain',
    //       value: ''
    //     }
    //   ]
    // }

    const sent = await sendGridService.send({
      personalizations: [{
        to: [{
          email: 'saddly@gmail.com'
        }]
      }],
      from: {
        email: 'test@example.com'
      },
      subject: 'Sending with SendGrid is Fun',
      content: [
        {
          type: 'text/plain', 
          value: 'and easy to do anywhere, even with cURL'
        }]
    });
    expect(sent).toBeTruthy();

  });
});