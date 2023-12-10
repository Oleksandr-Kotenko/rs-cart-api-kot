import { Injectable } from '@nestjs/common';

import { v4 as uuidv4 } from 'uuid';

import { User } from '../models';
import { UserEntity } from '../../database/entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async findOne(name: string): Promise<UserEntity> {
    return this.userRepository.findOneBy({ name });
  }

  async createOne({ name, password }: User): Promise<UserEntity> {
    const id = uuidv4();
    const newUser = { id: name || id, name, password };
    const user = this.userRepository.create(newUser);

    return this.userRepository.save(user);
  }
}
