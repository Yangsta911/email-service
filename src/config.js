// config.js
const env = process.env.NODE_ENV; // 'dev' or 'test'

const dev = {
  app: {
    port: parseInt(process.env.DEV_APP_PORT) || 3000
  },
  logger: {
    format: 'dev',
    level: 'debug'
  },
  mailGun:{
    host: 'api.mailgun.net',
    port: 443,
    version: 'v3',
    domain: 'sandboxde9fd8cb91c148ea9bf1d7a8b5cff7c7.mailgun.org',
    user: process.env.MAIL_GUN_USER,
    pass: process.env.MAIL_GUN_PASS
  },
  sendGrid:{
    host: 'api.sendgrid.com',
    port: 443,
    version: 'v3',
    // domain: 'sandboxde9fd8cb91c148ea9bf1d7a8b5cff7c7.mailgun.org',
    // user: process.env.MAIL_GUN_USER,
    token: process.env.SEND_GRID_TOKEN
  }
};
const prod = {
  app: {
    port: parseInt(process.env.APP_PORT) || 80
  },
  logger: {
    format: 'combined',
    level: 'info'
  }
};

const config = {
  dev,
  prod,
};

export default config[env] || dev;