import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './users.schema.js';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import UserDto from './user.dto.js';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private UserModel: Model<User>) {}

  async getUserByEmail(email: string) {
    return this.UserModel.findOne({ email });
  }

  async getUserById(userId: string) {
    return this.UserModel.findById(userId);
  }

  async createUser(user: UserDto) {
    user.password = await bcrypt.hash(user.password.toString(), 10);
    return this.UserModel.create(user);
  }

  async countUsers() {
    return this.UserModel.countDocuments();
  }
}
