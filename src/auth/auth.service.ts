import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service.js';
import * as bcrypt from 'bcrypt';
import { LoginCredentialsDto } from './dto/credentials.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(credentials: LoginCredentialsDto) {
    const { email, password } = credentials;
    const user = await this.usersService.getUserByEmail(email);
    if (!user) throw new UnauthorizedException('Wrong credentials');

    const match = await bcrypt.compare(password.toString(), user.password);
    if (!match) throw new UnauthorizedException('Wrong credentials');

    const secret = this.configService.get<string>('security.jwtSecret');
    const token = this.jwtService.sign(
      { userId: user._id, email: user.email, role: user.role },
      { secret, expiresIn: '24h' },
    );

    return { accessToken: token };
  }

  async validateToken(token: string) {
    try {
      const secret = this.configService.get<string>('security.jwtSecret');
      const payload = this.jwtService.verify(token, { secret });
      return { success: true, userId: payload.userId };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}
