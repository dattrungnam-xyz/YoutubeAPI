import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './input/createUser.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async hasPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
  public async comparePassword(
    password: string,
    userpassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, userpassword);
  }
  public async validateUser(username: string, password: string): Promise<User> {
    const user: User = await this.userRepository.findOne({
      where: { username },
    });
    if (!user) {
      this.logger.debug(`User ${username} not found!`);
      throw new UnauthorizedException();
    }
    if (!(await this.comparePassword(password, user.password))) {
      this.logger.debug(`Password incorrect!`);
      throw new UnauthorizedException();
    }

    return user;
  }
  public signToken(user: User): string {
    return this.jwtService.sign({ id: user.id });
  }
  public async createUser(createUserDTO: CreateUserDTO): Promise<User> {
    createUserDTO.passwordComfirm = undefined;
    return this.userRepository.save(
      new User({
        ...createUserDTO,
        password: await this.hasPassword(createUserDTO.password),
      }),
    );
  }
}
