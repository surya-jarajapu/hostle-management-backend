// export class RegisterDto {
//   name!: string;
//   email!: string;
//   password!: string;
//   // optional: allow role assignment for testing; in production restrict this
//   role?: 'ADMIN' | 'SUPERVISOR' | 'STAFF';
// }
// export class LoginDto {
//   email!: string;
//   password!: string;
// }

import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsIn,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(4)
  password: string;

  @IsOptional()
  @IsIn(['ADMIN', 'SUPERVISOR', 'STAFF'])
  role?: 'ADMIN' | 'SUPERVISOR' | 'STAFF';
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(4)
  password: string;
}
