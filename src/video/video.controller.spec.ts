import { Test, TestingModule } from '@nestjs/testing';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { JwtAuthGuard } from '../auth/authGuard.jwt';
import { User } from '../users/entities/user.entity';
import { CreateVideoDTO } from './input/createVideo.dto';
import { InvalidInputException } from '../exception/customExceptions/InvalidInputException';
import { Video } from './entities/video.entity';
import { UpdateVideoDTO } from './input/updateVideo.dto';

describe('VideoController', () => {
  let controller: VideoController;
  let service: VideoService;
  let cloudinaryService: CloudinaryService;
  beforeEach(async () => {
    let module: TestingModule = await Test.createTestingModule({
      controllers: [VideoController],
      providers: [
        {
          provide: VideoService,
          useValue: {
            createVideo: jest.fn(),
            updateVideo: jest.fn(),
            deleteVideo: jest.fn(),
            getVideo: jest.fn(),
            getAllVideo: jest.fn(),
          },
        },
        CloudinaryService,
        {
          provide: JwtAuthGuard,
          useValue: { canActivate: jest.fn(() => true) },
        },
      ],
    })
      .overrideProvider(CloudinaryService)
      .useValue({
        uploadImage: jest.fn(),
        uploadVideoStream: jest.fn(),
      })
      .compile();

    controller = module.get<VideoController>(VideoController);
    service = module.get<VideoService>(VideoService);
    cloudinaryService = module.get<CloudinaryService>(CloudinaryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('createVideo', () => {
    beforeAll(() => {});
    it('Should throw InvalidInputException for invalid mimetype', async () => {
      let mockFile = {
        video: [
          { mimetype: 'text/plain', buffer: Buffer.from('') },
        ] as Express.Multer.File[],
        thumbnail: [
          { mimetype: 'image/png', buffer: Buffer.from('') },
        ] as Express.Multer.File[],
      };
      let mockCreateVideoDTO = {} as CreateVideoDTO;
      let mockUser = { id: '1' } as User;

      await expect(
        controller.createVideo(mockFile, mockCreateVideoDTO, mockUser),
      ).rejects.toThrow(InvalidInputException);
    });
    it('Should create a video with valid inputs', async () => {
      let mockFile = {
        video: [
          { mimetype: 'video/mp4', buffer: Buffer.from('') },
        ] as Express.Multer.File[],
        thumbnail: [
          { mimetype: 'image/png', buffer: Buffer.from('') },
        ] as Express.Multer.File[],
      };
      let mockCreateVideoDTO = {
        description: 'des example',
        title: 'title',
      } as CreateVideoDTO;
      let mockUser = { id: '1' } as User;
      let mockVideo = { id: 'video_id' } as Video;
      jest
        .spyOn(cloudinaryService, 'uploadVideoStream')
        .mockResolvedValue({ type: 'video', url: 'video_url' });
      jest
        .spyOn(cloudinaryService, 'uploadImage')
        .mockResolvedValue({ type: 'photo', url: 'photo_url' });
      jest.spyOn(service, 'createVideo').mockResolvedValue(mockVideo);

      let result = await controller.createVideo(
        mockFile,
        mockCreateVideoDTO,
        mockUser,
      );

      expect(cloudinaryService.uploadVideoStream).toHaveBeenCalledWith(
        mockFile.video[0],
      );
      expect(cloudinaryService.uploadImage).toHaveBeenCalledWith(
        mockFile.thumbnail[0],
      );
      expect(service.createVideo).toHaveBeenCalledWith(
        mockUser,
        mockCreateVideoDTO,
      );
      expect(result).toBe(mockVideo);
      expect(mockCreateVideoDTO.videoUrl).toBe('video_url');
      expect(mockCreateVideoDTO.thumbnailUrl).toBe('photo_url');
    });
  });
  describe('updateVideo', () => {
    let mockUpdateVideoDTO: UpdateVideoDTO;
    let mockUser: User;
    let mockIdVideo: string;
    let mockFile: Express.Multer.File;
    let mockFileError: Express.Multer.File;
    beforeAll(() => {
      mockUpdateVideoDTO = { title: 'update title' };
      mockUser = { id: '1' } as User;
      mockIdVideo = '1';
      mockFileError = {
        mimetype: 'text/plain',
        buffer: Buffer.from(''),
      } as Express.Multer.File;
      mockFile = {
        mimetype: 'image/png',
        buffer: Buffer.from(''),
      } as Express.Multer.File;
    });
    it('Should throw InvalidInputException if thumbnail is not an image', async () => {
      await expect(
        controller.updateVideo(
          mockFileError,
          mockUser,
          mockUpdateVideoDTO,
          mockIdVideo,
        ),
      ).rejects.toThrow(InvalidInputException);
    });
    it('Should update video successfully with valid thumbnail', async () => {
      let mockImageResolve = {
        url: 'image url',
        type: 'image',
      };
      let mockResolveVideo = {
        id: mockIdVideo,
        ...mockUpdateVideoDTO,
        thumbnailUrl: mockImageResolve.url,
      } as Video;

      jest
        .spyOn(cloudinaryService, 'uploadImage')
        .mockResolvedValue(mockImageResolve);
      jest.spyOn(service, 'updateVideo').mockResolvedValue(mockResolveVideo);

      let result = await controller.updateVideo(
        mockFile,
        mockUser,
        mockUpdateVideoDTO,
        mockIdVideo,
      );
      expect(result).toEqual(mockResolveVideo);
      expect(cloudinaryService.uploadImage).toHaveBeenCalledWith(mockFile);
      expect(service.updateVideo).toHaveBeenCalledWith(
        mockIdVideo,
        mockUser,
        mockUpdateVideoDTO,
      );
    });
  });
  describe('deleteVideo', () => {
    let mockUser: User;
    let mockId: string;
    beforeAll(() => {
      mockUser = {
        id: 'userId',
      } as User;
      mockId = 'videoId';
    });
    it('Should delete video with id video', async () => {
      jest.spyOn(service, 'deleteVideo').mockResolvedValue(undefined);
      await controller.deleteVideo(mockUser, mockId);
      expect(service.deleteVideo).toHaveBeenCalledWith(mockId, mockUser);
    });
  });
  describe('getVideo', () => {
    let mockId: string;
    beforeAll(() => {
      mockId = 'videoId';
    });
    it('Should get video with id video', async () => {
      jest.spyOn(service, 'getVideo').mockResolvedValue(undefined);
      await controller.getVideo(mockId);
      expect(service.getVideo).toHaveBeenCalledWith(mockId);
    });
  });
  describe('getVideos', () => {
    let mockPage: number;
    let mockLimit: number;

    beforeAll(() => {
      mockPage = 1;
      mockLimit = 15;
    });
    it('Should get all video by page and limit', async () => {
      jest.spyOn(service, 'getAllVideo').mockResolvedValue(undefined);
      await controller.getVideos(mockPage, mockLimit);
      expect(service.getAllVideo).toHaveBeenCalledWith(mockPage, mockLimit);
    });
  });
});
