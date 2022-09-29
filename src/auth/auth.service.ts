import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserService } from './../user/user.service';
import { CreateUserDto } from './../user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...rest } = user;
      return rest;
    }

    return null;
  }

  async register(createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  async login(user: any) {
    const payload = {
      type: user.type,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      sub: user.id,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
