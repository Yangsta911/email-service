import { createMailGunService } from '../mailGunService';

// Exclude from auto unit test, run manually for mailGun backend test
describe('The mailGunService', () => {
  xit('should run the test', async () => {
    const mailGunService = createMailGunService();

    const test = await mailGunService.test();
    expect(test).toBeTruthy();

  });

  xit('should send the email', async () => {
    const mailGunService = createMailGunService();

    const sent = await mailGunService.send({
      from: 'Mailgun Sandbox <postmaster@sandboxde9fd8cb91c148ea9bf1d7a8b5cff7c7.mailgun.org>',
      subject: 'Hello Q.S. Wang',
      // cc: 'saddly@gmail.com',
      to: 'abcd@gmail.com',
      // bcc:'saddly@gmail.com',
      text: 'Congratulations Q.S. Wang, you just sent an email with Mailgun!  You are truly awesome!'
    });
    expect(sent).toBeTruthy();

  });

  // xit('should poll the backend status', async (done) =>{
  //   const mailGunService = createMailGunService();

  //   mailGunService.poll();

  //   setTimeout(()=>{
  //     const staus = mailGunService.isSystemOk();

  //     expect(staus).toBeTruthy();
  //     done();
  //   }, 5000)

  // }, 10000);
});