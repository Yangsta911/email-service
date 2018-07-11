import { createSendGridService } from '../sendGridService';

// Exclude from auto unit test, run manually for sendGrid backend test
describe('The mail sendGrid service', () => {
  xit('should run the test', async () => {
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

  xit('should send the email', async () => {
    const sendGridService = createSendGridService();

    const email = {
      from: 'aabb@gmail.com',
      subject: 'Hello Q.S. Wang',
      to: 'abcd@hotmail.com',
      cc: '123456@gmail.com',
      bcc:'cdef@gmail.com, fgh@gmail.com',
      text: 'Sending with api is Fun'
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