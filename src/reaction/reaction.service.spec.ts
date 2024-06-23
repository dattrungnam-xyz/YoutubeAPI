import { Test, TestingModule } from '@nestjs/testing';
import { ReactionService } from './reaction.service';
import { Repository } from 'typeorm';
import { Reaction } from './entities/reaction.entity';
import { Video } from '../video/entities/video.entity';
import { Comment } from '../comment/entities/comment.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateReactionDTO } from './input/createReaction.dto';
import { User } from '../users/entities/user.entity';

describe('ReactionService', () => {
  let service: ReactionService;
  let commentRepository: Repository<Comment>;
  let videoRepository: Repository<Video>;
  let reactionRepository: Repository<Reaction>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReactionService,
        {
          provide: getRepositoryToken(Comment),
          useValue: {
            findOneBy: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Video),
          useValue: {
            findOneBy: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Reaction),
          useValue: {
            findOne: jest.fn(),
            delete: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ReactionService>(ReactionService);
    videoRepository = module.get<Repository<Video>>(getRepositoryToken(Video));
    commentRepository = module.get<Repository<Comment>>(
      getRepositoryToken(Comment),
    );
    reactionRepository = module.get<Repository<Reaction>>(
      getRepositoryToken(Reaction),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('reaction', () => {
    let mockCreateReactionWithIdCommentDTO: CreateReactionDTO;
    let mockCreateReactionWithIdVideoDTO: CreateReactionDTO;
    let mockUser: User;
    beforeAll(() => {
      mockCreateReactionWithIdCommentDTO = {
        idComment: '1',
      } as CreateReactionDTO;
      mockCreateReactionWithIdVideoDTO = {
        idVideo: '1',
      } as CreateReactionDTO;
      mockUser = {
        id: '1',
      } as User;
    });
    it('should call with user and createReactionDTO', async () => {
      jest.spyOn(service, 'reaction').mockResolvedValue(undefined);
      await service.reaction(mockUser, mockCreateReactionWithIdCommentDTO);
      expect(service.reaction).toHaveBeenCalledWith(
        mockUser,
        mockCreateReactionWithIdCommentDTO,
      );
      await service.reaction(mockUser, mockCreateReactionWithIdVideoDTO);
      expect(service.reaction).toHaveBeenCalledWith(
        mockUser,
        mockCreateReactionWithIdVideoDTO,
      );
    });
    it('should find a comment with idComment', async () => {
      jest
        .spyOn(reactionRepository, 'findOne')
        .mockResolvedValueOnce(undefined);
      await service.reaction(mockUser, mockCreateReactionWithIdCommentDTO);
      expect(reactionRepository.findOne).toHaveBeenCalled();
    });
    it('should delete a reaction if already exist reaction', async () => {
      jest
        .spyOn(reactionRepository, 'findOne')
        .mockResolvedValueOnce({ id: '1' } as Reaction);
      jest.spyOn(reactionRepository, 'delete').mockResolvedValueOnce(undefined);
      await service.reaction(mockUser, mockCreateReactionWithIdCommentDTO);
      expect(reactionRepository.delete).toHaveBeenCalledWith('1');
    });
    it('should find a comment and create a reaction', async () => {
      jest
        .spyOn(reactionRepository, 'findOne')
        .mockResolvedValueOnce(undefined);
      jest
        .spyOn(commentRepository, 'findOneBy')
        .mockResolvedValueOnce({ id: '1' } as Comment);
      let mockResolveValue: Reaction = {
        id: '1',
      } as Reaction;
      jest
        .spyOn(reactionRepository, 'save')
        .mockResolvedValueOnce(mockResolveValue);
      expect(
        await service.reaction(mockUser, mockCreateReactionWithIdCommentDTO),
      ).toBe(mockResolveValue);
      expect(commentRepository.findOneBy).toHaveBeenCalledWith({
        id: mockCreateReactionWithIdCommentDTO.idComment,
      });
      expect(reactionRepository.save).toHaveBeenCalled();
    });
    it('should find a comment with idVideo', async () => {
      jest
        .spyOn(reactionRepository, 'findOne')
        .mockResolvedValueOnce(undefined);
      await service.reaction(mockUser, mockCreateReactionWithIdVideoDTO);
      expect(reactionRepository.findOne).toHaveBeenCalled();
    });
    it('should delete a reaction if already exist reaction', async () => {
      jest
        .spyOn(reactionRepository, 'findOne')
        .mockResolvedValueOnce({ id: '1' } as Reaction);
      jest.spyOn(reactionRepository, 'delete').mockResolvedValueOnce(undefined);
      await service.reaction(mockUser, mockCreateReactionWithIdVideoDTO);
      expect(reactionRepository.delete).toHaveBeenCalledWith('1');
    });
    it('should find a video and create a reaction', async () => {
      jest
        .spyOn(reactionRepository, 'findOne')
        .mockResolvedValueOnce(undefined);
      jest
        .spyOn(videoRepository, 'findOneBy')
        .mockResolvedValueOnce({ id: '1' } as Video);
      let mockResolveValue: Reaction = {
        id: '1',
      } as Reaction;
      jest
        .spyOn(reactionRepository, 'save')
        .mockResolvedValueOnce(mockResolveValue);
      expect(
        await service.reaction(mockUser, mockCreateReactionWithIdVideoDTO),
      ).toBe(mockResolveValue);
      expect(videoRepository.findOneBy).toHaveBeenCalledWith({
        id: mockCreateReactionWithIdVideoDTO.idVideo,
      });
      expect(reactionRepository.save).toHaveBeenCalled();
    });
  });
});
