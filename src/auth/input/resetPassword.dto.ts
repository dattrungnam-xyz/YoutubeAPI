import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateUserDTO } from './createUser.dto';

export class ResetPassworDTO extends PickType(CreateUserDTO, [
  'password',
  'passwordConfirm',
] as const) {}
