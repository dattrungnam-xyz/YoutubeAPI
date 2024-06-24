import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/authGuard.jwt';
import { User } from './entities/user.entity';
import { mock } from 'node:test';
import { updateProfileDTO } from './input/updateProfile.dto';
import { UnauthorizedException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let mockUser: User;
  let service: UsersService;
  let cloudinaryService: CloudinaryService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CloudinaryModule],
      controllers: [UsersController],
      providers: [
        CloudinaryService,
        UsersService,
        {
          provide: JwtAuthGuard,
          useValue: {
            canActivate: jest.fn(() => true),
          },
        },
      ],
    })
      .overrideProvider(UsersService)
      .useValue({
        subcribe: jest.fn(),
        unsubcribe: jest.fn(),
        updateProfile: jest.fn(),
      })
      .overrideProvider(CloudinaryService)
      .useValue({
        uploadImage: jest.fn(),
      })
      .compile();
    mockUser = { id: '1' } as User;
    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
    cloudinaryService = module.get<CloudinaryService>(CloudinaryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('updateProfile', () => {
    let mockUpdateProfileDTO: updateProfileDTO;
    let mockFile: Express.Multer.File;
    beforeAll(() => {
      mockFile = {
        buffer: Buffer.from('file buffer'),
      } as Express.Multer.File;
      mockUpdateProfileDTO = {
        name: 'name',
      };
    });
    it('should throw UnauthorizedException when user is not provider', async () => {
      await expect(
        controller.updateProfile(mockFile, mockUpdateProfileDTO, null),
      ).rejects.toThrow(UnauthorizedException);
    });
    it('should update profile with new avatar', async () => {
      jest
        .spyOn(cloudinaryService, 'uploadImage')
        .mockResolvedValue({ url: 'url', type: 'photo' });
      jest.spyOn(service, 'updateProfile').mockResolvedValue(undefined);
      await controller.updateProfile(mockFile, mockUpdateProfileDTO, mockUser);
      expect(cloudinaryService.uploadImage).toHaveBeenCalledWith(mockFile);
      expect(service.updateProfile).toHaveBeenCalledWith(mockUser, {
        avatar: 'url',
        name: 'name',
      });
    });
    it('should update profile without new avatar', async () => {
      jest
        .spyOn(cloudinaryService, 'uploadImage')
        .mockResolvedValue({ url: 'url', type: 'photo' });
      jest.spyOn(service, 'updateProfile').mockResolvedValue(undefined);
      await controller.updateProfile(null, mockUpdateProfileDTO, mockUser);
      expect(service.updateProfile).toHaveBeenCalledWith(mockUser, {
        name: 'name',
      });
    });
  });
  describe('subcribe', () => {
    let mockId: string;
    beforeAll(() => {
      mockId = '2';
    });
    it('should throw UnauthorizedException when user is not provider', async () => {
      await expect(controller.subcribe(mockId, null)).rejects.toThrow(
        UnauthorizedException,
      );
    });
    it('should subcribe user by id', async () => {
      jest.spyOn(service, 'subcribe').mockResolvedValue(undefined);
      await controller.subcribe(mockId, mockUser);
      expect(service.subcribe).toHaveBeenCalledWith(mockUser, mockId);
    });
  });
  describe('unsubcribe', () => {
    let mockId: string;
    beforeAll(() => {
      mockId = '2';
    });
    it('should throw UnauthorizedException when user is not provider', async () => {
      await expect(controller.unsubcribe(mockId, null)).rejects.toThrow(
        UnauthorizedException,
      );
    });
    it('should subcribe user by id', async () => {
      jest.spyOn(service, 'unsubcribe').mockResolvedValue(undefined);
      await controller.unsubcribe(mockId, mockUser);
      expect(service.unsubcribe).toHaveBeenCalledWith(mockUser, mockId);
    });
  });
});
