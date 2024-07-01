import { Test, TestingModule } from '@nestjs/testing';
import { VideoService } from './video.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Video } from './entities/video.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateVideoDTO } from './input/createVideo.dto';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { UpdateVideoDTO } from './input/updateVideo.dto';

describe('VideoService', () => {
  let service: VideoService;
  let videoRepository: Repository<Video>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VideoService,
        {
          provide: getRepositoryToken(Video),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
            softDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<VideoService>(VideoService);
    videoRepository = module.get<Repository<Video>>(getRepositoryToken(Video));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('createVideo', () => {
    let mockUser: User;
    let mockCreateVideoDTO: CreateVideoDTO;
    let mockVideo: Video;
    beforeAll(() => {
      mockUser = { id: 'user id' } as User;
      mockCreateVideoDTO = { description: 'description', title: 'title' };
      mockVideo = { id: 'video id' } as Video;
    });
    it('Should create a video', async () => {
      jest.spyOn(videoRepository, 'save').mockResolvedValueOnce(mockVideo);
      let spyService = jest.spyOn(service, 'createVideo');
      let result = await service.createVideo(mockUser, mockCreateVideoDTO);
      expect(spyService).toHaveBeenCalledWith(mockUser, mockCreateVideoDTO);
      expect(videoRepository.save).toHaveBeenCalled();
      expect(result).toBe(mockVideo);
    });
  });
  describe('updateVideo', () => {
    let mockUser: User;
    let mockId: string;
    let mockUpdateVideoDTO: UpdateVideoDTO;
    let mockVideo: Video;

    beforeAll(() => {
      mockUser = { id: 'user id' } as User;
      mockId = 'video id';
      mockUpdateVideoDTO = {
        description: 'description',
      } as UpdateVideoDTO;
      mockVideo = new Video();
      mockVideo.user = Promise.resolve({ id: 'another user id' } as User);
    });
    it('should throw NotFoundException if video is not found', async () => {
      jest.spyOn(videoRepository, 'findOne').mockResolvedValue(null);
      await expect(
        service.updateVideo(mockId, mockUser, mockUpdateVideoDTO),
      ).rejects.toThrow(NotFoundException);
    });
    it('should throw ForbiddenException if user is not the owner of the video', async () => {
      jest.spyOn(videoRepository, 'findOne').mockResolvedValueOnce(mockVideo);

      await expect(
        service.updateVideo(mockId, mockUser, mockUpdateVideoDTO),
      ).rejects.toThrow(ForbiddenException);
    });
    it('should update video', async () => {
      mockVideo.user = Promise.resolve({ id: 'user id' } as User);
      jest.spyOn(videoRepository, 'findOne').mockResolvedValueOnce(mockVideo);
      let mockResolveVideo = { ...mockVideo, ...mockUpdateVideoDTO } as Video;
      jest.spyOn(videoRepository, 'save').mockResolvedValue(mockResolveVideo);
      let result = await service.updateVideo(
        mockId,
        mockUser,
        mockUpdateVideoDTO,
      );

      expect(videoRepository.save).toHaveBeenCalled();
      expect(result).toEqual(mockResolveVideo);
    });
  });
  describe('deleteVideo', () => {
    let mockUser: User;
    let mockId: string;
    let mockVideo: Video;

    beforeAll(() => {
      mockUser = { id: 'user id' } as User;
      mockId = 'video id';

      mockVideo = new Video();
      mockVideo.user = Promise.resolve({ id: 'another user id' } as User);
    });
    it('should throw NotFoundException if video is not found', async () => {
      jest.spyOn(videoRepository, 'findOne').mockResolvedValue(null);
      await expect(service.deleteVideo(mockId, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
    it('should throw ForbiddenException if user is not the owner of the video', async () => {
      jest.spyOn(videoRepository, 'findOne').mockResolvedValueOnce(mockVideo);

      await expect(service.deleteVideo(mockId, mockUser)).rejects.toThrow(
        ForbiddenException,
      );
    });
    it('should delete video', async () => {
      mockVideo.user = Promise.resolve({ id: 'user id' } as User);
      jest.spyOn(videoRepository, 'findOne').mockResolvedValueOnce(mockVideo);

      jest.spyOn(videoRepository, 'softDelete').mockResolvedValue(undefined);
      let result = await service.deleteVideo(mockId, mockUser);

      expect(videoRepository.softDelete).toHaveBeenCalledWith(mockId);
    });
  });
  describe('getVideo', () => {
    let mockId: string;
    let mockVideo: Video;
    beforeAll(() => {
      mockId = 'video id';
      mockVideo = { id: 'video id' } as Video;
    });

    it('Should get a video', async () => {
      jest.spyOn(videoRepository, 'findOne').mockResolvedValueOnce(mockVideo);
      let spyService = jest.spyOn(service, 'getVideo');
      let result = await service.getVideo(mockId);

      expect(spyService).toHaveBeenCalledWith(mockId);

      expect(videoRepository.findOne).toHaveBeenCalled();
      expect(result).toBe(mockVideo);
    });
  });
});
