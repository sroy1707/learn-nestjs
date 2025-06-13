import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { getPaginationParams } from 'src/common/pagination';
import { CreateUserDto } from './dto/create-user.dto';
import { omitFields } from 'src/common/omit';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create({
    name,
    email,
    phone,
    password,
    is_active = true,
  }: CreateUserDto) {
    const emailExists = await this.userRepo.findOne({ where: { email } });
    const phoneExists = await this.userRepo.findOne({ where: { phone } });

    if (emailExists || phoneExists)
      throw new BadRequestException(
        phoneExists ? 'Phone number already exists' : 'Email alreday exist',
      );

    const hashedPassword = await bcrypt.hash(password, 6);

    const savedUser = await this.userRepo.save({
      name,
      email,
      phone,
      password: hashedPassword,
      is_active,
    });

    const user = omitFields(savedUser, [
      'password',
      'createdAt',
      'is_active',
      'updatedAt',
      'id',
    ]);

    return { message: 'User added successfully', data: user };
  }

  async findAll(page?: number, limit?: number) {
    const {
      skip,
      limit: take,
      page: currentPage,
    } = getPaginationParams({ page, limit });

    const [data, total] = await this.userRepo.findAndCount({
      where: { is_active: true },
      skip,
      take,
      // order: { created_at: 'DESC' },
    });

    if (!data.length) {
      throw new NotFoundException({ message: 'No data found' });
    }

    const sanitizedData = data.map((user) =>
      omitFields(user, [
        'password',
        'createdAt',
        'updatedAt',
        'is_active',
        'id',
      ]),
    );

    return {
      status: 200,
      data: sanitizedData,
      total,
      page: currentPage,
      limit: take,
      totalPages: Math.ceil(total / take),
    };
  }

  async findOne(id: number) {
    const data = await this.userRepo.findOne({
      where: { id, is_active: true },
    });
    if (!data) throw new NotFoundException({ message: `Data Not Found` });

    const user = omitFields(data, [
      'password',
      'createdAt',
      'is_active',
      'updatedAt',
      'id',
    ]);
    return user;
  }

  // It is properly not working it works for admin
  async update(id: number, updateUserDto: UpdateUserDto) {
    const data = await this.userRepo.update({ id }, updateUserDto);
    if (!data)
      throw new NotFoundException({ status: 204, message: `User not found` });
    return {
      message: 'User updated successfully!',
      data: updateUserDto,
    };
  }

  async remove(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException({
        message: 'User not found',
      });
    }

    await this.userRepo.update(id, { is_active: false });

    return {
      message: 'User deleted successfully!',
    };
  }
}
