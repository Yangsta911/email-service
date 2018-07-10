import { createSendGridService } from '../sendGridService';

// Exclude from auto unit test, run manually for sendGrid backend test
describe('The mail sendGrid service', () => {
  it('should run the test', async () => {
    const sendGridService = createSendGridService();

    const test = await sendGridService.test();
    expect(test).toBeTruthy();

  });

  // {
  //   personalizations: [{
  //     to: [{
  //       email: 'saddly@gmail.com'
  //     }]
  //   }],
  //   from: {
  //     email: 'test@example.com'
  //   },
  //   subject: 'Sending with SendGrid is Fun',
  //   content: [
  //     {
  //       type: 'text/plain', 
  //       value: 'and easy to do anywhere, even with cURL'
  //     }]
  // }

  it('should send the email', async () => {
    const sendGridService = createSendGridService();

    const email = {
      from: 'test@example.com',
      subject: 'Hello Q.S. Wang',
      // cc: 'saddly@gmail.com',
      to: 'saddly@gmail.com',
      // bcc:'saddly@gmail.com',
      text: 'Sending with SendGrid is Fun'
    };
    const sent = await sendGridService.send(email);
    expect(sent).toBeTruthy();

  }, 20000);

  // xit('should poll the backend status', async (done) =>{
  //   const mailGunService = createSendGridService();

  //   mailGunService.poll();

  //   setTimeout(()=>{
  //     const staus = mailGunService.isSystemOk();

  //     expect(staus).toBeTruthy();
  //     done();
  //   }, 5000)

  // }, 10000);
});