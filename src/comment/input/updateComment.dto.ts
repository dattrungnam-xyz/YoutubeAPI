import { PickType } from '@nestjs/mapped-types';
import { CreateCommentDTO } from './createComment.dto';

export class UpdateCommentDTO extends PickType(CreateCommentDTO, ['content']) {}
