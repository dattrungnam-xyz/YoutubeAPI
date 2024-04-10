import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { TokenOutput } from './output/token.output';
import { LoginInput } from './input/login.input';
import { CreateUserDTO } from './input/createUser.dto';

import { ForgotPassWordDTO } from './input/forgotPassword.dto';
import { MessageOutput } from './output/Message.output';
import { ResetPassworDTO } from './input/resetPassword.dto';
import { TokenInput } from './input/token.input';
import { User } from 'src/users/entities/user.entity';
import { UpdatePasswordDTO } from './input/updatePassword.dto';
import { CurrentUser } from 'src/decorator/currentUser.decorator';
import { UseGuards } from '@nestjs/common';
import { GQLJwtAuthGuard } from './authGuardGQL.jwt';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => TokenOutput, { name: 'login' })
  public async login(
    @Args('input', { type: () => LoginInput, name: 'loginInput' })
    input: LoginInput,
  ): Promise<TokenOutput> {
    return new TokenOutput({
      token: this.authService.signToken(
        await this.authService.validateUser(input.username, input.password),
      ),
    });
  }

  @Mutation(() => TokenOutput, { name: 'signup' })
  public async signup(
    @Args('input', { type: () => CreateUserDTO, name: 'signupInput' })
    input: CreateUserDTO,
  ): Promise<TokenOutput> {
    let user = await this.authService.createUser(input);
    return {
      token: this.authService.signToken(user),
    };
  }

  @Mutation(() => MessageOutput, { name: 'forgotPassword' })
  public async forgotPassword(
    @Args('input', {
      type: () => ForgotPassWordDTO,
      name: 'forgotPasswordInput',
    })
    input: ForgotPassWordDTO,
  ): Promise<MessageOutput> {
    return this.authService.forgotPassword(input.email, '');
  }

  @Mutation(() => MessageOutput, { name: 'resetPassword' })
  public async resetPassword(
    @Args('input', {
      type: () => ResetPassworDTO,
      name: 'resetPasswordInput',
    })
    input: ResetPassworDTO,
    @Args('token', {
      type: () => TokenInput,
      name: 'tokenInput',
    })
    token: TokenInput,
  ): Promise<MessageOutput> {
    return this.authService.resetPassword(token.token, input);
  }

  @Mutation(() => User, { name: 'updatePassword' })
  @UseGuards(GQLJwtAuthGuard)
  public async updatePassword(
    @Args('input', {
      type: () => UpdatePasswordDTO,
      name: 'updatePasswordInput',
    })
    input: UpdatePasswordDTO,
    @CurrentUser() user: User,
  ): Promise<User> {
    return this.authService.updatePassword(user.id, input);
  }
}
