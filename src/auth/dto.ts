export class RegisterDto {
  name!: string;
  email!: string;
  password!: string;
  // optional: allow role assignment for testing; in production restrict this
  role?: 'ADMIN' | 'SUPERVISOR' | 'STAFF';
}
export class LoginDto {
  email!: string;
  password!: string;
}
