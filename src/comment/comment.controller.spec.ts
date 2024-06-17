import { Test, TestingModule } from '@nestjs/testing';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

import { UpdateCommentDTO } from './input/updateComment.dto';

import { Comment } from './entities/comment.entity';

import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from '../auth/authGuard.jwt';
import { User } from '../users/entities/user.entity';
import { CreateCommentDTO } from './input/createComment.dto';

describe('CommentController', () => {
  let controller: CommentController;
  let service: CommentService;
  let mockCommentServie = {
    createComment: jest.fn(),
    getComment: jest.fn(),
    getCommentVideo: jest.fn(),
    updateComment: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentController],
      providers: [
        {
          provide: CommentService,
          useValue: mockCommentServie,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<CommentController>(CommentController);
    service = module.get<CommentService>(CommentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('createComment', () => {
    it('should create a comment', async () => {
      const createCommentDTO: CreateCommentDTO = { content: 'New comment' };
      const user: User = { id: '1', username: 'testuser' } as User;
      const result = {
        id: '1',
        ...createCommentDTO,
      } as Comment;

      jest.spyOn(service, 'createComment').mockResolvedValue(result);

      expect(await controller.createComment(user, createCommentDTO)).toBe(
        result,
      );
      expect(service.createComment).toHaveBeenCalledWith(
        user,
        createCommentDTO,
      );
    });
  });
  describe('updateComment', () => {
    it('should update a comment', async () => {
      const id = '1';
      const updateCommentDTO: UpdateCommentDTO = {
        content: 'Updated content',
      };
      const user: User = { id: '1', username: 'testuser' } as User;
      const result = { id, ...updateCommentDTO } as Comment;

      jest.spyOn(service, 'updateComment').mockResolvedValue(result);

      expect(await controller.updateComment(id, updateCommentDTO, user)).toBe(
        result,
      );
      expect(service.updateComment).toHaveBeenCalledWith(
        id,
        user,
        updateCommentDTO,
      );
    });

    it('should handle errors', async () => {
      const id = '1';
      const updateCommentDTO: UpdateCommentDTO = {
        content: 'Updated content',
      };
      const user: User = { id: '1', username: 'testuser' } as User;

      jest
        .spyOn(service, 'updateComment')
        .mockRejectedValue(new Error('Error updating comment'));

      await expect(
        controller.updateComment(id, updateCommentDTO, user),
      ).rejects.toThrow('Error updating comment');
    });
  });
  describe('getCommentVideo', () => {
    it('should return the video comment', async () => {
      const id = '1';
      const result = [
        {
          id: '1',
          content: 'comment content 1',
          user: null,
        },
        {
          id: '2',
          content: 'comment fcontent 2',
          user: null,
        },
      ] as Comment[];

      jest.spyOn(service, 'getCommentVideo').mockResolvedValue(result);

      expect(await controller.getCommentVideo(id)).toBe(result);
      expect(service.getCommentVideo).toHaveBeenCalledWith(id);
    });
  });
});
