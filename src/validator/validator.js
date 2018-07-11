import * as validator from 'validator';

export const validateEmail = (email) => {
  return email &&  validator.isEmail(email);
};

export const validateMultipleEmailReceipts = (emails) => {
  if ( !emails || validator.isEmpty(emails)) {
    return false;
  }
  const emailArray = emails.split(',');

  const hasInvalidEmail = emailArray.find((value) => {
    return !validator.isEmail(value);
  });

  return !hasInvalidEmail;
};

export const isEmptyString= (value) => {
  return validator.isEmpty(value);
};