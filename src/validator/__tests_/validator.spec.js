import { validateEmail, validateMultipleEmailReceipts } from '../validator';

describe('validator', () => {
  it('should validate a correct signle email', () => {
    expect(validateEmail('a@a.com')).toBeTruthy();
  });

  it('should return false for  invalid email', () => {
    expect(validateEmail('aa.com')).toBeFalsy();
  });

  it('should return handle undefined case', () => {
    expect(validateEmail(undefined)).toBeFalsy();
  });

  it('should return handle empty string case', () => {
    expect(validateEmail('')).toBeFalsy();
  });

  it('should return false for empyt receipts', () => {
    expect(validateMultipleEmailReceipts('')).toBeFalsy();
  });

  it('should return faslse for undefined receipts', () => {
    expect(validateMultipleEmailReceipts(undefined)).toBeFalsy();
  });

  it('should return true for multiple receipts', () => {
    expect(validateMultipleEmailReceipts('a@a.com,b@b.com')).toBeTruthy();
  });

  it('should return true for only one email in the multiple receipts string', () => {
    expect(validateMultipleEmailReceipts('a@a.com')).toBeTruthy();
  });

  it('should return true for only one email in the multiple receipts string with extra comma', () => {
    expect(validateMultipleEmailReceipts('a@a.com,')).toBeTruthy();
  });

  // TODO: support email with name
  xit('should return true for email with name', () => {
    expect(validateMultipleEmailReceipts('Q.S. Wang <a@a.com>')).toBeTruthy();
  });
});