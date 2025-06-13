/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name should not be empty' })
  @IsString({ message: 'Name must be a string' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  name: string;

  @IsNotEmpty({ message: 'Email should not be empty' })
  @IsString({ message: 'Email must be a string' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  email: string;

  @IsNotEmpty({ message: 'Phone number should not be empty' })
  @IsString({ message: 'Phone number must be a string' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @Matches(/^[6-9]\d{9}$/, {
    message: 'Phone number must be a valid 10-digit',
  })
  phone: string;

  @IsNotEmpty({ message: 'Password should not be empty' })
  @IsString({ message: 'Password must be a string' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  password: string;

  @IsNotEmpty({ message: 'is_active should not be empty' })
  @IsBoolean({ message: 'is_active must be a boolean value' })
  is_active: boolean = true;
}
