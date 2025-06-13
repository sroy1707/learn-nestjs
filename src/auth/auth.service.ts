import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { omitFields } from 'src/common/omit';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async create(createAuthDto: CreateAuthDto) {
    const { email, password } = createAuthDto;
    const user = await this.userService.findByEmail(email);

    if (!user || !user.is_active) {
      throw new BadRequestException('Invalid email');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');
    }

    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    const userInfo = omitFields(user, [
      'password',
      'createdAt',
      'updatedAt',
      'is_active',
      'id',
    ]);

    return {
      status: 200,
      message: 'Login successful',
      access_token: token,
      user: userInfo,
    };
  }
}
