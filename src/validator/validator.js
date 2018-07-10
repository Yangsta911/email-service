import * as EmailValidator from 'email-validator';

export const validateEmail = (email) => {
  return EmailValidator.validate(email);
};

export const validateMultipleEmailReceipts = (emails) => {
  if (!emails || !isString(emails)) {
    return false;
  }
  const emailArray = emails.split(',');

  const hasInvalidEmail = emailArray.find((value) => {
    return !validateEmail(value);
  });

  return !hasInvalidEmail;
};

export const isString = (value) => {
  return (typeof value === 'string' || value instanceof String);
};