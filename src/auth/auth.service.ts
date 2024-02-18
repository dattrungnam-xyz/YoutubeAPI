import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

import { User } from '../users/entities/user.entity';
import { MoreThan, Repository } from 'typeorm';
import { CreateUserDTO } from './input/createUser.dto';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import { ResetPassworDTO } from './input/resetPassword.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailService: MailService,
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
    createUserDTO.passwordConfirm = undefined;
    return this.userRepository.save(
      new User({
        ...createUserDTO,
        password: await this.hasPassword(createUserDTO.password),
      }),
    );
  }
  public async forgotPassword(email: string, host: string) {
    let user = await this.userRepository.findOneBy({
      email: email,
    });
    if (user == null) {
      throw new NotFoundException('There is no user with email address.');
    }
    const token = crypto.randomBytes(32).toString('hex');
    console.log(token);
    await this.userRepository.save(
      new User({
        ...user,
        passwordResetToken: crypto
          .createHash('sha256')
          .update(token)
          .digest('hex'),
        passwordResetExpires: new Date(Date.now() + 10 * 60 * 1000),
      }),
    );
    const resetURL = `${host}/auth/resetPassword/${token}`;
    await this.mailService.sendMailResetPassword(user, resetURL);
    return {
      status: 'success',
      message: 'Token sent to email!',
    };
  }
  public async resetPassword(token: string, resetPassword: ResetPassworDTO) {
    let hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    let user = await this.userRepository.findOne({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpires: MoreThan(new Date()),
      },
    });
    if (user == null) {
      throw new NotFoundException('Token is invalid or has expired');
    }
    await this.userRepository.save(
      new User({
        ...user,
        password: await this.hasPassword(resetPassword.password),
        passwordResetToken: null,
        passwordResetExpires: null,
        passwordChangedAt: new Date(),
      }),
    );
    return {
      status: 'success',
      message: 'Password reset successful!',
    };
  }
  public async updatePassword() {}
}
