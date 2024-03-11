import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidInputException extends HttpException {
  constructor() {
    super('Invalid input.', HttpStatus.BAD_REQUEST);
  }
}
