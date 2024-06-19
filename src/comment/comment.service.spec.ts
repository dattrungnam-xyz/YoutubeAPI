import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from './comment.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Video } from '../video/entities/video.entity';
import { Repository } from 'typeorm';
import { CreateCommentDTO } from './input/createComment.dto';
import { User } from '../users/entities/user.entity';
import { InvalidInputException } from '../exception/customExceptions/InvalidInputException';
import { UpdateCommentDTO } from './input/updateComment.dto';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('CommentService', () => {
  let service: CommentService;
  let commentRepository: Repository<Comment>;
  let videoRepository: Repository<Video>;
  let videoRepositoryToken = getRepositoryToken(Video);
  let commentRepositoryToken = getRepositoryToken(Comment);
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: commentRepositoryToken,
          useValue: {
            findOneBy: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: videoRepositoryToken,
          useValue: {
            findOneBy: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
    videoRepository = module.get<Repository<Video>>(videoRepositoryToken);
    commentRepository = module.get<Repository<Comment>>(commentRepositoryToken);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('videoRepository and commentRepository should be defined', () => {
    expect(videoRepository).toBeDefined();
    expect(commentRepository).toBeDefined();
  });
  describe('createComment', () => {
    let user: User;
    let createCommentDTO: CreateCommentDTO;
    beforeEach(() => {
      user = new User({ id: '1' });
      createCommentDTO = new CreateCommentDTO();
    });
    it('should create a comment with a parent comment', async () => {
      createCommentDTO.content = 'Test comment';
      createCommentDTO.idComment = '1';
      const parentComment = new Comment();
      parentComment.id = '1';
      jest
        .spyOn(commentRepository, 'findOneBy')
        .mockResolvedValue(parentComment);
      jest.spyOn(commentRepository, 'save').mockResolvedValue({
        ...new Comment(),
        content: 'Test comment',
      });
      let result = await service.createComment(user, createCommentDTO);
      expect(commentRepository.findOneBy).toHaveBeenCalledWith({ id: '1' });
      expect(commentRepository.save).toHaveBeenCalled();
      expect(result.content).toBe('Test comment');
    });
    it('should create a comment with a video', async () => {
      createCommentDTO.content = 'Test comment';
      createCommentDTO.idVideo = '1';
      const video = new Video({ id: '1' });

      jest.spyOn(videoRepository, 'findOneBy').mockResolvedValue(video);
      jest.spyOn(commentRepository, 'save').mockResolvedValue({
        ...new Comment(),
        content: 'Test comment',
      });
      let result = await service.createComment(user, createCommentDTO);
      expect(videoRepository.findOneBy).toHaveBeenCalledWith({ id: '1' });
      expect(commentRepository.save).toHaveBeenCalled();
      expect(result.content).toBe('Test comment');
    });
    it('should throw InvalidInputException when neither idComment nor idVideo is provided', async () => {
      createCommentDTO.content = 'Test comment';

      await expect(
        service.createComment(user, createCommentDTO),
      ).rejects.toThrow(InvalidInputException);
    });
  });
  describe('updateComment', () => {
    let mockComment;
    let mockUser;
    let mockAnotherUser;

    beforeAll(() => {
      mockUser = { id: 'user_id' } as User;
      mockComment = { id: 'comment_id', user: mockUser } as Comment;
      mockAnotherUser = { id: 'another_user_id' } as User;
    });
    it('should throw NotFoundException if comment not found', async () => {
      const updateCommentDTO: UpdateCommentDTO = { content: 'Updated comment' };

      jest.spyOn(commentRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.updateComment('comment_id', mockUser, updateCommentDTO),
      ).rejects.toThrow(NotFoundException);

      expect(commentRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'comment_id' },
        relations: ['user'],
      });
    });

    it('should throw ForbiddenException if user is not the owner', async () => {
      const updateCommentDTO: UpdateCommentDTO = { content: 'Updated comment' };
      jest.spyOn(commentRepository, 'findOne').mockResolvedValue({
        ...mockComment,
        user: mockAnotherUser,
      } as Comment);

      await expect(
        service.updateComment('comment_id', mockUser, updateCommentDTO),
      ).rejects.toThrow(ForbiddenException);

      expect(commentRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'comment_id' },
        relations: ['user'],
      });
    });
    it('should update comment', async () => {
      const updateCommentDTO: UpdateCommentDTO = { content: 'Updated comment' };
      jest.spyOn(commentRepository, 'findOne').mockResolvedValue(mockComment);
      jest
        .spyOn(commentRepository, 'save')
        .mockResolvedValue({ ...mockComment, ...updateCommentDTO } as Comment);

      const result = await service.updateComment(
        'comment_id',
        mockUser,
        updateCommentDTO,
      );

      expect(commentRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'comment_id' },
        relations: ['user'],
      });
      expect(commentRepository.save).toHaveBeenCalledWith({
        ...mockComment,
        ...updateCommentDTO,
      });
      expect(result).toEqual({ ...mockComment, ...updateCommentDTO });
    });
  });
  describe('getCommentVideo', () => {
    it('should return comments with sub-comments', async () => {
      const videoId = 'video_id';
      const comments = [{ id: 'comment_1' }, { id: 'comment_2' }] as Comment[];
      const subComments = [
        {
          id: 'sub_comment_1',
        },
        {
          id: 'sub_comment_2',
        },
      ] as Comment[];
      const getCommentVideoSpy = jest.spyOn(service, 'getCommentVideo');
      // jest.spyOn(service, 'getCommentVideo').mockResolvedValue(null);
      jest.spyOn(commentRepository, 'find').mockResolvedValue(comments);
      jest.spyOn(service, 'loadSubComments').mockImplementation((comment) => {
        return Promise.resolve({ ...comment, subComments: [] });
      });
      const result = await service.getCommentVideo(videoId);
      expect(getCommentVideoSpy).toHaveBeenCalledWith(videoId);
      expect(commentRepository.find).toHaveBeenCalledWith({
        relations: ['user', 'video', 'reactions'],
        where: { video: { id: 'video_id' } },
      });
      comments.forEach((comment) => {
        expect(service.loadSubComments).toHaveBeenCalledWith(
          comment as Comment,
        );
      });
    });
  });
});
