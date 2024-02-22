import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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

  async updateProfile(
    user: User,
    updateProfileDTO: updateProfileDTO,
  ): Promise<User> {
    return await this.userRepository.save(
      new User({ ...user, ...updateProfileDTO }),
    );
  }
  async subcribe(user: User, id: string): Promise<User> {
    let newUser = await this.userRepository.findOneBy({ id });
    let currUser = await this.userRepository.findOne({
      where: { id },
      relations: ['subcribes', 'subcribers'],
    });
    if (!currUser.subcribes) currUser.subcribes = [];
    if (
      currUser.subcribes.every((user) => {
        return user.id != id;
      })
    ) {
      currUser.subcribes = [...currUser.subcribes, newUser];
    }
    return await this.userRepository.save(currUser);
  }

  async unsubcribe(user: User, id: string): Promise<User> {
    let currUser = await this.userRepository.findOne({
      where: {
        id: user.id,
      },
      relations: ['subcribes', 'subcribers'],
    });
    let newUser = await this.userRepository.findOneBy({ id });
    if (!newUser) throw new UnauthorizedException('User does not exist');
    if (!currUser.subcribes) currUser.subcribes = [];
    currUser.subcribes = currUser.subcribes.filter((it) => {
      return it.id != id;
    });
    return await this.userRepository.save(currUser);
  }

  async testGetUser(id) {
    return await this.userRepository.findOne({
      where: { id },
      relations: ['subcribers'],
    });
  }
}
