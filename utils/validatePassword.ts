export default function validatePassword(password: string): boolean {
    const regexUppercase = /[A-Z]/
    const regexSpecialCarater = /[^A-Za-z0-9]/
    const regexNumber = /\d/

    if (!regexUppercase.test(password)) return false;
  
    if (!regexSpecialCarater.test(password)) return false;
  
    if (!regexNumber.test(password)) return false;
  
    return true;
  }