import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './users.repository';
import { updateProfileDTO } from './input/updateProfile.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async updateProfile(user: User, updateProfileDTO: updateProfileDTO) {
    return await this.userRepository.save(
      new User({ ...user, ...updateProfileDTO }),
    );
  }
}
