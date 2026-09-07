/** Small, framework-free validation helpers, mirroring the constraints
 * declared on omnibus.api's request DTOs (see AuthController's records).
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

/** Backend enforces 8–72 characters (RegisterCustomerRequest / ResetPasswordRequest). */
export function isValidPassword(value: string): boolean {
  return value.length >= 8 && value.length <= 72;
}

export function passwordsMatch(password: string, confirmPassword: string): boolean {
  return password.length > 0 && password === confirmPassword;
}

/** Backend enforces a minimum age of 18 (see @MinimumAge on RegisterCustomerRequest). */
export function isAtLeastAge(birthDateIso: string, minimumAge: number): boolean {
  const birthDate = new Date(birthDateIso);
  if (Number.isNaN(birthDate.getTime())) {
    return false;
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const hasNotHadBirthdayThisYear =
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate());

  if (hasNotHadBirthdayThisYear) {
    age -= 1;
  }

  return age >= minimumAge;
}

export function isValidOtp(value: string): boolean {
  return /^\d{6}$/.test(value);
}
