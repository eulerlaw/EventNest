const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eventnest',
  JWT_SECRET: process.env.JWT_SECRET || 'eventnest_super_secret_jwt_key_2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  QR_HMAC_SECRET: process.env.QR_HMAC_SECRET || 'eventnest_qr_security_hash_salt_9988',
  SMTP_HOST: process.env.SMTP_HOST || '',
  SMTP_PORT: process.env.SMTP_PORT || 587,
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  EMAIL_FROM: process.env.EMAIL_FROM || 'EventNest Notifications <no-reply@eventnest.gtbit.ac.in>'
};
