export const TOKEN = "TOKEN";

export function validateEmail(email) {
  return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
}
