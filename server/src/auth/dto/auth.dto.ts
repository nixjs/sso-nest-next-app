import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Email invalid' })
  @IsNotEmpty({ message: 'Email not empty' })
  email: string;

  @IsNotEmpty({ message: 'Username not empty' })
  username: string;

  @IsNotEmpty({ message: 'Password not empty' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  name: string;
}

export class LoginDto {
  @IsNotEmpty({ message: 'Email or username not empty' })
  identifier: string;

  @IsNotEmpty({ message: 'Password not empty' })
  password: string;
}
