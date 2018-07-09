import * as EmailValidator from 'email-validator';
 
export const validateEmail = (email) =>{
  return EmailValidator.validate(email);
};

export const validateMultipleEmailReceipts = (emails) =>{
  if(!emails){
    return false;
  }
  const emailArray = emails.split(',');

  const hasInvalidEmail = emailArray.find((value)=> {
    return !validateEmail(value);
  });
  
  return !hasInvalidEmail;
};